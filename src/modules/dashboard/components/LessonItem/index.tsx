'use client';
import React, { useState } from 'react';
import { Card } from 'antd';
import { BookOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons';
import './styles.css';
import styles from './styles';
import { Text, View } from 'react-native-web';
import LessonThumbnail from '../LessonThumbnail';
import { authQuery } from '~mdAuth/redux';
import { useAppSelector } from '@redux';

type LessonItemData = {
  thumbnail: string;
  title: string;
  description: string;
  _id: string;
  isPremium: boolean;
  price: number;
  totalLibraries: number;
  totalLearners: number;
};

type LessonItemProps = {
  data: LessonItemData;
  onClick: () => void;
  onEditClick?: (data: any) => void;
  refresh?: () => void;
  haveMenu?: boolean;
  style?: any;
};

const LessonItem: React.FC<LessonItemProps> = ({ data, onClick, style }) => {
  const {
    thumbnail,
    title,
    description,
    isPremium,
    price,
    totalLibraries,
    totalLearners,
  } = data || {};
  const { data: dataSub } = authQuery.useGetSubscriptionsQuery({});
  const [accessLesson, setAccessLesson] = useState(true);
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  // useEffect(() => {
  //   if (isPremium) {
  //     if (!dataSub || !userProfile?._id || !data) return;
  //     const hasPurchased = dataSub.some(
  //       sub =>
  //         sub.userId === userProfile._id &&
  //         sub.lessonId === data._id &&
  //         sub.status === 'success',
  //     );

  //     if (hasPurchased) {
  //       setAccessLesson(true);
  //     } else {
  //       setAccessLesson(false);
  //     }
  //   }
  //   if (userProfile?.role?.level <= 2) setAccessLesson(true);
  // }, [isPremium, dataSub, data]);

  return (
    <Card
      className="lesson-card"
      styles={{ body: { display: 'flex', height: '100%' } }}
      hoverable
      style={Object.assign({}, styles.container, style)}>
      <View style={{ flex: 1 }} onClick={onClick}>
        {!accessLesson && (
          <View style={styles.premium}>
            <DollarOutlined style={{ color: '#FFF', fontSize: 24 }} />
          </View>
        )}

        <View style={styles.cardThumbnail}>
          <LessonThumbnail thumbnail={thumbnail} />
        </View>

        <View style={[styles.content, { flex: 1 }]}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
            {description}
          </Text>
          {!accessLesson && (
            <Text style={styles.price} numberOfLines={2}>
              Cost price: {price} ETH
            </Text>
          )}

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <BookOutlined style={styles.statIcon} />
              <Text style={styles.statValue}>{totalLibraries}</Text>
            </View>
            <View style={styles.statItem}>
              <TeamOutlined style={styles.statIcon} />
              <Text style={styles.statValue}>{totalLearners}</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default LessonItem;
