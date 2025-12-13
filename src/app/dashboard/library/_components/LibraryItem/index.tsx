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

  return (
    <Image
      src={src}
      onError={handleImageError}
      layout="fill"
      objectFit="cover"
      alt={data?.title || ''}
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
