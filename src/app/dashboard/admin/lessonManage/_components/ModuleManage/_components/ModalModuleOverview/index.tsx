import { useWindowSize } from '@hooks';
import { Modal } from 'antd';
import React from 'react';
import { FlatList, ScrollView, View } from 'react-native-web';
import LibraryDetailItem from '~mdDashboard/components/LibraryDetailItem';
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

  return (
    <Modal
      open={isVisible}
      onCancel={closeModal}
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
      </ScrollView>
    </Modal>
  );
};

export default ModalModuleOverview;
