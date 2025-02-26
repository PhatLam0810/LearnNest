import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native-web';
import { Module } from '~mdDashboard/redux/saga/type';
import styles from './styles';

type DragModuleItemProps = {
  data: Module;
};
const DragModuleItem: React.FC<DragModuleItemProps> = ({ data }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.subTitle}>{data.durations}</Text>
      <Text style={styles.subTitle}>
        Total SubLesson {data.subLessons.length}
      </Text>
    </TouchableOpacity>
  );
};

export default DragModuleItem;
