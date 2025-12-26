'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { Card } from 'antd';
import Image from 'next/image';
import { Library } from '~mdDashboard/types';
import { getYouTubeThumbnail } from '@utils/youtube';
import { useResponsive } from '@/styles/responsive';

type LibraryItemProps = {
  data: Library;
  onClick?: () => void;
  style?: any;
};
const Thumbnail = ({ data }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    // Try to load actual image first
    if (data?.type === 'Youtube' || data.type === 'Short') {
      setSrc(getYouTubeThumbnail(data?.url));
    } else if (data?.type === 'Video') {
      setSrc(data?.url);
    } else if (data?.type === 'Image') {
      setSrc(data?.url);
    } else {
      // For other types without image, show placeholder immediately
      setShowPlaceholder(true);
    }
  }, [data]);

  const handleImageError = () => {
    // When image fails to load, show placeholder with title (no icon fallback)
    setShowPlaceholder(true);
  };

  // Show title text when image fails to load or no image source
  if (showPlaceholder || !src) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText} numberOfLines={2}>
          {data?.title || 'No Title'}
        </Text>
      </View>
    );
  }
  const EMPTY_IMAGE =
    'https://storage.googleapis.com/myproject0810/uploads/1752760987701-noname%20%282%29.mp4?GoogleAccessId=firebase-adminsdk-fbsvc%40my-project-c7f44.iam.gserviceaccount.com&Expires=1898553600&Signature=ibnGSV3WdPW6tGVw1YIMZPNlYMstPJhFTrU0VnyCzhiMm17laPbN6i5%2Bkd7XGdsG2twkvNQ3H3At8ap26ehMUIY0qDIdV0ZXir3pevtLPg%2F7TGxgO6k8G8rUwcnrMlqkuowt6ujko4joYaCOgGmThidDxV71SX0Ea%2FSVxYSFly%2FCmlbmoJYmGe0LqHGh0HGxiLLvZcKIsN3Q6t3xGepBu8p%2BgDxHjiW2l%2FknZfNlGzbvcptXShXDncalG7UkgWWYiauKv88x%2FjNZSJ7lXdRL2LIEzRDoI2Zg0g%2FPZeE95FDJpVjqpVDEwTNUo3%2FXH%2FLFuLnTWyqbpHqEtrmkJNcfRQ%3D%3D';
  return (
    <Image
      src={src || EMPTY_IMAGE}
      alt={data?.title || ''}
      fill
      style={{ objectFit: 'cover' }}
      onError={e => {
        const target = e.target as HTMLImageElement;
        target.src = EMPTY_IMAGE;
      }}
    />
  );
};

const LibraryItem: React.FC<LibraryItemProps> = ({ data, onClick, style }) => {
  const { isMobile, isTablet } = useResponsive();

  // Responsive container styles
  const containerStyle = {
    ...styles.container,
    ...style,
    maxWidth: isMobile ? '100%' : isTablet ? '48%' : '23.5%',
    minWidth: isMobile ? '100%' : isTablet ? '48%' : '23.5%',
    minHeight: isMobile ? 200 : 240,
    borderRadius: isMobile ? 8 : 12,
  };

  // Responsive image styles
  const imageStyle = {
    ...styles.image,
    borderTopLeftRadius: isMobile ? 8 : 12,
    borderTopRightRadius: isMobile ? 8 : 12,
  };

  // Responsive content padding
  const contentPadding = isMobile ? 10 : 12;

  // Responsive title styles
  const titleStyle = {
    ...styles.title,
    fontSize: isMobile ? 14 : 16,
    marginTop: isMobile ? 6 : 8,
    marginBottom: isMobile ? 4 : 6,
    lineHeight: isMobile ? 20 : 22,
    minHeight: isMobile ? 20 : 22,
  };

  // Responsive desc styles
  const descStyle = {
    ...styles.desc,
    fontSize: isMobile ? 12 : 14,
    lineHeight: isMobile ? 18 : 20,
    minHeight: isMobile ? 36 : 40,
  };

  return (
    <Card
      style={containerStyle}
      hoverable
      styles={{
        body: { padding: 0, display: 'flex', flexDirection: 'column' },
      }}>
      <View onClick={onClick} style={{ flex: 1 }}>
        <View style={imageStyle}>
          <Thumbnail data={data} />
        </View>
        <View style={{ padding: contentPadding }}>
          <Text numberOfLines={1} style={titleStyle}>
            {data?.title}
          </Text>
          <Text numberOfLines={2} style={descStyle}>
            {data?.description}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default LibraryItem;
