'use client';
import React from 'react';
import { Card } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import './styles.css';
import dayjs from 'dayjs';
import styles from './styles';
import { Text, View } from 'react-native-web';
import LessonThumbnail from '../LessonThumbnail';
type LessonItemProps = {
  data: {
    thumbnail: string;
    createdAt: string;
    title: string;
    description: string;
    _id: string;
  };
  onClick: () => void;
  onEditClick?: (data: any) => void;
  refresh?: () => void;
  haveMenu?: boolean;
  style?: any;
};

const LessonItem: React.FC<LessonItemProps> = ({ data, onClick, style }) => {
  const { thumbnail, createdAt, title, description } = data || {};

  return (
    <Card
      styles={{ body: { display: 'flex', height: '100%' } }}
      hoverable
      style={Object.assign({}, styles.container, style)}>
      <View style={{ flex: 1 }} onClick={onClick}>
        <View
          style={{
            width: '100%',
            aspectRatio: 16 / 9,
            borderRadius: 8,
            backgroundColor: 'gray',
          }}>
          <LessonThumbnail thumbnail={thumbnail} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
            {description}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 4,
            marginTop: 8,
            alignItems: 'center',
          }}>
          <ClockCircleOutlined style={styles.time} />
          <Text style={styles.time}>
            {dayjs(createdAt).format('MM/DD/YYYY HH:mm')}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default LessonItem;
