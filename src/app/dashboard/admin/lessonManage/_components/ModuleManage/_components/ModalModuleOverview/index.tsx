import { useWindowSize } from '@hooks';
import { Modal } from 'antd';
import React from 'react';
import { ScrollView, View, Text } from 'react-native-web';
import LibraryDetailItem from '~mdDashboard/components/LibraryDetailItem';
import { Module } from '~mdDashboard/redux/saga/type';
import styles from './styles';

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

  return (
    <Modal
      open={isVisible}
      onCancel={() => setIsVisible(false)}
      footer={null}
      centered
      width="80%"
      title={
        <div style={styles.header}>
          {data?.title}
          <div style={styles.subTitle}>
            {data?.libraries?.length || 0} lessons
          </div>
        </div>
      }>
      <ScrollView
        style={{
          height: width * 0.8 * (9 / 16),
          padding: 12,
        }}>
        <View style={styles.container}>
          {data?.libraries?.map(item => (
            <View key={item._id} style={styles.card}>
              <LibraryDetailItem data={item} />
            </View>
          ))}
        </View>
      </ScrollView>
    </Modal>
  );
};

export default ModalModuleOverview;
