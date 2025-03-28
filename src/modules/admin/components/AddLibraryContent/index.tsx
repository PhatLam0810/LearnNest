/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Button, Divider, Form, Input, Select, Space, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { adminQuery } from '../../redux';
import { messageApi, useAppPagination } from '@hooks';
import api from '@services/api';
import { Library } from '~mdDashboard/types';
import { ScrollView, View } from 'react-native-web';
import { AppRichTextInput } from '@components';
import { PlusOutlined } from '@ant-design/icons';

type AddLibraryContentProps = {
  onFinish?: (values: any) => void;
  onDone?: (data: Library) => void;
  initialValues?: any;
};
const AddLibraryContent: React.FC<AddLibraryContentProps> = ({
  onFinish,
  onDone,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const [addLibrary] = adminQuery.useAddLibraryMutation();
  const [addNewTag] = adminQuery.useAddNewTagMutation();
  const {
    listItem: listTag,
    search,
    refresh,
  } = useAppPagination<any>({
    apiUrl: 'tag/getAll',
  });
  const [libraryType, setLibraryType] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [newTag, setNewTag] = useState('');
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setLibraryType(initialValues.type);
    }
  }, [initialValues]);

  const renderInputContent = () => {
    switch (libraryType.toLocaleLowerCase()) {
      case 'text': {
        return (
          <Form.Item
            label="Content"
            name="url"
            rules={[{ required: true, message: 'Please enter the content' }]}>
            <AppRichTextInput />
          </Form.Item>
        );
      }
      case 'self-care': {
        return (
          <>
            <Form.Item
              label="Content"
              name="url"
              rules={[{ required: true, message: 'Please enter the content' }]}>
              <AppRichTextInput />
            </Form.Item>
          </>
        );
      }
      case 'youtube': {
        return (
          <Form.Item
            name="url"
            label="File / Link"
            rules={[
              {
                required: true,
                message: 'Please upload a file or enter a link',
              },
            ]}>
            <Input
              placeholder="Or enter a link"
              onChange={e => form.setFieldsValue({ url: e.target.value })}
              style={{ marginBottom: 32 }}
            />
          </Form.Item>
        );
      }
      default: {
        return (
          <Form.Item
            name="url"
            label="File / Link"
            rules={[
              {
                required: true,
                message: 'Please upload a file or enter a link',
              },
            ]}>
            <>
              <Upload
                maxCount={1}
                listType="picture-card"
                action={api.defaults.baseURL + '/upload'}
                onChange={info => {
                  if (info.file.status === 'done') {
                    const responseUrl = info.file.response?.data;
                    if (responseUrl) {
                      form.setFieldsValue({ url: responseUrl });
                    }
                  }
                }}>
                <Button type="text">Upload</Button>
              </Upload>
            </>
          </Form.Item>
        );
      }
    }
  };

  return (
    <Form
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      layout="vertical"
      form={form}
      onFinish={values => {
        onFinish
          ? onFinish(values)
          : addLibrary(values)
              .then(res => {
                setSelectedItems([...selectedItems, res.data]);
                messageApi.success('Add new library successfully!');
                onDone && onDone(res.data);
                form.resetFields();
              })
              .catch(() => {
                messageApi.error('Add new library failed!');
              });
      }}>
      <ScrollView style={{ flex: 1 }}>
        <Form.Item
          label="Library Name"
          name="title"
          rules={[
            { required: true, message: 'Please enter the library name' },
          ]}>
          <Input placeholder="Enter library name" />
        </Form.Item>

        <Form.Item label="Library Description" name="description">
          <Input.TextArea placeholder="Enter library description" />
        </Form.Item>

        <Form.Item label="tags" name="tags">
          <Select
            placeholder="Select tags"
            mode="multiple"
            onSearch={search}
            dropdownRender={menu => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <Input
                    placeholder="Please enter item"
                    value={newTag}
                    onChange={e => {
                      setNewTag(e.target.value);
                    }}
                  />
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      addNewTag({ name: newTag })
                        .unwrap()
                        .then(res => {
                          refresh();
                          setNewTag('');
                        });
                    }}>
                    Add item
                  </Button>
                </Space>
              </>
            )}
            getPopupContainer={triggerNode => triggerNode.parentNode}>
            {listTag?.map(item => (
              <Select.Option key={item._id} value={item._id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Resource Type"
          name="type"
          rules={[
            { required: true, message: 'Please select the library type' },
          ]}>
          <Select
            placeholder="Select library type"
            onChange={value => setLibraryType(value)} // Cập nhật trạng thái khi chọn
            getPopupContainer={triggerNode => triggerNode.parentNode}>
            <Select.Option value="Image">Image</Select.Option>
            <Select.Option value="Youtube">Link YouTube</Select.Option>
            <Select.Option value="PDF">PDF</Select.Option>
            <Select.Option value="Video">Video</Select.Option>
            <Select.Option value="Text">Text</Select.Option>
          </Select>
        </Form.Item>
        {renderInputContent()}
      </ScrollView>

      <Button type="primary" htmlType="submit">
        Add Library
      </Button>
    </Form>
  );
};

export default AddLibraryContent;
