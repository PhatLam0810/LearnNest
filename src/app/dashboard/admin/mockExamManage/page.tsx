'use client';
import { asButton } from '@/utils/asButton';
import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native-web';
import { Button, Input, Modal, Segmented, Space, Tag } from 'antd';
import { PlusOutlined, SearchOutlined } from '@components/AppIcon';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { MockExam } from '~mdDashboard/types/practice';
import { FilteredEmptyState, ThemedTable } from '~mdAdmin/components';
import MockExamEditorModal from '../practiceManage/_components/MockExamEditorModal';
import styles from './styles';

const SUBJECT_OPTIONS = [
  { label: 'Tất cả môn', value: 'all' },
  { label: 'Word', value: 'Word' },
  { label: 'Excel', value: 'Excel' },
  { label: 'Word + Excel', value: 'Mixed' },
];

const STATUS_OPTIONS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đã xuất bản', value: 'published' },
  { label: 'Bản nháp', value: 'draft' },
];

const MockExamManage = () => {
  const [editingExam, setEditingExam] = useState<MockExam | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingExam, setDeletingExam] = useState<MockExam | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isFetching } = adminQuery.useGetMockExamsAdminQuery();
  const [deleteExam, { isLoading: isDeleting }] =
    adminQuery.useDeleteMockExamMutation();

  const exams = data ?? [];

  // Tính toán số liệu KPI
  const stats = useMemo(() => {
    const total = exams.length;
    const excelCount = exams.filter(e => e.subject === 'Excel').length;
    const wordCount = exams.filter(e => e.subject === 'Word').length;
    const publishedCount = exams.filter(e => e.isPublished).length;
    return { total, excelCount, wordCount, publishedCount };
  }, [exams]);

  // Bộ lọc dữ liệu
  const filteredData = useMemo(() => {
    return exams.filter(item => {
      const matchSearch = searchQuery
        ? item.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
        : true;
      const matchSubject =
        subjectFilter === 'all' ? true : item.subject === subjectFilter;
      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'published'
            ? item.isPublished
            : !item.isPublished;
      return matchSearch && matchSubject && matchStatus;
    });
  }, [exams, searchQuery, subjectFilter, statusFilter]);

  const openCreate = () => {
    setEditingExam(undefined);
    setIsModalOpen(true);
  };
  const openEdit = (exam: MockExam) => {
    setEditingExam(exam);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingExam) return;
    try {
      await deleteExam(deletingExam._id).unwrap();
      messageApi.success('Đã xoá đề thi thử');
      setDeletingExam(null);
    } catch {
      messageApi.error('Xoá đề thi thử thất bại');
    }
  };

  const columns = [
    {
      title: 'Tên đề thi thử',
      dataIndex: 'title',
      key: 'title',
      render: (v: string) => <Text style={styles.examTitle}>{v}</Text>,
    },
    {
      title: 'Môn thi',
      dataIndex: 'subject',
      key: 'subject',
      width: 140,
      render: (v: string) => (
        <Tag color={v === 'Excel' ? 'green' : v === 'Word' ? 'blue' : 'purple'}>
          {v === 'Mixed' ? 'Word + Excel' : v}
        </Tag>
      ),
    },
    {
      title: 'Thời lượng',
      dataIndex: 'durationMinutes',
      key: 'durationMinutes',
      width: 120,
      render: (v: number) => <Text style={styles.cellText}>{v} phút</Text>,
    },
    {
      title: 'Số bài tập',
      key: 'taskCount',
      width: 100,
      render: (_: any, r: MockExam) => (
        <Text style={styles.cellText}>{r.taskIds.length} bài</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isPublished',
      key: 'isPublished',
      width: 140,
      render: (v: boolean) => (
        <Tag color={v ? 'success' : 'default'}>
          {v ? 'Đã xuất bản' : 'Bản nháp'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 140,
      render: (_: any, record: MockExam) => (
        <Space size={8}>
          <a
            {...asButton(() => openEdit(record), 'Chỉnh sửa đề thi')}
            onClick={() => openEdit(record)}
            style={styles.actionLinkEdit as React.CSSProperties}>
            Sửa
          </a>
          <a
            {...asButton(() => setDeletingExam(record), 'Xóa đề thi')}
            onClick={() => setDeletingExam(record)}
            style={styles.actionLinkDelete as React.CSSProperties}>
            Xoá
          </a>
        </Space>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Tiêu đề & Giới thiệu */}
      <View style={styles.headerBlock}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.pageTitle}>Quản Lý Đề Thi Thử MOS</Text>
          <Text style={styles.subtitle}>
            Tạo và cấu hình các bộ đề thi thử tổng hợp tính giờ, mô phỏng đúng
            áp lực và quy chuẩn kỳ thi MOS chính thức.
          </Text>
        </View>
      </View>

      {/* KPI Bento Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Tổng số bộ đề</Text>
          <Text style={styles.statValue}>{stats.total}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Đề Excel MOS</Text>
          <Text style={styles.statValue}>{stats.excelCount}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Đề Word MOS</Text>
          <Text style={styles.statValue}>{stats.wordCount}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Đã xuất bản</Text>
          <Text style={styles.statValue}>{stats.publishedCount}</Text>
        </View>
      </View>

      {/* Control & Filter Bar */}
      <View style={styles.controlCard}>
        <View style={styles.controlLeft}>
          <Input
            placeholder="Tìm theo tên đề thi..."
            prefix={
              <SearchOutlined style={{ color: 'var(--color-text-muted)' }} />
            }
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={styles.searchInput}
            allowClear
          />
          <Segmented
            options={SUBJECT_OPTIONS}
            value={subjectFilter}
            onChange={v => setSubjectFilter(v as string)}
          />
          <Segmented
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={v => setStatusFilter(v as string)}
          />
        </View>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreate}
          style={styles.createButton}>
          <Text style={styles.createButtonText}>Tạo đề thi thử</Text>
        </Button>
      </View>

      {/* Table Card */}
      <View style={styles.tableCard}>
        <ThemedTable
          rowKey="_id"
          loading={isFetching}
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{
            emptyText: searchQuery ? (
              <FilteredEmptyState
                query={searchQuery}
                onClear={() => setSearchQuery('')}
              />
            ) : undefined,
          }}
        />
      </View>

      <MockExamEditorModal
        open={isModalOpen}
        exam={editingExam}
        onClose={() => setIsModalOpen(false)}
      />

      <Modal
        title="Xoá đề thi thử"
        open={!!deletingExam}
        onCancel={() => setDeletingExam(null)}
        onOk={handleDelete}
        confirmLoading={isDeleting}>
        <Text
          style={
            styles.cellText
          }>{`Xoá đề: "${deletingExam?.title}"? Các phiên thi đã làm trước đó vẫn giữ nguyên kết quả, chỉ không tạo phiên mới được nữa.`}</Text>
      </Modal>
    </View>
  );
};

export default MockExamManage;
