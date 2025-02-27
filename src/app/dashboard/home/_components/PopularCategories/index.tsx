'use client';
import React from 'react';

import { PopularCategoryData } from './type';
import styles from './styles';
import { Image, Text, View } from 'react-native-web';
import { Card } from 'antd';

type PopularCategoriesProps = {
  data: PopularCategoryData;
  style?: any;
};

const PopularCategories: React.FC<PopularCategoriesProps> = ({
  data,
  style,
}) => {
  return (
    <Card
      hoverable
      styles={{ body: { display: 'flex', height: '100%' } }}
      style={Object.assign({}, styles.container, style)}>
      <Image style={styles.image} />
      <View style={styles.chip}>
        <Text>{data.name}</Text>
      </View>
    </Card>
  );
};

export default PopularCategories;
