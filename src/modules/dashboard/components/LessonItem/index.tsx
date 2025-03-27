'use client';
import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import './styles.css';
import dayjs from 'dayjs';
import styles from './styles';
import { Text, View } from 'react-native-web';
import LessonThumbnail from '../LessonThumbnail';
import { authQuery } from '~mdAuth/redux';
type LessonItemProps = {
  data: {
    thumbnail: string;
    createdAt: string;
    title: string;
    description: string;
    _id: string;
    isPremium: boolean;
    price: number;
  };
  onClick: () => void;
  onEditClick?: (data: any) => void;
  refresh?: () => void;
  haveMenu?: boolean;
  style?: any;
};

const LessonItem: React.FC<LessonItemProps> = ({ data, onClick, style }) => {
  const { thumbnail, createdAt, title, description, isPremium, price, _id } =
    data || {};
  const { data: dataSub } = authQuery.useGetSubscriptionsQuery({});
  const [accessLesson, setAccessLesson] = useState(false);

  useEffect(() => {
    if (isPremium) {
      setAccessLesson(false);
    }

    if (dataSub?.length > 0 && dataSub.some(sub => sub.lessonId === _id)) {
      setAccessLesson(true);
    }
  }, [dataSub, isPremium]);

  return (
    <Card
      styles={{ body: { display: 'flex', height: '100%' } }}
      hoverable
      style={Object.assign({}, styles.container, style)}>
      <View style={{ flex: 1 }} onClick={onClick}>
        {!accessLesson && (
          <View style={styles.premium}>
            <DollarOutlined style={{ color: '#FFF', fontSize: 24 }} />
          </View>
        )}

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
          {!accessLesson && (
            <Text style={styles.price} numberOfLines={2}>
              Price: {price}$
            </Text>
          )}
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
