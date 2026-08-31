'use client';
import React, { useState } from 'react';
import { Button, Empty, Spin, Upload, UploadProps } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAppSelector } from '@redux';
import { messageApi } from '@hooks';
import api from '@services/api';
import { dashboardQuery } from '~mdDashboard/redux';
import {
  PracticeSubmitResponse,
  PracticeSubmissionResultItem,
} from '~mdDashboard/types/practice';
import './styles.scss';

type Props = {
  taskId: string;
  // Gọi đúng 1 lần khi 1 lần nộp bài ĐẠT (>= 80% số điểm) — nơi gọi (VD
  // ModuleDetailPage) dùng để mở khóa + có thể tự chuyển sang nội dung tiếp
  // theo trong khóa học, y hệt cách video/trắc nghiệm hoạt động.
  onPassed?: () => void;
};

// Toàn bộ nội dung "làm 1 bài tập thực hành": mô tả yêu cầu, tải đề gốc,
// nộp bài + chấm điểm, kết quả, lịch sử nộp. Tách riêng khỏi trang để dùng
// lại được ở cả 2 chỗ: trang chi tiết đứng riêng (/dashboard/practice/[id])
// và bên phải trang khóa thực hành dạng sidebar Phần > Bài tập.
const PracticeTaskContent: React.FC<Props> = ({ taskId, onPassed }) => {
  const accessToken = useAppSelector(
    state => state.authReducer.tokenInfo?.accessToken,
  );
  const [latestResult, setLatestResult] =
    useState<PracticeSubmitResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: detail, isFetching } =
    dashboardQuery.useGetPracticeTaskDetailStudentQuery(taskId, {
      skip: !taskId,
    });
  const { data: submissions, refetch: refetchSubmissions } =
    dashboardQuery.useGetMyPracticeSubmissionsQuery(taskId, {
      skip: !taskId,
    });
  // Hướng dẫn "Bước 1,2,3..." của TỪNG yêu cầu — hiện ngay từ đầu (không đợi
  // nộp sai mới thấy) để học viên biết chính xác cần làm gì cho mỗi tiêu chí
  // chấm điểm, giống cách đề thi MOS thật liệt kê rõ từng yêu cầu.
  const { data: instructions } =
    dashboardQuery.useGetPracticeTaskInstructionsQuery(taskId, {
      skip: !taskId,
    });

  // Đổi bài tập (taskId khác) thì phải xoá kết quả lần nộp trước đi, không
  // thì kết quả bài cũ sẽ hiện nhầm lên bài mới vừa chọn.
  const [lastTaskId, setLastTaskId] = useState(taskId);
  if (taskId !== lastTaskId) {
    setLastTaskId(taskId);
    setLatestResult(null);
  }

  if (isFetching) {
    return (
      <div className="practice-content practice-content-loading">
        <Spin />
      </div>
    );
  }

  if (!detail?.task) {
    return (
      <div className="practice-content">
        <Empty description="Không tìm thấy đề thực hành" />
      </div>
    );
  }

  const { task, criteria } = detail;
  const accept = task.subject === 'Excel' ? '.xlsx' : '.docx';

  const handleDownloadStarter = async () => {
    try {
      const res = await api.get(`/practice/tasks/${taskId}/starter-file`, {
        responseType: 'blob',
      });
      const blobUrl = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = blobUrl;
      // Tên file dễ hiểu theo tiêu đề đề bài, thay vì tên hash dài của
      // Firebase Storage — proxy qua backend nên tải blob rồi tự đặt tên,
      // không dùng thẳng link Firebase (cross-origin nên thuộc tính
      // `download` của thẻ <a> sẽ bị trình duyệt bỏ qua).
      a.download = `${task.title}${accept}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      messageApi.error('Tải file đề gốc thất bại, vui lòng thử lại');
    }
  };

  const uploadProps: UploadProps = {
    accept,
    maxCount: 1,
    showUploadList: false,
    action: `${api.defaults.baseURL}/practice/tasks/${taskId}/submit`,
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
    beforeUpload: () => {
      setIsSubmitting(true);
      setLatestResult(null);
      return true;
    },
    onChange: info => {
      if (info.file.status === 'done') {
        setIsSubmitting(false);
        const result: PracticeSubmitResponse = info.file.response?.data;
        if (result) {
          setLatestResult(result);
          if (result.isPass) {
            messageApi.success(
              `Đã đạt ${result.totalScore}/${result.maxScore} điểm — bạn có thể qua nội dung tiếp theo.`,
            );
            onPassed?.();
          } else {
            messageApi.warning(
              `Được ${result.totalScore}/${result.maxScore} điểm — cần đạt tối thiểu 80% số điểm mới được qua nội dung tiếp theo, hãy làm lại.`,
            );
          }
          refetchSubmissions();
        }
      }
      if (info.file.status === 'error') {
        setIsSubmitting(false);
        const serverMessage = (info.file.response as any)?.message;
        messageApi.error(serverMessage || 'Nộp bài thất bại, vui lòng thử lại');
      }
    },
  };

  return (
    <div className="practice-content">
      <div className="practice-content-header">
        <h1>{task.title}</h1>
      </div>

      <div className="practice-content-requirements">
        <h3>Yêu cầu đề bài</h3>
        {task.description && (
          <p className="practice-content-desc">{task.description}</p>
        )}
        {instructions && instructions.length > 0 && (
          <ol className="practice-content-instruction-list">
            {instructions.map((it, idx) => (
              <li key={it.criteriaId}>
                <span className="practice-content-instruction-label">
                  Yêu cầu {idx + 1}
                </span>
                <div className="practice-content-instruction-text">
                  {it.instruction}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <p className="practice-content-meta">
        Đề bài có {criteria.length} yêu cầu chấm điểm — nộp bài đúng .
        {accept.replace('.', '')} để hệ thống tự động chấm.
      </p>

      <div className="practice-content-actions">
        <Button icon={<DownloadOutlined />} onClick={handleDownloadStarter}>
          Tải file đề gốc
        </Button>
        <Upload {...uploadProps}>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            loading={isSubmitting}>
            Nộp bài làm ({accept})
          </Button>
        </Upload>
      </div>

      {latestResult && (
        <div className="practice-result-panel">
          <h3>
            Kết quả: {latestResult.totalScore}/{latestResult.maxScore} điểm
            {latestResult.isPass ? (
              <span className="practice-result-status practice-result-status--pass">
                Đạt
              </span>
            ) : (
              <span className="practice-result-status practice-result-status--fail">
                Chưa đạt (cần ≥ 80%)
              </span>
            )}
          </h3>
          {latestResult.items.map((item, idx) => (
            <ResultItemRow key={item.criteriaId} item={item} index={idx} />
          ))}
        </div>
      )}

      {submissions && submissions.length > 0 && (
        <div className="practice-history">
          <h3>Lịch sử nộp bài ({submissions.length} lần)</h3>
          {submissions.map(s => (
            <div key={s._id} className="practice-history-row">
              <span>
                {s.totalScore}/{s.maxScore} điểm
              </span>
              <span className="practice-history-time">
                {dayjs(s.submittedAt).format('HH:mm DD/MM/YYYY')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ResultItemRow: React.FC<{
  item: PracticeSubmissionResultItem;
  index: number;
}> = ({ item, index }) => (
  <div className="practice-result-item">
    {item.passed ? (
      <CheckCircleFilled style={{ color: '#52c41a' }} />
    ) : (
      <CloseCircleFilled style={{ color: '#ff4d4f' }} />
    )}
    <div>
      <div>Yêu cầu {index + 1}</div>
      {!item.passed && item.instruction && (
        <div className="practice-result-instruction">{item.instruction}</div>
      )}
    </div>
  </div>
);

export default PracticeTaskContent;
