'use client';
import { useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { store } from '@redux';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:9999';

let socketInstance: Socket | null = null;

const getSocket = (): Socket => {
  if (!socketInstance) {
    // Gửi kèm access token lúc connect - CommentGateway giờ yêu cầu xác
    // thực (xem comment.gateway.ts), không chấp nhận kết nối ẩn danh nữa.
    const token = store.getState()?.authReducer?.tokenInfo?.accessToken;
    socketInstance = io(API_BASE_URL, { auth: { token } });
  }
  return socketInstance;
};

// Shared socket.io connection for the whole app — connects once, reused by
// every feature that needs real-time events (upload progress, comments...)
// instead of each component opening its own connection.
export const useSocket = (): Socket => {
  const socketRef = useRef<Socket>(getSocket());
  return socketRef.current;
};
