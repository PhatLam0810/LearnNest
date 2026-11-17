'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { Collapse } from 'antd';

// Khung "Hướng dẫn từng bước" đặt đầu mỗi chức năng admin. Mặc định thu gọn
// để không chiếm chỗ; bấm vào tiêu đề để mở.
const AdminGuide: React.FC<{
  title: string;
  steps: string[];
  note?: string;
}> = ({ title, steps, note }) => (
  <Collapse
    size="small"
    style={{ marginBottom: 12 }}
    items={[
      {
        key: 'guide',
        label: `Hướng dẫn: ${title}`,
        children: (
          <View style={{ gap: 6 }}>
            {steps.map((s, i) => (
              <Text key={i}>{`${i + 1}. ${s}`}</Text>
            ))}
            {note ? <Text>{`Lưu ý: ${note}`}</Text> : null}
          </View>
        ),
      },
    ]}
  />
);

export default AdminGuide;
