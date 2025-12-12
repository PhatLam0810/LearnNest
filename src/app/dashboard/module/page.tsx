'use client';
import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native-web';
import styles from './styles';
import { useAppPagination } from '@hooks';
import { ModuleItem, UpdateModuleForm } from './_components';
import { Module } from '~mdDashboard/redux/saga/type';
import Search from 'antd/es/input/Search';
import { Select } from 'antd';
// import './styles.css';

const ModuleList = () => {
  const { listItem, fetchData, refresh, search, changeParams } =
    useAppPagination<Module>({
      apiUrl: 'lesson/getAllModule',
    });
  const [isVisible, setIsVisible] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>();

  const handleEdit = (value: any) => {
    setDataEdit(value);
    setIsVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text aria-level={1} style={[styles.title, { marginBottom: 4 }]}>
        Modules
      </Text>
      <View style={{ gap: 8, marginBottom: 20 }}>
        <Search
          placeholder="Search"
          enterButton="Search"
          allowClear
          size="large"
          // suffix={suffix}
          aria-label="Search modules"
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
              aria-label="Sort modules"
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
          <ModuleItem
            data={item}
            key={item._id + index}
            title={item.title}
            id={item._id}
            haveMenu={true}
            refresh={refresh}
            description={item.description}
            durations={item.durations}
            subLessonsData={item.subLessons}
            subLessons={item.subLessons.length}
            onEditClick={value => handleEdit(value)}
          />
        )}
      />
      <UpdateModuleForm
        data={dataEdit}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        refresh={refresh}
      />
    </View>
  );
};

export default ModuleList;
