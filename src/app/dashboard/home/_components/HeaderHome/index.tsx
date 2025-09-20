'use client';
import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { View, Text, TouchableOpacity } from 'react-native-web';
import styles from './styles';
import Icon from '@components/icons';
import { HeartIcon } from '@/assets/svg';
import { useAppSelector } from '@redux';
import { typography } from '@styles';
import { useRouter } from 'next/navigation';

const HeaderHome = () => {
  const router = useRouter();
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
        <TouchableOpacity>
          <View
            onClick={() => {
              router.push('/dashboard/profile');
            }}>
            <Icon name="settingSuggest" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default HeaderHome;
