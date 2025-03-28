'use client';
import { messageApi, useAppPagination } from '@hooks';
import { FlatList, Text, View } from 'react-native-web';
import { LessonItem } from '~mdDashboard/components';
import styles from './styles';
import './styles.css';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { useAppDispatch, useAppSelector } from '@redux';
import { useRouter } from 'next/navigation';
import Search from 'antd/es/input/Search';
import { Select } from 'antd';
import { UpdateLessonForm } from './_components';
import { useState } from 'react';
import { adminQuery } from '~mdAdmin/redux';

const Page = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};

  const { listItem, fetchData, search, filter, changeParams, refresh } =
    useAppPagination<any>({
      apiUrl: 'lesson/getAllLesson',
    });
  const [isVisible, setIsVisible] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>();

  const { data } = dashboardQuery.useGetAllCategoryQuery();

  return (
    <View style={styles.container}>
      <View style={{ gap: 8, marginBottom: 20 }}>
        <Search
          placeholder="Search"
          enterButton="Search"
          allowClear
          size="large"
          onSearch={search}
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ gap: 2 }}>
            <Text style={styles.title}>Sort By</Text>
            <Select
              style={{ width: 120 }}
              defaultValue={{ label: 'desc', value: 'desc' }}
              options={[
                { label: 'Desc', value: 'desc' },
                { label: 'Asc', value: 'asc' },
              ]}
              placeholder="Sort"
              onSelect={data => {
                changeParams({ sortBy: data });
              }}
            />
          </View>
        </View>
      </View>
      <FlatList
        data={listItem}
        stickyHeaderHiddenOnScroll={true}
        keyExtractor={(item, index) => item._id + index}
        numColumns={5}
        contentContainerStyle={{ gap: 6 }}
        columnWrapperStyle={{ gap: '0.5%' }}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchData}
        renderItem={({ item }) => {
          return (
            <LessonItem
              key={item._id}
              data={item}
              onClick={() => {
                dispatch(dashboardAction.getLessonDetail({ id: item._id }));
                router.push('home/lesson');
              }}
            />
          );
        }}
      />
      <UpdateLessonForm
        data={dataEdit}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
    </View>
  );
};

export default Page;
