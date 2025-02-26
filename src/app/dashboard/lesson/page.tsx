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

  const handleEdit = (value: any) => {
    setDataEdit(value);
    setIsVisible(true);
  };

  const { data } = dashboardQuery.useGetAllCategoryQuery();

  const [updateLesson] = adminQuery.useUpdateLessonMutation();

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
            <Text style={styles.title}>Category</Text>
            <Select
              style={{ width: 120 }}
              allowClear
              options={data?.map(item => ({
                label: item.name,
                value: item._id,
              }))}
              placeholder="Category"
              onSelect={data => {
                filter({
                  categories: data.value,
                });
              }}
            />
          </View>

          <View style={{ gap: 2 }}>
            <Text style={styles.title}>Sort By</Text>
            <Select
              style={{ width: 120 }}
              defaultValue={{ label: 'desc', value: 'desc' }}
              options={[
                { label: 'desc', value: 'desc' },
                { label: 'asc', value: 'asc' },
              ]}
              placeholder="Category"
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
        numColumns={4}
        contentContainerStyle={{ gap: 6 }}
        columnWrapperStyle={{ gap: '0.5%' }}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchData}
        renderItem={({ item }) => {
          return (
            <LessonItem
              style={styles.lessonItem}
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
        onUpdateFinish={res => {
          updateLesson({ _id: dataEdit._id, ...res })
            .unwrap()
            .then(res => {
              setIsVisible(false);
              messageApi.success('Update Successfully');
              refresh();
            });
        }}
      />
    </View>
  );
};

export default Page;
