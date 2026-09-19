'use client';

import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native-web';
import { Skeleton } from 'antd';
import {
  CheckCircleFilled,
  FileTextOutlined,
  LockOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { convertDurationToTime } from '@utils/time';
import { useResponsive } from '@/styles/responsive';
import {
  isTaskAccessible,
  TaskAccessibilitySeqItem,
} from '~mdDashboard/utils/isTaskAccessible';
import {
  getLessonContentItems,
  getModuleContentItems,
} from '~mdDashboard/utils/getLessonContentItems';
import styles from './styles';
import { CurriculumRailProps } from './types';

// Khung skeleton của rail — dùng chung cho trạng thái loading 2 cột của
// các trang có rail.
export const CurriculumRailSkeleton = () => {
  const { isMobile } = useResponsive();
  return (
    <View style={[styles.rail, isMobile && styles.railMobile]}>
      <View style={styles.railHeader}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </View>
    </View>
  );
};

// Rail "Nội dung khóa học" — danh sách Phần > mục (video/trắc nghiệm/bài
// thực hành) kèm tiến độ. Tự tính khóa/đã xong/nhãn trạng thái từ dữ liệu
// tiến độ truyền vào; chọn mục nào thì báo lên qua onSelect.
const CurriculumRail = ({
  modules,
  tasks,
  videoCompletedBySubLesson,
  quizPassedByLibrary,
  isAdmin,
  currentUserId,
  selected,
  onSelect,
}: CurriculumRailProps) => {
  const { isMobile } = useResponsive();

  const hasAccess = (item: any) =>
    isAdmin || item?.usersCanPlay?.some(user => user._id === currentUserId);

  const isContentDone = (item: TaskAccessibilitySeqItem) => {
    if (item.kind === 'task') return !!item.data.hasPassed;
    if (item.data.type === 'Text') {
      return !!quizPassedByLibrary?.[item.data._id];
    }
    return !!videoCompletedBySubLesson?.[item.data._id];
  };

  // Danh sách phẳng theo từng phần: mỗi mục là 1 <button> thật (Tab/Enter
  // hoạt động), mục đang học tô nền vàng nhạt + nhãn "Đang học", mục đã xong
  // có dấu tích + nhãn — trạng thái không chỉ dựa vào màu.
  const renderCurriculum = () => {
    const lessonSeq = getLessonContentItems(modules, tasks);
    return modules.map(moduleItem => {
      const contentItems = getModuleContentItems(moduleItem, tasks);
      return (
        <View key={moduleItem._id}>
          <View style={styles.moduleHeader}>
            <Text style={styles.moduleTitle} numberOfLines={2}>
              {moduleItem.title}
            </Text>
            <Text style={styles.moduleCount}>{contentItems.length} bài</Text>
          </View>
          {contentItems.map(contentItem => {
            const isTask = contentItem.kind === 'task';
            const data = contentItem.data;
            const isSelected =
              selected.kind === contentItem.kind && selected.id === data._id;
            const isLocked = isTask
              ? !isTaskAccessible(
                  lessonSeq,
                  lessonSeq.findIndex(
                    it => it.kind === 'task' && it.data._id === data._id,
                  ),
                  { isAdmin, videoCompletedBySubLesson, quizPassedByLibrary },
                )
              : !hasAccess(data);
            const isDone = isContentDone(contentItem);
            const meta = isTask
              ? `Bài thực hành ${data.subject}`
              : data.type === 'Text'
                ? 'Trắc nghiệm'
                : convertDurationToTime(data.duration);
            const stateLabel = isSelected
              ? 'Đang học'
              : isDone
                ? isTask
                  ? 'Đạt'
                  : 'Đã xong'
                : isLocked
                  ? 'Chưa mở'
                  : '';
            const blocked = isLocked && !isSelected;
            return (
              <button
                key={`${contentItem.kind}-${data._id}`}
                type="button"
                disabled={blocked}
                aria-current={isSelected ? 'true' : undefined}
                onClick={() => onSelect(contentItem)}
                style={{
                  ...styles.lessonRow,
                  ...(isSelected ? styles.lessonRowActive : null),
                  ...(blocked ? styles.lessonRowLocked : null),
                }}>
                <span
                  aria-hidden="true"
                  style={{
                    ...styles.lessonIcon,
                    ...(isDone ? styles.lessonIconDone : null),
                  }}>
                  {isDone ? (
                    <CheckCircleFilled />
                  ) : blocked ? (
                    <LockOutlined />
                  ) : isTask || data.type === 'Text' ? (
                    <FileTextOutlined />
                  ) : (
                    <PlayCircleOutlined />
                  )}
                </span>
                <View style={styles.lessonText}>
                  <Text numberOfLines={2} style={styles.lessonTitle}>
                    {data.title}
                  </Text>
                  <Text style={styles.lessonMeta}>{meta}</Text>
                </View>
                {!!stateLabel && (
                  <Text
                    style={[
                      styles.lessonState,
                      isDone && styles.lessonStateDone,
                      isSelected && styles.lessonStateCurrent,
                    ]}>
                    {stateLabel}
                  </Text>
                )}
              </button>
            );
          })}
        </View>
      );
    });
  };

  // renderCurriculum() duyệt MỌI phần × MỌI mục để dựng lại danh sách — bọc
  // useMemo để không chạy lại ở mỗi lần render không liên quan tới nó (vd
  // trang cha mở modal kết quả trắc nghiệm...).
  const curriculum = useMemo(
    () => renderCurriculum(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      modules,
      tasks,
      onSelect,
      selected.kind,
      selected.id,
      videoCompletedBySubLesson,
      quizPassedByLibrary,
      isAdmin,
      currentUserId,
    ],
  );

  const contentSeq = getLessonContentItems(modules, tasks);
  const totalContentCount = contentSeq.length;
  const doneContentCount = contentSeq.filter(isContentDone).length;
  const progressPercent = totalContentCount
    ? Math.round((doneContentCount / totalContentCount) * 100)
    : 0;

  return (
    <View
      style={[
        styles.rail,
        isMobile && styles.railMobile,
        !isMobile && ({ maxHeight: '100%' } as any),
      ]}>
      <View style={styles.railHeader}>
        <Text style={styles.railTitle}>Nội dung khóa học</Text>
        <Text style={styles.railProgressLabel}>
          {doneContentCount}/{totalContentCount} bài đã hoàn thành ·{' '}
          {progressPercent}%
        </Text>
        <div
          role="progressbar"
          aria-label="Tiến độ khóa học"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progressPercent}%`,
            }}
          />
        </div>
      </View>
      {isMobile ? (
        // Plain View on mobile — react-native-web's ScrollView still
        // attaches its own JS touch handling even with overflow
        // disabled via style, which fights the page's native scroll
        // and makes scrolling feel like it randomly stops working.
        <View>{curriculum}</View>
      ) : (
        <ScrollView style={styles.railScroll}>{curriculum}</ScrollView>
      )}
    </View>
  );
};

export default CurriculumRail;
