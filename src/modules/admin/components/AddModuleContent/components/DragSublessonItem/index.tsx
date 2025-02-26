import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native-web';
import { Module, Sublesson } from '~mdDashboard/redux/saga/type';
import styles from './styles';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

type DragSublessonItemProps = {
  data: Sublesson;
  onDelete?: () => void;
};
const DragSublessonItem: React.FC<DragSublessonItemProps> = ({
  data,
  onDelete,
}) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subTitle}>{data.durations}</Text>
        <Text style={styles.subTitle}>
          Total library {data.libraries.length}
        </Text>
      </View>
      <Button
        color="danger"
        variant="solid"
        onMouseDown={onDelete}
        onTouchStart={onDelete}>
        <DeleteOutlined />
      </Button>
    </TouchableOpacity>
  );
};

export default DragSublessonItem;
