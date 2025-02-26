'use client';
import React, { useState } from 'react';
import styles from './styles';
import { Text, View } from 'react-native-web';
import {
  Form,
  Input,
  Select,
  Upload,
  message,
  Image,
  UploadFile,
  UploadProps,
  Modal,
} from 'antd';
import api from '@services/api';
import { adminAction } from '@/modules/admin/redux';
import { useAppDispatch } from '@redux';
import { PlusOutlined } from '@ant-design/icons';
import { UpdateLibraryFormData } from './types';
import { Library } from '~mdDashboard/types';

type UpdateLibraryFormProps = {
  data: Library;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  refresh: () => void;
};

const UpdateLibraryForm: React.FC<UpdateLibraryFormProps> = ({
  data,
  isVisible,
  setIsVisible,
  refresh,
}) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: data?.url,
    },
  ]);

  const [typeUrl, setTypeUrl] = useState(data?.type);

  const handleEditOk = () => {
    form.submit();
    setConfirmLoading(true);
  };

  const handleEditCancel = () => {
    setIsVisible(false);
  };

  const onFinish = (values: UpdateLibraryFormData) => {
    const { title, description, tag, url, text } = values;
    dispatch(
      adminAction.updateLibrary({
        params: {
          _id: data?._id,
          title: title,
          description: description,
          url: url,
          type: typeUrl,
          tags: tag,
        },
        callback() {
          refresh();
          setConfirmLoading(false);
          setIsVisible(false);
        },
      }),
    );
  };

  const beforeUpload = (file: File) => {
    const isPdf = file.type === 'application/pdf';
    const isVideo = file.type.startsWith('video/');
    const isPng = file.type === 'image/png';

    if (isPdf) {
      const isLessThan1GB = file.size / 1024 / 1024 / 1024 < 1; // Kích thước dưới 1GB
      if (!isLessThan1GB) {
        message.error('PDF must be smaller than 1GB!');
        return Upload.LIST_IGNORE; // Bỏ qua nếu không hợp lệ
      }
      setTypeUrl('PDF');
      return true;
    }

    // Kiểm tra file Video
    if (isVideo) {
      const isLessThan1GB = file.size / 1024 / 1024 / 1024 < 1; // Kích thước dưới 1GB
      if (!isLessThan1GB) {
        message.error('Video must be smaller than 1GB!');
        return Upload.LIST_IGNORE; // Bỏ qua nếu không hợp lệ
      }
      setTypeUrl('Video');
      return true;
    }

    if (isPng) {
      const isLessThan10MB = file.size / 1024 / 1024 < 10; // Kích thước dưới 10MB
      if (!isLessThan10MB) {
        message.error('PNG must be smaller than 10MB!');
        return Upload.LIST_IGNORE; // Bỏ qua nếu không hợp lệ
      }
      setTypeUrl('Image');
      return true;
    }

    // Kiểm tra link YouTube

    // Nếu không phải PDF, video, hoặc link YouTube, thông báo lỗi
    messageApi.open({
      type: 'error',
      content: 'Only PDF,PNG, video files, or YouTube links are allowed!',
    });

    return Upload.LIST_IGNORE; // Bỏ qua nếu không hợp lệ
  };
  const handlePreview = async (file: UploadFile) => {
    if (file?.url) {
      setPreviewImage(file.url);
    }
    if (file?.response?.data) {
      setPreviewImage(file.response.data);
    }
    setPreviewOpen(true);
  };

  const initialValues = {
    title: data?.title || '',
    description: data?.description || '',
    url: data?.url || '',
    tag: data?.tags || [],
    type: data?.type || '',
  };

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList[0].status === 'done') {
      const responseUrl = newFileList[0].response?.data;
      if (responseUrl) {
        form.setFieldsValue({
          url: responseUrl,
        });
      }
    }
  };

  const handleRemove = file => {
    setFileList(prevFileList =>
      prevFileList.filter(item => item.uid !== file.uid),
    );
    message.success(`${file.name} removed successfully.`);
  };

  return (
    <Modal
      open={isVisible}
      onOk={handleEditOk}
      confirmLoading={confirmLoading}
      onCancel={handleEditCancel}>
      <View style={styles.container}>
        {contextHolder}
        <Text style={styles.formItemTitle}>Edit Library</Text>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={initialValues}>
          <Form.Item
            style={styles.formItemTitle}
            label="Library Name"
            name="title"
            rules={[
              { required: true, message: 'Please input the library name!' },
            ]}>
            <Input placeholder="Enter library name" />
          </Form.Item>

          <Form.Item
            style={styles.formItemTitle}
            label="Description"
            name="description"
            rules={[
              { required: true, message: 'Please input the description!' },
            ]}>
            <Input.TextArea rows={4} placeholder="Enter library description" />
          </Form.Item>

          <Form.Item
            label="Library Type"
            name="type"
            rules={[
              { required: true, message: 'Please select the library type' },
            ]}>
            <Select
              placeholder="Select library type"
              value={data?.type}
              onChange={value => setTypeUrl(value)} // Cập nhật trạng thái khi chọn
              getPopupContainer={triggerNode => triggerNode.parentNode}>
              <Select.Option value="Image">Image</Select.Option>
              <Select.Option value="Video">Video</Select.Option>
              <Select.Option value="Youtube">YouTube</Select.Option>
              <Select.Option value="PDF">PDF</Select.Option>
              <Select.Option value="Text">Text</Select.Option>
            </Select>
          </Form.Item>

          {typeUrl?.toLowerCase() === 'text' ? (
            <Form.Item
              label="Content"
              name="text"
              rules={[{ required: true, message: 'Please enter the content' }]}>
              <Input.TextArea placeholder="Enter text content" />
            </Form.Item>
          ) : (
            <Form.Item
              name="url"
              label="File / Link"
              rules={[
                {
                  required: true,
                  message: 'Please upload a file or enter a link',
                },
              ]}>
              <Upload
                name="file"
                maxCount={1}
                listType="picture-card"
                action={api.defaults.baseURL + '/upload'}
                onPreview={file => {
                  handlePreview(file);
                }}
                onRemove={handleRemove}
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={onChange}>
                <button style={styles.btnContainerUpload} type="button">
                  <PlusOutlined />
                  <Text style={{ marginTop: 8 }}>Upload</Text>
                </button>
              </Upload>

              <Input
                placeholder="Or enter a link"
                onChange={e => form.setFieldsValue({ url: e.target.value })}
                style={{ marginTop: 8 }}
              />
              {previewImage && (
                <Image
                  wrapperStyle={{ display: 'none' }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: visible => setPreviewOpen(visible),
                    afterOpenChange: visible => !visible && setPreviewImage(''),
                  }}
                  src={previewImage}
                />
              )}
            </Form.Item>
          )}

          <Form.Item style={styles.formItemTitle} label="Tags" name="tag">
            <Select
              mode="tags"
              maxTagCount={10}
              placeholder="Select tag"></Select>
          </Form.Item>
        </Form>
      </View>
    </Modal>
  );
};

export default UpdateLibraryForm;
