import React, { useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Upload,
  UploadFile,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { messageApi, useAppPagination } from '@hooks';
import api from '@services/api';
import { adminQuery } from '~mdAdmin/redux';
import { dashboardQuery } from '~mdDashboard/redux';
import { PracticeCriteria, PracticeSubject } from '~mdDashboard/types/practice';
import CriteriaListItem from './CriteriaListItem';

type LessonOption = { _id: string; title: string };

type Props = {
  open: boolean;
  taskId?: string;
  onClose: () => void;
  onSaved: () => void;
};

const PracticeTaskEditorDrawer: React.FC<Props> = ({
  open,
  taskId,
  onClose,
  onSaved,
}) => {
  const [taskForm] = Form.useForm();
  const [criteriaForm] = Form.useForm();
  const [starterFileList, setStarterFileList] = useState<UploadFile[]>([]);
  const [currentTaskId, setCurrentTaskId] = useState<string | undefined>(
    taskId,
  );
  const [subject, setSubject] = useState<PracticeSubject>('Excel');
  const [instructions, setInstructions] = useState<
    { criteriaId: string; instruction: string }[] | null
  >(null);

  const { data: detail, isFetching: isLoadingDetail } =
    adminQuery.useGetPracticeTaskDetailAdminQuery(currentTaskId, {
      skip: !currentTaskId,
    });
  const [createTask, { isLoading: isCreating }] =
    adminQuery.useCreatePracticeTaskMutation();
  const [updateTask, { isLoading: isUpdating }] =
    adminQuery.useUpdatePracticeTaskMutation();
  const [setCriteria, { isLoading: isSavingCriteria }] =
    adminQuery.useSetPracticeCriteriaMutation();
  const [fetchInstructions, { isFetching: isLoadingInstructions }] =
    adminQuery.useLazyGetPracticeInstructionsQuery();

  // Gắn đề vào 1 khóa thực hành (Lesson) + 1 Phần (Module) đã có sẵn —
  // tái dùng đúng khóa học/module admin đã tạo ở tab "Tạo Khóa Học".
  const { listItem: lessonOptions } = useAppPagination<LessonOption>({
    apiUrl: 'lesson/getAllLesson',
    params: { pageSize: 100 },
  });
  const selectedLessonId = Form.useWatch('lessonId', taskForm);
  const { data: selectedLessonDetail } = dashboardQuery.useGetLessonIdQuery(
    { id: selectedLessonId },
    { skip: !selectedLessonId },
  );

  useEffect(() => {
    if (!open) return;
    setCurrentTaskId(taskId);
    setInstructions(null);
    if (!taskId) {
      taskForm.resetFields();
      criteriaForm.resetFields();
      setStarterFileList([]);
      setSubject('Excel');
    }
  }, [open, taskId]);

  useEffect(() => {
    if (!detail) return;
    taskForm.setFieldsValue(detail.task);
    setSubject(detail.task.subject);
    if (detail.task.starterFileUrl) {
      setStarterFileList([
        {
          uid: '-1',
          name: decodeURIComponent(
            detail.task.starterFileUrl.split('/').pop() || 'de-goc',
          ),
          status: 'done',
          url: detail.task.starterFileUrl,
        },
      ]);
    }
    criteriaForm.setFieldsValue({
      criteria: detail.criteria.map((c: PracticeCriteria) => ({
        type: c.type,
        points: c.points,
        params: c.params,
      })),
    });
  }, [detail]);

  const handleSaveTask = async (values: any) => {
    try {
      if (currentTaskId) {
        await updateTask({ taskId: currentTaskId, body: values }).unwrap();
        messageApi.success('Đã cập nhật đề thực hành');
      } else {
        const created = await createTask(values).unwrap();
        setCurrentTaskId(created._id);
        messageApi.success(
          'Đã tạo đề — giờ hãy thêm tiêu chí chấm điểm bên dưới',
        );
      }
      onSaved();
    } catch {
      messageApi.error('Lưu đề thực hành thất bại');
    }
  };

  const handleSaveCriteria = async (values: {
    criteria: PracticeCriteria[];
  }) => {
    if (!currentTaskId) return;
    try {
      await setCriteria({
        taskId: currentTaskId,
        criteria: values.criteria || [],
      }).unwrap();
      messageApi.success('Đã lưu tiêu chí chấm điểm');
      onSaved();
    } catch {
      messageApi.error(
        'Lưu tiêu chí thất bại — kiểm tra lại các trường bắt buộc',
      );
    }
  };

  const handlePreviewInstructions = async () => {
    if (!currentTaskId) return;
    try {
      const res = await fetchInstructions(currentTaskId).unwrap();
      setInstructions(res);
    } catch {
      messageApi.error('Không tải được hướng dẫn xem trước');
    }
  };

  return (
    <Drawer
      title={currentTaskId ? 'Sửa đề thực hành' : 'Thêm đề thực hành mới'}
      open={open}
      onClose={onClose}
      width={640}
      destroyOnClose>
      <Form
        form={taskForm}
        layout="vertical"
        onFinish={handleSaveTask}
        initialValues={{ subject: 'Excel', isPublished: false }}>
        <Form.Item label="Môn" name="subject" rules={[{ required: true }]}>
          <Select
            disabled={!!currentTaskId}
            onChange={v => setSubject(v)}
            options={[
              { value: 'Excel', label: 'Excel' },
              { value: 'Word', label: 'Word' },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Tiêu đề đề bài"
          name="title"
          rules={[{ required: true, message: 'Nhập tiêu đề đề bài' }]}>
          <Input placeholder="VD: Báo cáo doanh thu Cà Phê Sunrise" />
        </Form.Item>
        <Form.Item label="Mô tả / yêu cầu đề bài" name="description">
          <Input.TextArea
            rows={5}
            placeholder="Mô tả tình huống và các yêu cầu học viên cần thực hiện..."
          />
        </Form.Item>
        <Form.Item
          label="Khóa thực hành (không bắt buộc)"
          name="lessonId"
          tooltip="Gắn đề vào 1 khóa thực hành (đã tạo ở tab Tạo Khóa Học) để bài tập hiện trong khóa đó thay vì đứng riêng lẻ.">
          <Select
            allowClear
            showSearch
            placeholder="Chọn khóa thực hành"
            optionFilterProp="label"
            onChange={() => taskForm.setFieldsValue({ moduleId: undefined })}
            options={lessonOptions.map(l => ({ value: l._id, label: l.title }))}
          />
        </Form.Item>
        <Form.Item
          label="Phần (không bắt buộc)"
          name="moduleId"
          tooltip="Chọn 1 Phần thuộc khóa thực hành ở trên để nhóm bài tập lại.">
          <Select
            allowClear
            disabled={!selectedLessonId}
            placeholder={
              selectedLessonId ? 'Chọn phần' : 'Chọn khóa thực hành trước'
            }
            options={(selectedLessonDetail?.modules || []).map(m => ({
              value: m._id,
              label: m.title,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="File đề gốc (.xlsx / .docx) để học viên tải về làm bài"
          name="starterFileUrl"
          rules={[{ required: true, message: 'Tải lên file đề gốc' }]}>
          <Upload
            maxCount={1}
            accept=".xlsx,.docx"
            fileList={starterFileList}
            action={api.defaults.baseURL + '/upload'}
            onRemove={() => {
              setStarterFileList([]);
              taskForm.setFieldsValue({ starterFileUrl: undefined });
            }}
            onChange={info => {
              setStarterFileList(info.fileList.slice(-1));
              if (info.file.status === 'done') {
                const url = info.file.response?.data;
                if (url) taskForm.setFieldsValue({ starterFileUrl: url });
              }
            }}>
            <Button icon={<UploadOutlined />}>Tải lên file đề gốc</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="Xuất bản (học viên thấy và làm được)"
          name="isPublished"
          valuePropName="checked">
          <Switch />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isCreating || isUpdating}>
          {currentTaskId ? 'Cập nhật đề' : 'Tạo đề'}
        </Button>
      </Form>

      {currentTaskId && (
        <>
          <Divider>Tiêu chí chấm điểm</Divider>
          {isLoadingDetail ? (
            <p>Đang tải tiêu chí...</p>
          ) : (
            <Form
              form={criteriaForm}
              layout="vertical"
              onFinish={handleSaveCriteria}>
              <Form.List name="criteria">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <CriteriaListItem
                        key={key}
                        form={criteriaForm}
                        name={name}
                        restField={restField}
                        remove={remove}
                        subject={subject}
                      />
                    ))}
                    <Button
                      type="dashed"
                      block
                      icon={<PlusOutlined />}
                      onClick={() => add({ points: 1 })}
                      style={{ marginBottom: 12 }}>
                      Thêm tiêu chí
                    </Button>
                  </>
                )}
              </Form.List>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSavingCriteria}>
                  Lưu tiêu chí
                </Button>
                <Button
                  onClick={handlePreviewInstructions}
                  loading={isLoadingInstructions}>
                  Xem trước hướng dẫn tự sinh
                </Button>
              </Space>
            </Form>
          )}
          {instructions && (
            <div
              style={{
                marginTop: 16,
                background: '#fafafa',
                padding: 12,
                borderRadius: 8,
              }}>
              {instructions.map((it, idx) => (
                <div key={it.criteriaId} style={{ marginBottom: 8 }}>
                  <b>Tiêu chí {idx + 1}:</b>
                  <div style={{ whiteSpace: 'pre-line' }}>{it.instruction}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Drawer>
  );
};

export default PracticeTaskEditorDrawer;
