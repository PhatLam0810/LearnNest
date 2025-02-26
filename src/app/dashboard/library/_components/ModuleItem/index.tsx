'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { Card } from 'antd';
import { typeItem } from '@/constants';
import Image from 'next/image';
import { getYouTubeThumbnail } from '@utils/youtube';
import { Module } from '~mdDashboard/redux/saga/type';

type LibraryItemProps = {
  data: Module;
  onClick?: () => void;
  style?: any;
};
const Thumbnail = ({ data }) => {
  const [src, setSrc] = useState(typeItem[data?.type]);

  useEffect(() => {
    if (data?.type === 'Youtube' || data.type === 'Short') {
      setSrc(getYouTubeThumbnail(data?.url));
    }
    if (data?.type === 'Video') {
      setSrc(data?.url);
    }
    if (data?.type === 'Image') {
      setSrc(data?.url);
    }
  }, []);

  return (
    <Image
      src={src}
      onError={() => {
        setSrc(typeItem[data?.type]);
      }}
      layout="fill"
      objectFit="cover"
      alt=""
    />
  );
};

const LibraryItem: React.FC<LibraryItemProps> = ({ data, onClick, style }) => {
  let firstLibrary = undefined;
  if (data?.hasSubLesson || data?.subLessons?.length > 0) {
    const firstSubLesson = data?.subLessons[0];
    if (firstSubLesson?.libraries?.length > 0) {
      firstLibrary = firstSubLesson?.libraries[0];
    }
  } else if (data?.libraries?.length > 0) {
    firstLibrary = data?.libraries[0];
  }

  return (
    <Card style={{ ...styles.container, ...style }} hoverable>
      <View style={{ flex: 1 }}>
        <View onClick={onClick}>
          <View style={styles.image}>
            {firstLibrary && <Thumbnail data={firstLibrary} />}
          </View>
          <View>
            <Text style={styles.title}>{data?.title}</Text>
            <Text style={styles.desc}>{data?.description}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default LibraryItem;
