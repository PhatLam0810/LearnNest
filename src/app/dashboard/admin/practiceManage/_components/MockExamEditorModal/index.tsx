import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select, Switch } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { View, Text } from 'react-native-web';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { MockExam } from '~mdDashboard/types/practice';

type Props = {
  open: boolean;
  exam?: MockExam;
  onClose: () => void;
};

type FormValues = {
  title: string;
  subject: 'Word' | 'Excel' | 'Mixed';
  durationMinutes: number;
  isPublished: boolean;
};

// Sửa/tạo 1 đề thi thử — chọn bài từ danh sách đề thực hành ĐÃ CÓ SẴN
// (admin/all, dùng chung với PracticeManage), sắp thứ tự bằng nút lên/xuống
// thay vì kéo-thả để giảm độ phức tạp/rủi ro cho lần làm đầu tiên.
const MockExamEditorModal: React.FC<Props> = ({ open, exam, onClose }) => {
  const [form] = Form.useForm<FormValues>();
  const [taskIds, setTaskIds] = useState<string[]>([]);
  const { data: allTasks } = adminQuery.useGetPracticeTasksAdminQuery(
    undefined,
    { skip: !open },
  );
  const [createExam, { isLoading: isCreating }] =
    adminQuery.useCreateMockExamMutation();
  const [updateExam, { isLoading: isUpdating }] =
    adminQuery.useUpdateMockExamMutation();
  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (!open) return;
    if (exam) {
      form.setFieldsValue({
        title: exam.title,
        subject: exam.subject,
        durationMinutes: exam.durationMinutes,
        isPublished: exam.isPublished,
      });
      setTaskIds(exam.taskIds);
    } else {
      form.resetFields();
      setTaskIds([]);
    }
  }, [open, exam, form]);

  const taskById = new Map((allTasks || []).map(t => [t._id, t]));
  const availableOptions = (allTasks || [])
    .filter(t => !taskIds.includes(t._id))
    .map(t => ({ value: t._id, label: `[${t.subject}] ${t.title}` }));

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...taskIds];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setTaskIds(next);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (taskIds.length === 0) {
        messageApi.error('Chọn ít nhất 1 bài cho đề thi thử');
        return;
      }
      const body = { ...values, taskIds };
      if (exam) {
        await updateExam({ examId: exam._id, body }).unwrap();
        messageApi.success('Đã cập nhật đề thi thử');
      } else {
        await createExam(body).unwrap();
        messageApi.success('Đã tạo đề thi thử');
      }
      onClose();
    } catch (e: any) {
      if (e?.errorFields) return; // Lỗi validate form — antd tự hiện.
      messageApi.error(e?.data?.message || 'Lưu đề thi thử thất bại');
    }
  };

  return (
    <Modal
      title={exam ? 'Sửa đề thi thử' : 'Tạo đề thi thử'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isSaving}
      width={640}
      okText={exam ? 'Lưu' : 'Tạo'}>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên đề thi thử"
          name="title"
          rules={[{ required: true, message: 'Nhập tên đề' }]}>
          <Input placeholder="VD: Đề thi thử Excel - Cơ bản" />
        </Form.Item>
        <Form.Item
          label="Môn"
          name="subject"
          rules={[{ required: true }]}
          initialValue="Excel">
          <Select
            options={[
              { value: 'Excel', label: 'Excel' },
              { value: 'Word', label: 'Word' },
              { value: 'Mixed', label: 'Word + Excel' },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Thời lượng (phút)"
          name="durationMinutes"
          rules={[{ required: true, message: 'Nhập thời lượng' }]}
          initialValue={30}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Xuất bản" name="isPublished" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label={`Bài trong đề (${taskIds.length})`}>
          <Select
            placeholder="Thêm bài vào đề..."
            showSearch
            optionFilterProp="label"
            value={null}
            options={availableOptions}
            onChange={(id: string) => setTaskIds(prev => [...prev, id])}
          />
          <View style={{ marginTop: 10, gap: 8 }}>
            {taskIds.map((id, idx) => {
              const task = taskById.get(id);
              return (
                <View
                  key={id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    border: '1px solid #f0f0f0',
                    borderRadius: 8,
                  }}>
                  <Text style={{ flex: 1, fontSize: 13 }}>
                    {idx + 1}. {task ? `[${task.subject}] ${task.title}` : id}
                  </Text>
                  <Button
                    size="small"
                    type="text"
                    icon={<ArrowUpOutlined />}
                    disabled={idx === 0}
                    onClick={() => move(idx, -1)}
                  />
                  <Button
                    size="small"
                    type="text"
                    icon={<ArrowDownOutlined />}
                    disabled={idx === taskIds.length - 1}
                    onClick={() => move(idx, 1)}
                  />
                  <Button
                    size="small"
                    type="text"
                    danger
                    icon={<CloseOutlined />}
                    onClick={() =>
                      setTaskIds(prev => prev.filter(t => t !== id))
                    }
                  />
                </View>
              );
            })}
          </View>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MockExamEditorModal;
