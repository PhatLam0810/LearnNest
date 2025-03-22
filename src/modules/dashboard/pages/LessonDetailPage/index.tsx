'use client';
import React from 'react';
import {
  ArrowLeftOutlined,
  BookOutlined,
  CheckOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import './styles.css';
import { useRouter } from 'next/navigation';
import Icon from '@components/icons';
import { useAppDispatch, useAppSelector } from '@redux';
import { LessonItem, LessonThumbnail } from '~mdDashboard/components';
import { dashboardAction } from '~mdDashboard/redux';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-web';
import styles from './styles';
import { convertDurationToTime } from '@utils';
import { AppHeader } from '@components';
import { message } from 'antd';

const LessonDetailPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { lessonDetail } = useAppSelector(state => state.dashboardReducer);

  return (
    <View style={styles.container}>
      {contextHolder}
      <AppHeader title="Lesson" />
      <ScrollView style={{ scrollbarWidth: 'none' }}>
        <View style={{ marginTop: 12, gap: 12 }}>
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
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 3 }}>
              <Text style={styles.description}>
                {lessonDetail?.description}
              </Text>
              <View style={{ paddingTop: 10, paddingBottom: 10, gap: 10 }}>
                <Text style={styles.whatLearnTitle}>What you’ll learn:</Text>
                {lessonDetail?.learnedSkills?.map((item, index) => (
                  <View key={index} style={{ flexDirection: 'row', gap: 12 }}>
                    <CheckOutlined />
                    <Text style={styles.skillLearnedItem}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View
              style={{
                flex: 1,
                width: '100%',
                aspectRatio: 16 / 9,
                borderRadius: 12,
                overflow: 'hidden',
                backgroundColor: 'gray',
              }}>
              <LessonThumbnail thumbnail={lessonDetail.thumbnail} />
            </View>
          </View>
          <button
            className="button"
            onClick={() => {
              const modules = lessonDetail.modules;
              if (modules && modules?.length > 0) {
                console.log('object');
                dispatch(dashboardAction.setSelectedModule(modules[0]));
                if (modules[0]?.hasSubLesson) {
                  console.log('2');
                  router.push('/dashboard/home/lesson/subLesson');
                } else {
                  console.log('44');
                  router.push('/dashboard/home/lesson/moduleDetail');
                }
              } else {
                messageApi.open({
                  type: 'warning',
                  content: 'Chưa có nội dung bài học vui lòng quay lại sau',
                  duration: 5,
                });
              }
            }}>
            <Icon name="liveTV" className="button-icon" />
            <span className="label">Start lesson</span>
          </button>
        </View>

        {lessonDetail?.modules?.length > 0 && (
          <View style={styles.lessonContent}>
            <Text style={styles.lessonContentTitle}>Lesson Content</Text>
            <View style={{ gap: 12 }}>
              {lessonDetail?.modules?.map((item, index) => (
                <TouchableOpacity key={index}>
                  <View
                    style={styles.buttonModule}
                    onClick={() => {
                      dispatch(dashboardAction.setSelectedModule(item));
                      if (item?.hasSubLesson) {
                        router.push('/dashboard/home/lesson/subLesson');
                      } else {
                        router.push('/dashboard/home/lesson/moduleDetail');
                      }
                    }}>
                    <PlayCircleOutlined />
                    <View style={{ paddingTop: 7, paddingBottom: 7 }}>
                      <Text style={styles.moduleItemTitle}>{item.title}</Text>
                      <Text style={styles.moduleItemTime}>
                        {convertDurationToTime(0)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
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
      </ScrollView>
    </View>
  );
};

export default LessonDetailPage;
