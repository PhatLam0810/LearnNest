'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Form, Input, message } from 'antd';
import { adminQuery } from '~mdAdmin/redux';
import AppButton from '@components/AppButton';
import { CreateUserParams } from './type';
import styles from './styles';

const PHONE_PATTERN = /^0\d{9}$/;
const INPUT_STYLE: React.CSSProperties = { height: 48, borderRadius: 8 };

interface CreateUserFormProps {
  onCreated?: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onCreated }) => {
  const [form] = Form.useForm<CreateUserParams>();
  const [messageApi, contextHolder] = message.useMessage();
  const [createUser] = adminQuery.useCreateUserMutation();
  const [sendEmails] = adminQuery.useSendImportEmailsMutation();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: CreateUserParams) => {
    setSubmitting(true);
    try {
      const account = await createUser(values).unwrap();
      await sendEmails({ accounts: [account] }).unwrap();
      messageApi.success('Đã tạo tài khoản và gửi email kích hoạt');
      form.resetFields();
      // Tab "Quản Trị Người Dùng" là 1 component riêng, không share state -
      // báo qua event để danh sách ở đó tự làm mới (xem userManage/page.tsx).
      window.dispatchEvent(new Event('learnnest:user-created'));
      onCreated?.();
    } catch (error: any) {
      messageApi.error(error?.data?.message || 'Tạo tài khoản thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      {contextHolder}
      <View>
        <Text style={styles.title}>Tạo người dùng mới</Text>
        <Text style={styles.subtitle}>
          Hệ thống tự sinh mật khẩu và gửi email kích hoạt cho người dùng.
        </Text>
      </View>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <View style={styles.formGrid}>
          <Form.Item
            label={<Text style={styles.fieldLabel}>Họ và tên</Text>}
            name="fullName"
            rules={[{ required: true, message: 'Nhập họ và tên' }]}
            style={{ marginBottom: 0 }}>
            <Input placeholder="VD: Nguyễn Văn A" style={INPUT_STYLE} />
          </Form.Item>
          <Form.Item
            label={<Text style={styles.fieldLabel}>Email</Text>}
            name="email"
            rules={[
              { required: true, message: 'Nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
            style={{ marginBottom: 0 }}>
            <Input placeholder="ten@learnnest.vn" style={INPUT_STYLE} />
          </Form.Item>
          <Form.Item
            label={<Text style={styles.fieldLabel}>Mã sinh viên</Text>}
            name="studentId"
            rules={[{ required: true, message: 'Nhập mã sinh viên' }]}
            style={{ marginBottom: 0 }}>
            <Input placeholder="221B0000" style={INPUT_STYLE} />
          </Form.Item>
          <Form.Item
            label={<Text style={styles.fieldLabel}>Số điện thoại</Text>}
            name="phoneNumber"
            rules={[
              {
                pattern: PHONE_PATTERN,
                message: 'Số điện thoại phải gồm 10 số',
              },
            ]}
            style={{ marginBottom: 0 }}>
            <Input placeholder="09xx xxx xxx" style={INPUT_STYLE} />
          </Form.Item>
          <Form.Item
            label={<Text style={styles.fieldLabel}>Lớp</Text>}
            name="class"
            style={{ marginBottom: 0 }}>
            <Input placeholder="K22QTKD2" style={INPUT_STYLE} />
          </Form.Item>
          <Form.Item
            label={<Text style={styles.fieldLabel}>Khoa</Text>}
            name="faculty"
            style={{ marginBottom: 0 }}>
            <Input placeholder="Kinh tế" style={INPUT_STYLE} />
          </Form.Item>
        </View>

        <View style={{ ...styles.footer, marginTop: 18 }}>
          <AppButton
            style={{ width: 'auto' }}
            onClick={() => form.resetFields()}>
            Hủy
          </AppButton>
          <AppButton
            type="primary"
            style={{ width: 'auto' }}
            htmlType="submit"
            loading={submitting}>
            Tạo và gửi email
          </AppButton>
        </View>
      </Form>
    </View>
  );
};

export default CreateUserForm;
