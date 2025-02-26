import React from 'react';
import { useRouter } from 'next/navigation';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { ArrowLeft } from '@/assets/svg';

type AppHeaderProps = {
  title?: string;
  subTitle?: string;
  middleContainerStyle?: any;
};

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subTitle,
  middleContainerStyle,
}) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer} onClick={router.back}>
        <ArrowLeft />
      </View>
      <View style={[styles.middleContainer, middleContainerStyle]}>
        {title && (
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        )}
        {subTitle && (
          <Text numberOfLines={1} style={styles.subTitle}>
            {subTitle}
          </Text>
        )}
      </View>
      <View style={styles.rightContainer}></View>
    </View>
  );
};

export default AppHeader;
