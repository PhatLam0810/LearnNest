import React, { useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Tag,
  Upload,
  UploadFile,
} from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExperimentOutlined,
  PlusOutlined,
  RobotOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { messageApi, useAppPagination } from '@hooks';
import api from '@services/api';
import { useAppSelector } from '@redux';
import { adminQuery } from '~mdAdmin/redux';
import { dashboardQuery } from '~mdDashboard/redux';
import {
  PracticeCriteria,
  PracticeSubject,
  PracticeSubmissionResultItem,
} from '~mdDashboard/types/practice';
import CriteriaListItem from './CriteriaListItem';

type LessonOption = { _id: string; title: string };

type Props = {
  open: boolean;
  taskId?: string;
  onClose: () => void;
};

const PracticeTaskEditorDrawer: React.FC<Props> = ({
  open,
  taskId,
  onClose,
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
  // Modal.confirm (static call) không render ra bất kỳ DOM node nào trong
  // app này (đã kiểm chứng: gọi xong, criteria vẫn giữ giá trị cũ và
  // document.querySelectorAll('.ant-modal*') rỗng — không có lỗi console
  // nào cả, chỉ đơn giản là không hoạt động, khả năng do thiếu context của
  // antd <App> cho các static method) — dùng <Modal open> có state riêng
  // thay vì static Modal.confirm để chắc chắn hiện ra được.
  const [isConfirmReplaceOpen, setIsConfirmReplaceOpen] = useState(false);
  // Kết quả "thử chấm" file mẫu với bộ tiêu chí hiện có trên form — không
  // liên quan gì tới PracticeSubmission thật, chỉ để admin tự kiểm tra
  // tiêu chí có đúng ý mình trước khi publish, xem handleTestGrade.
  const [testGradeResult, setTestGradeResult] = useState<{
    totalScore: number;
    maxScore: number;
    items: PracticeSubmissionResultItem[];
  } | null>(null);
  const [isTestGrading, setIsTestGrading] = useState(false);
  const accessToken = useAppSelector(
    state => state.authReducer.tokenInfo?.accessToken,
  );

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
  const [generateCriteria, { isLoading: isGeneratingCriteria }] =
    adminQuery.useGenerateCriteriaMutation();

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
    setTestGradeResult(null);
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

  // Đọc thẳng từ form đề bài (kể cả khi CHƯA lưu) để gợi ý tiêu chí bằng AI
  // — không bắt buộc phải tạo đề trước mới dùng được. Kết quả chỉ điền vào
  // form tiêu chí, admin vẫn phải bấm "Lưu tiêu chí" mới thật sự ghi vào DB.
  const runGenerateCriteria = async () => {
    const {
      subject: formSubject,
      title,
      description,
    } = taskForm.getFieldsValue(['subject', 'title', 'description']);
    if (!description?.trim()) {
      messageApi.warning('Nhập mô tả / yêu cầu đề bài trước khi dùng AI');
      return;
    }
    try {
      const suggested = await generateCriteria({
        subject: formSubject || subject,
        title,
        description,
      }).unwrap();
      if (!suggested.length) {
        messageApi.warning(
          'AI không nhận diện được tiêu chí nào cụ thể từ mô tả — hãy viết rõ hơn hoặc nhập thủ công',
        );
        return;
      }
      criteriaForm.setFieldsValue({ criteria: suggested });
      messageApi.success(
        `AI đã gợi ý ${suggested.length} tiêu chí — kiểm tra lại rồi bấm "Lưu tiêu chí"`,
      );
    } catch {
      messageApi.error('Tạo gợi ý bằng AI thất bại, vui lòng thử lại');
    }
  };

  const handleGenerateCriteria = () => {
    const current = criteriaForm.getFieldValue('criteria') || [];
    if (current.length > 0) {
      setIsConfirmReplaceOpen(true);
      return;
    }
    runGenerateCriteria();
  };

  // "Thử chấm với file mẫu": chạy đúng engine chấm điểm thật với bộ tiêu
  // chí ĐANG CÓ trên form (kể cả chưa bấm "Lưu tiêu chí") — không tạo
  // PracticeSubmission, không lưu gì cả, chỉ để admin tự kiểm tra tiêu chí
  // có đúng ý mình trước khi publish cho học viên. Dùng antd Upload trực
  // tiếp (như file đề gốc/bài nộp học viên) vì đây là multipart thật, RTK
  // Query mutation không hợp cho việc này.
  const testGradeAccept = subject === 'Excel' ? '.xlsx' : '.docx';
  const testGradeUploadProps = {
    accept: testGradeAccept,
    maxCount: 1,
    showUploadList: false,
    action: `${api.defaults.baseURL}/practice/tasks/test-grade`,
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
    data: () => ({
      subject,
      criteria: JSON.stringify(criteriaForm.getFieldValue('criteria') || []),
    }),
    beforeUpload: () => {
      const current = criteriaForm.getFieldValue('criteria') || [];
      if (!current.length) {
        messageApi.warning('Chưa có tiêu chí nào để thử chấm');
        return Upload.LIST_IGNORE;
      }
      setIsTestGrading(true);
      setTestGradeResult(null);
      return true;
    },
    onChange: (info: any) => {
      if (info.file.status === 'done') {
        setIsTestGrading(false);
        const result = info.file.response?.data;
        if (result) {
          setTestGradeResult(result);
          messageApi.success(
            `Thử chấm xong: ${result.totalScore}/${result.maxScore} điểm`,
          );
        }
      }
      if (info.file.status === 'error') {
        setIsTestGrading(false);
        const serverMessage = info.file.response?.message;
        messageApi.error(
          serverMessage || 'Thử chấm thất bại, vui lòng thử lại',
        );
      }
    },
  };

  return (
    <Drawer
      title={currentTaskId ? 'Sửa đề thực hành' : 'Thêm đề thực hành mới'}
      open={open}
      onClose={onClose}
      width={640}
      destroyOnClose>
      {/* .ant-drawer-body có override toàn cục `overflow-y: hidden !important;
          padding: 0 !important` (src/app/dashboard/styles.css) — dùng chung
          cho cả app nên không sửa được ở đây, phải tự quản lý scroll + padding
          riêng trong 1 wrapper của chính Drawer này. */}
      <div
        style={{
          height: 'calc(100vh - 55px)',
          overflowY: 'auto',
          padding: 24,
        }}>
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
              options={lessonOptions.map(l => ({
                value: l._id,
                label: l.title,
              }))}
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
                <Button
                  icon={<RobotOutlined />}
                  loading={isGeneratingCriteria}
                  onClick={handleGenerateCriteria}
                  style={{ marginBottom: 16 }}
                  block>
                  Dùng AI tạo tiêu chí từ mô tả đề bài
                </Button>
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
                <Space wrap>
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
                  <Upload {...testGradeUploadProps}>
                    <Button
                      icon={<ExperimentOutlined />}
                      loading={isTestGrading}>
                      Thử chấm với file mẫu ({testGradeAccept})
                    </Button>
                  </Upload>
                </Space>
              </Form>
            )}
            {testGradeResult && (
              <div
                style={{
                  marginTop: 16,
                  border: '1px solid #f0f0f0',
                  borderRadius: 8,
                  padding: 12,
                }}>
                <b>
                  Kết quả thử chấm: {testGradeResult.totalScore}/
                  {testGradeResult.maxScore} điểm
                </b>
                <div style={{ marginTop: 8 }}>
                  {testGradeResult.items.map((item, idx) => (
                    <div
                      key={item.criteriaId}
                      style={{
                        display: 'flex',
                        gap: 8,
                        alignItems: 'flex-start',
                        padding: '6px 0',
                        borderBottom: '1px solid #f5f5f5',
                      }}>
                      {item.passed ? (
                        <CheckCircleFilled style={{ color: '#52c41a' }} />
                      ) : (
                        <CloseCircleFilled style={{ color: '#ff4d4f' }} />
                      )}
                      <div>
                        <div>Tiêu chí {idx + 1}</div>
                        <div style={{ color: '#666', fontSize: 13 }}>
                          {item.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                    <div style={{ whiteSpace: 'pre-line' }}>
                      {it.instruction}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        title="Thay thế tiêu chí hiện tại?"
        open={isConfirmReplaceOpen}
        onCancel={() => setIsConfirmReplaceOpen(false)}
        okText="Thay thế"
        cancelText="Hủy"
        onOk={() => {
          setIsConfirmReplaceOpen(false);
          runGenerateCriteria();
        }}>
        Danh sách tiêu chí đang có sẽ bị thay bằng gợi ý mới từ AI. Bạn vẫn cần
        bấm &quot;Lưu tiêu chí&quot; để ghi lại thật sự.
      </Modal>
    </Drawer>
  );
};

export default PracticeTaskEditorDrawer;
