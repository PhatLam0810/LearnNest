'use client';
import React, { use, useEffect, useState } from 'react';
import { LibraryItem, ModuleItem, SubLessonItem } from '../_components';
import { FlatList, Image, Modal, Text, View } from 'react-native-web';
import { useAppPagination } from '@hooks';
import ReactPlayer from 'react-player';
import { Document, Page } from 'react-pdf';
import Search from 'antd/es/input/Search';
import { Select } from 'antd';
import { Library } from '~mdDashboard/types';
import styles from './styles';
import { useSearchParams } from 'next/navigation';
import { LessonItem } from '~mdDashboard/components';
import './styles.css';

const LibraryList = ({ params }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const collection = searchParams.get('collection');
  const { listItem, fetchData, search, changeParams, refresh } =
    useAppPagination<any>({
      apiUrl: '/lesson/libraryType/getListFromLibraryType',
      params: { other: { id } },
    });

  useEffect(() => {
    changeParams({ pageNum: 1, other: { id } });
  }, [id]);

  const [selectedItem, setSelectedItem] = useState<Library>();
  const [isVisibleModalVideo, setIsVisibleModalVideo] = useState(false);

  const renderModalContent = () => {
    if (!selectedItem) return null;
    switch (selectedItem.type) {
      case 'Youtube':
      case 'Video':
        return (
          <View style={styles.youtubeWrap}>
            <ReactPlayer
              url={selectedItem?.url}
              controls
              playing={isVisibleModalVideo}
              width="100%"
              height="100%"
            />
          </View>
        );
      case 'Short':
        return (
          <View style={styles.shortWrap}>
            <ReactPlayer
              url={selectedItem?.url}
              controls
              playing={isVisibleModalVideo}
              width="100%"
              height="100%"
            />
          </View>
        );
      case 'PDF':
        return (
          <Document file={selectedItem?.url} onLoadError={console.log}>
            <Page pageNumber={1} scale={0.99} />
          </Document>
        );
      case 'Image':
        return (
          <Image
            source={selectedItem.url}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ gap: 8, marginBottom: 20 }}>
        <Search
          placeholder="Search"
          enterButton="Search"
          allowClear
          size="large"
          // suffix={suffix}
          onSearch={search}
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
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
        key={collection}
        data={listItem}
        stickyHeaderHiddenOnScroll
        keyExtractor={(item, index) => item._id + index}
        numColumns={5}
        contentContainerStyle={{ gap: 6 }}
        columnWrapperStyle={{ gap: '0.5%' }}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchData}
        renderItem={({ item, index }) => {
          if (collection === 'lesson') {
            return <LessonItem key={item._id} data={item} onClick={() => {}} />;
          }
          if (collection === 'module') {
            return <ModuleItem key={item._id} data={item} />;
          }
          if (collection === 'subLesson') {
            return <SubLessonItem key={item._id} data={item} />;
          }
          return (
            <LibraryItem
              key={item._id}
              data={item}
              onClick={() => {
                setSelectedItem(item);
                setIsVisibleModalVideo(true);
              }}
            />
          );
        }}
      />
      <Modal
        visible={isVisibleModalVideo}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisibleModalVideo(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#00000080',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => setIsVisibleModalVideo(false)}>
          <View
            style={{
              width: '80%',
              height: '80%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={e => {
              e.stopPropagation();
            }}>
            {renderModalContent()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LibraryList;
