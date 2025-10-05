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
import { authAction, authQuery } from '~mdAuth/redux';
import { useResponsive } from '@/styles/responsive'; // 🟢 thêm

const TransactionHistory = () => {
  const divRef = useRef(null);
  const dispatch = useAppDispatch();
  const [height, setHeight] = useState(0);
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const [getTransactions, { data, error, isSuccess }] =
    authQuery.useGetTransactionDetailMutation();
  const [isVisibleModalOverview, setIsVisibleModalModalOverview] =
    useState(false);
  const { listItem, currentData, fetchData, refresh, search } =
    useAppPagination<TransactionItem>({
      apiUrl: '/transaction/getAllTransaction',
      params: { userId: userProfile?._id },
    });

  const { isMobile, isTablet } = useResponsive(); // 🟢 thêm

  const columns: TableProps<TransactionItem>['columns'] = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (_, record) => (
        <Text style={styles.subTitle}> {record.paymentId} </Text>
      ),
      width: isMobile ? 150 : 200,
    },
    {
      title: 'Lesson Name',
      key: 'title',
      render: (_, record) => (
        <Text style={styles.subTitle}> {record.title} </Text>
      ),
      width: isMobile ? 150 : 200,
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
      width: isMobile ? 100 : 150,
    },
    {
      title: 'Date created',
      key: 'Date created',
      render: (_, record) => (
        <Text style={styles.subTitle}>
          {dayjs(record.createdAt).format('HH:mm DD/MM/YYYY')}
        </Text>
      ),
      width: isMobile ? 150 : 200,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const isSuccess = record?.status === 'success';
        const backgroundColor = isSuccess ? '#6BC49729' : '#EB6F7029';
        const color = isSuccess ? '#47B881' : '#f95f5b';
        return (
          <View style={[styles.status, { backgroundColor }]}>
            <Text style={[styles.subTitle, { color, textAlign: 'center' }]}>
              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
            </Text>
          </View>
        );
      },
      width: isMobile ? 100 : 120,
    },
  ];

  useEffect(() => {
    if (divRef.current) setHeight(divRef.current.offsetHeight);
  }, []);

  const { Search } = Input;

  return (
    <View
      style={
        isMobile
          ? styles.containerMobile
          : isTablet
            ? styles.containerTablet
            : styles.containerDesktop
      }>
      <View style={styles.header}>
        <Search
          placeholder="Search transactions"
          onSearch={search}
          style={{
            width: isMobile ? '100%' : isTablet ? '70%' : '50%',
          }}
        />
      </View>

      <View ref={divRef} style={styles.tableContainer}>
        <Table
          scroll={{ x: isMobile ? 600 : undefined, y: height - 100 }}
          columns={columns}
          dataSource={listItem}
          pagination={{
            current: currentData?.pageNum,
            pageSize: currentData?.pageSize,
            total: currentData?.totalRecords,
            position: ['bottomCenter'],
          }}
          style={{ cursor: 'pointer' }}
          onRow={record => ({
            onClick: async () => {
              dispatch(authAction.setIsShowLoading(true));
              const res = await getTransactions({ id: record.paymentId });
              if (res) {
                setIsVisibleModalModalOverview(true);
                dispatch(authAction.setIsShowLoading(false));
                dispatch(authAction.lessonPurchaseData(res.data.data));
              }
            },
          })}
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
