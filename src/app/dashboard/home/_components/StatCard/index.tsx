import React from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  caption?: string;
  captionColor?: string;
};

// 1 thẻ thống kê nhỏ dùng ở Trang Chủ (giờ học tuần này, bài đã hoàn thành,
// chuỗi ngày học) - card trắng bo góc, số lớn, caption xám nhỏ bên dưới.
const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  caption,
  captionColor,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.labelRow}>
        {icon}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {caption ? (
        <Text
          style={[
            styles.caption,
            captionColor ? { color: captionColor } : null,
          ]}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
};

export default StatCard;
