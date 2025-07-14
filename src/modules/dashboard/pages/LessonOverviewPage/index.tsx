'use client';
import React from 'react';
import { Carousel, Col, Flex, Row } from 'antd';
import Icon from '@components/icons';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { LessonItem } from '~mdDashboard/components';
import { useAppDispatch, useAppSelector } from '@redux';
import { useRouter } from 'next/navigation';
import {
  DailySelfCare,
  PopularCategories,
  Tags,
} from '@/app/dashboard/home/_components';
import { ScrollView, View } from 'react-native-web';

const HomeOverview = () => {
  const { data, refetch } = dashboardQuery.useGetLessonRecommendQuery();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};

  const router = useRouter();
  const dispatch = useAppDispatch();

  const onClickLesson = (id: string) => {
    dispatch(dashboardAction.getLessonDetail({ id }));
    router.push('/dashboard/home/lesson');
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: 'red' }}>
      {/* <DailySelfCare /> */}
      <Flex gap={8} align="center" className="title-container">
        <h3 className="title">Today lesson</h3>
        <div className="tag-content tag-yellow">
          <Icon name="awesome" className="tag-icon" />
          <span className="tag-name">For You</span>
        </div>
      </Flex>
      <Row gutter={16}>
        {data?.today && (
          <LessonItem
            data={data?.today}
            refresh={refetch}
            haveMenu={userProfile?.role?.level <= 2}
            onClick={() => onClickLesson(data.today._id)}
          />
        )}
      </Row>
      <Flex gap={8} align="center" className="title-container">
        <h3 className="title">Just added</h3>
        <Tags title="new" color="#0059C7" backgroundColor="#0059C7" />
      </Flex>

      <Row gutter={16}>
        {data?.recommend &&
          data?.recommend.map((item, index) => (
            <Col order={4} span={6} key={index}>
              <LessonItem
                data={item}
                refresh={refetch}
                haveMenu={userProfile?.role?.level <= 2}
                onClick={() => onClickLesson(item._id)}
              />
            </Col>
          ))}
      </Row>
      <h3 className="title">Popular categories</h3>
      <Carousel arrows draggable>
        {data?.popularCategories?.map((item, index) => (
          <PopularCategories key={index} data={item} />
        ))}
      </Carousel>
    </ScrollView>
  );
};

export default HomeOverview;
