'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Form, Input, Radio } from 'antd';
import { adminQuery } from '~mdAdmin/redux';
import AppButton from '@components/AppButton';
import { CreateUserParams } from './type';
import styles from './styles';
import { messageApi } from '@hooks';

const PHONE_PATTERN = /^0\d{9}$/;
const INPUT_STYLE: React.CSSProperties = { height: 48, borderRadius: 8 };

interface CreateUserFormProps {
  onCreated?: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onCreated }) => {
  const [form] = Form.useForm<CreateUserParams>();
  const isAdmin = !!Form.useWatch('isAdmin', form);
  const contextHolder = null;
  const [createUser] = adminQuery.useCreateUserMutation();
  const [sendEmails] = adminQuery.useSendImportEmailsMutation();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: CreateUserParams) => {
    setSubmitting(true);
    try {
      // Học viên để trống mật khẩu = dùng MSSV; mật khẩu này được gửi qua email.
      const plainPassword = values.password || values.studentId;
      const account = await createUser({
        ...values,
        password: values.password || undefined,
      }).unwrap();
      // Tài khoản admin do người tạo tự đặt mật khẩu nên không gửi email kích hoạt.
      if (values.isAdmin) {
        messageApi.success('Đã tạo tài khoản Admin');
      } else {
        await sendEmails({
          accounts: [
            {
              email: account.email,
              fullName: account.fullName,
              username: account.studentId,
              password: plainPassword,
            },
          ],
        }).unwrap();
        messageApi.success('Đã tạo tài khoản và gửi email kích hoạt');
      }
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
          {isAdmin
            ? 'Tài khoản Admin chỉ cần email và mật khẩu do bạn đặt, không gửi email.'
            : 'Mật khẩu để trống sẽ là MSSV. Sau khi tạo, hệ thống gửi tài khoản và mật khẩu về email học viên.'}
        </Text>
      </View>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ isAdmin: false }}>
        <Form.Item
          label={<Text style={styles.fieldLabel}>Loại tài khoản</Text>}
          name="isAdmin">
          <Radio.Group>
            <Radio value={false}>Học viên</Radio>
            <Radio value={true}>Quản trị viên (Admin)</Radio>
          </Radio.Group>
        </Form.Item>
        <View style={styles.formGrid}>
          {!isAdmin && (
            <Form.Item
              label={<Text style={styles.fieldLabel}>Họ và tên</Text>}
              name="fullName"
              rules={[{ required: true, message: 'Nhập họ và tên' }]}
              style={{ marginBottom: 0 }}>
              <Input placeholder="VD: Nguyễn Văn A" style={INPUT_STYLE} />
            </Form.Item>
          )}
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
          {isAdmin && (
            <Form.Item
              label={<Text style={styles.fieldLabel}>Mật khẩu</Text>}
              name="password"
              rules={[
                { required: true, message: 'Nhập mật khẩu' },
                { min: 8, message: 'Mật khẩu cần ít nhất 8 ký tự' },
              ]}
              style={{ marginBottom: 0 }}>
              <Input.Password
                placeholder="Ít nhất 8 ký tự"
                autoComplete="new-password"
                style={INPUT_STYLE}
              />
            </Form.Item>
          )}
          {!isAdmin && (
            <>
              <Form.Item
                label={<Text style={styles.fieldLabel}>Mã sinh viên</Text>}
                name="studentId"
                rules={[{ required: true, message: 'Nhập mã sinh viên' }]}
                style={{ marginBottom: 0 }}>
                <Input placeholder="221B0000" style={INPUT_STYLE} />
              </Form.Item>
              <Form.Item
                label={
                  <Text style={styles.fieldLabel}>
                    Mật khẩu (để trống = dùng MSSV)
                  </Text>
                }
                name="password"
                rules={[{ min: 8, message: 'Mật khẩu cần ít nhất 8 ký tự' }]}
                style={{ marginBottom: 0 }}>
                <Input.Password
                  placeholder="Mặc định là MSSV"
                  autoComplete="new-password"
                  style={INPUT_STYLE}
                />
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
            </>
          )}
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
            {isAdmin ? 'Tạo tài khoản Admin' : 'Tạo và gửi email'}
          </AppButton>
        </View>
      </Form>
    </View>
  );
};

export default CreateUserForm;
