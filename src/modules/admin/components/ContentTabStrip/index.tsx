'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';

export interface ContentTab {
  key: string;
  label: string;
}

interface ContentTabStripProps {
  tabs: ContentTab[];
  activeKey: string;
  onChange: (key: string) => void;
}

const ContentTabStrip: React.FC<ContentTabStripProps> = ({
  tabs,
  activeKey,
  onChange,
}) => (
  <View style={styles.strip}>
    {tabs.map(tab => {
      const active = tab.key === activeKey;
      return (
        <View
          key={tab.key}
          onClick={() => onChange(tab.key)}
          style={[styles.tab, active && styles.tabActive]}>
          <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
            {tab.label}
          </Text>
        </View>
      );
    })}
  </View>
);

export default ContentTabStrip;
