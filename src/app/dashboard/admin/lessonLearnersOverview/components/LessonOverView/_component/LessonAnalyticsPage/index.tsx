'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Dropdown,
  Empty,
  Input,
  Pagination,
  Progress,
  Select,
  Space,
  Tag,
  message,
} from 'antd';
import { ArrowLeftOutlined, FilterOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { adminQuery } from '~mdAdmin/redux';
import { LessonLearner } from '~mdAdmin/redux/RTKQuery/type';
import { useAppPagination } from '@hooks';
import CreatePracticeClassModal from '../CreatePracticeClassModal';
import styles from './styles';

dayjs.extend(relativeTime);
dayjs.locale('vi');

// Phải khớp với REMINDER_ELIGIBLE_INACTIVE_DAYS / REMINDER_COOLDOWN_DAYS ở
// backend (src/admin/user/admin.service.ts) — chỉ dùng để hiển thị đúng
// trạng thái nút, điều kiện thật vẫn do backend quyết định.
const REMINDER_INACTIVE_DAYS = 3;
const REMINDER_COOLDOWN_DAYS = 3;

type Props = {
  lessonId: string;
};

const getReminderState = (
  learner: LessonLearner,
): { eligible: boolean; hint: string | null } => {
  if (!learner.lastStudiedAt) return { eligible: false, hint: null };

  const daysSinceStudied = dayjs().diff(dayjs(learner.lastStudiedAt), 'day');
  if (daysSinceStudied < REMINDER_INACTIVE_DAYS) {
    return { eligible: false, hint: null };
  }

  if (learner.lastRemindedAt) {
    const daysSinceReminded = dayjs().diff(
      dayjs(learner.lastRemindedAt),
      'day',
    );
    if (daysSinceReminded < REMINDER_COOLDOWN_DAYS) {
      return {
        eligible: false,
        hint: `Đã nhắc ${dayjs(learner.lastRemindedAt).fromNow()}`,
      };
    }
  }

  return { eligible: true, hint: null };
};

const LessonAnalyticsPage: React.FC<Props> = ({ lessonId }) => {
  const router = useRouter();
  const [tempFilters, setTempFilters] = useState<any>();
  const [openFilter, setOpenFilter] = useState(false);
  const [isCreatePracticeModalVisible, setIsCreatePracticeModalVisible] =
    useState(false);

  const { data: summaryData } = adminQuery.useGetLessonLearnersSummaryQuery();
  const lessonTitle = useMemo(
    () => summaryData?.items.find(item => item._id === lessonId)?.title,
    [summaryData, lessonId],
  );

  const { listItem: listTag } = useAppPagination<any>({
    apiUrl: 'tag/getAll',
    isLazy: false,
  });

  const { currentData, fetchData, search, filter } =
    useAppPagination<LessonLearner>({
      apiUrl: `admin/lessons/${lessonId}/learners`,
      isLazy: true,
    });

  const [exportLearners] = adminQuery.useExportLearnersMutation();
  const [remindLearner] = adminQuery.useRemindLearnerMutation();
  const [remindLearnersBulk, { isLoading: isBulkReminding }] =
    adminQuery.useRemindLearnersBulkMutation();
  const [remindingUserId, setRemindingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (lessonId) fetchData();
  }, [lessonId]);

  const learners: LessonLearner[] = (currentData as any)?.items || [];
  const totalRecords = (currentData as any)?.totalRecords || 0;
  const pageNum = (currentData as any)?.pageNum || 1;
  const pageSize = (currentData as any)?.pageSize || 20;
  const totalCompleted = (currentData as any)?.totalCompleted || 0;
  const completionRate = (currentData as any)?.completionRate || 0;

  const isCanCreatePracticeClass = totalCompleted > 30;

  const downloadFile = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExportExcel = async () => {
    if (!learners.length) {
      message.warning('Không có dữ liệu để xuất');
      return;
    }
    try {
      const blob = await exportLearners({ learners }).unwrap();
      const timestamp = new Date().toISOString().slice(0, 10);
      const fileName = `${lessonTitle || 'learners'}_${timestamp}.xlsx`;
      downloadFile(blob, fileName);
      message.success('Tải file thành công!');
    } catch (error) {
      console.error('Lỗi export:', error);
      message.error('Lỗi khi tải file. Vui lòng thử lại.');
    }
  };

  const handleRemindLearner = async (learner: LessonLearner) => {
    setRemindingUserId(learner._id);
    try {
      await remindLearner({ lessonId, userId: learner._id }).unwrap();
      message.success(`Đã gửi email nhắc nhở tới ${learner.fullName}`);
      fetchData();
    } catch (error: any) {
      message.error(
        error?.data?.message || 'Gửi email nhắc nhở thất bại, thử lại sau',
      );
    } finally {
      setRemindingUserId(null);
    }
  };

  const handleRemindBulk = async () => {
    try {
      const res = await remindLearnersBulk({ lessonId }).unwrap();
      if (res.totalEligible === 0) {
        message.info('Hiện không có học viên nào đủ điều kiện để nhắc nhở');
        return;
      }
      message.success(
        `Đã gửi nhắc nhở cho ${res.sent}/${res.totalEligible} học viên${
          res.failed ? ` (${res.failed} gửi thất bại)` : ''
        }`,
      );
      fetchData();
    } catch (error: any) {
      message.error(
        error?.data?.message || 'Gửi nhắc nhở hàng loạt thất bại, thử lại sau',
      );
    }
  };

  const filterContent = () => (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        padding: 16,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        width: 250,
      }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ fontWeight: 'bold' }}>Bộ lọc tìm kiếm</div>
        <Select
          style={{ width: '100%' }}
          placeholder="Chọn mã lớp học"
          allowClear
          value={tempFilters?.class}
          onChange={val => setTempFilters(prev => ({ ...prev, class: val }))}>
          {listTag?.map((item: any) => (
            <Select.Option key={item._id} value={item.name}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
        <Select
          allowClear
          placeholder="Trạng thái lớp thực hành"
          style={{ width: '100%' }}
          value={tempFilters?.isSelected}
          onChange={val =>
            setTempFilters(prev => ({ ...prev, isSelected: val }))
          }>
          <Select.Option value={true}>Đã tham gia</Select.Option>
          <Select.Option value={false}>Chưa tham gia</Select.Option>
        </Select>
        <Select
          allowClear
          placeholder="Trạng thái"
          style={{ width: '100%' }}
          value={tempFilters?.isCompleted}
          onChange={val =>
            setTempFilters(prev => ({ ...prev, isCompleted: val }))
          }>
          <Select.Option value={true}>Hoàn thành</Select.Option>
          <Select.Option value={false}>Chưa hoàn thành</Select.Option>
        </Select>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button
            onClick={() => {
              setTempFilters({});
              filter({});
              setOpenFilter(false);
            }}>
            Thiết lập lại
          </Button>
          <Button
            type="primary"
            onClick={() => {
              filter(tempFilters);
              setOpenFilter(false);
            }}>
            Áp dụng
          </Button>
        </Space>
      </Space>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/dashboard/admin')}
        />
        <h1 style={styles.title}>
          {lessonTitle ? `Phân tích: ${lessonTitle}` : 'Phân tích khóa học'}
        </h1>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <Progress
            type="circle"
            percent={completionRate}
            size={90}
            strokeColor="#1d418a"
          />
          <div style={styles.statLabel}>Tỉ Lệ Hoàn Thành</div>
        </div>
        <div style={styles.statCard}>
          <Progress
            type="circle"
            percent={100}
            size={90}
            format={() => totalRecords}
            strokeColor="#88c1e9"
          />
          <div style={styles.statLabel}>Tổng Người Học</div>
        </div>
        <div style={styles.statCard}>
          <Progress
            type="circle"
            percent={totalRecords ? (totalCompleted / totalRecords) * 100 : 0}
            size={90}
            format={() => totalCompleted}
            strokeColor="#16a34a"
          />
          <div style={styles.statLabel}>Đã Hoàn Thành</div>
        </div>
      </div>

      <div style={styles.toolbar}>
        <Space>
          <Input.Search
            placeholder="Tìm kiếm học viên"
            onSearch={search}
            style={styles.searchInput}
          />
          <Dropdown
            open={openFilter}
            trigger={['click']}
            onOpenChange={setOpenFilter}
            popupRender={filterContent}>
            <Button icon={<FilterOutlined />}>Lọc</Button>
          </Dropdown>
        </Space>
        <div style={styles.actionsRow}>
          <Button onClick={handleExportExcel}>Tải Excel</Button>
          <Button loading={isBulkReminding} onClick={handleRemindBulk}>
            Nhắc Hàng Loạt
          </Button>
          <Button
            type="primary"
            disabled={!isCanCreatePracticeClass}
            onClick={() => setIsCreatePracticeModalVisible(true)}>
            Tạo Lớp Thực Hành
          </Button>
        </div>
      </div>

      {learners.length === 0 ? (
        <div style={styles.emptyState}>
          <Empty description="Không có người học" />
        </div>
      ) : (
        <div style={styles.learnerList}>
          {learners.map(learner => {
            const reminderState = getReminderState(learner);
            return (
              <div key={learner._id} style={styles.learnerCard}>
                <div style={styles.learnerInfo}>
                  <div style={styles.learnerName}>{learner.fullName}</div>
                  <div style={styles.learnerMeta}>
                    {learner.email} · {learner.class || '—'}
                  </div>
                </div>
                <div style={styles.learnerProgressWrap}>
                  <Progress
                    percent={learner.progress}
                    size="small"
                    status="active"
                    strokeColor={{ '0%': '#1d418a', '100%': '#88c1e9' }}
                  />
                </div>
                <div style={styles.learnerLastStudied}>
                  {learner.lastStudiedAt
                    ? `Học gần nhất: ${dayjs(learner.lastStudiedAt).fromNow()}`
                    : 'Chưa xem video nào'}
                </div>
                <div style={styles.learnerStatus}>
                  <Tag color={learner.isCompleted ? 'success' : 'default'}>
                    {learner.isCompleted ? 'Hoàn thành' : 'Chưa hoàn thành'}
                  </Tag>
                </div>
                <div style={styles.learnerReminder}>
                  {reminderState.eligible && (
                    <Button
                      size="small"
                      loading={remindingUserId === learner._id}
                      onClick={() => handleRemindLearner(learner)}>
                      Nhắc nhở
                    </Button>
                  )}
                  {!reminderState.eligible && reminderState.hint && (
                    <span style={styles.reminderHint}>
                      {reminderState.hint}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalRecords > pageSize && (
        <div style={styles.paginationWrap}>
          <Pagination
            current={pageNum}
            total={totalRecords}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={page => fetchData({ pageNum: page })}
          />
        </div>
      )}

      <CreatePracticeClassModal
        open={isCreatePracticeModalVisible}
        onClose={() => setIsCreatePracticeModalVisible(false)}
        lessonId={lessonId}
        onCreated={() => setIsCreatePracticeModalVisible(false)}
      />
    </div>
  );
};

export default LessonAnalyticsPage;
