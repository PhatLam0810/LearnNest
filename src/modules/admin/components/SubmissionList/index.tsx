'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Input, Skeleton } from 'antd';
import dayjs from 'dayjs';
import AppButton from '@components/AppButton';
import UserAvatar from '@components/UserAvatar';
import { SubmissionListItem } from '../../redux/RTKQuery/type';
import FilteredEmptyState from '../FilteredEmptyState';
import SubmissionScoreBadge from '../SubmissionScoreBadge';
import styles from './styles';

interface SubmissionListProps {
  items: SubmissionListItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  emptyAction: { label: string; onClick: () => void };
}

const matches = (item: SubmissionListItem, q: string) => {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const l = item.learner;
  return [l?.fullName, l?.studentId, l?.email, l?.class]
    .filter(Boolean)
    .some(v => String(v).toLowerCase().includes(needle));
};

const SubmissionList: React.FC<SubmissionListProps> = ({
  items,
  selectedId,
  onSelect,
  isLoading,
  isError,
  onRetry,
  emptyAction,
}) => {
  const [query, setQuery] = useState('');
  const visible = items.filter(i => matches(i, query));

  const renderBody = () => {
    if (isLoading) {
      return (
        <View style={styles.skeletonWrap}>
          {[0, 1, 2, 3].map(k => (
            <Skeleton.Input key={k} active block style={{ height: 40 }} />
          ))}
        </View>
      );
    }
    if (isError) {
      return (
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>
            Không tải được danh sách bài nộp.
          </Text>
          <AppButton style={{ width: 'auto', height: 40 }} onClick={onRetry}>
            Thử lại
          </AppButton>
        </View>
      );
    }
    if (!items.length) {
      return (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>
            Chưa có học viên nào nộp bài này.
          </Text>
          <AppButton
            type="primary"
            style={{ width: 'auto', height: 40 }}
            onClick={emptyAction.onClick}>
            {emptyAction.label}
          </AppButton>
        </View>
      );
    }
    if (!visible.length) {
      return <FilteredEmptyState query={query} onClear={() => setQuery('')} />;
    }
    return visible.map(item => {
      const selected = item.id === selectedId;
      return (
        <button
          key={item.id}
          type="button"
          aria-pressed={selected}
          onClick={() => onSelect(item.id)}
          style={{
            ...(styles.row as React.CSSProperties),
            ...((selected
              ? styles.rowSelected
              : styles.rowIdle) as React.CSSProperties),
          }}>
          <UserAvatar
            size={32}
            avatar={item.learner?.avatar}
            fullName={item.learner?.fullName}
            seed={item.learner?._id}
          />
          <View style={styles.rowMain}>
            <Text style={styles.name}>
              {item.learner?.fullName || 'Học viên'}
            </Text>
            <Text style={styles.meta}>
              {`${dayjs(item.submittedAt).format('HH:mm DD/MM/YYYY')}${
                item.learner?.studentId ? ` · ${item.learner.studentId}` : ''
              }`}
            </Text>
            {item.isOverridden && (
              <Text style={styles.overriddenTag}>Đã chấm tay</Text>
            )}
          </View>
          <SubmissionScoreBadge
            state={item.state}
            scoreLabel={item.scoreLabel}
          />
        </button>
      );
    });
  };

  return (
    <View style={styles.panel}>
      <View style={styles.searchRow}>
        <Input
          allowClear
          aria-label="Tìm học viên theo tên, mã số sinh viên hoặc lớp"
          placeholder="Tìm theo tên, MSSV, lớp"
          style={{ height: 44 }}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </View>
      <View style={styles.scroll}>{renderBody()}</View>
    </View>
  );
};

export default SubmissionList;
