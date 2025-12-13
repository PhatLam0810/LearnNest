'use client';
import React, { useEffect } from 'react';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { LessonItem } from '~mdDashboard/components';
import { useAppDispatch } from '@redux';
import { useRouter } from 'next/navigation';
import { Tags } from './_components';
import styles from './styles';
import { View, ScrollView, Text } from 'react-native-web';
import 'antd/dist/reset.css';
import { AnimatePresence, motion } from 'framer-motion';
import { authAction } from '~mdAuth/redux';
import { messageApi } from '@hooks';
import { useResponsive } from '@/styles/responsive';

const HomeOverview = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data, isLoading } = dashboardQuery.useGetLessonRecommendQuery();
  const [getLessonId] = dashboardQuery.useGetLessonIdMutation();
  const onClickLesson = async (id: string) => {
    try {
      dispatch(authAction.setIsShowLoading(true));
      const response = await getLessonId({ id: id });

      if (response.data) {
        dispatch(dashboardAction.setLessonDetail(response.data));
        router.push(`/dashboard/home/lesson/${id}`);
      }
    } catch (error) {
      messageApi.error(error.message || 'Failed to get Lesson .');
    } finally {
      dispatch(authAction.setIsShowLoading(false));
    }
  };

  useEffect(() => {
    if (isLoading) {
      dispatch(authAction.setIsShowLoading(true));
    } else {
      dispatch(authAction.setIsShowLoading(false));
    }
  }, [isLoading]);

  // Responsive hook
  const { isMobile, isTablet } = useResponsive();

  // Responsive container styles
  const containerStyle = {
    ...styles.container,
    padding: isMobile ? 12 : isTablet ? 16 : 20,
  };

  // Responsive grid styles
  const recommendGridStyle = {
    ...styles.recommendGrid,
    gridTemplateColumns: isMobile
      ? 'repeat(1, minmax(0, 1fr))'
      : isTablet
        ? 'repeat(2, minmax(0, 1fr))'
        : 'repeat(4, minmax(0, 1fr))',
    columnGap: isMobile ? 12 : 16,
    rowGap: isMobile ? 16 : 20,
  };

  return (
    <ScrollView style={containerStyle} aria-label="Home dashboard overview">
      <ScrollView
        style={styles.content}
        aria-label="Recommended lessons"
        contentContainerStyle={styles.contentContainer}>
        <AnimatePresence mode="popLayout">
          <motion.div key={2}>
            <View style={styles.section}>
              <View style={styles.titleContainer}>
                <Text
                  style={{
                    ...styles.title,
                    fontSize: isMobile ? 18 : 20,
                  }}>
                  Today lesson
                </Text>
                <Tags title="For you" backgroundColor="#FFA726" />
              </View>
              <View style={recommendGridStyle}>
                {data?.today && (
                  <LessonItem
                    data={data?.today}
                    onClick={() => onClickLesson(data.today._id)}
                  />
                )}
              </View>
            </View>

            <View style={[styles.section, styles.sectionSpacing]}>
              <View style={styles.titleContainer}>
                <Text
                  style={{
                    ...styles.title,
                    fontSize: isMobile ? 18 : 20,
                  }}>
                  Just added
                </Text>
                <Tags title="New" backgroundColor="#0059C7" />
              </View>
              <View style={recommendGridStyle}>
                {(data?.recommend || []).map((item, index) => (
                  <LessonItem
                    key={index}
                    data={item}
                    onClick={() => onClickLesson(item._id)}
                  />
                ))}
              </View>
            </View>
          </motion.div>
        </AnimatePresence>
      </ScrollView>
    </ScrollView>
  );
};

export default HomeOverview;
