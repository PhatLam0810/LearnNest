/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Button, Form, Input, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native-web';
import { adminQuery } from '~mdAdmin/redux';
import { Module } from '~mdDashboard/redux/saga/type';
import { PracticeTask } from '~mdDashboard/types/practice';
import { PlusOutlined } from '@ant-design/icons';
import { messageApi } from '@hooks';
import styles from './styles';
import {
  DragLibraryItem,
  DragPracticeTaskItem,
  ModalSelectLibrary,
} from './components';
import { DraggableList } from '@components';

type ContentItem =
  { type: 'library'; data: any } | { type: 'task'; data: PracticeTask };

type AddModuleContentProps = {
  onFinish?: (values: Module) => void;
  onDone?: (data: Module) => void;
  initialValues?: Module;
};
const AddModuleContent: React.FC<AddModuleContentProps> = ({
  onFinish,
  onDone,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [addModule] = adminQuery.useAddModuleMutation();
  const [setTaskModule] = adminQuery.useSetPracticeTaskModuleMutation();
  const { data: allTasks } = adminQuery.useGetPracticeTasksAdminQuery();
  // 1 danh sách DUY NHẤT trộn cả bài học video và bài thực hành, sắp xếp
  // kéo-thả chung — đúng yêu cầu "để bài thực hành chung với danh sách bài
  // học để tiện sắp xếp theo thứ tự". Vị trí (index) trong mảng này chính
  // là "order" dùng khi lưu, cho cả 2 loại nội dung.
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isVisibleModalLibrarySelect, setIsVisibleModalLibrarySelect] =
    useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  // Dựng lại danh sách trộn từ dữ liệu đã lưu: libraries theo đúng thứ tự
  // mảng module.libraries[], bài thực hành theo field order riêng — rồi
  // sắp theo order để ra đúng thứ tự hiển thị đã lưu trước đó.
  useEffect(() => {
    if (!initialValues) return;
    const libraryItems: ContentItem[] = (initialValues.libraries || []).map(
      (l: any, i: number) => ({ type: 'library', data: l, _order: i }) as any,
    );
    const taskItems: ContentItem[] = (allTasks || [])
      .filter(t => t.moduleId === initialValues._id)
      .map(t => ({ type: 'task', data: t, _order: t.order ?? 0 }) as any);
    const merged = [...libraryItems, ...taskItems].sort(
      (a: any, b: any) => a._order - b._order,
    );
    setContentItems(merged);
  }, [initialValues?._id, allTasks]);

  // Đồng bộ bài thực hành vào đúng lúc phần học được lưu — không gọi PUT
  // .../module ngay lúc chọn trong picker, giống hệt cách library items chỉ
  // thật sự ghi vào Module.libraries[] lúc submit.
  const reconcileTasks = async (moduleId: string) => {
    if (!allTasks) return;
    const selectedTaskIdsWithOrder = new Map(
      contentItems
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item.type === 'task')
        .map(({ item, index }) => [(item.data as PracticeTask)._id, index]),
    );
    const ops = allTasks
      .filter(
        t => t.moduleId === moduleId || selectedTaskIdsWithOrder.has(t._id),
      )
      .map(t => {
        const isSelected = selectedTaskIdsWithOrder.has(t._id);
        return setTaskModule({
          taskId: t._id,
          moduleId: isSelected ? moduleId : null,
          order: isSelected ? selectedTaskIdsWithOrder.get(t._id) : undefined,
        });
      });
    await Promise.all(ops);
  };

  return (
    <Form
      form={form}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      layout="vertical"
      onFinish={async values => {
        const libraries = contentItems
          .filter(i => i.type === 'library')
          .map(i => i.data._id);
        const formValues = {
          ...values,
          libraries,
          durations: contentItems
            .filter(i => i.type === 'library')
            .reduce((cur, i) => cur + (i.data.durations || 0), 0),
        };

        if (onFinish) {
          // Sửa phần học đã có sẵn — đã biết _id, gắn/gỡ bài thực hành
          // ngay, không cần đợi module lưu xong.
          if (initialValues?._id) await reconcileTasks(initialValues._id);
          onFinish(formValues);
        } else {
          addModule(formValues)
            .then(async res => {
              await reconcileTasks(res.data._id);
              messageApi.success('Add new module successfully!');
              form.resetFields();
              setContentItems([]);
              onDone && onDone(res.data);
            })
            .catch(() => {
              messageApi.error('Add new module failed!');
            });
        }
      }}>
      <ScrollView>
        <Form.Item
          label="Tên phần học"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tên phần học' }]}>
          <Input placeholder="Tên phần học" />
        </Form.Item>
        <Typography.Title level={5}>Sắp xếp</Typography.Title>
        <View>
          <Button
            style={{ alignSelf: 'flex-end', marginBottom: 12 }}
            onClick={() => {
              setIsVisibleModalLibrarySelect(true);
            }}>
            <PlusOutlined />
          </Button>
          <DraggableList
            data={contentItems}
            keyExtractor={item => item?.data?._id}
            handleUpdatedList={setContentItems}
            renderItem={({ item }) => {
              if (!item) return null;
              if (item.type === 'library') {
                return (
                  <DragLibraryItem
                    data={item.data}
                    key={item.data._id}
                    onDelete={() => {
                      setContentItems(
                        contentItems.filter(
                          i =>
                            !(
                              i.type === 'library' &&
                              i.data._id === item.data._id
                            ),
                        ),
                      );
                    }}
                  />
                );
              }
              return (
                <DragPracticeTaskItem
                  data={item.data}
                  key={item.data._id}
                  onDelete={() => {
                    setContentItems(
                      contentItems.filter(
                        i =>
                          !(i.type === 'task' && i.data._id === item.data._id),
                      ),
                    );
                  }}
                />
              );
            }}
          />
        </View>
      </ScrollView>

      <Button style={styles.button} htmlType="submit">
        <Text style={styles.buttonText}> Lưu phần học </Text>
      </Button>

      <ModalSelectLibrary
        isVisible={isVisibleModalLibrarySelect}
        setIsVisible={setIsVisibleModalLibrarySelect}
        initialValues={contentItems
          .filter(i => i.type === 'library')
          .map(i => i.data)}
        initialTaskValues={contentItems
          .filter(i => i.type === 'task')
          .map(i => i.data)}
        onDone={(newLibraries, newTasks) => {
          setContentItems(prev => {
            const newLibraryIds = new Set(newLibraries.map(l => l._id));
            const newTaskIds = new Set(newTasks.map(t => t._id));
            // Giữ nguyên vị trí các mục còn được chọn, bỏ các mục bị bỏ
            // chọn, rồi nối thêm các mục MỚI được chọn vào cuối.
            const kept = prev.filter(i =>
              i.type === 'library'
                ? newLibraryIds.has(i.data._id)
                : newTaskIds.has(i.data._id),
            );
            const keptIds = new Set(kept.map(i => i.data._id));
            const addedLibraries: ContentItem[] = newLibraries
              .filter(l => !keptIds.has(l._id))
              .map(l => ({ type: 'library', data: l }));
            const addedTasks: ContentItem[] = newTasks
              .filter(t => !keptIds.has(t._id))
              .map(t => ({ type: 'task', data: t }));
            return [...kept, ...addedLibraries, ...addedTasks];
          });
        }}
      />
    </Form>
  );
};

export default AddModuleContent;
