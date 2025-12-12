'use client';
import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native-web';
import styles from './styles';
import { useAppPagination } from '@hooks';
import { Sublesson } from '~mdDashboard/redux/saga/type';
import { SubLessonItem } from './_components';
import Search from 'antd/es/input/Search';
import { Select } from 'antd';
import { UpdateLessonForm } from '../lesson/_components';
import UpdateSubLessonForm from './_components/UpdateSubLessonForm';

const SubLessonList = () => {
  const { listItem, fetchData, refresh, search, changeParams } =
    useAppPagination<Sublesson>({
      apiUrl: 'lesson/getAllSubLesson',
    });

  const [isVisible, setIsVisible] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>();

  const handleEdit = (value: any) => {
    setDataEdit(value);
    setIsVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text
        accessibilityRole="header"
        aria-level={1}
        style={[styles.title, { marginBottom: 4 }]}>
        Sub-lessons
      </Text>
      <View style={{ gap: 8, marginBottom: 20 }}>
        <Search
          placeholder="Search"
          enterButton="Search"
          allowClear
          size="large"
          // suffix={suffix}
          aria-label="Search sub-lessons"
          onSearch={search}
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ gap: 2 }}>
            <Text style={styles.title}>Sort By</Text>
            <Select
              style={{ width: 120 }}
              defaultValue="desc"
              options={[
                { label: 'desc', value: 'desc' },
                { label: 'asc', value: 'asc' },
              ]}
              placeholder="Category"
              aria-label="Sort sub-lessons"
              onSelect={data => {
                changeParams({ sortBy: data });
              }}
            />
          </View>
        </View>
      </View>
      <FlatList
        data={listItem}
        stickyHeaderHiddenOnScroll
        keyExtractor={(item, index) => item._id + index}
        numColumns={4}
        contentContainerStyle={{ gap: 6 }}
        columnWrapperStyle={{ gap: '0.5%' }}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchData}
        renderItem={({ item, index }) => (
          <SubLessonItem
            key={item._id + index}
            title={item.title}
            id={item._id}
            refresh={refresh}
            haveMenu={true}
            description={item.description}
            durations={item.durations}
            libraries={item.libraries.length}
            librariesData={item.libraries}
            onEditClick={handleEdit}
          />
        )}
      />

      <UpdateSubLessonForm
        data={dataEdit}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        refresh={refresh}
      />
    </View>
  );
};

export default SubLessonList;
