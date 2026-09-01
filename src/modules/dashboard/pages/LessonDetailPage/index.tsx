'use client';
import React, { CSSProperties, useEffect, useState } from 'react';
import {
  CheckOutlined,
  PlayCircleOutlined,
  CaretRightOutlined,
  DollarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import './styles.scss';

import { useRouter } from 'next/navigation';
import Icon from '@components/icons';
import { useAppDispatch, useAppSelector } from '@redux';
import { LessonItem, LessonThumbnail } from '~mdDashboard/components';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-web';
import styles from './styles';
import { convertDurationToTime } from '@utils';
import { Collapse, CollapseProps, message, Modal, Tag } from 'antd';
import { authAction } from '~mdAuth/redux';
import AppModalSuccess from '@components/AppModalSuccess';
import AppVideoWatchersButton from '~mdDashboard/components/VideoWatchersList/AppVideoWatchersButton';
import AppVideoWatchers from '~mdDashboard/components/VideoWatchersList/AppVideoWatchers';
import { isTaskAccessible as checkTaskAccessible } from '~mdDashboard/utils/isTaskAccessible';
import { useResponsive } from '@/styles/responsive';

interface LessonDetailPageProps {
  id: string;
}

const LessonDetailPage = ({ id }: LessonDetailPageProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const { lessonPurchaseData } = useAppSelector(state => state.authReducer);
  const [messageApi, contextHolder] = message.useMessage();
  const { data: lessonDetail, isLoading } = dashboardQuery.useGetLessonIdQuery({
    id: id,
  });
  const [isVisibleModalSuccess, setIsVisibleModalSuccess] = useState(false);
  const [setLibraryCanPlay] = dashboardQuery.useSetLibraryCanPlayMutation();
  const [triggerAccessLesson] = dashboardQuery.useAccessLessonMutation();
  const [checkRegistrationLesson] =
    dashboardQuery.useCheckRegistrationLessonMutation();
  const lessonLibraries =
    lessonDetail?.modules?.flatMap(module => module.libraries ?? []) ?? [];
  const hasContent = lessonLibraries.length > 0;

  // "Khóa thực hành" (MOS practice) dùng lại đúng Lesson/Module này — nếu
  // KHÔNG có video nào thì tự chuyển sang đúng trang làm bài thực hành
  // thay vì hiện giao diện "Sẽ có trong tương lai" gây hiểu nhầm; nếu khóa
  // có CẢ video lẫn bài thực hành (nội dung trộn) thì fetch để trộn vào
  // đúng chỗ trong "Nội dung khóa học" bên dưới.
  const { data: practiceTasksOfLesson } =
    dashboardQuery.useGetPracticeTasksStudentQuery(
      { lessonId: id },
      { skip: !id },
    );
  // Bài thực hành đứng ngay sau 1 video chỉ mở khóa được nếu video đó đã
  // XEM XONG (VideoTracking.completed) — không dùng usersCanPlay (chỉ báo
  // "đã tới lượt"). Xem giải thích đầy đủ ở isTaskAccessible bên dưới.
  const { data: videoCompletedBySubLesson } =
    dashboardQuery.useGetMyLessonVideoProgressQuery(
      { userId: userProfile?._id || '', lessonId: id },
      { skip: !userProfile?._id || !id },
    );
  // Tương tự nhưng cho quiz (ResultTest.isPass) — xem isTaskAccessible bên
  // dưới. Trang này không sở hữu luồng "vừa làm xong quiz/xem xong video rồi
  // tự chuyển tiếp" (đó là ModuleDetailPage), nên chỉ đọc tĩnh, không cần
  // refetch chủ động ở đây.
  const { data: quizPassedByLibrary } =
    dashboardQuery.useGetMyLessonQuizProgressQuery(
      { userId: userProfile?._id || '', lessonId: id },
      { skip: !userProfile?._id || !id },
    );
  useEffect(() => {
    // Đợi lessonDetail tải xong hẳn mới xét — nếu không, hasContent tạm
    // thời là false trong lúc lessonDetail còn undefined (chưa load), gây
    // redirect nhầm sang trang thực hành dù khóa thật sự có video (lỗi
    // thật đã gặp: 1 khóa có nhiều module video + 1 module trộn bài thực
    // hành vẫn bị đẩy nhầm sang PracticeCourseDetailPage).
    if (isLoading) return;
    if (
      !hasContent &&
      practiceTasksOfLesson &&
      practiceTasksOfLesson.length > 0
    ) {
      router.replace(`/dashboard/practice/course/${id}`);
    }
  }, [isLoading, hasContent, practiceTasksOfLesson, id, router]);

  const { isMobile, isTablet } = useResponsive();
  const numColumns = isMobile ? 1 : 2;

  const [accessLesson, setAccessLesson] = useState(true);
  const [activePanelKeys, setActivePanelKeys] = useState<string[]>([
    '0',
    '1',
    '2',
  ]);
  const [watcherModalVisible, setWatcherModalVisible] = useState(false);
  const [selectedSubLessonId, setSelectedSubLessonId] = useState<string | null>(
    null,
  );
  const [selectedSubLessonTitle, setSelectedSubLessonTitle] =
    useState<string>('');

  useEffect(() => {
    if (!lessonDetail || lessonDetail.modules.length === 0) return;

    const firstLibrary = lessonDetail.modules[0].libraries?.[0];
    if (firstLibrary) {
      setLibraryCanPlay({
        libraryId: firstLibrary._id,
        userId: userProfile?._id,
      });
    }
  }, [lessonDetail, setLibraryCanPlay, userProfile?._id]);

  useEffect(() => {
    if (lessonPurchaseData) {
      setIsVisibleModalSuccess(true);
    }
  }, [lessonPurchaseData]);

  const hasAccessToLibrary = (library: any) => {
    if (!library) return false;
    return (
      userProfile?.role?.level <= 2 ||
      library?.usersCanPlay?.some(user => user._id === userProfile?._id)
    );
  };

  const handleLibraryClick = async (subItem: any, item: any) => {
    if (!accessLesson) return;

    if (userProfile?.role?.level <= 2 && subItem.type === 'Text') {
      router.push(
        `/dashboard/home/lesson/resultHistory?libraryId=${subItem?._id}`,
      );
      return;
    }

    if (hasAccessToLibrary(subItem)) {
      dispatch(dashboardAction.setSelectedModule(item));
      dispatch(dashboardAction.setSelectedLibrary(subItem));
      router.push(
        `/dashboard/home/lesson/moduleDetail?lessonId=${lessonDetail?._id}`,
      );
    }
  };

  const handleStartLesson = async () => {
    if (!userProfile?._id || !lessonDetail?._id) {
      messageApi.open({
        type: 'error',
        content:
          'Không xác định được người dùng hoặc bài học, vui lòng tải lại trang.',
        duration: 5,
      });
      return;
    }

    dispatch(authAction.setIsShowLoading(true));
    try {
      const result = await checkRegistrationLesson({
        userId: userProfile._id,
        lessonId: lessonDetail._id,
      }).unwrap();

      if (!result.isRegisterLesson) {
        await triggerAccessLesson({
          userId: userProfile._id,
          lessonId: lessonDetail._id,
        });
      }

      const modules = lessonDetail.modules || [];
      // Tìm nội dung ĐẦU TIÊN theo đúng thứ tự đã sắp xếp — có thể là video
      // hoặc bài thực hành. Trước đây chỉ nhìn `firstModule.libraries[0]`
      // nên hễ phần học đầu tiên không có video nào (toàn bài thực hành) là
      // báo nhầm "chưa có nội dung", dù chính module đó (hoặc module sau)
      // thật ra có bài tập để làm ngay.
      let firstModuleWithContent: any = null;
      let firstContentItem: { kind: 'library' | 'task'; data: any } | null =
        null;
      for (const m of modules) {
        const items = getModuleContentItems(m);
        if (items.length > 0) {
          firstModuleWithContent = m;
          firstContentItem = items[0];
          break;
        }
      }

      if (!firstModuleWithContent || !firstContentItem) {
        messageApi.open({
          type: 'error',
          content: 'Khóa học này hiện chưa có nội dung.',
          duration: 5,
        });
        return;
      }

      if (firstContentItem.kind === 'task') {
        router.push(
          `/dashboard/home/lesson/moduleDetail?lessonId=${lessonDetail._id}&taskId=${firstContentItem.data._id}`,
        );
      } else {
        dispatch(dashboardAction.setSelectedModule(firstModuleWithContent));
        dispatch(dashboardAction.setSelectedLibrary(firstContentItem.data));
        router.push(
          `/dashboard/home/lesson/moduleDetail?lessonId=${lessonDetail._id}`,
        );
      }
    } catch (error) {
      console.error('handleStartLesson error:', error);
      messageApi.open({
        type: 'error',
        content: 'Vui lòng thử lại.',
        duration: 5,
      });
    } finally {
      dispatch(authAction.setIsShowLoading(false));
    }
  };
  // Trộn bài học video (order = vị trí trong module.libraries[]) với bài
  // thực hành thuộc module này (order = field riêng) — 1 khóa học có thể
  // chứa cả 2 loại nội dung xen kẽ theo đúng thứ tự admin đã sắp xếp.
  const getModuleContentItems = (moduleItem: any) => {
    const libraryItems = (moduleItem.libraries || []).map(
      (l: any, i: number) => ({ kind: 'library' as const, data: l, order: i }),
    );
    const taskItems = (practiceTasksOfLesson || [])
      .filter(t => t.moduleId === moduleItem._id)
      .map(t => ({ kind: 'task' as const, data: t, order: t.order ?? 0 }));
    return [...libraryItems, ...taskItems].sort((a, b) => a.order - b.order);
  };

  // Toàn bộ nội dung khóa học theo 1 thứ tự duy nhất (nối các module theo
  // đúng thứ tự) — dùng để khoá bài thực hành chưa tới lượt, y hệt
  // ModuleDetailPage.
  const getLessonContentItems = () =>
    (lessonDetail?.modules || []).flatMap(m => getModuleContentItems(m));

  // Logic thật nằm ở utils/isTaskAccessible.ts (dùng chung với
  // ModuleDetailPage, có test riêng) — wrapper này chỉ khép kín state của
  // trang lại thành đúng chữ ký (seq, idx) mà các chỗ gọi bên dưới đang dùng.
  const isTaskAccessible = (
    seq: { kind: 'library' | 'task'; data: any }[],
    idx: number,
  ) =>
    checkTaskAccessible(seq, idx, {
      isAdmin: userProfile?.role?.level <= 2,
      videoCompletedBySubLesson,
      quizPassedByLibrary,
    });

  const getItems = (panelStyle: CSSProperties): CollapseProps['items'] => {
    const lessonSeq = getLessonContentItems();
    return (
      lessonDetail?.modules?.map((item, index) => {
        const contentItems = getModuleContentItems(item);
        return {
          key: index.toString(),
          label: (
            <div style={styles.moduleContentHeader}>
              <p style={styles.moduleTitleText} title={item.title}>
                {item.title}
              </p>
              <p style={styles.moduleCountText}>
                Tổng số bài học: {contentItems.length}
              </p>
            </div>
          ),
          children: (
            <View style={styles.contentGap8Margin8}>
              {contentItems.map((contentItem, subIndex) => {
                if (contentItem.kind === 'task') {
                  const task = contentItem.data;
                  const globalIdx = lessonSeq.findIndex(
                    it => it.kind === 'task' && it.data._id === task._id,
                  );
                  const isTaskDisabled = !isTaskAccessible(
                    lessonSeq,
                    globalIdx,
                  );
                  const isExcel = task.subject === 'Excel';
                  return (
                    <TouchableOpacity
                      key={task._id}
                      style={isTaskDisabled && styles.disabledButton}>
                      {/* View không expose prop className trong type của
                          react-native-web -> bọc 1 div trần chỉ để gắn class
                          hover, không đổi style/layout gì khác. */}
                      <div className="lesson-task-card">
                        <View
                          style={styles.buttonModule}
                          onClick={() => {
                            if (isTaskDisabled) return;
                            router.push(
                              `/dashboard/home/lesson/moduleDetail?lessonId=${lessonDetail?._id}&taskId=${task._id}`,
                            );
                          }}>
                          <View style={styles.rowGap10}>
                            <View
                              style={
                                isExcel
                                  ? styles.taskIconBadgeExcel
                                  : styles.taskIconBadgeWord
                              }>
                              <FileTextOutlined
                                style={{
                                  fontSize: 18,
                                  color: isExcel ? '#16a34a' : '#1d418a',
                                }}
                              />
                            </View>
                            <View style={styles.moduleItemContainer}>
                              <Text
                                numberOfLines={2}
                                style={styles.moduleItemTitle}>
                                {task.title}
                              </Text>
                              <View style={styles.taskTagRow}>
                                <Tag color={isExcel ? 'green' : 'blue'}>
                                  Bài thực hành {task.subject}
                                </Tag>
                                {task.hasPassed && (
                                  <Tag color="success" icon={<CheckOutlined />}>
                                    Đạt
                                  </Tag>
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                      </div>
                    </TouchableOpacity>
                  );
                }

                const subItem = contentItem.data;
                const isDisabled = !hasAccessToLibrary(subItem);
                return (
                  <TouchableOpacity
                    key={subIndex}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={[
                        isDisabled && styles.disabledButton,
                        { flex: 1 },
                      ]}>
                      <View
                        style={styles.buttonModule}
                        onClick={() => handleLibraryClick(subItem, item)}>
                        <View style={styles.rowGap10}>
                          <PlayCircleOutlined />
                          <View style={styles.moduleItemContainer}>
                            <Text
                              numberOfLines={2}
                              style={styles.moduleItemTitle}>
                              {subItem.title}
                            </Text>
                            <Text style={styles.moduleItemTime}>
                              {subItem.type !== 'Text'
                                ? convertDurationToTime(subItem.duration)
                                : 'Trắc nghiệm'}
                            </Text>
                          </View>
                        </View>
                        {userProfile?.role?.level <= 2 &&
                          subItem.type !== 'Text' && (
                            <AppVideoWatchersButton
                              subLessonId={subItem._id}
                              subLessonTitle={subItem.title}
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedSubLessonId(subItem._id);
                                setSelectedSubLessonTitle(subItem.title);
                                setWatcherModalVisible(true);
                              }}
                            />
                          )}
                      </View>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          ),
          style: panelStyle,
        };
      }) || []
    );
  };

  const panelStyle: React.CSSProperties = {
    background: '#f5f5f5',
    borderRadius: '#f5f5f5',
    border: 'none',
  };
  const containerStyle = {
    ...styles.container,
    paddingLeft: isMobile ? 12 : isTablet ? 16 : 20,
    paddingRight: isMobile ? 12 : isTablet ? 16 : 20,
  };

  const contentRowStyle = {
    ...styles.contentRow,
    flexDirection: (isMobile ? 'column' : 'row') as 'row' | 'column',
    gap: isMobile ? 16 : isTablet ? 20 : 24,
  };

  const mainColumnStyle = {
    ...styles.mainColumn,
    maxWidth: isMobile ? '100%' : '90%',
  };

  const sideColumnStyle = {
    ...styles.sideColumn,
    minWidth: isMobile ? '100%' : isTablet ? 220 : 240,
    position: (isMobile ? 'relative' : 'sticky') as 'relative' | 'sticky',
    // Must clear the sticky dashboard topbar (~80px) above this page,
    // otherwise the button sticks partway under it and visually "jumps"
    // into view at an inconsistent point while scrolling.
    top: isMobile ? 0 : 88,
  };
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          height: '80vh',
        }}>
        <ActivityIndicator size="large" color="var(--color-vhu-primary)" />
        <Text style={{ color: '#8c8c8c' }}>Đang tải nội dung khóa học...</Text>
      </View>
    );
  }
  return (
    <View style={containerStyle}>
      {contextHolder}
      <View style={styles.pageWrapper}>
        <View style={styles.marginTop12}>
          {isMobile && (
            <>
              <View style={{ ...sideColumnStyle, ...styles.sideColumnGap }}>
                <View
                  style={{
                    ...styles.thumbnailCard,
                    minHeight: isMobile ? 200 : 260,
                  }}>
                  {!accessLesson && (
                    <View style={styles.premium}>
                      <DollarOutlined
                        style={{
                          ...styles.premiumIcon,
                          fontSize: isMobile ? 20 : 24,
                        }}
                      />
                    </View>
                  )}
                  <LessonThumbnail thumbnail={lessonDetail.thumbnail} />
                </View>
                {!accessLesson ? (
                  <View>
                    <button
                      className="button lesson-pill-button"
                      onClick={() => {
                        dispatch(authAction.setVerifyInfo(false));
                      }}>
                      <Icon name="liveTV" className="button-icon" />
                      <span className="label">Buy Now</span>
                    </button>
                    <Text style={styles.totalLibrary}>
                      Tổng thời lượng:
                      {convertDurationToTime(lessonDetail.totalDuration)}
                    </Text>
                    <Text style={styles.totalLibrary}>
                      Tổng bài học: {lessonDetail.totalLibraries}
                    </Text>
                  </View>
                ) : (
                  <View>
                    <button
                      className="button lesson-pill-button"
                      disabled={!hasContent}
                      style={
                        !hasContent
                          ? { opacity: 0.6, cursor: 'not-allowed' }
                          : undefined
                      }
                      onClick={hasContent ? handleStartLesson : undefined}>
                      <Icon name="liveTV" className="button-icon" />
                      <span className="label">
                        {hasContent
                          ? 'Bắt đầu khóa học'
                          : 'Sẽ có trong tương lai'}
                      </span>
                    </button>
                    <Text style={styles.totalLibrary}>
                      Tổng thời lượng:{' '}
                      {convertDurationToTime(lessonDetail.totalDuration)}
                    </Text>
                    <Text style={styles.totalLibrary}>
                      Tổng số bài học: {lessonDetail.totalLibraries}
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  ...styles.lessonContent,
                  maxWidth: isMobile ? '100%' : '90%',
                }}>
                <Text
                  style={{
                    ...styles.lessonContentTitle,
                    fontSize: isMobile ? 16 : 18,
                  }}>
                  Nội dung khóa học
                </Text>
                <View style={styles.lessonContent}>
                  <Collapse
                    bordered={false}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    accordion={true}
                    activeKey={activePanelKeys}
                    onChange={keys =>
                      setActivePanelKeys(Array.isArray(keys) ? keys : [keys])
                    }
                    items={getItems(panelStyle)}
                  />
                </View>
              </View>
            </>
          )}
          <Text
            style={{
              ...styles.title,
              fontSize: isMobile ? 18 : isTablet ? 24 : 32,
            }}>
            {lessonDetail?.title.trim()}
          </Text>
          <View style={contentRowStyle}>
            <View style={mainColumnStyle}>
              <Text
                style={{
                  ...styles.description,
                  maxWidth: isMobile ? '100%' : '90%',
                  marginTop: 12,
                  fontSize: isMobile ? 16 : 18,
                }}>
                {lessonDetail?.description}
              </Text>
              <View style={styles.paddingBottom10}>
                <Text
                  style={{
                    ...styles.whatLearnTitle,
                    fontSize: isMobile ? 18 : 24,
                  }}>
                  Kỹ năng đạt được:
                </Text>
                <FlatList
                  data={lessonDetail?.learnedSkills}
                  numColumns={numColumns}
                  key={numColumns}
                  keyExtractor={(item, index) => index.toString()}
                  style={{
                    maxWidth: isMobile ? '100%' : '90%',
                    marginTop: 12,
                  }}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        margin: 5,
                        flex: 1,
                      }}>
                      <CheckOutlined
                        style={{
                          marginRight: 8,
                          color: '#f05123',
                          fontWeight: '500',
                        }}
                      />
                      <Text style={styles.learnedSkillText}>
                        {item.replace(/\n+/g, '\n')}
                      </Text>
                    </View>
                  )}
                />
              </View>
              {!isMobile && (
                <>
                  <View style={styles.lessonContent}>
                    <Text
                      style={{
                        ...styles.lessonContentTitle,
                        fontSize: isMobile ? 16 : 24,
                      }}>
                      Nội dung khóa học
                    </Text>
                    <View style={styles.lessonContent}>
                      <Collapse
                        bordered={false}
                        expandIcon={({ isActive }) => (
                          <CaretRightOutlined rotate={isActive ? 90 : 0} />
                        )}
                        activeKey={activePanelKeys}
                        onChange={keys =>
                          setActivePanelKeys(
                            Array.isArray(keys) ? keys : [keys],
                          )
                        }
                        items={getItems(panelStyle)}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
            {!isMobile && (
              <View style={{ ...sideColumnStyle, ...styles.sideColumnGap }}>
                <View
                  style={{
                    ...styles.thumbnailCard,
                    minHeight: isMobile ? 200 : 260,
                  }}>
                  {!accessLesson && (
                    <View style={styles.premium}>
                      <DollarOutlined
                        style={{
                          ...styles.premiumIcon,
                          fontSize: isMobile ? 20 : 24,
                        }}
                      />
                    </View>
                  )}
                  <LessonThumbnail thumbnail={lessonDetail.thumbnail} />
                </View>
                {!accessLesson ? (
                  <View>
                    <button
                      className="button lesson-pill-button"
                      onClick={() => {
                        dispatch(authAction.setVerifyInfo(false));
                      }}>
                      <Icon name="liveTV" className="button-icon" />
                      <span className="label">Buy Now</span>
                    </button>
                    <Text style={styles.totalLibrary}>
                      Tổng thời lượng:{' '}
                      {convertDurationToTime(lessonDetail.totalDuration)}
                    </Text>
                    <Text style={styles.totalLibrary}>
                      Tổng số bài học: {lessonDetail.totalLibraries}
                    </Text>
                  </View>
                ) : (
                  <View>
                    <button
                      className="button lesson-pill-button"
                      disabled={!hasContent}
                      style={
                        !hasContent
                          ? { opacity: 0.6, cursor: 'not-allowed' }
                          : undefined
                      }
                      onClick={hasContent ? handleStartLesson : undefined}>
                      <Icon name="liveTV" className="button-icon" />
                      <span className="label">
                        {hasContent
                          ? 'Bắt đầu khóa học'
                          : 'Sẽ có trong tương lai'}
                      </span>
                    </button>
                    <Text style={styles.totalLibrary}>
                      Tổng thời lượng:{' '}
                      {convertDurationToTime(lessonDetail.totalDuration)}
                    </Text>
                    <Text style={styles.totalLibrary}>
                      Tổng số bài học: {lessonDetail.totalLibraries}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </View>

      <Modal
        title={selectedSubLessonTitle}
        open={watcherModalVisible}
        onCancel={() => setWatcherModalVisible(false)}
        footer={null}
        width={isMobile ? '95%' : isTablet ? 600 : 700}>
        <AppVideoWatchers
          subLessonId={selectedSubLessonId || ''}
          subLessonTitle={selectedSubLessonTitle}
          userId={userProfile?._id || ''}
          lessonId={lessonDetail?._id}
          onClose={() => setWatcherModalVisible(false)}
        />
      </Modal>

      <AppModalSuccess
        isVisibleModalSuccess={isVisibleModalSuccess}
        setIsVisibleModalSuccess={setIsVisibleModalSuccess}
      />
    </View>
  );
};

export default LessonDetailPage;
