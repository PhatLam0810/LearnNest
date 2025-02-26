'use client';
import React, { useEffect, useState } from 'react';
import { Form, Input, Card, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './styles';
import { adminAction } from '@/modules/admin/redux';
import { UpdateModule, UpdateModuleFormData } from './types';
import './styles.css';
import { FlatList, ScrollView } from 'react-native-web';
import { useAppDispatch } from '@redux';
import { ModalSelectSubLesson } from '~mdAdmin/components/AddModuleContent/components';
import { SubLessonItem } from '@/app/dashboard/subLesson/_components';

type UpdateModuleFormProps = {
  data: UpdateModule;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  refresh: () => void;
};

const UpdateModuleForm: React.FC<UpdateModuleFormProps> = ({
  data,
  isVisible,
  setIsVisible,
  refresh,
}) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [listSelected, setListSelected] = useState<any[]>([]);
  const [isVisibleModalSelect, setIsVisibleModalSelect] = useState(false);

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data.title || '',
        description: data.description || '',
      });
      setListSelected(data?.subLessonsData);
    }
  }, [data, form]);
  const handleEditCancel = () => {
    setIsVisible(false);
  };

  const handleEditOk = () => {
    form.submit();
    setConfirmLoading(true);
  };

  const onFinish = (values: UpdateModuleFormData) => {
    const { title, description } = values;
    dispatch(
      adminAction.updateModule({
        params: {
          _id: data.id,
          title: title,
          description: description,
          subLessons: listSelected.map(item => item._id),
          duration: 0,
        },
        callback() {
          refresh();
          setConfirmLoading(false);
          setIsVisible(false);
        },
      }),
    );
  };

  const initialValues = {
    title: data?.title || '',
    description: data?.description || '',
  };

  return (
    <Modal
      open={isVisible}
      onCancel={handleEditCancel}
      onOk={handleEditOk}
      confirmLoading={confirmLoading}>
      <Form
        form={form}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}>
        <ScrollView style={{ flex: 1 }}>
          <Form.Item
            label="Module Title"
            name="title"
            rules={[
              { required: true, message: 'Please enter the module title' },
            ]}>
            <Input placeholder="Enter module title" />
          </Form.Item>

          <Form.Item
            label="Module Description"
            name="description"
            rules={[
              {
                required: true,
                message: 'Please enter the module description',
              },
            ]}>
            <Input.TextArea placeholder="Enter module description" rows={4} />
          </Form.Item>

          <h3>Select SubLesson</h3>
          <FlatList
            data={[{ _id: 0 }, ...listSelected]}
            numColumns={5}
            columnWrapperStyle={{ gap: '0.5%' }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item._id + index}
            renderItem={({ item, index }) => {
              if (index === 0) {
                return (
                  <Card
                    hoverable
                    style={{ display: 'flex', ...styles.libraryItem }}
                    onClick={() => setIsVisibleModalSelect(true)}>
                    <PlusOutlined />
                  </Card>
                );
              }
              return (
                <SubLessonItem
                  style={styles.libraryItem}
                  title={item.title}
                  description={item.description}
                  libraries={item.libraries.length}
                  durations={0}
                />
              );
            }}
          />
        </ScrollView>
        <ModalSelectSubLesson
          initialValues={data?.subLessonsData}
          isVisible={isVisibleModalSelect}
          setIsVisible={setIsVisibleModalSelect}
          onFinish={setListSelected}
        />
      </Form>
    </Modal>
  );
};

export default UpdateModuleForm;
