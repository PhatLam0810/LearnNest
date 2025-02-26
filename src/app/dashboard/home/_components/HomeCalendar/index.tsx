'use client';
import React, { useEffect } from 'react';
import { Calendar } from 'antd';
import 'antd/dist/reset.css'; // Reset lại CSS antd nếu cần
import styles from './styles';
import { Text, View } from 'react-native-web';
import './styles.css';

const App = () => {
  // Apply styles to all <th> elements
  useEffect(() => {
    const thElements = document.querySelectorAll('th');
    thElements.forEach(th => {
      Object.assign(th.style, styles.monthCell);
    });
  }, []);
  return (
    <View style={styles.calendarContainer}>
      <Calendar
        style={{ backgroundColor: 'transparent' }}
        headerRender={() => <div />}
        fullscreen={false}
        fullCellRender={(date, info) => {
          return (
            <View
              style={[
                styles.dayWrap,
                info.today.format('DD/MM/YYYY') === date.format('DD/MM/YYYY')
                  ? styles.today
                  : {},
              ]}>
              <Text
                style={[
                  styles.dayCell,
                  info.today.format('DD/MM/YYYY') === date.format('DD/MM/YYYY')
                    ? styles.today
                    : {},
                ]}>
                {date.date()}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default App;
