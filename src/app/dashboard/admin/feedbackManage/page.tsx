'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Table, TableProps, Modal, Image, Space } from 'antd';
import dayjs from 'dayjs';
import { useAppPagination } from '@hooks';
import { FeedbackItem } from '~mdDashboard/types';
import styles from './styles';

const FeedbackManage: React.FC = () => {
  const { listItem, currentData, fetchData } = useAppPagination<FeedbackItem>({
    apiUrl: 'feedback/getAllFeedback',
  });
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(
    null,
  );

  const columns: TableProps<FeedbackItem>['columns'] = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      render: (value: string) => (
        <Text style={{ maxWidth: 320 }} numberOfLines={2}>
          {value}
        </Text>
      ),
    },
    {
      title: 'Ảnh đính kèm',
      dataIndex: 'images',
      key: 'images',
      render: (images: string[]) => <Text>{images?.length || 0} ảnh</Text>,
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => (
        <Text>{dayjs(value).format('DD/MM/YYYY HH:mm')}</Text>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}>
        <h1 style={{ margin: 0 }}>Phản hồi người dùng</h1>
      </View>

      <Table
        columns={columns}
        dataSource={listItem}
        rowKey={record => record._id}
        scroll={{ x: 'max-content' }}
        onRow={record => ({
          onClick: () => setSelectedFeedback(record),
          style: { cursor: 'pointer' },
        })}
        onChange={res => {
          fetchData({ pageNum: res.current });
        }}
        pagination={{
          current: currentData?.pageNum,
          pageSize: currentData?.pageSize,
          total: currentData?.totalRecords,
        }}
      />

      <Modal
        title="Chi tiết phản hồi"
        open={!!selectedFeedback}
        onCancel={() => setSelectedFeedback(null)}
        footer={null}
        width={600}>
        {selectedFeedback && (
          <View style={{ gap: 12 }}>
            <Text>
              <b>Họ và tên:</b> {selectedFeedback.fullName}
            </Text>
            <Text>
              <b>Email:</b> {selectedFeedback.email}
            </Text>
            <Text>
              <b>Ngày gửi:</b>{' '}
              {dayjs(selectedFeedback.createdAt).format('DD/MM/YYYY HH:mm')}
            </Text>
            <Text style={{ whiteSpace: 'pre-wrap' }}>
              <b>Nội dung:</b> {selectedFeedback.content}
            </Text>
            {selectedFeedback.images?.length > 0 && (
              <Space wrap>
                {selectedFeedback.images.map((url, idx) => (
                  <Image
                    key={idx}
                    src={url}
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                ))}
              </Space>
            )}
          </View>
        )}
      </Modal>
    </View>
  );
};

export default FeedbackManage;
