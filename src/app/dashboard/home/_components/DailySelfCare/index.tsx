'use client';
import React from 'react';
import { Typography } from 'antd';
import styles from './styles';
import { TouchableOpacity, View } from 'react-native-web';

type DailySelfCareProps = {
  title: string;
  content: string;
  haveGotIt?: boolean;
  onGotIt?: () => void;
};
const DailySelfCare: React.FC<DailySelfCareProps> = ({
  title,
  content,
  haveGotIt = true,
  onGotIt,
}) => {
  return (
    <View style={styles.container}>
      <Typography.Title level={2} style={styles.title}>
        Daily Self-care
      </Typography.Title>
      <Typography.Text style={styles.subTitle}>{title}</Typography.Text>

      <Typography.Text style={styles.desc}>{content}</Typography.Text>

      {haveGotIt && (
        <TouchableOpacity style={styles.button}>
          <View onClick={onGotIt}>
            <Typography.Text>Got it</Typography.Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DailySelfCare;
