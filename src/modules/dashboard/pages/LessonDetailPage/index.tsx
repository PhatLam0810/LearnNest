'use client';
import React, { CSSProperties, useEffect, useState } from 'react';
import {
  CheckOutlined,
  PlayCircleOutlined,
  CaretRightOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import './styles.css';

import { useRouter } from 'next/navigation';
import Icon from '@components/icons';
import { useAppDispatch, useAppSelector } from '@redux';
import { LessonItem, LessonThumbnail } from '~mdDashboard/components';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { FlatList, Text, TouchableOpacity, View } from 'react-native-web';
import styles from './styles';
import { convertDurationToTime } from '@utils';
import { AppComment, AppHeader, AppModalPayPal } from '@components';
import { Collapse, CollapseProps, message, Modal } from 'antd';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { authAction, authQuery } from '~mdAuth/redux';
import AppModalSuccess from '@components/AppModalSuccess';
import AppVideoWatchersButton from '~mdDashboard/components/VideoWatchersList/AppVideoWatchersButton';
import AppVideoWatchers from '~mdDashboard/components/VideoWatchersList/AppVideoWatchers';
import { useResponsive } from '@/styles/responsive';
import AppModalSuiPay from '@components/AppModalSuiPay/components/AppModalSuiPay';

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
  const { data: dataSub, refetch } = authQuery.useGetSubscriptionsQuery({});
  const libraries = lessonDetail?.modules?.flatMap(module => module.libraries);
  const totalLibraries = lessonDetail?.modules?.reduce((total, item) => {
    return total + (item.libraries?.length || 0);
  }, 0);
  const totalDuration = lessonDetail?.modules?.reduce((total, module) => {
    return (
      total +
      (module.libraries?.reduce(
        (libTotal, library) => libTotal + (library.duration || 0),
        0,
      ) || 0)
    );
  }, 0);

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

  // Cách cũ của PhátPhát
  //  useEffect(() => {
  //     if (lessonDetail.isPremium) {
  //       setAccessLesson(false);
  //     }
  //     if (userProfile?.role?.level <= 2) {
  //       setAccessLesson(true);
  //     }
  //     if (
  //       dataSub?.length > 0 &&
  //       dataSub.some(sub => sub.lessonId === lessonDetail._id)
  //     ) {
  //       setAccessLesson(true);
  //     }
  //   }, [dataSub, lessonDetail.isPremium]);

  //   useEffect(() => {
  //     if (libraries) {
  //       setLibraryCanPlay({
  //         libraryId: libraries[0]?._id,
  //         userId: userProfile?._id,
  //       });
  //       dispatch(dashboardAction.getLessonDetail({ id: lessonDetail._id }));
  //     }
  //   }, []);
  //   useEffect(() => {
  //     if (lessonPurchaseData) {
  //       refetch();
  //       setIsVisibleModalBuy(false);
  //       setIsVisibleModalSuccess(true);
  //       dispatch(dashboardAction.getLessonDetail({ id: lessonDetail._id }));
  //     }
  //   }, [lessonPurchaseData]);

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

    if (lessonDetail.isPremium) {
      if (!dataSub || !userProfile?._id) return;
      const hasPurchased = dataSub.some(
        sub =>
          sub.userId === userProfile._id &&
          sub.lessonId === lessonDetail._id &&
          sub.status === 'success',
      );

      if (hasPurchased) {
        setAccessLesson(true);
      } else {
        setAccessLesson(false);
      }
    }
    if (userProfile?.role?.level <= 2) setAccessLesson(true);

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
    if (canPlay) {
      dispatch(dashboardAction.setSelectedModule(item));
      dispatch(dashboardAction.setSelectedLibrary(subItem));
      router.push('/dashboard/home/lesson/moduleDetail');
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
        <View style={{ gap: 8, marginTop: 8 }}>
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
                  style={[
                    styles.buttonModule,
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}
                  onClick={() => handleLibraryClick(subItem, item)}>
                  {/* LEFT AREA: TITLE + TIME */}
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <PlayCircleOutlined />
                    <View>
                      <Text style={styles.moduleItemTitle}>
                        {subItem.title}
                      </Text>
                      <Text style={styles.moduleItemTime}>
                        {convertDurationToTime(subItem.duration)}
                      </Text>
                    </View>
                  </View>

                  {/* RIGHT AREA: WATCHERS BUTTON */}
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
        <View style={{ marginTop: 12 }}>
          <View
            style={{
              flexDirection: isMobile ? 'column' : 'row',
              gap: 12,
              flexWrap: 'wrap',
            }}>
            {lessonDetail?.categories?.map((item, index) => (
              <View key={index}>
                <Text style={styles.chip}>{item.name}</Text>
              </View>
            ))}
          </View>
          <Text
            style={{
              ...styles.title,
              fontSize: isMobile ? 18 : isTablet ? 20 : 22.78,
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
                  fontSize: isMobile ? 14 : 16,
                }}>
                {lessonDetail?.description}
              </Text>
              <View style={{ paddingBottom: 10 }}>
                <Text
                  style={{
                    ...styles.whatLearnTitle,
                    fontSize: isMobile ? 16 : 18,
                  }}>
                  What you&apos;ll learn:
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

              {lessonDetail?.modules?.length > 0 && (
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
                    Lesson Content
                  </Text>
                  <View style={{ gap: 12 }}>
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
              )}

              {lessonDetail?.relatedLessons?.length > 0 && (
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
                    Related Lessons
                  </Text>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={lessonDetail.relatedLessons}
                    contentContainerStyle={{ gap: 8 }}
                    renderItem={({ item }) => (
                      <LessonItem
                        data={item}
                        onClick={() => {
                          router.push(`/dashboard/home/lesson/${item._id}`);
                        }}
                      />
                    )}
                  />
                </View>
              )}
            </View>
            <View style={{ ...sideColumnStyle, gap: 16 }}>
              <View
                style={{
                  ...styles.thumbnailCard,
                  minHeight: isMobile ? 200 : 260,
                }}>
                {!accessLesson && (
                  <View style={styles.premium}>
                    <DollarOutlined
                      style={{
                        color: '#FFF',
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
                    Total Duration: {convertDurationToTime(totalDuration)}
                  </Text>
                  <Text style={styles.totalLibrary}>
                    Total Libraries: {totalLibraries}
                  </Text>
                </View>
              ) : (
                <View>
                  <button
                    className="button lesson-pill-button"
                    onClick={() => {
                      const modules = lessonDetail.modules;
                      const libraries = modules[0].libraries[0];
                      if (modules && modules?.length > 0) {
                        dispatch(dashboardAction.setSelectedModule(modules[0]));
                        dispatch(dashboardAction.setSelectedLibrary(libraries));
                        router.push('/dashboard/home/lesson/moduleDetail');
                      } else {
                        messageApi.open({
                          type: 'warning',
                          content:
                            'Chưa có nội dung bài học vui lòng quay lại sau',
                          duration: 5,
                        });
                      }
                    }}>
                    <Icon name="liveTV" className="button-icon" />
                    <span className="label">Start lesson</span>
                  </button>
                  <Text style={styles.totalLibrary}>
                    Total Duration: {convertDurationToTime(totalDuration)}
                  </Text>
                  <Text style={styles.totalLibrary}>
                    Total Libraries: {totalLibraries}
                  </Text>
                </View>
              )}
            </View>
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
      <AppModalSuiPay
        isVisibleModalBuy={isVisibleModalBuy}
        setIsVisibleModalBuy={setIsVisibleModalBuy}
        data={lessonDetail}
        accessLesson={accessLesson}
      />
      <AppModalSuccess
        isVisibleModalSuccess={isVisibleModalSuccess}
        setIsVisibleModalSuccess={setIsVisibleModalSuccess}
      />
    </View>
  );
};

export default LessonDetailPage;
