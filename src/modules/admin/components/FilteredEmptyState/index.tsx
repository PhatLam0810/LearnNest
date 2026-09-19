'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';

interface FilteredEmptyStateProps {
  query: string;
  onClear: () => void;
}

const FilteredEmptyState: React.FC<FilteredEmptyStateProps> = ({
  query,
  onClear,
}) => (
  <View style={styles.wrap}>
    <Text style={styles.text}>{`Không tìm thấy kết quả cho "${query}"`}</Text>
    <Text style={styles.clear} onPress={onClear}>
      Xóa bộ lọc
    </Text>
  </View>
);

export default FilteredEmptyState;
