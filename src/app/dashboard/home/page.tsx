'use client';
import React, { useEffect, useState } from 'react';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { LessonItem } from '~mdDashboard/components';
import { useAppDispatch } from '@redux';
import { useRouter } from 'next/navigation';
import {
  DailySelfCare,
  HeaderHome,
  PopularCategories,
  Tags,
} from './_components';
import styles from './styles';
import { View, ScrollView, Text, FlatList } from 'react-native-web';
import { splitData } from './functions';
import 'antd/dist/reset.css';
import { AnimatePresence, motion } from 'framer-motion';

import { authAction, authQuery } from '~mdAuth/redux';

import { messageApi } from '@hooks';

const HomeOverview = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data } = dashboardQuery.useGetLessonRecommendQuery();
  const { data: selfCareData, isFetching } =
    dashboardQuery.useGetTodaySelfCareQuery();
  const [markAtRead] = dashboardQuery.useMarkSelfCareAsReadMutation();
  const [getLessonId] = dashboardQuery.useGetLessonIdMutation();
  const [isShowSelfCare, setIsShowSelfCare] = useState(false);

  const onClickLesson = async (id: string) => {
    try {
      dispatch(authAction.setIsShowLoading(true));
      const response = await getLessonId({ id: id });

      if (response.data) {
        dispatch(dashboardAction.setLessonDetail(response.data));
        router.push('home/lesson');
      }
    } catch (error) {
      messageApi.error(error.message || 'Failed to get Lesson .');
    } finally {
      dispatch(authAction.setIsShowLoading(false));
    }
  };

  useEffect(() => {
    if (selfCareData) {
      setIsShowSelfCare(!selfCareData?.isRead);
    }
  }, [isFetching, selfCareData]);

  return (
    <View style={styles.container}>
      <HeaderHome />
      <ScrollView style={styles.content}>
        <AnimatePresence mode="popLayout">
          {isShowSelfCare && selfCareData && (
            <motion.div
              key={1}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring' }}
              exit={{ opacity: 0, y: -20 }}>
              <DailySelfCare
                title={selfCareData?.selfCare?.title}
                content={selfCareData?.selfCare?.url}
                onGotIt={() => {
                  markAtRead({ id: selfCareData?._id });
                  setIsShowSelfCare(false);
                }}
              />
            </motion.div>
          )}

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
    </View>
  );
};

export default HomeOverview;
