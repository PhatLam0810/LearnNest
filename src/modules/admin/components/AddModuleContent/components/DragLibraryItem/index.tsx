import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native-web';
import styles from './styles';
import { Library } from '~mdDashboard/types';
import { Button } from 'antd';
import { DeleteOutlined } from '@components/AppIcon';

type DragLibraryItemProps = {
  data: Library;
  onDelete?: () => void;
};
const DragLibraryItem: React.FC<DragLibraryItemProps> = ({
  data,
  onDelete,
}) => {
  return (
    <View style={styles.container} onClick={e => e.stopPropagation()}>
      <Text style={styles.title}>{data?.title}</Text>
      <Button
        style={styles.deleteButton}
        onMouseDown={onDelete}
        onTouchStart={onDelete}>
        <DeleteOutlined style={{ color: 'var(--color-text-on-primary)' }} />
      </Button>
    </View>
  );
};

export default DragLibraryItem;
