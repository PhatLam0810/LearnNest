'use client';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import { adminQuery } from '~mdAdmin/redux';
import {
  Button,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Modal,
  Radio,
  Space,
  Table,
  TableProps,
  Typography,
} from 'antd';
import { LibraryType } from '~mdDashboard/redux/RTKQuery/types';
import { View } from 'react-native-web';
import { messageApi } from '@hooks';

const OtherManage = () => {
  const { data, refetch } = adminQuery.useGetListLibraryTypeQuery();
  const [addLibraryType] = adminQuery.useAddLibraryTypeMutation();
  const [form] = Form.useForm();

  const [rowData, setRowData] = useState<LibraryType>();

  const [isVisibleAddNew, setIsVisibleAddNew] = useState(false);

  const columns: TableProps<LibraryType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => {}}>Delete</a>
          <a onClick={() => {}}>Update</a>
        </Space>
      ),
    },
    {
      key: 'more',
    },
  ];

  const closeModal = () => {
    setRowData(null);
    setIsVisibleAddNew(false);
    form.resetFields();
  };

  useEffect(() => {
    if (rowData) {
      form.setFieldsValue({
        name: rowData?.name,
        collection: rowData?.filter?.collection,
      });
    }
  }, [rowData]);

  const items: MenuProps['items'] = [
    {
      key: 'add',
      label: (
        <Typography.Text
          onClick={() => {
            setIsVisibleAddNew(true);
            form.setFieldValue('collection', 'lesson');
          }}>
          Add New Library Type
        </Typography.Text>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <View style={{ flex: 1 }}></View>
        <View style={{}}>
          <Dropdown menu={{ items }}>
            <Button>+</Button>
          </Dropdown>
        </View>
      </View>
      <Table
        columns={columns}
        dataSource={data}
        style={{ cursor: 'pointer' }}
        onRow={record => ({
          onClick: () => {
            setRowData(record);
          },
        })}
      />
      <Modal
        open={!!rowData || isVisibleAddNew}
        onCancel={closeModal}
        onClose={closeModal}
        title={rowData?.name}
        footer={null}>
        <Form
          form={form}
          layout="vertical"
          onFinish={values => {
            if (!rowData) {
              messageApi.loading('Adding...');
              addLibraryType({
                name: values.name,
                filter: { collection: values.collection, query: values.query },
              })
                .unwrap()
                .then(res => {
                  messageApi.destroy();
                  messageApi.success('Added new library type!');
                  refetch();
                  setIsVisibleAddNew(false);
                })
                .catch(err => {
                  messageApi.destroy();
                  messageApi.error('Add new library error!');
                });
            }
          }}>
          <View>
            <Form.Item
              label="Name:"
              name="name"
              required
              rules={[{ required: true, message: 'This field is required!' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Collection:"
              name="collection"
              required
              rules={[{ required: true, message: 'This field is required!' }]}>
              <Radio.Group
                defaultValue={'lesson'}
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Radio value="lesson">Lesson</Radio>
                <Radio value="module">Module</Radio>
                <Radio value="subLesson">subLesson</Radio>
                <Radio value="library">library</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Query: (Updating...)" name="query"></Form.Item>
            <View
              style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 8 }}>
              <Form.Item>
                <Button onClick={closeModal}>
                  <Typography.Text>Cancel</Typography.Text>
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  <Typography.Text style={{ color: 'white' }}>
                    {!!rowData ? 'Add' : 'Update'}
                  </Typography.Text>
                </Button>
              </Form.Item>
            </View>
          </View>
        </Form>
      </Modal>
    </View>
  );
};

export default OtherManage;
