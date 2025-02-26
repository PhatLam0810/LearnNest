'use client';
import { Avatar, Button, Card } from 'antd';
import React from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { IdcardOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const Subscription = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <IdcardOutlined color="white" style={styles.icon} />
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.desc}>Upgrade Your Plan</Text>
        <Text style={styles.desc}>Find Out Here</Text>
      </View>
      <Button
        onClick={() => {
          router.push('/subscription');
        }}>
        <Text style={styles.getPro}>Get Pro Now</Text>
      </Button>
    </View>
  );
};

export default Subscription;
