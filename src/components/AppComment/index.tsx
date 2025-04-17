import { messageApi, useAppPagination } from '@hooks';
import { useAppSelector } from '@redux';
import { realTimeCommentService } from '@services/signalR';
import Search from 'antd/es/input/Search';
import React, { useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native-web';
import styles from './styles';
import './styles.css';

const CommentSection = () => {
  const { userProfile } = useAppSelector(state => state.authReducer.tokenInfo);

  const { listItem, setListItem, fetchData, filter, changeParams, refresh } =
    useAppPagination<any>({
      apiUrl: 'comments/getList',
      params: {
        postId: '1244',
      },
    });
  const [commentText, setCommentText] = useState('');

  realTimeCommentService.onCommentReceived(
    comment => {
      console.log(comment);
      setListItem(prevList => [comment, ...prevList]);
    },
    { clearListener: true },
  );

  const handleCommentChange = (value: string) => {
    const trimmedValue = value.trim(); // Loại bỏ khoảng trắng đầu/cuối

    if (!trimmedValue) {
      messageApi.error(`Comment can't empty`);
      return;
    } // Nếu rỗng sau khi trim thì không làm gì cả

    realTimeCommentService.sendComment({
      postId: '1244',
      commentText: value,
      type: 'Lesson',
      userId: userProfile?._id,
    });
    setCommentText('');
  };
  const renderItem = ({ item }) => (
    <View
      key={item._id}
      style={{
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#ddd',
      }}>
      <Image
        source={{ uri: item.userAvatar }}
        style={{ width: 48, height: 48, borderRadius: 24 }}
        resizeMode="contain"
      />
      <View style={{ marginLeft: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontWeight: '600', fontSize: 14 }}>
            {item.userFirstName} {item.userLastName}
          </Text>
          <Text style={{ fontSize: 12, color: 'gray', marginLeft: 8 }}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
        <Text style={{ marginTop: 8, fontSize: 14 }}>{item.commentText}</Text>
      </View>
    </View>
  );
  return (
    <FlatList
      data={listItem}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={{ backgroundColor: 'white', gap: 8, paddingBottom: 16 }}>
          <Text style={styles.subTitle}>
            {`Total Comments (${listItem.length})`}
          </Text>
          <Search
            placeholder="Enter your comments"
            enterButton="Sent"
            allowClear
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            size="large"
            // suffix={suffix}
            onSearch={handleCommentChange}
          />
        </View>
      }
      stickyHeaderIndices={[0]}
      onEndReached={fetchData}
      renderItem={renderItem}
      keyExtractor={item => item._id.toString()} // Nếu _id là số hoặc chuỗi, cần chuyển sang kiểu string
    />
  );
};

export default CommentSection;
