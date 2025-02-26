'use client';
import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { View, Text } from 'react-native-web';
import styles from './styles';
import Icon from '@components/icons';
import { HeartIcon } from '@/assets/svg';
import { useAppSelector } from '@redux';
import { typography } from '@styles';

const HeaderHome = () => {
  const userProfile = useAppSelector(
    state => state.authReducer.tokenInfo?.userProfile,
  );
  return (
    <View style={styles.headerContainer}>
      {/* Logo Image */}
      <View style={styles.headerItemLayout}>
        <HeartIcon />

        <Text
          style={
            styles.welcomeText
          }>{`Welcome, ${userProfile?.firstName}!`}</Text>
      </View>

      {/* Search Input */}
      <View style={styles.headerItemLayout}>
        <Input
          placeholder="Search anything..."
          styles={{
            input: {
              ...typography.titleSM,
            },
          }}
          prefix={<SearchOutlined />}
          style={styles.searchInput}
        />

        {/* Icons */}
        <Icon name="notification" />
        <Icon name="settingSuggest" />
      </View>
    </View>
  );
};
export default HeaderHome;
