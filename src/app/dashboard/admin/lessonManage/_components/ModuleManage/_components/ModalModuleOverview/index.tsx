import { LibraryItem } from '@/app/dashboard/library/_components';
import { useWindowSize } from '@hooks';
import { Collapse, CollapseProps, Modal } from 'antd';
import React from 'react';
import { FlatList, ScrollView, View } from 'react-native-web';
import LibraryDetailItem from '~mdDashboard/pages/SubLessonDetailPage/_components/LibraryDetailItem';
import { Module } from '~mdDashboard/redux/saga/type';

type ModalModuleOverviewProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  data: Module;
};
const ModalModuleOverview: React.FC<ModalModuleOverviewProps> = ({
  isVisible,
  setIsVisible,
  data,
}) => {
  const { width } = useWindowSize();

  const closeModal = () => {
    setIsVisible(false);
  };

  const items: CollapseProps['items'] = data?.subLessons?.map(item => ({
    key: item._id,
    label: item.title,
    children: (
      <FlatList
        scrollEnabled={false}
        keyExtractor={i => i._id}
        data={item.libraries}
        renderItem={({ item }) => <LibraryDetailItem data={item} />}
      />
    ),
  }));

  return (
    <Modal
      open={isVisible}
      onCancel={closeModal}
      onClose={closeModal}
      title={data?.title}
      closable={false}
      footer={false}
      centered
      width={'80%'}>
      <ScrollView
        style={{
          height: width * 0.8 * (9 / 16),
          scrollbarWidth: 'none',
        }}>
        <FlatList
          scrollEnabled={false}
          keyExtractor={item => item?._id}
          data={data?.libraries}
          renderItem={({ item }) => {
            return <LibraryDetailItem data={item} />;
          }}
        />
        <Collapse items={items} defaultActiveKey={['1']} />
      </ScrollView>
    </Modal>
  );
};

export default ModalModuleOverview;
