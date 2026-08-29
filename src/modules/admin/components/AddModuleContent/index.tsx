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
  ModalSelectLibrary,
  PracticeTaskSection,
} from './components';
import { DraggableList } from '@components';

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
  const [selectedLibraries, setSelectedLibraries] = useState<any[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<PracticeTask[]>([]);
  const [isVisibleModalLibrarySelect, setIsVisibleModalLibrarySelect] =
    useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setSelectedLibraries(initialValues?.libraries);
    }
  }, [initialValues, form]);

  // Bài thực hành đã gắn vào phần học này từ trước — lấy từ danh sách
  // chung (allTasks) theo moduleId, không cần lưu phần học trước mới biết.
  useEffect(() => {
    if (initialValues?._id && allTasks) {
      setSelectedTasks(allTasks.filter(t => t.moduleId === initialValues._id));
    }
  }, [initialValues?._id, allTasks]);

  // Đồng bộ lựa chọn bài thực hành vào đúng lúc phần học được lưu — không
  // gọi PUT .../module ngay lúc tick chọn trong picker (giống hệt cách
  // selectedLibraries chỉ thật sự ghi vào Module.libraries[] lúc submit).
  const reconcileTasks = async (moduleId: string) => {
    if (!allTasks) return;
    const selectedIds = new Set(selectedTasks.map(t => t._id));
    const ops = allTasks
      .filter(t => (t.moduleId === moduleId) !== selectedIds.has(t._id))
      .map(t =>
        setTaskModule({
          taskId: t._id,
          moduleId: selectedIds.has(t._id) ? moduleId : null,
        }),
      );
    await Promise.all(ops);
  };

  return (
    <Form
      form={form}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      layout="vertical"
      onFinish={async values => {
        const formValues = {
          ...values,
          libraries: selectedLibraries.map(item => item._id),
          durations: selectedLibraries.reduce(
            (cur, prev) => cur + (prev.durations || 0),
            0,
          ),
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
              setSelectedLibraries(null);
              setSelectedTasks([]);
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
            data={selectedLibraries}
            keyExtractor={item => item?._id}
            handleUpdatedList={setSelectedLibraries}
            renderItem={({ item, index }) => {
              if (item) {
                return (
                  <DragLibraryItem
                    data={item}
                    key={item._id}
                    onDelete={() => {
                      const newList = [...selectedLibraries].filter(
                        sItem => sItem._id !== item._id,
                      );
                      setSelectedLibraries(newList);
                    }}
                  />
                );
              }
            }}
          />
        </View>
        <PracticeTaskSection
          tasks={selectedTasks}
          onRemove={taskId =>
            setSelectedTasks(selectedTasks.filter(t => t._id !== taskId))
          }
        />
      </ScrollView>

      <Button style={styles.button} htmlType="submit">
        <Text style={styles.buttonText}> Lưu phần học </Text>
      </Button>

      <ModalSelectLibrary
        isVisible={isVisibleModalLibrarySelect}
        setIsVisible={setIsVisibleModalLibrarySelect}
        onFinish={setSelectedLibraries}
        initialValues={selectedLibraries}
        onFinishTasks={setSelectedTasks}
        initialTaskValues={selectedTasks}
      />
    </Form>
  );
};

export default AddModuleContent;
