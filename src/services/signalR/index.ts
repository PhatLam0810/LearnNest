// services/realTimeCommentService.ts
import { io, Socket } from 'socket.io-client';

class RealTimeCommentService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://127.0.0.1:9999'); // thay bằng URL BE của bạn
  }

  // Lắng nghe sự kiện nhận comment
  onCommentReceived(
    callback: (comment: any) => void,
    config: { clearListener?: boolean } = {},
  ) {
    const { clearListener } = config;

    if (clearListener) {
      this.socket?.off('ReceiveComment');
    }

    this.socket.on('ReceiveComment', callback);
  }

  // Gửi comment đến server
  sendComment(commentData: {
    postId: string;
    commentText: string;
    userId: string;
    type: string;
  }) {
    this.socket.emit('sendcomment', commentData);
  }

  // Khởi động kết nối
  start() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  // Ngắt kết nối
  stop() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }
}

export const realTimeCommentService = new RealTimeCommentService();
