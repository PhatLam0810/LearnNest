import React, { CSSProperties, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native-web';
import styles from './styles';
import { CaretRightOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@redux';
import LibraryDetailItem from '../SubLessonDetailPage/_components/LibraryDetailItem';
import { AppHeader } from '@components';
import { Button, Collapse, CollapseProps } from 'antd';
import { convertDurationToTime } from '@utils';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';

const ModuleDetailPage = () => {
  const { selectedModule, lessonDetail, selectedLibrary } = useAppSelector(
    state => state.dashboardReducer,
  );
  const dispatch = useAppDispatch();
  const [setLibraryCanPlay] = dashboardQuery.useSetLibraryCanPlayMutation();
  const { userProfile } = useAppSelector(state => state.authReducer.tokenInfo);

  const getItems = (panelStyle: CSSProperties): CollapseProps['items'] =>
    lessonDetail?.modules?.map((item, index) => ({
      key: index,
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
          {item.libraries.map((subItem, subIndex) => {
            return (
              <TouchableOpacity
                key={subIndex}
                style={[
                  !subItem?.usersCanPlay?.some(
                    id => id._id === userProfile?._id,
                  ) && styles.disabledButton,
                ]}>
                <View
                  onClick={() => {
                    if (
                      subItem?.usersCanPlay?.some(
                        id => id._id === userProfile?._id,
                      )
                    ) {
                      dispatch(dashboardAction.setSelectedLibrary(subItem));
                    }
                  }}
                  style={[
                    styles.buttonModule,
                    selectedLibrary?._id === subItem._id && {
                      backgroundColor: '#ef405c',
                      color: '#FFF',
                    },
                  ]}>
                  <PlayCircleOutlined />
                  <View style={{ paddingVertical: 7, flex: 1 }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.moduleItemTitle,
                        selectedLibrary?._id === subItem._id && {
                          color: '#FFF',
                        },
                      ]}>
                      {subItem.title}
                    </Text>
                    <Text
                      style={[
                        styles.moduleItemTime,
                        selectedLibrary?._id === subItem._id && {
                          color: '#FFF',
                        },
                      ]}>
                      {convertDurationToTime(subItem.duration)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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

  const onWatchFinish = async () => {
    if (!selectedLibrary || !lessonDetail?.modules) return;

    const libraries = lessonDetail?.modules?.flatMap(
      module => module.libraries,
    );

    const currentIndex = libraries.findIndex(
      lib => lib._id === selectedLibrary?._id,
    );

    const nextLibrary = libraries[currentIndex + 1] || null;

    await setLibraryCanPlay({
      libraryId: nextLibrary?._id,
      userId: userProfile?._id,
    });
    dispatch(dashboardAction.getLessonDetail({ id: lessonDetail._id }));
    dispatch(dashboardAction.setSelectedLibrary(nextLibrary));
  };
  return (
    <View style={styles.container}>
      <AppHeader title={selectedModule?.title} subTitle={lessonDetail?.title} />

      <View style={styles.layout}>
        <View style={{ width: '70%' }}>
          {selectedLibrary && (
            <LibraryDetailItem
              data={selectedLibrary}
              onWatchFinish={onWatchFinish}
            />
          )}
          <View style={styles.layoutTitleContainer}>
            <View style={{ width: '100%', flex: 1 }}>
              <Text style={styles.layoutTitle}>{selectedLibrary?.title}</Text>
              <Text style={styles.description}>
                {selectedLibrary?.description}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {lessonDetail?.modules?.length > 0 && (
            <View style={styles.lessonContent}>
              <Text style={styles.lessonContentTitle}>Lesson Content</Text>
              <View style={{ gap: 12 }}>
                <Collapse
                  bordered={false}
                  defaultActiveKey={[0]}
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                  items={getItems(panelStyle)}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default ModuleDetailPage;
