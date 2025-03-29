'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { Input, Table, TableProps } from 'antd';
import { useAppPagination } from '@hooks';
import { TransactionItem } from '~mdDashboard/redux/saga/type';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '@redux';
import AppModalSuccess from '@components/AppModalSuccess';
import { authAction } from '~mdAuth/redux';

const TransactionHistory = () => {
  const divRef = useRef(null);
  const dispatch = useAppDispatch();
  const [height, setHeight] = useState(0);
  const { userProfile } = useAppSelector(state => state.authReducer.tokenInfo);
  const [isVisibleModalOverview, setIsVisibleModalModalOverview] =
    useState(false);
  const { listItem, currentData, fetchData, refresh, search } =
    useAppPagination<TransactionItem>({
      apiUrl: '/transaction/getAllTransaction',
      params: {
        userId: userProfile?._id,
      },
    });
  const columns: TableProps<TransactionItem>['columns'] = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (_, record) => (
        <Text style={styles.subTitle}> {record.paymentId} </Text>
      ),
    },
    {
      title: 'Lesson Name',
      key: 'title',
      render: (_, record) => (
        <Text style={styles.subTitle}> {record.title} </Text>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      key: 'Amount',
      render: (_, record) => {
        const amount = (record?.amount || 0).toLocaleString('en-US');
        return (
          <View style={{ display: 'flex', gap: 8 }}>
            <Text style={[styles.subTitle, { color: '#f95f5b' }]}>
              - {amount}$
            </Text>
          </View>
        );
      },
    },
    {
      title: 'Date created',
      key: 'Date created',
      render: (_, record) => (
        <Text style={styles.subTitle}>
          {dayjs(record.createdAt).format('HH:MM DD/MM/YYYY')}
        </Text>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const isSuccess = record?.status === 'success';
        const backgroundColor = isSuccess ? '#6BC49729' : '#EB6F7029';
        const color = isSuccess ? '#47B881' : '#f95f5b';
        return (
          <View style={[styles.status, { backgroundColor: backgroundColor }]}>
            <Text
              style={[styles.subTitle, { color: color, textAlign: 'center' }]}>
              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
            </Text>
          </View>
        );
      },
    },
  ];

  useEffect(() => {
    if (divRef.current) {
      setHeight(divRef.current.offsetHeight);
    }
  }, []);

  const { Search } = Input;
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Search
          placeholder="Input search text"
          onSearch={search}
          style={{ width: '50%' }}
        />
      </View>
      <View ref={divRef} style={{ flex: 1 }}>
        <Table
          scroll={{ y: height - 100 }}
          columns={columns}
          dataSource={listItem}
          onChange={res => {
            fetchData({ pageNum: res.current });
          }}
          pagination={{
            current: currentData?.pageNum,
            pageSize: currentData?.pageSize,
            total: currentData?.totalRecords,
          }}
          style={{ cursor: 'pointer' }}
          onRow={record => {
            return {
              onClick: () => {
                dispatch(
                  authAction.viewDetailTransaction({ id: record.paymentId }),
                );
                setIsVisibleModalModalOverview(true);
              },
            };
          }}
        />
      </View>
      <AppModalSuccess
        isVisibleModalSuccess={isVisibleModalOverview}
        setIsVisibleModalSuccess={setIsVisibleModalModalOverview}
        isDetail={false}
      />
    </View>
  );
};

export default TransactionHistory;
