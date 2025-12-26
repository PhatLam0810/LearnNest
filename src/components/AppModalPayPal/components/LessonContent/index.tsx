import React from 'react';
import { useRouter } from 'next/navigation';
import { FlatList, Text, View } from 'react-native-web';
import styles from './styles';
import { LessonDetailDataResponse } from '~mdDashboard/redux/saga/type';
import { LessonThumbnail } from '~mdDashboard/components';
import { DollarOutlined, CheckOutlined } from '@ant-design/icons';
type LessonContentProps = {
  data: Partial<LessonDetailDataResponse>;
  accessLesson: boolean;
};

const LessonContent: React.FC<LessonContentProps> = ({
  data,
  accessLesson,
}) => {
  return (
    <View>
      <View
        style={{
          width: '100%',
          height: 250,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: 'gray',
        }}>
        {!accessLesson && (
          <View style={styles.premium}>
            <DollarOutlined style={{ color: '#FFF', fontSize: 24 }} />
          </View>
        )}
        <LessonThumbnail thumbnail={data.thumbnail} />
      </View>
      <Text style={styles.priceTitle}>Cost price: {data.price} SUI</Text>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.description}>{data.description}</Text>
      <View style={{ paddingTop: 10, paddingBottom: 10, gap: 10 }}>
        <Text style={styles.whatLearnTitle}>What you’ll learn:</Text>
        <FlatList
          data={data?.learnedSkills.slice(0, 5)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                margin: 5,
                flex: 1,
              }}>
              <CheckOutlined style={{ color: '#ef405c', marginRight: 12 }} />
              <Text style={styles.learnedSkillText}>{item}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default LessonContent;
