'use client';
import React, { useEffect, useState } from 'react';
import { Form, Input, Card, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './styles';
import { adminAction } from '@/modules/admin/redux';
import { LibraryItem } from '@/app/dashboard/library/_components';
import { UpdateSubLesson } from './types';
import './styles.css';
import { FlatList, ScrollView } from 'react-native-web';
import { useAppDispatch } from '@redux';
import { ModalSelectLibrary } from '~mdAdmin/components/AddSubLessonContent/components';
import { UpdateSubLessonData } from './types copy';
import { AppRichTextInput } from '@components';

type UpdateSubLessonFormProps = {
  data: UpdateSubLesson;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  refresh: () => void;
};

const UpdateSubLessonForm: React.FC<UpdateSubLessonFormProps> = ({
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
      setListSelected(data.librariesData);
    }
  }, [data, form]);
  const handleEditCancel = () => {
    setIsVisible(false);
  };

  const handleEditOk = () => {
    form.submit();
    setConfirmLoading(true);
  };

  const onFinish = (values: UpdateSubLessonData) => {
    const { title, description } = values;
    dispatch(
      adminAction.updateSubLesson({
        params: {
          _id: data.id,
          title: title,
          description: description,
          libraries: listSelected.map(item => item._id),
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
            label="Sublesson Title"
            name="title"
            rules={[
              { required: true, message: 'Please enter the sublesson title' },
            ]}>
            <Input placeholder="Enter sublesson title" />
          </Form.Item>

          <Form.Item
            label="Sublesson Description"
            name="description"
            rules={[
              {
                required: true,
                message: 'Please enter the sublesson description',
              },
            ]}>
            <AppRichTextInput />
          </Form.Item>

          <h3>Select Libraries</h3>
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
              return <LibraryItem style={styles.libraryItem} data={item} />;
            }}
          />
        </ScrollView>
        <ModalSelectLibrary
          initialValues={data?.librariesData}
          isVisible={isVisibleModalSelect}
          setIsVisible={setIsVisibleModalSelect}
          onFinish={setListSelected}
        />
      </Form>
    </Modal>
  );
};

export default UpdateSubLessonForm;
