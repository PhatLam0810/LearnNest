'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { Pagination, Tag } from 'antd';
import dayjs from 'dayjs';
import UserAvatar from '@components/UserAvatar';
import { questionState } from '../qnaShared';
import { QuestionItem } from './type';
import styles from './styles';

interface QnaInboxListProps {
  listItem: QuestionItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  currentData?: { pageNum?: number; pageSize?: number; totalRecords?: number };
  onChangePage: (pageNum: number) => void;
}

const QnaInboxList: React.FC<QnaInboxListProps> = ({
  listItem,
  selectedId,
  onSelect,
  currentData,
  onChangePage,
}) => (
  <View style={styles.listPanel}>
    {!listItem.length && (
      <Text style={styles.emptyListText}>
        Không có câu hỏi nào trong bộ lọc này.
      </Text>
    )}
    {listItem.map((item, i) => {
      const st = questionState(item);
      const isSelected = item._id === selectedId;
      return (
        <div
          key={item._id}
          onClick={() => onSelect(item._id)}
          style={{
            ...(styles.listItem as React.CSSProperties),
            borderTop: i === 0 ? 'none' : (styles.listItem as any).borderTop,
            borderLeft: `3px solid ${isSelected ? 'var(--color-vhu-primary)' : 'transparent'}`,
            background: isSelected ? '#f1f5fb' : '#fff',
          }}>
          <View style={styles.listItemHead}>
            <UserAvatar
              size={30}
              avatar={item.user?.avatar}
              fullName={item.user?.fullName}
              seed={item.user?._id}
            />
            <Text style={styles.listItemName}>
              {item.user?.fullName || 'Học viên'}
            </Text>
            <Text style={{ ...styles.listItemTime, color: st.color }}>
              {dayjs(item.createdAt).fromNow()}
            </Text>
          </View>
          <Text style={styles.listItemText}>{item.commentText}</Text>
          <View style={styles.listItemFoot}>
            <Text style={styles.listItemLesson}>{item.contextTitle || ''}</Text>
            <Tag
              style={{
                color: st.color,
                background: st.bg,
                border: 'none',
                margin: 0,
              }}>
              {st.label}
            </Tag>
          </View>
        </div>
      );
    })}
    {!!currentData?.totalRecords &&
      currentData.totalRecords > (currentData.pageSize || 5) && (
        <View style={styles.paginationRow}>
          <Pagination
            size="small"
            current={currentData.pageNum}
            pageSize={currentData.pageSize}
            total={currentData.totalRecords}
            showSizeChanger={false}
            onChange={onChangePage}
          />
        </View>
      )}
  </View>
);

export default QnaInboxList;
