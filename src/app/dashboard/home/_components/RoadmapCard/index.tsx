import React from 'react';
import { Text, View } from 'react-native-web';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@redux';
import { useGetMyRoadmapQuery } from '~mdDashboard/redux';
import styles from './styles';

// Bản rút gọn của /dashboard/my-roadmap cho Trang Chủ - chỉ hiện insight
// gần nhất (BE trả về đã sort mới nhất trước, xem MyRoadmapPage), kèm nút
// sang trang đầy đủ. Không đổi trang my-roadmap.
const RoadmapCard: React.FC = () => {
  const router = useRouter();
  const userId = useAppSelector(
    state => state.authReducer.tokenInfo?.userProfile?._id,
  );
  const { data: insights, isFetching } = useGetMyRoadmapQuery(userId || '', {
    skip: !userId,
  });

  const latest = Array.isArray(insights) ? insights[0] : null;

  if (isFetching || !latest) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Lộ Trình AI</Text>
      <Text style={styles.summary} numberOfLines={4}>
        {latest.summary}
      </Text>
      <Text
        style={styles.link}
        onClick={() => router.push('/dashboard/my-roadmap')}>
        Xem lộ trình đề xuất →
      </Text>
    </View>
  );
};

export default RoadmapCard;
