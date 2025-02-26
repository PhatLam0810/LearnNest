'use client';
import React from 'react';
import { View } from 'react-native-web';
import styles from './styles';
import { AddLibraryContent } from '~mdAdmin/components';

const AdminLibrary = () => {
  return (
    <View style={[styles.container]}>
      <AddLibraryContent />
    </View>
  );
};

export default AdminLibrary;
