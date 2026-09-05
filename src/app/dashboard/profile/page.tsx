'use client';
import React from 'react';
import { View, Text } from 'react-native-web';
import styles from './styles';
import {
  ChangePassword,
  EditProfile,
  ProfileSidebar,
  StudyPreferences,
} from './components';

const ProfilePage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cài Đặt</Text>
      <View style={styles.contentRow}>
        <View style={styles.sideCol}>
          <ProfileSidebar />
        </View>
        <View style={styles.mainCol}>
          <EditProfile />
          <ChangePassword />
          <StudyPreferences />
        </View>
      </View>
    </View>
  );
};

export default ProfilePage;
