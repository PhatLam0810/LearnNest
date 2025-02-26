'use client';
import React from 'react';
import { View } from 'react-native-web';
import styles from './styles';
import { useRouter } from 'next/navigation';
import { AddModuleContent } from '~mdAdmin/components';

const AddModule = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <h2>Add Module</h2>
      <AddModuleContent />
    </View>
  );
};
export default AddModule;
