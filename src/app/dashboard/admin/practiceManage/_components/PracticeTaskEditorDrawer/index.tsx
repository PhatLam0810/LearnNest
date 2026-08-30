import React, { useEffect, useRef, useState } from 'react';
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
import { messageApi } from '@hooks';
import api from '@services/api';
import { useAppSelector } from '@redux';
import { adminQuery } from '~mdAdmin/redux';
import {
  PracticeCriteria,
  PracticeSubject,
  PracticeSubmissionResultItem,
} from '~mdDashboard/types/practice';
import CriteriaListItem from './CriteriaListItem';

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
  // Tăng lên mỗi lần drawer MỞ (kể cả mở lại đúng task cũ) — dùng làm 1 phần
  // "khoá populate" bên dưới. Bug thật đã gặp: chỉ reset lastPopulatedTaskIdRef
  // trong effect mở drawer thì không đủ, vì effect đổ dữ liệu form lại chỉ
  // chạy theo [detail] — nếu mở lại ĐÚNG task cũ (chưa lưu gì nên `detail`
  // vẫn y hệt tham chiếu cũ), effect đó không chạy lại, chữ đang gõ dở từ
  // lần trước bị bỏ sót trên form dù trông như "task mới mở". Thêm
  // openSession vào dependency để buộc effect populate chạy lại đúng lúc mở.
  const [openSession, setOpenSession] = useState(0);
  const accessToken = useAppSelector(
    state => state.authReducer.tokenInfo?.accessToken,
  );

  // currentData (không phải data) — bug thật đã gặp: đóng drawer đang SỬA
  // task F rồi mở "Thêm đề thực hành mới" (currentTaskId -> undefined),
  // `data` của RTK Query vẫn giữ nguyên kết quả CŨ của task F một nhịp (để
  // tránh nháy UI khi đổi tham số bình thường) — form "Thêm mới" vẫn hiện
  // y hệt dữ liệu task F dù tiêu đề drawer đã đổi đúng. `currentData` luôn
  // undefined ngay khi tham số đổi (hoặc bị skip), không bị dính giá trị cũ.
  const { currentData: detail, isFetching: isLoadingDetail } =
    adminQuery.useGetPracticeTaskDetailAdminQuery(currentTaskId, {
      skip: !currentTaskId,
    });
  const [createTask, { isLoading: isCreating }] =
    adminQuery.useCreatePracticeTaskMutation();
  const [updateTask, { isLoading: isUpdating }] =
    adminQuery.useUpdatePracticeTaskMutation();
  const [setCriteria, { isLoading: isSavingCriteria }] =
    adminQuery.useSetPracticeCriteriaMutation();
  const [previewInstructionsMutation, { isLoading: isLoadingInstructions }] =
    adminQuery.usePreviewInstructionsMutation();
  const [generateCriteria, { isLoading: isGeneratingCriteria }] =
    adminQuery.useGenerateCriteriaMutation();

  // Gắn đề vào 1 khóa thực hành (Lesson) + 1 Phần (Module) đã có sẵn —
  // tái dùng đúng khóa học/module admin đã tạo ở tab "Tạo Khóa Học".

  useEffect(() => {
    if (!open) return;
    setCurrentTaskId(taskId);
    setInstructions(null);
    setTestGradeResult(null);
    // Mở lại drawer (kể cả cho ĐÚNG task cũ) phải populate lại từ đầu —
    // openSession đổi buộc effect populate bên dưới chạy lại dù `detail` vẫn
    // y hệt tham chiếu cũ (task cũ, chưa lưu gì nên RTK Query không có gì để
    // refetch mới).
    setOpenSession(s => s + 1);
    if (!taskId) {
      taskForm.resetFields();
      criteriaForm.resetFields();
      setStarterFileList([]);
      setSubject('Excel');
    }
  }, [open, taskId]);

  // Chỉ đổ dữ liệu vào form đúng 1 LẦN cho mỗi "phiên mở" (openSession) của
  // 1 task, không phải mỗi khi `detail` đổi tham chiếu — getPracticeTaskDetailAdmin
  // giờ tự động refetch nền sau khi tag PracticeTask bị invalidate (VD: vừa
  // lưu tiêu chí xong), và nếu người dùng đang gõ dở tiêu đề/mô tả đúng lúc
  // refetch đó về, effect cũ (chạy theo [detail]) sẽ ghi đè mất chữ đang gõ
  // dở — lỗi thật đã gặp khi test tag invalidation.
  //
  // Khoá theo (taskId + openSession) chứ KHÔNG chỉ theo taskId — nếu chỉ so
  // taskId, đóng rồi mở lại ĐÚNG task cũ (chưa lưu gì) sẽ bị bỏ qua vì
  // taskId không đổi, để sót chữ đang gõ dở từ lần trước trên form dù trông
  // như "vừa mở task mới" — lỗi thật thứ 2 đã gặp. openSession tăng mỗi lần
  // mở (xem effect trên) nên luôn buộc populate lại đúng lúc mở, trong khi
  // vẫn bỏ qua refetch nền xảy ra GIỮA lúc đang mở (openSession không đổi).
  const lastPopulatedKeyRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    // Chốt chặn thêm: detail phải khớp đúng currentTaskId ĐANG chọn — phòng
    // trường hợp tương tự (RTK Query trả dữ liệu của tham số cũ) tái diễn ở
    // đâu đó khác mà không bị vô hiệu hoàn toàn chỉ nhờ đổi data->currentData.
    if (!detail || detail.task._id !== currentTaskId) return;
    const key = `${detail.task._id}:${openSession}`;
    if (lastPopulatedKeyRef.current === key) return;
    lastPopulatedKeyRef.current = key;
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
  }, [detail, openSession]);

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

  // Dùng tiêu chí ĐANG CÓ trên form (criteriaForm), không phải bản đã lưu
  // trong DB — nếu không, sửa/dùng AI xong mà chưa bấm "Lưu tiêu chí" thì
  // bấm nút này vẫn hiện hướng dẫn CŨ (hoặc rỗng), trông như không hoạt động.
  const handlePreviewInstructions = async () => {
    const current = criteriaForm.getFieldValue('criteria') || [];
    if (!current.length) {
      messageApi.warning('Chưa có tiêu chí nào để xem trước hướng dẫn');
      return;
    }
    try {
      const res = await previewInstructionsMutation(current).unwrap();
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
