'use client';
import React, { CSSProperties, useEffect, useState } from 'react';
import {
  CheckOutlined,
  PlayCircleOutlined,
  CaretRightOutlined,
  DollarOutlined,
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
import { Collapse, CollapseProps, message, Modal } from 'antd';
import { authAction } from '~mdAuth/redux';
import AppModalSuccess from '@components/AppModalSuccess';
import AppVideoWatchersButton from '~mdDashboard/components/VideoWatchersList/AppVideoWatchersButton';
import AppVideoWatchers from '~mdDashboard/components/VideoWatchersList/AppVideoWatchers';
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
      const firstModule = modules[0];
      const firstLibrary = firstModule?.libraries?.[0];

      if (!firstModule || !firstLibrary) {
        messageApi.open({
          type: 'error',
          content: 'Khóa học này hiện chưa có nội dung.',
          duration: 5,
        });
        return;
      }

      dispatch(dashboardAction.setSelectedModule(firstModule));
      dispatch(dashboardAction.setSelectedLibrary(firstLibrary));
      router.push(
        `/dashboard/home/lesson/moduleDetail?lessonId=${lessonDetail._id}`,
      );
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
  const getItems = (panelStyle: CSSProperties): CollapseProps['items'] =>
    lessonDetail?.modules?.map((item, index) => ({
      key: index.toString(),
      label: (
        <div style={styles.moduleContentHeader}>
          <p style={styles.moduleTitleText} title={item.title}>
            {item.title}
          </p>
          <p style={styles.moduleCountText}>
            Tổng số bài học: {item.libraries.length}
          </p>
        </div>
      ),
      children: (
        <View style={styles.contentGap8Margin8}>
          {item.libraries.map((subItem, subIndex) => {
            const isDisabled = !hasAccessToLibrary(subItem);
            return (
              <TouchableOpacity
                key={subIndex}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={[isDisabled && styles.disabledButton, { flex: 1 }]}>
                  <View
                    style={styles.buttonModule}
                    onClick={() => handleLibraryClick(subItem, item)}>
                    <View style={styles.rowGap10}>
                      <PlayCircleOutlined />
                      <View style={styles.moduleItemContainer}>
                        <Text numberOfLines={2} style={styles.moduleItemTitle}>
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
    })) || [];

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
                      onClick={handleStartLesson}>
                      <Icon name="liveTV" className="button-icon" />
                      <span className="label">Bắt đầu khóa học</span>
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
                  <View
                    style={{
                      ...styles.lessonContent,
                      maxWidth: isMobile ? '100%' : '90%',
                    }}>
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
                      onClick={handleStartLesson}>
                      <Icon name="liveTV" className="button-icon" />
                      <span className="label">Bắt đầu khóa học</span>
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
