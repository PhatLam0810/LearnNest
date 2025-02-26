import React from 'react';
import { ScrollView, Text, View } from 'react-native-web';
import styles from './styles';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useAppSelector } from '@redux';
import LibraryDetailItem from '../SubLessonDetailPage/_components/LibraryDetailItem';
import { AppHeader } from '@components';

const ModuleDetailPage = () => {
  const { selectedModule, lessonDetail } = useAppSelector(
    state => state.dashboardReducer,
  );
  const router = useRouter();
  return (
    <View style={styles.container}>
      <AppHeader title={selectedModule?.title} subTitle={lessonDetail?.title} />
      {/* <View style={styles.header} onClick={() => router.back()}>
        <ArrowLeftOutlined style={{ fontSize: 20 }} />
        <View>
          <Text style={styles.title}>{selectedModule?.title}</Text>
          <Text style={styles.subTitle}>{lessonDetail?.title}</Text>
        </View>
      </View> */}

      <ScrollView
        style={{ width: '90%', alignSelf: 'center', scrollbarWidth: 'none' }}>
        <View style={{ gap: 12 }}>
          {selectedModule?.libraries?.map((item, index) => (
            <LibraryDetailItem key={index} data={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ModuleDetailPage;
