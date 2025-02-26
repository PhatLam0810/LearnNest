'use client';
import React from 'react';

import { PopularCategoryData } from './type';
import styles from './styles';
import { Image, Text, View } from 'react-native-web';
import { Card } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';

type PopularCategoriesProps = {
  data: PopularCategoryData;
};

const PopularCategories: React.FC<PopularCategoriesProps> = ({ data }) => {
  return (
    <Card>
      <View style={styles.container}>
        <Image style={styles.image} />
        <View style={{ flex: 1, paddingRight: 20 }}>
          <Text style={styles.chip}>{data.name}</Text>
          <Text style={styles.desc}>{data.name}</Text>
        </View>

        <DoubleRightOutlined style={styles.icon} />
      </View>
    </Card>
  );
};

export default PopularCategories;
