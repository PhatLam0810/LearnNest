import { messageApi, useAppPagination } from '@hooks';
import { useAppSelector } from '@redux';
import { realTimeCommentService } from '@services/signalR';
import Search from 'antd/es/input/Search';
import React, { useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native-web';
import styles from './styles';
import './styles.css';
import dayjs from 'dayjs';
import Editor from './InputLexical';
import { $getRoot, EditorState } from 'lexical';

type AppCommentProps = {
  postId: string;
};

const AppComment: React.FC<AppCommentProps> = ({ postId }) => {
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};

  const { listItem, setListItem, fetchData, filter, changeParams, refresh } =
    useAppPagination<any>({
      apiUrl: 'comments/getList',
      params: {
        postId: postId,
      },
    });
  const [plainContent, setPlainContent] = useState<string>('');
  realTimeCommentService.onCommentReceived(
    comment => {
      setListItem(prevList => [comment, ...prevList]);
    },
    { clearListener: true },
  );

  const handleCommentChange = (editorState: EditorState) => {
    const children = editorState.toJSON().root.children;

    // If children not have length => wrong default custom note => set back

    const firstLinkNode = children
      .reverse()
      .find((x: any) =>
        x?.children?.some(child => ['link', 'autolink'].includes(child.type)),
      );
    const link: string = (firstLinkNode as any)?.children?.find(x =>
      ['link', 'autolink'].includes(x.type),
    )?.children?.[0]?.text;

    editorState.read(() => {
      setPlainContent($getRoot().getTextContent());
    });
  };

  const handleSendComment = () => {
    const trimmedValue = plainContent.trim();
    if (!trimmedValue) {
      messageApi.error(`Comment can't empty`);
      return;
    }
    realTimeCommentService.sendComment({
      postId: postId,
      commentText: plainContent,
      type: 'Lesson',
      userId: userProfile?._id,
    });
    setPlainContent('');
  };
  const renderItem = ({ item }) => (
    <View key={item._id} style={styles.commentContainer}>
      <Image
        source={{ uri: item.user?.avatar }}
        style={styles.avatar}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {item.user?.firstName} {item.user?.lastName}
          </Text>
          <Text style={styles.time}>{dayjs(item.createdAt).fromNow()}</Text>
        </View>
        <Text style={styles.commentText}>{item.commentText}</Text>
      </View>
    </View>
  );
  return (
    <FlatList
      data={listItem}
      nestedScrollEnabled
      style={{ height: 500 }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={{ backgroundColor: 'white', gap: 8, paddingBottom: 16 }}>
          <Text style={styles.subTitle}>
            {`Total Comments (${listItem.length})`}
          </Text>
          {/* <Search
            placeholder="Enter your comments"
            enterButton="Sent"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            size="large"
            // suffix={suffix}
            onSearch={handleCommentChange}
          /> */}
          <Editor
            onChange={handleCommentChange}
            handleSendComment={handleSendComment}
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

export default AppComment;
