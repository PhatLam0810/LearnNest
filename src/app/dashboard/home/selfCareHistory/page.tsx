'use client';
import React from 'react';
import { FlatList, View } from 'react-native-web';
import styles from './styles';
import { useAppPagination } from '@hooks';
import { SelfCareItem } from '~mdDashboard/types';
import { DailySelfCare } from '../_components';
import { AppHeader } from '@components';

const SelfCareHistory = () => {
  const { listItem, fetchData } = useAppPagination<SelfCareItem>({
    apiUrl: 'user/getSelfCareHistory',
  });
  return (
    <View style={styles.container}>
      <AppHeader title="Self-Care" />
      <FlatList
        style={{ flex: 1 }}
        keyExtractor={item => item._id}
        data={listItem}
        onEndReached={fetchData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => {
          return (
            <DailySelfCare
              title={item.selfCare?.title}
              content={item.selfCare?.url}
              haveGotIt={false}
            />
          );
        }}
      />
    </View>
  );
};

export default SelfCareHistory;
