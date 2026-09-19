'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native-web';
import { Modal, Segmented, Select, Tooltip } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { useResponsive } from '@/styles/responsive';
import { adminQuery } from '~mdAdmin/redux';
import { dashboardQuery } from '~mdDashboard/redux';
import { SubmissionKind } from '~mdAdmin/redux/RTKQuery/type';
import PracticeSubmissionDetail from '~mdAdmin/components/PracticeSubmissionDetail';
import QuizSubmissionDetail from '~mdAdmin/components/QuizSubmissionDetail';
import SubmissionList from '~mdAdmin/components/SubmissionList';
import {
  downloadBlob,
  fromPracticeSubmission,
  fromQuizResult,
} from '~mdAdmin/components/submissionShared';
import styles from './styles';

const KIND_OPTIONS = [
  { label: 'Trắc nghiệm', value: 'quiz' },
  { label: 'Thực hành', value: 'practice' },
];

const buttonStyle = { width: 'auto', height: 40 } as const;

const SubmissionsManage: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const { isMobile, isTablet } = useResponsive();

  const kind: SubmissionKind =
    params.get('kind') === 'practice' ? 'practice' : 'quiz';
  const itemId = params.get('id') || undefined;
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const report = dashboardQuery.useGetPassRateReportQuery();
  const quizList = dashboardQuery.useGetResultsForLibraryQuery(itemId ?? '', {
    skip: kind !== 'quiz' || !itemId,
  });
  const practiceList = adminQuery.useGetPracticeSubmissionsForTaskQuery(
    itemId ?? '',
    { skip: kind !== 'practice' || !itemId },
  );
  const [exportPractice, { isLoading: isExportingPractice }] =
    adminQuery.useExportPracticeSubmissionsMutation();
  const [exportQuiz, { isLoading: isExportingQuiz }] =
    adminQuery.useExportQuizResultsMutation();
  const [downloadAll, { isLoading: isZipping }] =
    adminQuery.useDownloadPracticeSubmissionsMutation();
  const [regradeAll, { isLoading: isRegradingAll }] =
    adminQuery.useRegradePracticeTaskMutation();

  const active = kind === 'quiz' ? quizList : practiceList;
  // currentData (không phải data) để không hiện nhầm danh sách của bài trước
  // trong lúc đang tải bài mới.
  const items = useMemo(
    () =>
      kind === 'quiz'
        ? (quizList.currentData ?? []).map(fromQuizResult)
        : (practiceList.currentData ?? []).map(fromPracticeSubmission),
    [kind, quizList.currentData, practiceList.currentData],
  );
  const isListLoading = active.isFetching && !active.currentData;

  // Đổi bài/loại -> bỏ chọn bài nộp cũ; desktop tự chọn bài nộp đầu tiên.
  useEffect(() => {
    setSelectedId(undefined);
  }, [kind, itemId]);
  useEffect(() => {
    if (!isMobile && !selectedId && items.length) setSelectedId(items[0].id);
  }, [isMobile, selectedId, items]);

  const goTo = (nextKind: SubmissionKind, nextId?: string) => {
    const q = new URLSearchParams({ tab: '13', kind: nextKind });
    if (nextId) q.set('id', nextId);
    router.replace(`/dashboard/admin?${q.toString()}`);
  };

  const options = (report.data?.rows ?? [])
    .filter(r => r.type === kind)
    .map(r => ({ value: r.id, label: `${r.name} (${r.attempts} lượt)` }));

  const errorMessage = (e: unknown, fallback: string) =>
    (e as { data?: { message?: string } })?.data?.message || fallback;

  const handleExport = async () => {
    if (!itemId) return;
    try {
      const blob = await (
        kind === 'quiz' ? exportQuiz(itemId) : exportPractice(itemId)
      ).unwrap();
      downloadBlob(
        blob,
        `diem-${kind === 'quiz' ? 'trac-nghiem' : 'thuc-hanh'}.xlsx`,
      );
    } catch (e: unknown) {
      messageApi.error(errorMessage(e, 'Xuất điểm thất bại'));
    }
  };

  const handleDownloadAll = async () => {
    if (!itemId) return;
    try {
      const blob = await downloadAll(itemId).unwrap();
      downloadBlob(blob, 'bai-nop-thuc-hanh.zip');
      if (items.length > 100) {
        messageApi.warning('Chỉ tải 100 bài nộp mới nhất trong mỗi lần.');
      }
    } catch (e: unknown) {
      messageApi.error(errorMessage(e, 'Tải bài nộp thất bại'));
    }
  };

  const handleRegradeAll = () => {
    if (!itemId) return;
    Modal.confirm({
      title: `Chấm lại ${items.length} bài nộp?`,
      content:
        'Tất cả bài nộp sẽ được chấm lại theo bộ tiêu chí hiện tại. Điểm chấm tay sẽ bị xóa. Không thể hoàn tác.',
      okText: 'Chấm lại tất cả',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const r = await regradeAll(itemId).unwrap();
          messageApi.success(
            `Đã chấm lại ${r.regraded} bài${r.failed ? `, ${r.failed} bài lỗi` : ''}`,
          );
        } catch (e: unknown) {
          messageApi.error(errorMessage(e, 'Chấm lại thất bại'));
        }
      },
    });
  };

  const isQuiz = kind === 'quiz';
  const noItems = !items.length;
  const gridColumns = isMobile
    ? '1fr'
    : `${isTablet ? 320 : 390}px minmax(0, 1fr)`;

  const emptyAction = isQuiz
    ? { label: 'Chọn bài khác', onClick: () => goTo(kind) }
    : {
        label: 'Giao bài cho lớp',
        onClick: () => router.push('/dashboard/admin?tab=11'),
      };

  return (
    <View style={styles.page}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>Bài nộp của học viên</Text>
        <Text style={styles.subtitle}>
          Xem chi tiết từng bài nộp, chấm lại và xuất điểm.
        </Text>
      </View>

      <View style={styles.controls}>
        <Segmented
          size="large"
          options={KIND_OPTIONS}
          value={kind}
          onChange={v => goTo(v as SubmissionKind)}
        />
        <View style={styles.pickerWrap}>
          <Select
            showSearch
            size="large"
            style={{ width: '100%' }}
            aria-label="Chọn bài để xem bài nộp"
            placeholder={isQuiz ? 'Chọn bài trắc nghiệm' : 'Chọn bài thực hành'}
            loading={report.isLoading}
            options={options}
            value={itemId}
            optionFilterProp="label"
            notFoundContent="Chưa có bài nào có học viên nộp."
            onChange={v => goTo(kind, v)}
          />
        </View>
      </View>

      {report.isError && (
        <View style={styles.errorPanel}>
          <Text style={styles.errorText}>Không tải được danh sách bài.</Text>
          <AppButton style={buttonStyle} onClick={() => report.refetch()}>
            Thử lại
          </AppButton>
        </View>
      )}

      {!itemId ? (
        <View style={styles.idleCard}>
          <Text style={styles.idleText}>
            Chọn một bài ở trên để xem bài nộp của học viên.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.bulkRow}>
            <Tooltip
              title={isQuiz ? 'Bài trắc nghiệm không có file nộp.' : undefined}>
              <span>
                <AppButton
                  style={buttonStyle}
                  disabled={isQuiz || noItems || isZipping}
                  loading={isZipping}
                  onClick={handleDownloadAll}>
                  Tải tất cả bài nộp
                </AppButton>
              </span>
            </Tooltip>
            <Tooltip
              title={
                isQuiz
                  ? 'Bài trắc nghiệm được chấm tự động ngay khi nộp.'
                  : undefined
              }>
              <span>
                <AppButton
                  style={buttonStyle}
                  disabled={isQuiz || noItems || isRegradingAll}
                  loading={isRegradingAll}
                  onClick={handleRegradeAll}>
                  Chấm lại
                </AppButton>
              </span>
            </Tooltip>
            <AppButton
              style={buttonStyle}
              disabled={noItems || isExportingQuiz || isExportingPractice}
              loading={isExportingQuiz || isExportingPractice}
              onClick={handleExport}>
              Xuất điểm ra Excel
            </AppButton>
          </View>

          <div
            style={{
              ...(styles.grid as React.CSSProperties),
              gridTemplateColumns: gridColumns,
            }}>
            <SubmissionList
              items={items}
              selectedId={selectedId}
              onSelect={setSelectedId}
              isLoading={isListLoading}
              isError={active.isError}
              onRetry={() => active.refetch()}
              emptyAction={emptyAction}
            />
            {selectedId ? (
              isQuiz ? (
                <QuizSubmissionDetail key={selectedId} resultId={selectedId} />
              ) : (
                <PracticeSubmissionDetail
                  key={selectedId}
                  submissionId={selectedId}
                />
              )
            ) : (
              !isMobile && (
                <View style={styles.idleCard}>
                  <Text style={styles.idleText}>
                    Chọn một bài nộp bên trái để xem chi tiết.
                  </Text>
                </View>
              )
            )}
          </div>
        </>
      )}
    </View>
  );
};

export default SubmissionsManage;
