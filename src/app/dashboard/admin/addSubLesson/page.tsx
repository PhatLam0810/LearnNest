'use client';
import React from 'react';
import { View } from 'react-native-web';
import styles from './styles';
import { useRouter } from 'next/navigation';
import { AddSubLessonContent } from '~mdAdmin/components';

const AddSublesson = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <h2>Add Sublesson</h2>
      <AddSubLessonContent onDone={() => {}} />
    </View>
  );
};

export default AddSublesson;
