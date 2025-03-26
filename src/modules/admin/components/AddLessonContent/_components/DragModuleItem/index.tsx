import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native-web';
import { Module } from '~mdDashboard/redux/saga/type';
import styles from './styles';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
type DragModuleItemProps = {
  data: Module;
  onDelete?: () => void;
};
const DragModuleItem: React.FC<DragModuleItemProps> = ({ data, onDelete }) => {
  console.log(data);
  return (
    <TouchableOpacity style={styles.container}>
      <View>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subTitle}>
          Total Libraries: {data.libraries.length}
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

export default DragModuleItem;
