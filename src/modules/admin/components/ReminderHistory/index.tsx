import React from 'react';
import { Skeleton } from 'antd';
import { View, Text } from 'react-native-web';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { adminQuery } from '~mdAdmin/redux';
import { ReminderLogType } from '~mdAdmin/redux/RTKQuery/type';

dayjs.extend(relativeTime);
dayjs.locale('vi');

type Props = {
  lessonId: string;
  type: ReminderLogType;
  targetId?: string;
};

// Lịch sử vài lần nhắc gần nhất cho đúng 1 nút nhắc (nhắc học đều / nhắc
// video / nhắc bài thực hành) — để admin biết "đã nhắc chưa, lúc nào, bao
// nhiêu người" mà không cần nhớ hoặc bấm lại để xem, vì trước đây kết quả
// chỉ hiện thoáng qua lúc bấm xong rồi mất, không tra lại được.
const ReminderHistory: React.FC<Props> = ({ lessonId, type, targetId }) => {
  const { data, isFetching } = adminQuery.useGetReminderLogsQuery(
    { lessonId, type, targetId },
    { skip: !lessonId },
  );

  if (isFetching) {
    return <Skeleton.Input active size="small" style={{ width: 200 }} />;
  }

  if (!data?.length) {
    return (
      <Text style={{ fontSize: 12, color: '#999' }}>
        Chưa từng nhắc lần nào
      </Text>
    );
  }

  return (
    <View style={{ gap: 2 }}>
      {data.slice(0, 3).map(log => (
        <Text key={log._id} style={{ fontSize: 12, color: '#666' }}>
          Đã nhắc {log.sent}/{log.totalEligible} người ·{' '}
          {dayjs(log.createdAt).fromNow()}
          {log.triggeredByAdminName ? ` · bởi ${log.triggeredByAdminName}` : ''}
          {log.failed ? ` (${log.failed} gửi thất bại)` : ''}
        </Text>
      ))}
    </View>
  );
};

export default ReminderHistory;
