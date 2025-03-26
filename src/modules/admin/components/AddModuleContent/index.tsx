/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Button, Form, Input, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native-web';
import { adminQuery } from '~mdAdmin/redux';
import { Module } from '~mdDashboard/redux/saga/type';
import { PlusOutlined } from '@ant-design/icons';
import { messageApi } from '@hooks';
import styles from './styles';
import { DragLibraryItem } from './components';
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
  const [selectedLibraries, setSelectedLibraries] = useState<any[]>([]);
  const [isVisibleModalLibrarySelect, setIsVisibleModalLibrarySelect] =
    useState(false);

  useEffect(() => {
    form.setFieldsValue(initialValues);
    setSelectedLibraries(initialValues?.libraries);
  }, [initialValues]);

  return (
    <Form
      form={form}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
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
          : addModule(formValues)
              .then(res => {
                messageApi.success('Add new module successfully!');
                form.resetFields();
                setSelectedLibraries(null);
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
                    key={index}
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
      </ScrollView>

      <Button style={styles.button} htmlType="submit">
        <Text style={styles.buttonText}> Save Module</Text>
      </Button>

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
