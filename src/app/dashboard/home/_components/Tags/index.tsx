import React from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import Icon from '@components/icons';
// import Star from './a.svg';

type TagsProps = {
  title: string;
  color?: string;
  colorTitle?: string;
  backgroundColor?: string;
};
const Tags: React.FC<TagsProps> = ({
  title,
  color,
  colorTitle,
  backgroundColor,
}) => {
  return (
    <View style={[styles.container, { color, backgroundColor }]}>
      <Icon name="awesome" className="tag-icon" />
      <Text style={[styles.title, { color: colorTitle }]}>{title}</Text>
    </View>
  );
};

export default Tags;
