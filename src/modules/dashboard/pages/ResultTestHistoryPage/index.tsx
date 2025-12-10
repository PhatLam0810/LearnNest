import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native-web';
import { Input, Table, TableProps } from 'antd';
import dayjs from 'dayjs';
import { useAppPagination } from '@hooks';
import { useAppDispatch } from '@redux';
import AppModalSuccess from '@components/AppModalSuccess';
import { useSearchParams } from 'next/navigation';
import styles from './styles';
import { AppHeader } from '@components';
import { adminQuery } from '~mdAdmin/redux';
interface ResultItem {
  _id: string;
  name: string;
  userName: string;
  correctCount: number;
  totalQuestions: number;
  score: number;
  isPass: boolean;
  userId: string;
  libraryId: string;
  createdAt: string;
}

const ResultTestHistoryPage = () => {
  const divRef = useRef(null);
  const dispatch = useAppDispatch();
  const [height, setHeight] = useState(0);
  const searchParams = useSearchParams();
  const libraryId = searchParams.get('libraryId');
  // 🔥 FETCH API bằng hook chung của bạn
  const { listItem, currentData, fetchData, search } =
    useAppPagination<ResultItem>({
      apiUrl: `lesson/library/resultTest/${libraryId}`,
      params: {},
    });

  const columns: TableProps<ResultItem>['columns'] = [
    {
      title: 'User Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, r) => <Text style={{ fontSize: 14 }}>{r.userName}</Text>,
    },
    {
      title: 'Correct Answers',
      dataIndex: 'correctCount',
      key: 'correctCount',
      render: (_, r) => (
        <Text>
          {r.correctCount} / {r.totalQuestions}
        </Text>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (_, r) => (
        <Text style={{ color: r.isPass ? '#47B881' : '#f95f5b' }}>
          {r.score}
        </Text>
      ),
    },
    {
      title: 'Result',
      key: 'result',
      render: (_, r) => (
        <Text style={{ color: r.isPass ? '#47B881' : '#f95f5b' }}>
          {r.isPass ? 'Pass' : 'Fail'}
        </Text>
      ),
    },
    {
      title: 'Date Started',
      key: 'createdAt',
      render: (_, r) => (
        <Text>{dayjs(r.createdAt).format('HH:mm DD/MM/YYYY')}</Text>
      ),
    },
  ];

  useEffect(() => {
    if (divRef.current) setHeight(divRef.current.offsetHeight * 3);
  }, []);

  const { Search } = Input;

  return (
    <View style={styles.container}>
      <AppHeader title={'fasfasf'} subTitle={'fasfsa'} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}>
        <Search
          placeholder="Search by user name"
          onSearch={search}
          style={{ width: '50%' }}
        />
      </View>

      <View ref={divRef} style={{ flex: 1 }}>
        <Table
          scroll={{ y: height - 100 }}
          columns={columns}
          dataSource={listItem}
          rowKey="_id"
          pagination={{
            current: currentData?.pageNum,
            pageSize: currentData?.pageSize,
            total: currentData?.totalRecords,
          }}
          style={{ cursor: 'pointer' }}
          onChange={pagination => {
            fetchData({ pageNum: pagination.current });
          }}
        />
      </View>
    </View>
  );
};

export default ResultTestHistoryPage;
