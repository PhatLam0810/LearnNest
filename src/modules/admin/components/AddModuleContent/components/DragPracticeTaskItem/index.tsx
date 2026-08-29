import React from 'react';
import { Text, View } from 'react-native-web';
import { Button, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { PracticeTask } from '~mdDashboard/types/practice';
import styles from '../DragLibraryItem/styles';

type Props = {
  data: PracticeTask;
  onDelete?: () => void;
};

// Chip cho 1 bài thực hành trong danh sách "Sắp xếp" đã trộn chung với bài
// học video — dùng lại đúng style của DragLibraryItem để 2 loại nhìn nhất
// quán trong cùng 1 danh sách kéo-thả.
const DragPracticeTaskItem: React.FC<Props> = ({ data, onDelete }) => {
  return (
    <View style={styles.container} onClick={e => e.stopPropagation()}>
      {/* flex:1 ở đây (không chỉ ở Text bên trong) — nếu không, nhóm
          tag+tiêu đề chỉ co vừa đúng nội dung của nó, không chiếm hết
          khoảng trống còn lại của hàng, khiến nút xoá bị đẩy sát ngay sau
          chữ thay vì nằm ở mép phải cùng hàng. */}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          minWidth: 0,
        }}>
        <Tag color={data.subject === 'Excel' ? 'green' : 'blue'}>
          {data.subject}
        </Tag>
        <Text style={styles.title} numberOfLines={1}>
          {data?.title}
        </Text>
      </View>
      <Button
        color="danger"
        variant="solid"
        onMouseDown={onDelete}
        onTouchStart={onDelete}>
        <DeleteOutlined />
      </Button>
    </View>
  );
};

export default DragPracticeTaskItem;
