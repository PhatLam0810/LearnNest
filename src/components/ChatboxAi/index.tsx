'use client';
import { useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '@redux';
import { useRouter } from 'next/navigation';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native-web';

import styles from './styles';

export default function Chatbox() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [lessonInfo, setLessonInfo] = useState<null | {
    _id: string;
    title: string;
    thumbnail?: string;
    price?: number;
    isPremium: boolean;
  }>(null);

  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const router = useRouter();

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { role: 'user', content: message };
    setChat(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/ai/ask`,
        {
          question: message,
          userId: userProfile?._id || null,
        },
      );

      const aiMsg = { role: 'ai', content: res.data.response };
      setChat(prev => [...prev, aiMsg]);

      if (res.data.lessonInfo) {
        setLessonInfo(res.data.lessonInfo);
      } else {
        setLessonInfo(null);
      }
    } catch (err) {
      setChat(prev => [
        ...prev,
        { role: 'ai', content: '⚠️ Lỗi kết nối. Vui lòng thử lại.' },
      ]);
      setLessonInfo(null);
    } finally {
      setMessage('');
      setLoading(false);
    }
  };
  if (!userProfile) return null;
  return (
    <View style={styles.wrapper}>
      {open ? (
        <View style={styles.panel}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>🎓 Trợ lý khóa học</Text>
            <TouchableOpacity>
              <View onClick={() => setOpen(false)}>
                <Text style={styles.closeBtn}>X</Text>
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.chatArea}
            contentContainerStyle={{ gap: 8 }}>
            {chat.map((msg, idx) => (
              <View
                key={idx}
                style={[
                  styles.bubble,
                  msg.role === 'user' ? styles.userBubble : styles.aiBubble,
                ]}>
                {msg.content.split('\n').map((line, i) => (
                  <Text key={i} style={styles.line}>
                    {line}
                  </Text>
                ))}
              </View>
            ))}

            {/* Lesson suggestion */}
            {lessonInfo && (
              <View style={styles.lessonBox}>
                <View style={styles.lessonInfo}>
                  <View style={styles.thumbnailWrapper}>
                    <Image
                      source={{ uri: lessonInfo.thumbnail || '/fallback.jpg' }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.lessonTitle}>{lessonInfo.title}</Text>
                    <Text style={styles.lessonPrice}>
                      {lessonInfo.isPremium
                        ? `${lessonInfo.price} VNĐ`
                        : 'Miễn phí'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity>
                  <View
                    onClick={() =>
                      router.push(`/dashboard/home/lesson/${lessonInfo._id}`)
                    }>
                    <Text style={styles.lessonLink}>👉 Xem bài học</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {loading && (
              <Text style={styles.loadingText}>Đang phản hồi...</Text>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Hỏi AI điều gì đó..."
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity style={styles.sendBtn}>
              <View onClick={sendMessage}>
                <Text style={styles.sendText}>Gửi</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.fab}>
          <View onClick={() => setOpen(true)}>
            <Text style={styles.fabText}>💬 Chat với AI</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
