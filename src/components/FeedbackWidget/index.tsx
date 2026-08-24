'use client';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native-web';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@redux';
import FeedbackFormModal from './FeedbackFormModal';
import styles from './styles';

const FeedbackWidget: React.FC = () => {
  const pathname = usePathname();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const [open, setOpen] = useState(false);

  // Only show once inside the logged-in app area — layout.tsx mounts this
  // globally (including the public /login, /signup, /forgotPassword pages),
  // so a route check is needed alongside the auth check.
  const isInsideApp = pathname?.startsWith('/dashboard');
  if (!userProfile || !isInsideApp) return null;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.fab}>
        <View onClick={() => setOpen(true)}>
          <Text style={styles.fabText}>💬 Gửi phản hồi</Text>
        </View>
      </TouchableOpacity>

      <FeedbackFormModal open={open} onOpenChange={setOpen} />
    </View>
  );
};

export default FeedbackWidget;
