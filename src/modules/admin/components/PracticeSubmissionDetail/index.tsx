'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Input, InputNumber, Modal, Skeleton, Table } from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { PracticeSubmissionDetailResult } from '../../redux/RTKQuery/type';
import SubmissionDetailHeader from '../SubmissionDetailHeader';
import { practiceState } from '../submissionShared';
import styles from './styles';

interface PracticeSubmissionDetailProps {
  submissionId: string;
}

const buttonStyle = { width: 'auto', height: 40 } as const;

const errorMessage = (e: unknown, fallback: string) =>
  (e as { data?: { message?: string } })?.data?.message || fallback;

const PracticeSubmissionDetail: React.FC<PracticeSubmissionDetailProps> = ({
  submissionId,
}) => {
  const { data, isFetching, isError, refetch } =
    adminQuery.useGetPracticeSubmissionDetailQuery(submissionId);
  const [override, { isLoading: isSaving }] =
    adminQuery.useOverridePracticeSubmissionMutation();
  const [regrade, { isLoading: isRegrading }] =
    adminQuery.useRegradePracticeSubmissionMutation();

  const [score, setScore] = useState<number | null | undefined>(undefined);
  const [comment, setComment] = useState<string | undefined>(undefined);
  const [scoreError, setScoreError] = useState('');

  if (isFetching && !data) {
    return (
      <View style={styles.card}>
        <Skeleton active avatar paragraph={{ rows: 6 }} />
      </View>
    );
  }
  if (isError || !data) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.errorText}>Không tải được chi tiết bài nộp.</Text>
        <AppButton style={buttonStyle} onClick={() => refetch()}>
          Thử lại
        </AppButton>
      </View>
    );
  }

  // undefined = học viên chưa sửa gì -> hiện điểm/nhận xét đang lưu.
  const scoreValue = score === undefined ? data.totalScore : score;
  const commentValue = comment ?? data.overrideComment ?? '';

  const validate = (v: number | null) => {
    const msg =
      v === null || Number.isNaN(v)
        ? 'Vui lòng nhập điểm.'
        : v < 0 || v > data.maxScore
          ? `Điểm phải nằm trong khoảng 0 - ${data.maxScore}.`
          : '';
    setScoreError(msg);
    return !msg;
  };

  const resetForm = () => {
    setScore(undefined);
    setComment(undefined);
    setScoreError('');
  };

  const handleSave = async () => {
    if (!validate(scoreValue) || scoreValue === null) return;
    try {
      await override({
        id: data._id,
        score: scoreValue,
        comment: commentValue,
      }).unwrap();
      resetForm();
      messageApi.success('Đã lưu điểm chấm tay');
    } catch (e: unknown) {
      messageApi.error(errorMessage(e, 'Lưu điểm thất bại'));
    }
  };

  const handleRegrade = () => {
    Modal.confirm({
      title: 'Chấm lại bằng máy?',
      content:
        'Bài sẽ được chấm lại theo bộ tiêu chí hiện tại. Điểm chấm tay và nhận xét (nếu có) sẽ bị xóa. Không thể hoàn tác.',
      okText: 'Chấm lại',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await regrade(data._id).unwrap();
          resetForm();
          messageApi.success('Đã chấm lại bài nộp');
        } catch (e: unknown) {
          messageApi.error(errorMessage(e, 'Chấm lại thất bại'));
        }
      },
    });
  };

  const columns: TableProps<PracticeSubmissionDetailResult>['columns'] = [
    {
      title: 'Yêu cầu',
      key: 'criterion',
      render: (_: unknown, r: PracticeSubmissionDetailResult) => (
        <View>
          <Text style={styles.criterionText}>
            {r.detail || r.type || 'Tiêu chí đã bị xóa'}
          </Text>
          {!r.passed && !!r.instruction && (
            <Text style={styles.criterionHint}>{r.instruction}</Text>
          )}
        </View>
      ),
    },
    {
      title: 'Kết quả',
      key: 'passed',
      width: 120,
      render: (_: unknown, r: PracticeSubmissionDetailResult) => (
        <Text style={r.passed ? styles.statusPass : styles.statusFail}>
          {r.passed ? 'Đạt' : 'Chưa đạt'}
        </Text>
      ),
    },
    {
      title: 'Điểm',
      key: 'points',
      width: 100,
      align: 'right',
      render: (_: unknown, r: PracticeSubmissionDetailResult) =>
        r.points === null ? '—' : `${r.passed ? r.points : 0}/${r.points}`,
    },
  ];

  return (
    <View style={styles.card}>
      <SubmissionDetailHeader
        learner={data.user}
        submittedAt={data.submittedAt}
        scoreLabel={`${data.totalScore}/${data.maxScore}`}
        state={practiceState(data.totalScore, data.maxScore)}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tệp bài nộp</Text>
        <View style={styles.fileRow}>
          <a
            href={data.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.fileLink as React.CSSProperties}>
            Tải file bài nộp
          </a>
          {!!data.task && (
            <Text
              style={
                styles.hint
              }>{`${data.task.subject} · ${data.task.title}`}</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chấm điểm theo yêu cầu</Text>
        <Table
          rowKey="criteriaId"
          size="middle"
          pagination={false}
          columns={columns}
          dataSource={data.results}
          scroll={{ x: 'max-content' }}
        />
      </View>

      {!!data.aiSummary && (
        <View style={styles.quoteBlock}>
          <Text style={styles.sectionTitle}>Nhận xét tự động</Text>
          <Text style={styles.quoteText}>{data.aiSummary}</Text>
        </View>
      )}

      <View style={styles.overrideCard}>
        <Text style={styles.sectionTitle}>Chấm điểm thủ công</Text>
        {!!data.overriddenAt && (
          <Text style={styles.overrideNote}>
            {`Đã chấm tay lúc ${dayjs(data.overriddenAt).format('HH:mm DD/MM/YYYY')}. Điểm máy chấm gốc: ${data.autoScore ?? '—'}/${data.maxScore}.`}
          </Text>
        )}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            {'Điểm '}
            <span style={{ color: 'var(--color-error)' }} aria-hidden>
              *
            </span>
          </Text>
          <InputNumber
            aria-label="Điểm chấm tay"
            min={0}
            max={data.maxScore}
            step={0.5}
            style={{ width: 160, height: 44 }}
            status={scoreError ? 'error' : undefined}
            value={scoreValue}
            onChange={v => {
              setScore(v);
              if (scoreError) validate(v);
            }}
            onBlur={() => validate(scoreValue ?? null)}
          />
          {scoreError ? (
            <Text style={styles.fieldError}>{scoreError}</Text>
          ) : (
            <Text style={styles.hint}>{`Tối đa ${data.maxScore} điểm.`}</Text>
          )}
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nhận xét</Text>
          <Input.TextArea
            aria-label="Nhận xét khi chấm tay"
            rows={3}
            maxLength={500}
            showCount
            placeholder="Lý do điều chỉnh điểm"
            value={commentValue}
            onChange={e => setComment(e.target.value)}
          />
        </View>
        <View style={styles.buttonRow}>
          <AppButton
            type="primary"
            style={buttonStyle}
            loading={isSaving}
            disabled={isSaving || isRegrading}
            onClick={handleSave}>
            Lưu điểm chấm tay
          </AppButton>
          <AppButton
            style={buttonStyle}
            loading={isRegrading}
            disabled={isSaving || isRegrading}
            onClick={handleRegrade}>
            Chấm lại bằng máy
          </AppButton>
        </View>
      </View>
    </View>
  );
};

export default PracticeSubmissionDetail;
