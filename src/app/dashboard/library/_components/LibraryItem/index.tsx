'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { Card } from 'antd';
import { typeItem } from '@/constants';
import Image from 'next/image';
import { Library } from '~mdDashboard/types';
import { getYouTubeThumbnail } from '@utils/youtube';

type LibraryItemProps = {
  data: Library;
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
  return (
    <Card style={{ ...styles.container, ...style }} hoverable>
      <View style={{ flex: 1 }}>
        <View onClick={onClick}>
          <View style={styles.image}>
            <Thumbnail data={data} />
          </View>
          <View>
            <Text style={styles.title}>{data?.title}</Text>
            <Text style={styles.desc}>{data?.description}</Text>
            <Text style={styles.tags}>{`Tags: ${data?.tags?.join(', ')}`}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default LibraryItem;
