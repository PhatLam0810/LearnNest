import React from 'react';
import { Tag, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { PracticeTask } from '~mdDashboard/types/practice';

type Props = {
  tasks: PracticeTask[];
  onRemove: (taskId: string) => void;
};

// Danh sách bài thực hành ĐÃ CHỌN cho phần học này — chỉ hiển thị + gỡ,
// việc CHỌN diễn ra trong ModalSelectLibrary (chung 1 modal với bài học
// video, tab "Bài thực hành"). Việc lưu thật (gọi PUT .../module) diễn ra
// khi bấm "Lưu phần học" ở AddModuleContent — mirror đúng cách
// selectedLibraries hoạt động, không cần lưu phần học trước mới chọn được.
const PracticeTaskSection: React.FC<Props> = ({ tasks, onRemove }) => {
  if (tasks.length === 0) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <Typography.Title level={5} style={{ margin: '0 0 8px' }}>
        Bài thực hành đã chọn
      </Typography.Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tasks.map(task => (
          <div
            key={task._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              padding: '6px 12px',
            }}>
            <Tag color={task.subject === 'Excel' ? 'green' : 'blue'}>
              {task.subject}
            </Tag>
            <span style={{ flex: 1 }}>{task.title}</span>
            {!task.isPublished && <Tag color="default">Nháp</Tag>}
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onRemove(task._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeTaskSection;
