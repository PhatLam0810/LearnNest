'use client';
import React from 'react';
import { Card, Collapse, CollapseProps } from 'antd';
import './styles.css';
import styles from './styles';
import { View } from 'react-native-web';
import { Module } from '~mdDashboard/redux/saga/type';
import Icon from '@components/icons';
import { SelectedSubLessonPayload } from '~mdDashboard/redux/slice/types';

type LessonModuleProps = {
  modules: Module[];
  onClick: (data: SelectedSubLessonPayload) => void;
  subLessonSelected?: SelectedSubLessonPayload;
};

const LessonModule: React.FC<LessonModuleProps> = ({
  modules,
  onClick,
  subLessonSelected,
}) => {
  return (
    <View>
      {modules.map((item, index) => {
        const items: CollapseProps['items'] = [
          {
            key: index,
            label: <span style={styles.lessonItemTitle}>{item.title}</span>,
            children: (
              <div>
                {item?.subLessons?.map(subItem => (
                  <Card
                    variant="outlined"
                    hoverable
                    className="lesson-item"
                    key={subItem._id}
                    onClick={() =>
                      onClick({
                        moduleId: item._id,
                        subLesson: subItem,
                      })
                    }
                    style={
                      subLessonSelected?.moduleId === item._id &&
                      subLessonSelected?.subLesson._id === subItem._id
                        ? { backgroundColor: '#ef405c' }
                        : {}
                    }>
                    <div className="lesson-item-container">
                      <div className="lesson-item-header">
                        <Icon name="video" color={'#000000e0'} />
                        <span style={styles.lessonItemSubTitle}>
                          {subItem.title}
                        </span>
                      </div>
                      <span style={{ color: '#8D8D8D' }}>5 minutes</span>
                    </div>
                  </Card>
                ))}
              </div>
            ),
          },
        ];
        return <Collapse items={items} defaultActiveKey={['0']} key={index} />;
      })}
    </View>
  );
};

export default LessonModule;
