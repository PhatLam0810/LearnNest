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
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-web';
import styles from './styles';
import { convertDurationToTime } from '@utils';
import { AppComment, AppHeader, AppModalPayPal } from '@components';
import { Collapse, CollapseProps, message, Modal } from 'antd';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { authAction, authQuery } from '~mdAuth/redux';
import AppModalSuccess from '@components/AppModalSuccess';

const LessonDetailPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { lessonDetail } = useAppSelector(state => state.dashboardReducer);
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};

  const { lessonPurchaseData } = useAppSelector(state => state.authReducer);
  const [messageApi, contextHolder] = message.useMessage();
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
  const numColumns = lessonDetail?.learnedSkills?.length >= 10 ? 2 : 1;

  const [accessLesson, setAccessLesson] = useState(true);

  useEffect(() => {
    if (lessonDetail.isPremium) {
      setAccessLesson(false);
    }
    if (userProfile?.role?.level <= 2) {
      setAccessLesson(true);
    }
    if (
      dataSub?.length > 0 &&
      dataSub.some(sub => sub.lessonId === lessonDetail._id)
    ) {
      setAccessLesson(true);
    }
  }, [dataSub, lessonDetail.isPremium]);

  useEffect(() => {
    if (libraries) {
      setLibraryCanPlay({
        libraryId: libraries[0]?._id,
        userId: userProfile?._id,
      });
      dispatch(dashboardAction.getLessonDetail({ id: lessonDetail._id }));
    }
  }, []);
  useEffect(() => {
    if (lessonPurchaseData) {
      refetch();
      setIsVisibleModalBuy(false);
      setIsVisibleModalSuccess(true);
      dispatch(dashboardAction.getLessonDetail({ id: lessonDetail._id }));
    }
  }, [lessonPurchaseData]);

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
              style={[
                !subItem?.usersCanPlay?.some(
                  id => id._id === userProfile?._id,
                ) && styles.disabledButton,
                !accessLesson && styles.disabledButton,
              ]}>
              <View
                style={styles.buttonModule}
                onClick={() => {
                  if (!accessLesson) {
                    return;
                  }
                  if (
                    subItem?.usersCanPlay?.some(
                      id => id._id === userProfile?._id,
                    )
                  ) {
                    dispatch(dashboardAction.setSelectedModule(item));
                    dispatch(dashboardAction.setSelectedLibrary(subItem));
                    router.push('/dashboard/home/lesson/moduleDetail');
                  }
                }}>
                <PlayCircleOutlined />
                <View style={{ paddingTop: 7, paddingBottom: 7 }}>
                  <Text style={styles.moduleItemTitle}>{subItem.title}</Text>
                  <Text style={styles.moduleItemTime}>
                    {convertDurationToTime(subItem.duration)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ),
      style: panelStyle,
    })) || [];

  const panelStyle: React.CSSProperties = {
    marginBottom: 12,
    background: '#f5f5f5',
    borderRadius: '#f5f5f5',
    border: 'none',
  };
  return (
    <View style={styles.container}>
      {contextHolder}
      <AppHeader title="Lesson" />
      <ScrollView style={{ scrollbarWidth: 'none' }}>
        <View style={{ marginTop: 12, gap: 16 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {lessonDetail?.categories?.map((item, index) => (
              <View style={styles.container} key={index}>
                <View style={{ flex: 1, paddingRight: 20 }}>
                  <Text style={styles.chip}>{item.name}</Text>
                </View>
              </View>
            ))}
          </View>
          <Text style={styles.title}>{lessonDetail?.title}</Text>
          <View style={{ flexDirection: 'row', height: '100%', gap: 12 }}>
            <View style={{ flex: 2.4 }}>
              <Text style={styles.description}>
                {lessonDetail?.description}
              </Text>
              <View style={{ paddingTop: 10, paddingBottom: 10, gap: 10 }}>
                <Text style={styles.whatLearnTitle}>What you’ll learn:</Text>
                <FlatList
                  data={lessonDetail?.learnedSkills}
                  numColumns={numColumns} // Dynamically set columns
                  key={numColumns} // Force re-render when column count changes
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        margin: 5,
                        flex: 1,
                      }}>
                      <CheckOutlined
                        style={{ color: '#ef405c', marginRight: 12 }}
                      />
                      <Text style={styles.learnedSkillText}>
                        {item.replace(/\n+/g, '\n')}
                      </Text>
                    </View>
                  )}
                />
              </View>
            </View>
            <View style={{ flex: 1, gap: 16, display: 'flex' }}>
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                  minHeight: 200,
                  borderRadius: 12,
                  overflow: 'hidden',
                  backgroundColor: 'gray',
                }}>
                {!accessLesson && (
                  <View style={styles.premium}>
                    <DollarOutlined style={{ color: '#FFF', fontSize: 24 }} />
                  </View>
                )}
                <LessonThumbnail thumbnail={lessonDetail.thumbnail} />
              </View>
              {!accessLesson ? (
                <View>
                  <button
                    className="button"
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
                    className="button"
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

        {lessonDetail?.modules?.length > 0 && (
          <View style={styles.lessonContent}>
            <Text style={styles.lessonContentTitle}>Lesson Content</Text>
            <View style={{ gap: 12 }}>
              <Collapse
                bordered={false}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                items={getItems(panelStyle)}
              />
            </View>
          </View>
        )}

        {lessonDetail?.relatedLessons?.length > 0 && (
          <View style={styles.lessonContent}>
            <Text style={styles.lessonContentTitle}>Related Lessons</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={lessonDetail.relatedLessons}
              contentContainerStyle={{ gap: 8 }}
              renderItem={({ item }) => (
                <LessonItem
                  data={item}
                  onClick={() => {
                    dispatch(dashboardAction.getLessonDetail({ id: item._id }));
                  }}
                />
              )}
            />
          </View>
        )}
        {/* <AppComment postId={lessonDetail._id} /> */}
      </ScrollView>
      <AppModalPayPal
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
