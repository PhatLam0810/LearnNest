import React, { useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Upload,
  UploadFile,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { messageApi } from '@hooks';
import api from '@services/api';
import { adminQuery } from '~mdAdmin/redux';

type Props = {
  lessonId: string;
  moduleId: string;
  onCreated: () => void;
  onCancel: () => void;
};

// Form tạo NHANH 1 bài thực hành mới ngay trong màn Phần học — giống hệt
// cách "Thêm bài học mới" hoạt động trong ModalSelectLibrary (video). Chỉ
// tạo thông tin cơ bản + gán sẵn lessonId/moduleId của phần đang sửa; phần
// tiêu chí chấm điểm (phức tạp hơn nhiều so với questionList của video) vẫn
// phải sang tab "Thực Hành MOS" để thêm, không lặp lại UI đó ở đây.
const CreateTaskInlineForm: React.FC<Props> = ({
  lessonId,
  moduleId,
  onCreated,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [starterFileList, setStarterFileList] = useState<UploadFile[]>([]);
  const [createTask, { isLoading }] =
    adminQuery.useCreatePracticeTaskMutation();

  return (
    <Form
      form={form}
      layout="vertical"
      style={{
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
      }}
      initialValues={{ subject: 'Excel', isPublished: false }}
      onFinish={async values => {
        try {
          await createTask({ ...values, lessonId, moduleId }).unwrap();
          messageApi.success(
            'Đã tạo bài thực hành — vào tab "Thực Hành MOS" để thêm tiêu chí chấm điểm cho bài này.',
          );
          form.resetFields();
          setStarterFileList([]);
          onCreated();
        } catch {
          messageApi.error('Tạo bài thực hành thất bại');
        }
      }}>
      <Form.Item label="Môn" name="subject" rules={[{ required: true }]}>
        <Select
          options={[
            { value: 'Excel', label: 'Excel' },
            { value: 'Word', label: 'Word' },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Tiêu đề bài thực hành"
        name="title"
        rules={[{ required: true, message: 'Nhập tiêu đề bài thực hành' }]}>
        <Input placeholder="VD: Báo cáo doanh thu Cà Phê Sunrise" />
      </Form.Item>
      <Form.Item label="Mô tả / yêu cầu đề bài" name="description">
        <Input.TextArea
          rows={3}
          placeholder="Mô tả tình huống và các yêu cầu học viên cần thực hiện..."
        />
      </Form.Item>
      <Form.Item
        label="File đề gốc (.xlsx / .docx)"
        name="starterFileUrl"
        rules={[{ required: true, message: 'Tải lên file đề gốc' }]}>
        <Upload
          maxCount={1}
          accept=".xlsx,.docx"
          fileList={starterFileList}
          action={api.defaults.baseURL + '/upload'}
          onRemove={() => {
            setStarterFileList([]);
            form.setFieldsValue({ starterFileUrl: undefined });
          }}
          onChange={info => {
            setStarterFileList(info.fileList.slice(-1));
            if (info.file.status === 'done') {
              const url = info.file.response?.data;
              if (url) form.setFieldsValue({ starterFileUrl: url });
            }
          }}>
          <Button icon={<UploadOutlined />}>Tải lên file đề gốc</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        label="Xuất bản ngay"
        name="isPublished"
        valuePropName="checked">
        <Switch />
      </Form.Item>
      <Space>
        <Button onClick={onCancel}>Huỷ</Button>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Tạo bài thực hành
        </Button>
      </Space>
    </Form>
  );
};

export default CreateTaskInlineForm;
