'use client';

import React, { useState } from 'react';
import { Empty, Modal, Progress, Spin, Tag } from 'antd';
import { FileTextOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { View, Text } from 'react-native-web';
import { adminQuery } from '~mdAdmin/redux';
import { useAppSelector } from '@redux';
import AppVideoWatchers from '~mdDashboard/components/VideoWatchersList/AppVideoWatchers';
import PracticeSubmissionsModal from '@/app/dashboard/admin/practiceManage/_components/PracticeSubmissionsModal';
import styles from './styles';

type Props = { lessonId: string };

// "Tổng quan nội dung khóa học" — theo từng Phần học, video lẫn bài thực
// hành trộn chung đúng thứ tự thật (giống hệt cách học viên nhìn thấy),
// mỗi mục cho biết bao nhiêu học viên (trên tổng số học viên khóa này) đã
// xem xong / đã đạt. Bấm vào 1 mục để xem CHI TIẾT từng người — tái dùng 2
// component đã có sẵn (AppVideoWatchers, PracticeSubmissionsModal) thay vì
// làm lại danh sách người dùng riêng ở đây.
const LessonContentOverview: React.FC<Props> = ({ lessonId }) => {
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const { data: modules, isFetching } =
    adminQuery.useGetLessonContentOverviewQuery(lessonId, { skip: !lessonId });

  const [watcherLibrary, setWatcherLibrary] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [submissionsTaskId, setSubmissionsTaskId] = useState<
    string | undefined
  >(undefined);

  if (isFetching) {
    return (
      <View style={{ padding: 48, alignItems: 'center' }}>
        <Spin />
      </View>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <View style={{ padding: 48 }}>
        <Empty description="Khóa học chưa có phần học nào" />
      </View>
    );
  }

  const countColor = (done: number, total: number) => {
    if (total === 0) return '#9ca3af';
    const ratio = done / total;
    if (ratio >= 0.8) return '#16a34a';
    if (ratio >= 0.4) return '#d97706';
    return '#dc2626';
  };

  return (
    <View>
      {modules.map(mod => {
        const isEmpty = mod.videos.length === 0 && mod.tasks.length === 0;
        return (
          <View key={mod.moduleId} style={styles.moduleCard}>
            <View style={styles.moduleHeader}>
              <Text style={styles.moduleTitle}>{mod.title}</Text>
            </View>
            {isEmpty ? (
              <Text style={styles.emptyModule}>Chưa có nội dung</Text>
            ) : (
              <View style={styles.itemList}>
                {mod.videos.map(v => (
                  <View
                    key={v.libraryId}
                    style={styles.itemRow}
                    onClick={() =>
                      setWatcherLibrary({ id: v.libraryId, title: v.title })
                    }>
                    <View style={styles.itemInfo}>
                      <PlayCircleOutlined
                        style={{ color: 'var(--color-vhu-primary)' }}
                      />
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {v.title}
                      </Text>
                    </View>
                    <View style={styles.itemCountWrap}>
                      <Progress
                        percent={
                          v.totalLearners
                            ? Math.round(
                                (v.completedCount / v.totalLearners) * 100,
                              )
                            : 0
                        }
                        size="small"
                        showInfo={false}
                        strokeColor={countColor(
                          v.completedCount,
                          v.totalLearners,
                        )}
                        style={{ flex: 1 }}
                      />
                      <Text style={styles.itemCountText}>
                        {v.completedCount}/{v.totalLearners} đã xem
                      </Text>
                    </View>
                  </View>
                ))}
                {mod.tasks.map(t => (
                  <View
                    key={t.taskId}
                    style={styles.itemRow}
                    onClick={() => setSubmissionsTaskId(t.taskId)}>
                    <View style={styles.itemInfo}>
                      <FileTextOutlined
                        style={{ color: 'var(--color-vhu-primary)' }}
                      />
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {t.title}
                      </Text>
                      <Tag color={t.subject === 'Excel' ? 'green' : 'blue'}>
                        {t.subject}
                      </Tag>
                    </View>
                    <View style={styles.itemCountWrap}>
                      <Progress
                        percent={
                          t.totalLearners
                            ? Math.round(
                                (t.passedCount / t.totalLearners) * 100,
                              )
                            : 0
                        }
                        size="small"
                        showInfo={false}
                        strokeColor={countColor(t.passedCount, t.totalLearners)}
                        style={{ flex: 1 }}
                      />
                      <Text style={styles.itemCountText}>
                        {t.passedCount}/{t.totalLearners} đã đạt
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}

      <Modal
        title={watcherLibrary?.title}
        open={!!watcherLibrary}
        onCancel={() => setWatcherLibrary(null)}
        footer={null}
        width={700}
        destroyOnClose>
        {watcherLibrary && (
          <AppVideoWatchers
            subLessonId={watcherLibrary.id}
            subLessonTitle={watcherLibrary.title}
            userId={userProfile?._id || ''}
          />
        )}
      </Modal>

      {submissionsTaskId && (
        <PracticeSubmissionsModal
          taskId={submissionsTaskId}
          onClose={() => setSubmissionsTaskId(undefined)}
        />
      )}
    </View>
  );
};

export default LessonContentOverview;
