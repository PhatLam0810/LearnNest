import { useWindowSize } from '@hooks';
import { Collapse, CollapseProps, Modal } from 'antd';
import React from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native-web';
import { Lesson } from '~mdDashboard/redux/saga/type';
import styles from './styles';
import { LessonThumbnail } from '~mdDashboard/components';
import { CheckOutlined } from '@ant-design/icons';
import LibraryDetailItem from '~mdDashboard/pages/SubLessonDetailPage/_components/LibraryDetailItem';

type ModalLessonOverviewProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  data: Lesson;
};
const ModalLessonOverview: React.FC<ModalLessonOverviewProps> = ({
  isVisible,
  setIsVisible,
  data,
}) => {
  const { width } = useWindowSize();
  const closeModal = () => {
    setIsVisible(false);
  };

  const items: CollapseProps['items'] = data?.modules?.map(mItem => {
    if (mItem.libraries.length > 0) {
      return {
        key: mItem._id,
        label: mItem.title,
        children: (
          <FlatList
            scrollEnabled={false}
            keyExtractor={i => i._id}
            data={mItem.libraries}
            renderItem={({ item }) => <LibraryDetailItem data={item} />}
          />
        ),
      };
    } else if (mItem.subLessons.length > 0) {
      const nestedItem: CollapseProps['items'] = mItem.subLessons.map(sItem => {
        return {
          key: sItem._id,
          label: sItem.title,
          children: (
            <FlatList
              scrollEnabled={false}
              keyExtractor={i => i._id}
              data={sItem.libraries}
              renderItem={({ item }) => <LibraryDetailItem data={item} />}
            />
          ),
        };
      });
      return {
        key: mItem._id,
        label: mItem.title,
        children: <Collapse items={nestedItem} />,
      };
    }
  });

  return (
    <Modal
      open={isVisible}
      onCancel={closeModal}
      onClose={closeModal}
      centered
      width={'80%'}
      closable={false}
      footer={false}
      title={data?.title}>
      <ScrollView
        style={{ height: (width * 0.8 * 9) / 16, scrollbarWidth: 'none' }}>
        <View style={styles.descContainer}>
          <View style={{ flex: 3 }}>
            <Text>{data?.description}</Text>
            {data?.learnedSkills.map((item, index) => (
              <View key={index}>
                <CheckOutlined />
                <Text>{item}</Text>
              </View>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.thumbnailWrap}>
              <LessonThumbnail thumbnail={data?.thumbnail} />
            </View>
          </View>
        </View>
        <Collapse items={items} />
      </ScrollView>
    </Modal>
  );
};

export default ModalLessonOverview;
