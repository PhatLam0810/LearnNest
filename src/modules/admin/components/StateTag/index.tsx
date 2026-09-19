'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';

interface StateTagProps {
  label: string;
  color: string;
  bg: string;
}

// Trạng thái luôn có chữ, không truyền đạt chỉ bằng màu (UI-UX.md §10).
const StateTag: React.FC<StateTagProps> = ({ label, color, bg }) => (
  <View style={{ ...styles.tag, backgroundColor: bg }}>
    <Text style={{ ...styles.text, color }}>{label}</Text>
  </View>
);

export default StateTag;
