/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Button, Card, Form, Input, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native-web';
import { adminQuery } from '~mdAdmin/redux';
import { Sublesson } from '~mdDashboard/redux/saga/type';
import styles from './styles';
import { PlusOutlined } from '@ant-design/icons';
import { LibraryItem } from '@/app/dashboard/library/_components';
import { messageApi } from '@hooks';
import { useForm } from 'antd/es/form/Form';
import { DragLibraryItem, ModalSelectLibrary } from './components';
import { AppRichTextInput, DraggableList } from '@components';

type AddSubLessonContentProps = {
  initialValues?: Sublesson;
  onFinish?: (values: any) => void;
  onDone?: (data: Sublesson) => void;
};
const AddSubLessonContent: React.FC<AddSubLessonContentProps> = ({
  initialValues,
  onFinish,
  onDone,
}) => {
  const [form] = useForm();
  const [addSubLesson] = adminQuery.useAddSubLessonMutation();
  const [selectedLibraries, setSelectedLibraries] = useState<any[]>([]);
  const [isVisibleModalSelect, setIsVisibleModalSelect] = useState(false);
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setSelectedLibraries(initialValues.libraries);
    } else {
      form.resetFields();
      setSelectedLibraries([]);
    }
  }, [initialValues]);
  return (
    <Form
      form={form}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      layout="vertical"
      onFinish={values => {
        const formValues = {
          ...values,
          libraries: selectedLibraries.map(item => item._id),
          durations: selectedLibraries.reduce(
            (cur, prev) => cur + (prev.durations || 0),
            0,
          ),
        };
        onFinish
          ? onFinish(formValues)
          : addSubLesson(formValues).then(res => {
              messageApi.success('Add new sublesson successfully!');
              form.resetFields();
              setSelectedLibraries([]);
              onDone && onDone(res.data);
            });
      }}>
      <ScrollView style={{ flex: 1 }}>
        <Form.Item
          label="Sublesson Title"
          name="title"
          rules={[
            { required: true, message: 'Please enter the sublesson title' },
          ]}>
          <Input placeholder="Enter sublesson title" />
        </Form.Item>

        <Typography.Title level={5}>Manage libraries</Typography.Title>
        <View>
          <Button
            style={{ alignSelf: 'flex-end', marginBottom: 12 }}
            onClick={() => {
              setIsVisibleModalSelect(true);
            }}>
            <PlusOutlined />
          </Button>
          <DraggableList
            data={selectedLibraries}
            keyExtractor={item => item?._id}
            handleUpdatedList={setSelectedLibraries}
            renderItem={({ item }) => (
              <DragLibraryItem
                data={item}
                onDelete={() => {
                  const newList = [...selectedLibraries].filter(
                    sItem => sItem._id !== item._id,
                  );
                  setSelectedLibraries(newList);
                }}
              />
            )}
          />
        </View>
      </ScrollView>
      <Button type="primary" htmlType="submit">
        Save Sublesson
      </Button>
      <ModalSelectLibrary
        isVisible={isVisibleModalSelect}
        setIsVisible={setIsVisibleModalSelect}
        onFinish={setSelectedLibraries}
        initialValues={selectedLibraries}
      />
    </Form>
  );
};

export default AddSubLessonContent;
