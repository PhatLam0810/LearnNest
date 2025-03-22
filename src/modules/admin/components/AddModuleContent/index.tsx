/* eslint-disable @typescript-eslint/no-unused-expressions */
import { SubLessonItem } from '@/app/dashboard/subLesson/_components';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native-web';
import { adminQuery } from '~mdAdmin/redux';
import { Module } from '~mdDashboard/redux/saga/type';
import { PlusOutlined } from '@ant-design/icons';
import { messageApi } from '@hooks';
import {
  DragLibraryItem,
  DragSublessonItem,
  ModalSelectSubLesson,
} from './components';
import { DraggableList } from '@components';
import { ModalSelectLibrary } from '../AddSubLessonContent/components';

type AddModuleContentProps = {
  onFinish?: (values: any) => void;
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
  const [listSelected, setListSelected] = useState<any[]>([]);
  const [isVisibleModalSelect, setIsVisibleModalSelect] = useState(false);
  const [hasSubLesson, setHasSubLesson] = useState(true);
  const [selectedLibraries, setSelectedLibraries] = useState<any[]>([]);
  const [isVisibleModalLibrarySelect, setIsVisibleModalLibrarySelect] =
    useState(false);
  useEffect(() => {
    form.setFieldsValue(initialValues);
    setHasSubLesson(true);
    setSelectedLibraries(initialValues?.libraries);
    setListSelected(initialValues?.subLessons);
  }, [initialValues]);

  return (
    <Form
      form={form}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      layout="vertical"
      onFinish={values => {
        const formValues = {
          ...values,
          subLessons: hasSubLesson
            ? listSelected.map(item => item._id)
            : undefined,
          libraries: hasSubLesson
            ? undefined
            : selectedLibraries.map(item => item._id),
          durations: hasSubLesson
            ? listSelected.reduce((cur, prev) => cur + (prev.durations || 0), 0)
            : selectedLibraries.reduce(
                (cur, prev) => cur + (prev.durations || 0),
                0,
              ),
        };

        onFinish
          ? onFinish(formValues)
          : addModule(formValues)
              .then(res => {
                messageApi.success('Add new module successfully!');
                form.resetFields();
                setListSelected([]);
                onDone && onDone(res.data);
              })
              .catch(err => {
                messageApi.error('Add new module failed!');
              });
      }}>
      <ScrollView>
        <Form.Item
          label="Module Title"
          name="title"
          rules={[
            { required: true, message: 'Please enter the Module title' },
          ]}>
          <Input placeholder="Enter Module title" />
        </Form.Item>
        <Typography.Title level={5}>Manage</Typography.Title>
        <View>
          <Button
            style={{ alignSelf: 'flex-end', marginBottom: 12 }}
            onClick={() => {
              if (hasSubLesson) {
                setIsVisibleModalSelect(true);
              } else {
                setIsVisibleModalLibrarySelect(true);
              }
            }}>
            <PlusOutlined />
          </Button>
          <DraggableList
            data={listSelected || []}
            keyExtractor={item => item?._id}
            handleUpdatedList={setListSelected}
            renderItem={({ item, index }) => {
              console.log(item);
              if (item) {
                return (
                  <DragSublessonItem
                    key={index}
                    data={item}
                    onDelete={() => {
                      const newList = [...listSelected].filter(
                        sItem => sItem?._id !== item._id,
                      );
                      setSelectedLibraries(newList);
                      setListSelected(newList);
                    }}
                  />
                );
              }
            }}
          />
        </View>
      </ScrollView>

      <Button type="primary" htmlType="submit">
        Save Module
      </Button>

      <ModalSelectSubLesson
        isVisible={isVisibleModalSelect}
        setIsVisible={setIsVisibleModalSelect}
        onFinish={setListSelected}
        initialValues={listSelected}
      />
      <ModalSelectLibrary
        isVisible={isVisibleModalLibrarySelect}
        setIsVisible={setIsVisibleModalLibrarySelect}
        onFinish={setSelectedLibraries}
        initialValues={selectedLibraries}
      />
    </Form>
  );
};

export default AddModuleContent;
