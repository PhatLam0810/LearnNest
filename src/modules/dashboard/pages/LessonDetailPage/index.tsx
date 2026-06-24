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
import { FlatList, Text, TouchableOpacity, View } from 'react-native-web';
import styles from './styles';
import { convertDurationToTime } from '@utils';
import { Collapse, CollapseProps, message, Modal } from 'antd';
import { authAction, authQuery } from '~mdAuth/redux';
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
  // const { lessonDetail } = useAppSelector(state => state.dashboardReducer);
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const { lessonPurchaseData } = useAppSelector(state => state.authReducer);
  const [messageApi, contextHolder] = message.useMessage();
  const [lessonDetail, setLessonDetail] = useState<any>(null);
  const [getLessonId] = dashboardQuery.useGetLessonIdMutation();
  const [isVisibleModalBuy, setIsVisibleModalBuy] = useState(false);
  const [isVisibleModalSuccess, setIsVisibleModalSuccess] = useState(false);
  const [itemBuy, setItemBuy] = useState(null);
  const [setLibraryCanPlay] = dashboardQuery.useSetLibraryCanPlayMutation();
  const [triggerAccessLesson] = dashboardQuery.useAccessLessonMutation();
  const [checkRegistrationLesson] =
    dashboardQuery.useCheckRegistrationLessonMutation();
  const { data: dataSub, refetch } = authQuery.useGetSubscriptionsQuery({});
  const libraries = lessonDetail?.modules?.flatMap(module => module.libraries);

  // Responsive hook
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const numColumns = isMobile ? 1 : 2;

  const [accessLesson, setAccessLesson] = useState(true);
  const [activePanelKeys, setActivePanelKeys] = useState<string[]>([]);
  const [watcherModalVisible, setWatcherModalVisible] = useState(false);
  const [selectedSubLessonId, setSelectedSubLessonId] = useState<string | null>(
    null,
  );
  const [selectedSubLessonTitle, setSelectedSubLessonTitle] =
    useState<string>('');

  useEffect(() => {
    const fetchLesson = async () => {
      dispatch(authAction.setIsShowLoading(true));

      try {
        const res = await getLessonId({ id });
        if (res.data) {
          setLessonDetail(res.data);
        } else {
          messageApi.error('khong tim thay bai hochoc');
        }
      } catch (err) {
        messageApi.error('loi api');
      } finally {
        dispatch(authAction.setIsShowLoading(false));
      }
    };
    if (id) fetchLesson();
  }, [id]);

  useEffect(() => {
    if (!lessonDetail) return;

    // if (lessonDetail.isPremium) {
    // if (!dataSub || !userProfile?._id) return;
    // const hasPurchased = dataSub.some(
    //   sub =>
    //     sub.userId === userProfile._id &&
    //     sub.lessonId === lessonDetail._id &&
    //     sub.status === 'success',
    // );

    // if (hasPurchased) {
    //   setAccessLesson(true);
    // } else {
    //   setAccessLesson(false);
    // }
    // }
    // if (userProfile?.role?.level <= 2) setAccessLesson(true);

    if (lessonDetail?.modules?.length > 0) {
      const firstLibrary = lessonDetail.modules[0].libraries[0];
      if (firstLibrary) {
        setLibraryCanPlay({
          libraryId: firstLibrary._id,
          userId: userProfile?._id,
        });
      }
    }
  }, [lessonDetail, dataSub]);

  useEffect(() => {
    if (lessonPurchaseData) {
      refetch();
      setIsVisibleModalBuy(false);
      setIsVisibleModalSuccess(true);
    }
  }, [lessonPurchaseData]);

  if (!lessonDetail) {
    return;
  }

  const handleLibraryClick = async (subItem, item) => {
    if (!accessLesson) return;

    const canPlay = subItem?.usersCanPlay?.some(
      id => id._id === userProfile?._id,
    );
    // 🔥 Nếu role <= 2 thì đi sang trang xem lịch sử kết quả
    if (userProfile?.role?.level <= 2 && subItem.type === 'Text') {
      router.push(
        `/dashboard/home/lesson/resultHistory?libraryId=${subItem?._id}`,
      );
      return;
    }

    // 🔥 Logic cũ: user được phép xem bài học
    if (canPlay || userProfile?.role?.level <= 2) {
      dispatch(dashboardAction.setSelectedModule(item));
      dispatch(dashboardAction.setSelectedLibrary(subItem));
      router.push('/dashboard/home/lesson/moduleDetail');
    }
  };

  const handleStartLesson = async () => {
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

      const modules = lessonDetail.modules;
      const libraries = modules?.[0]?.libraries?.[0];

      dispatch(dashboardAction.setSelectedModule(modules[0]));
      dispatch(dashboardAction.setSelectedLibrary(libraries));
      router.push('/dashboard/home/lesson/moduleDetail');
    } catch (error) {
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
          <p style={styles.learnedSkillText}>{item.title}</p>
          <p style={styles.learnedSkillText}>
            Total Libraries: {item.libraries.length}
          </p>
        </div>
      ),
      children: (
        <View style={styles.contentGap8Margin8}>
          {item.libraries.map((subItem, subIndex) => (
            <TouchableOpacity
              key={subIndex}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={[
                  !subItem?.usersCanPlay?.some(
                    id => id._id === userProfile?._id,
                  ) && styles.disabledButton,
                  !accessLesson && styles.disabledButton,
                  { flex: 1 },
                ]}>
                <View
                  style={styles.buttonModule}
                  onClick={() => handleLibraryClick(subItem, item)}>
                  {/* LEFT AREA: TITLE + TIME */}
                  <View style={styles.rowGap10}>
                    <PlayCircleOutlined />
                    <View style={styles.moduleItemContainer}>
                      <Text numberOfLines={2} style={styles.moduleItemTitle}>
                        {subItem.title}
                      </Text>
                      <Text style={styles.moduleItemTime}>
                        {convertDurationToTime(subItem.duration)}
                      </Text>
                    </View>
                  </View>
                  {userProfile?.role?.level <= 2 && subItem.type !== 'Text' && (
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
          ))}
        </View>
      ),
      style: panelStyle,
    })) || [];

  const panelStyle: React.CSSProperties = {
    background: '#f5f5f5',
    borderRadius: '#f5f5f5',
    border: 'none',
  };
  // Responsive container styles
  const containerStyle = {
    ...styles.container,
    paddingLeft: isMobile ? 12 : isTablet ? 16 : 20,
    paddingRight: isMobile ? 12 : isTablet ? 16 : 20,
  };

  // Responsive content row styles
  const contentRowStyle = {
    ...styles.contentRow,
    flexDirection: (isMobile ? 'column' : 'row') as 'row' | 'column',
    gap: isMobile ? 16 : isTablet ? 20 : 24,
  };

  // Responsive main column styles
  const mainColumnStyle = {
    ...styles.mainColumn,
    maxWidth: isMobile ? '100%' : '90%',
  };

  // Responsive side column styles
  const sideColumnStyle = {
    ...styles.sideColumn,
    minWidth: isMobile ? '100%' : isTablet ? 280 : 340,
    maxWidth: isMobile ? '100%' : isTablet ? 360 : 420,
    position: (isMobile ? 'relative' : 'sticky') as 'relative' | 'sticky',
    top: isMobile ? 0 : 8,
  };

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
                        setItemBuy(lessonDetail);
                        setIsVisibleModalBuy(true);
                        dispatch(authAction.setVerifyInfo(false));
                      }}>
                      <Icon name="liveTV" className="button-icon" />
                      <span className="label">Buy Now</span>
                    </button>
                    <Text style={styles.totalLibrary}>
                      Total Duration:
                      {convertDurationToTime(lessonDetail.totalDuration)}
                    </Text>
                    <Text style={styles.totalLibrary}>
                      Total Libraries: {lessonDetail.totalLibraries}
                    </Text>
                  </View>
                ) : (
                  <View>
                    <button
                      className="button lesson-pill-button"
                      onClick={handleStartLesson}>
                      <Icon name="liveTV" className="button-icon" />
                      <span className="label">Start lesson</span>
                    </button>
                    <Text style={styles.totalLibrary}>
                      Total Duration:{' '}
                      {convertDurationToTime(lessonDetail.totalDuration)}
                    </Text>
                    <Text style={styles.totalLibrary}>
                      Total Libraries: {lessonDetail.totalLibraries}
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
                        setItemBuy(lessonDetail);
                        setIsVisibleModalBuy(true);
                        dispatch(authAction.setVerifyInfo(false));
                      }}>
                      <Icon name="liveTV" className="button-icon" />
                      <span className="label">Buy Now</span>
                    </button>
                    <Text style={styles.totalLibrary}>
                      Total Duration:{' '}
                      {convertDurationToTime(lessonDetail.totalDuration)}
                    </Text>
                    <Text style={styles.totalLibrary}>
                      Total Libraries: {lessonDetail.totalLibraries}
                    </Text>
                  </View>
                ) : (
                  <View>
                    <button
                      className="button lesson-pill-button"
                      onClick={handleStartLesson}>
                      <Icon name="liveTV" className="button-icon" />
                      <span className="label">Start lesson</span>
                    </button>
                    <Text style={styles.totalLibrary}>
                      Total Duration:{' '}
                      {convertDurationToTime(lessonDetail.totalDuration)}
                    </Text>
                    <Text style={styles.totalLibrary}>
                      Total Libraries: {lessonDetail.totalLibraries}
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

      {/* <AppModalPayPal
        isVisibleModalBuy={isVisibleModalBuy}
        setIsVisibleModalBuy={setIsVisibleModalBuy}
        data={lessonDetail}
        accessLesson={accessLesson}
      /> */}
      <AppModalSuccess
        isVisibleModalSuccess={isVisibleModalSuccess}
        setIsVisibleModalSuccess={setIsVisibleModalSuccess}
      />
    </View>
  );
};

export default LessonDetailPage;
