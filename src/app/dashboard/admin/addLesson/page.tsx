/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import { ScrollView, Text, View } from 'react-native-web';
import { Form, Input, Select, Button } from 'antd';
import api from '@services/api';
import { adminQuery } from '@/modules/admin/redux';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { CreateLessonFrom } from './type';
import { DragModuleItem, ModalSelectModule } from './_components';
import { messageApi } from '@hooks';
import { AppUploadImageCrop, DraggableList } from '@components';

type CreateLessonFormProps = {
  initialValues?: any;
  onFormFinish?: (data: any) => void;
};
const CreateLessonForm: React.FC<CreateLessonFormProps> = ({
  initialValues,
  onFormFinish,
}) => {
  const [form] = Form.useForm();
  const { data: CategoriesAllData } = adminQuery.useGetCategoriesAllQuery();
  const [addLesson] = adminQuery.useAddLessonMutation();
  const { Option } = Select;

  const [listSelected, setListSelected] = useState<any[]>([]);
  const [isVisibleModalSelect, setIsVisibleModalSelect] = useState(false);

  const onFinish = (values: CreateLessonFrom) => {
    const lessonData = {
      ...values,
      modules: listSelected.map(item => item._id),
      durations: listSelected.reduce(
        (cur, prev) => cur + (prev.durations || 0),
        0,
      ),
    };
    onFormFinish
      ? onFormFinish(lessonData)
      : addLesson(lessonData)
          .unwrap()
          .then(res => {
            messageApi.success('Add new lesson successfully!');
            form.resetFields();
            setListSelected([]);
          })
          .catch(() => {
            messageApi.error('Add new lesson failed!');
          });
  };
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setListSelected(initialValues.modules);
    }
  }, [initialValues]);
  return (
    <View style={styles.container}>
      <Text style={styles.formItemTitle}>Create Lesson</Text>
      <View style={{ flex: 1 }}>
        <Form
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ categories: [] }}>
          <ScrollView style={{ flex: 1, scrollbarWidth: 'none' }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 4 }}>
                <Form.Item
                  style={styles.formItemTitle}
                  label="Lesson Name"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the lesson name!',
                    },
                  ]}>
                  <Input placeholder="Enter lesson name" />
                </Form.Item>

                <Form.Item
                  style={styles.formItemTitle}
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the description!',
                    },
                  ]}>
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter lesson description"
                  />
                </Form.Item>

                <Form.Item
                  style={styles.formItemTitle}
                  label="Skill learned"
                  name="learnedSkills">
                  <Form.List name="learnedSkills">
                    {(fields, { add, remove }) => (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                        }}>
                        {fields.map(({ key, name, ...restField }) => {
                          return (
                            <Form.Item
                              key={key}
                              {...restField}
                              name={name}
                              rules={[
                                {
                                  required: true,
                                  message: 'skill is required',
                                },
                              ]}>
                              <SkillItem remove={remove} />
                            </Form.Item>
                          );
                        })}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}>
                            Add Row
                          </Button>
                        </Form.Item>
                      </div>
                    )}
                  </Form.List>
                </Form.Item>
              </View>
              <View style={{ flex: 1.5 }}>
                <Form.Item
                  style={styles.formItemTitle}
                  label="Thumbnail"
                  name="thumbnail">
                  <AppUploadImageCrop
                    containerStyle={styles.uploadCrop}
                    onChange={async data => {
                      const blob = await fetch(data).then(res => res.blob());
                      const formData = new FormData();
                      const timestamp = new Date().getTime();
                      formData.append(
                        'file',
                        new File([blob], `cropped-image-${timestamp}.jpg`, {
                          type: 'image/jpeg',
                        }),
                      );
                      const res = await api.post('/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                      });
                      form.setFieldsValue({ thumbnail: res.data.data });
                    }}
                  />
                </Form.Item>

                <Form.Item
                  style={styles.formItemTitle}
                  label="Categories"
                  name="categories">
                  <Select mode="tags" placeholder="Select categories">
                    {CategoriesAllData?.map((category: any, index) => (
                      <Option key={category._id} value={category._id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </View>
            </View>

            <h4>Select module</h4>

            <Button
              onClick={() => {
                setIsVisibleModalSelect(true);
                setListSelected(null);
              }}>
              <Text>Add Module</Text>
            </Button>
            <DraggableList
              data={listSelected}
              keyExtractor={item => item?._id}
              handleUpdatedList={setListSelected}
              style={styles.draggableList}
              renderItem={({ item }) => <DragModuleItem data={item} />}
            />
          </ScrollView>
          <Button style={styles.btn} type="primary" htmlType="submit">
            Add Lesson
          </Button>
        </Form>
      </View>
      <ModalSelectModule
        isVisible={isVisibleModalSelect}
        setIsVisible={setIsVisibleModalSelect}
        listSelected={listSelected}
        onFinish={setListSelected}
      />
    </View>
  );
};

export default CreateLessonForm;

const SkillItem = ({ value, onChange, remove }: any) => {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Input.TextArea
        placeholder="Skill learned"
        value={value}
        onChange={onChange}
      />
      <MinusCircleOutlined onClick={() => remove(name)} />
    </div>
  );
};
