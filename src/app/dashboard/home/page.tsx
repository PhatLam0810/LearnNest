'use client';
import React, { useEffect } from 'react';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { LessonItem } from '~mdDashboard/components';
import { useAppDispatch } from '@redux';
import { useRouter } from 'next/navigation';
import { HeaderHome, Tags } from './_components';
import styles from './styles';
import { View, ScrollView, Text } from 'react-native-web';
import { splitData } from './functions';
import 'antd/dist/reset.css';
import { AnimatePresence, motion } from 'framer-motion';
import { authAction } from '~mdAuth/redux';
import { messageApi } from '@hooks';

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

  return (
    <ScrollView style={styles.container}>
      <HeaderHome />
      <ScrollView style={styles.content}>
        <AnimatePresence mode="popLayout">
          <motion.div key={2}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Today lesson</Text>
              <Tags title="For you" backgroundColor="#FFA726" />
            </View>
            {data?.today && (
              <LessonItem
                data={data?.today}
                onClick={() => onClickLesson(data.today._id)}
              />
            )}

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Just added</Text>
              <Tags title="New" backgroundColor="#0059C7" />
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{ width: '100%' }}
              style={{ scrollbarWidth: 'none' }}>
              <View style={{ gap: 12 }}>
                {splitData(data?.recommend || []).map((arr, arrIndex) => (
                  <View
                    key={arrIndex}
                    style={{ flexDirection: 'row', gap: '0.5%' }}>
                    {arr.map((item, index) => (
                      <LessonItem
                        key={index}
                        data={item}
                        onClick={() => onClickLesson(item._id)}
                      />
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </motion.div>
        </AnimatePresence>
      </ScrollView>
    </ScrollView>
  );
};

export default HomeOverview;
