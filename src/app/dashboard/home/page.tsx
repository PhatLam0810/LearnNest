'use client';
import React, { useEffect } from 'react';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { LessonItem } from '~mdDashboard/components';
import { useAppDispatch } from '@redux';
import { useRouter } from 'next/navigation';
import { Banner, Tags } from './_components';
import styles from './styles';
import { View, ScrollView, Text } from 'react-native-web';
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
        : 'repeat(5, minmax(0, 1fr))',
    columnGap: isMobile ? 12 : 16,
    rowGap: isMobile ? 16 : 20,
  };

  // Định nghĩa cách ánh xạ (Mapping)
  const COURSE_MAPPING: Record<string, string> = {
    'MOS WORD': 'MOS WORD',
    'Học React': 'Học React',
    'Học AI': 'Học AI',
  };

  const handleBannerClick = (buttonText: string) => {
    const targetTitle = COURSE_MAPPING[buttonText];

    if (targetTitle) {
      const foundItem = data?.recommend.find(
        item => item.title === targetTitle,
      );
      onClickLesson(foundItem._id);
    }
  };

  return (
    <View style={containerStyle} aria-label="Home dashboard overview">
      <View style={styles.content}>
        <AnimatePresence mode="popLayout">
          <motion.div key={2}>
            <View style={styles.section}>
              <Banner onButtonClick={handleBannerClick} />
            </View>

            <View style={[styles.section, styles.sectionSpacing]}>
              <View style={styles.titleContainer}>
                <Text
                  style={{
                    ...styles.title,
                    fontSize: isMobile ? 18 : 20,
                  }}>
                  Khóa Học
                </Text>
                <Tags title="Mới" backgroundColor="#0059C7" />
              </View>
              <View style={recommendGridStyle}>
                {(data?.recommend || []).map(item => (
                  <LessonItem
                    key={item._id}
                    data={item}
                    onClick={() => onClickLesson(item._id)}
                  />
                ))}
              </View>
            </View>
          </motion.div>
        </AnimatePresence>
      </View>
    </View>
  );
};

export default HomeOverview;
