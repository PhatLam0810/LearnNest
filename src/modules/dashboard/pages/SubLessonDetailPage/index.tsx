'use client';
import React, { useEffect, useState } from 'react';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import './styles.css';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@redux';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native-web';
import styles from './styles';
import LibraryDetailItem from './_components/LibraryDetailItem';
import { Sublesson } from '~mdDashboard/redux/saga/type';
import Image from 'next/image';
import { pencil } from 'public/images';
import { AppHeader } from '@components';
const LessonDetailPage = () => {
  const router = useRouter();
  const { selectedModule, lessonDetail } = useAppSelector(
    state => state.dashboardReducer,
  );
  const [currentSubLesson, setCurrentSubLesson] = useState<Sublesson>();

  useEffect(() => {
    if (selectedModule) {
      setCurrentSubLesson(selectedModule.subLessons[0]);
    }
  }, [selectedModule]);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <AppHeader
          title={selectedModule?.title}
          subTitle={lessonDetail?.title}
        />

        <View style={styles.content}>
          {selectedModule?.subLessons?.map((item, index) => {
            const isSelected = item?._id === currentSubLesson?._id;
            return (
              <TouchableOpacity key={index}>
                <View
                  onClick={() => setCurrentSubLesson(item)}
                  style={[
                    styles.buttonSubLesson,
                    isSelected && styles.buttonSubLessonSelected,
                  ]}>
                  <PlayCircleOutlined
                    width={24}
                    height={24}
                    size={100}
                    style={isSelected ? styles.buttonSubLessonTextSelected : {}}
                  />

                  <View style={{ flex: 1, paddingTop: 7, paddingBottom: 7 }}>
                    <Text
                      style={[
                        styles.buttonSubLessonTitle,
                        isSelected && styles.buttonSubLessonTextSelected,
                      ]}>
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.buttonSubLessonTime,
                        isSelected && styles.buttonSubLessonTextSelected,
                      ]}>
                      {[...new Set(item.libraries.map(item => item.type))].join(
                        ', ',
                      )}
                    </Text>
                  </View>
                  <ArrowRightOutlined
                    style={isSelected ? styles.buttonSubLessonTextSelected : {}}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={{ flex: 2.5 }}>
        <ScrollView
          style={{
            scrollbarWidth: 'none',
            padding: 20,
            borderRadius: 12,
            backgroundColor: '#F9F9F9',
          }}>
          <Text style={styles.currentSubLessonTitle}>
            {currentSubLesson?.title}
          </Text>

          <View style={styles.divider} />
          <View style={{ gap: 12 }}>
            {currentSubLesson?.libraries?.map((item, index) => (
              <LibraryDetailItem key={index} data={item} />
            ))}
          </View>

          {currentSubLesson?.description && (
            <div
              style={styles.currentSubLessonDesc}
              dangerouslySetInnerHTML={{
                __html: currentSubLesson?.description,
              }}
            />
          )}

          {currentSubLesson?.note && (
            <View>
              <View style={styles.divider} />
              <View style={{ flexDirection: 'row' }}>
                <Image style={{ width: 50, height: 50 }} src={pencil} alt="" />
                <div
                  style={styles.currentSubLessonNote}
                  dangerouslySetInnerHTML={{
                    __html: currentSubLesson?.description,
                  }}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default LessonDetailPage;
