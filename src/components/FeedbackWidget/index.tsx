'use client';
import React, { useState } from 'react';
import { Form, Input, Modal, Upload, UploadFile } from 'antd';
import { View, Text, TouchableOpacity } from 'react-native-web';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@redux';
import { adminAction } from '~mdAdmin/redux';
import api from '@services/api';
import styles from './styles';

const { TextArea } = Input;
const MAX_WORDS = 200;
const MAX_IMAGES = 5;

type FeedbackFormValues = {
  fullName: string;
  email: string;
  content: string;
};

const countWords = (text: string) =>
  text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

const FeedbackWidget: React.FC = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const [form] = Form.useForm<FeedbackFormValues>();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [wordCount, setWordCount] = useState(0);

  // Only show once inside the logged-in app area — layout.tsx mounts this
  // globally (including the public /login, /signup, /forgotPassword pages),
  // so a route check is needed alongside the auth check.
  const isInsideApp = pathname?.startsWith('/dashboard');
  if (!userProfile || !isInsideApp) return null;

  const handleOpen = () => {
    form.setFieldsValue({
      fullName: userProfile.fullName || '',
      email: userProfile.email || '',
      content: '',
    });
    setFileList([]);
    setWordCount(0);
    setOpen(true);
  };

  const handleSubmit = async (values: FeedbackFormValues) => {
    const images = fileList
      .map(file => file.response?.data)
      .filter((url): url is string => Boolean(url));

    setSubmitting(true);
    dispatch(
      adminAction.submitFeedback({
        params: {
          fullName: values.fullName,
          email: values.email,
          content: values.content,
          images,
        },
        callback: () => {
          setSubmitting(false);
          setOpen(false);
          form.resetFields();
          setFileList([]);
        },
      }),
    );
    // Callback above only fires on success; make sure the button doesn't
    // stay stuck spinning forever if the saga's error path is hit instead.
    setTimeout(() => setSubmitting(false), 8000);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.fab}>
        <View onClick={handleOpen}>
          <Text style={styles.fabText}>💬 Gửi phản hồi</Text>
        </View>
      </TouchableOpacity>

      <Modal
        title="Gửi phản hồi"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText="Gửi"
        cancelText="Hủy">
        <Form<FeedbackFormValues>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không đúng định dạng' },
            ]}>
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label={`Nội dung phản hồi (${wordCount}/${MAX_WORDS} từ)`}
            name="content"
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung phản hồi' },
              {
                validator: (_, value: string) =>
                  countWords(value || '') > MAX_WORDS
                    ? Promise.reject(
                        new Error(
                          `Nội dung không được vượt quá ${MAX_WORDS} từ`,
                        ),
                      )
                    : Promise.resolve(),
              },
            ]}>
            <TextArea
              rows={4}
              placeholder="Chia sẻ góp ý hoặc báo lỗi bạn gặp phải..."
              onChange={e => setWordCount(countWords(e.target.value))}
            />
          </Form.Item>

          <Form.Item label="Hình ảnh đính kèm (tối đa 5 ảnh)">
            <Upload
              listType="picture-card"
              multiple
              maxCount={MAX_IMAGES}
              fileList={fileList}
              action={api.defaults.baseURL + '/upload'}
              onChange={({ fileList: newFileList }) =>
                setFileList(newFileList)
              }>
              {fileList.length >= MAX_IMAGES ? null : <div>+ Tải ảnh</div>}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </View>
  );
};

export default FeedbackWidget;
