'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import { Card } from 'antd';
import { typeItem } from '@/constants';
import Image from 'next/image';
import { getYouTubeThumbnail } from '@utils/youtube';
import styles from './styles';
import { Sublesson } from '~mdDashboard/redux/saga/type';

type SubLessonItemProps = {
  data: Sublesson;
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

const SubLessonItem: React.FC<SubLessonItemProps> = ({
  data,
  onClick,
  style,
}) => {
  const firstLibrary =
    data?.libraries?.length > 0 ? data?.libraries[0] : undefined;
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

export default SubLessonItem;
