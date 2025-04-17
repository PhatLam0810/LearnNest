import { useAppSelector } from '@redux';
import { realTimeCommentService } from '@services/signalR';
import Search from 'antd/es/input/Search';
import React, { useState, useEffect } from 'react';
import { Image } from 'react-native-web';

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const { userProfile } = useAppSelector(state => state.authReducer.tokenInfo);
  useEffect(() => {
    // Kết nối và lắng nghe sự kiện nhận comment
    realTimeCommentService.onCommentReceived(comment => {
      console.log(comment);
      setComments(prev => [...prev, comment]);
    });

    realTimeCommentService.start();

    // Cleanup
    return () => {
      realTimeCommentService.stop();
    };
  }, []);

  //   const sendComment = (commentText: string) => {
  //     realTimeCommentService.sendComment({
  //       postId: '1244',
  //       commentText,
  //     });
  //   };

  const search = (value: string) => {
    realTimeCommentService.sendComment({
      postId: '1244',
      commentText: value,
      type: 'Lesson',
      userId: userProfile?._id,
    });
  };

  return (
    <div>
      <h2>Comments</h2>
      <Search
        placeholder="Search"
        enterButton="Search"
        allowClear
        size="large"
        onSearch={search}
      />
      <ul>
        {comments.map((comment: any, index) => (
          <li key={comment._id} className="flex items-start gap-3 p-4 border-b">
            <Image
              source={comment.userAvatar}
              style={{ width: 48, height: 48 }}
              resizeMode="contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm">
                  {comment.userFirstName} {comment.userLastName}
                </h4>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm mt-1">{comment.commentText}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
