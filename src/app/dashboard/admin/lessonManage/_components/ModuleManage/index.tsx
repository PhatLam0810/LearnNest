'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native-web';
import styles from './styles';
import { Button, Input, Modal, Space, Table, TableProps, Tag } from 'antd';
import { messageApi, useAppPagination, useWindowSize } from '@hooks';
import { Module } from '~mdDashboard/redux/saga/type';
import { PlusOutlined } from '@ant-design/icons';
import { AddModuleContent, ModalBulkData } from '~mdAdmin/components';
import { adminQuery } from '~mdAdmin/redux';
import api from '@services/api';
import { ModalModuleOverview } from './_components';
import { UpdateModuleForm } from '@/app/dashboard/module/_components';

const ModuleManage = () => {
  const divRef = useRef(null);
  const { width } = useWindowSize();

  const [height, setHeight] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Module>(null);
  const [isVisibleModalAdd, setIsVisibleModalAdd] = useState(false);
  const [isVisibleModalBulk, setIsVisibleModalBulk] = useState(false);
  const [isVisibleModalOverview, setIsVisibleModalOverview] = useState(false);
  const [isVisibleModalUpdate, setIsVisibleModalUpdate] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>();
  const [openDelete, setOpenDelete] = useState(false);
  const [data, setData] = useState<Module>(null);
  const { listItem, currentData, fetchData, refresh, search } =
    useAppPagination<Module>({
      apiUrl: 'lesson/getAllModule',
    });

  const [deleteItem] = adminQuery.useDeleteModuleMutation();
  const columns: TableProps<Module>['columns'] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Total Library',
      dataIndex: 'Library',
      key: 'Library',
      render: (_, record) => (
        <p style={{ margin: 0 }}>Library: {record.libraries.length} </p>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" onClick={e => e.stopPropagation()}>
          <button
            style={styles.button}
            onClick={() => {
              setSelectedItem(record);
              setOpenDelete(true);
            }}>
            <a style={styles.buttonText}> Delete</a>
          </button>
          <button
            style={styles.button}
            onClick={() => {
              setSelectedItem(record);
              setDataEdit(record);
              setIsVisibleModalUpdate(true);
            }}>
            <a style={styles.buttonText}> Update</a>
          </button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (divRef.current) {
      setHeight(divRef.current.offsetHeight * 3);
    }
  }, []);

  const onCloseModalAdd = () => {
    setSelectedItem(null);
    setIsVisibleModalAdd(false);
    setIsVisibleModalUpdate(false);
  };

  const onCloseDelete = () => {
    setOpenDelete(false);
  };

  const onDone = () => {
    refresh();
    setSelectedItem(null);
    setIsVisibleModalAdd(false);
  };

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
        <View style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 8 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsVisibleModalAdd(true)}>
            Add Module
          </Button>
        </View>
      </View>
      <View ref={divRef} style={{ flex: 1 }}>
        <Table
          scroll={{ y: height - 100 }}
          columns={columns}
          dataSource={listItem}
          onChange={res => {
            fetchData({ pageNum: res.current });
          }}
          style={{ cursor: 'pointer' }}
          pagination={{
            current: currentData?.pageNum,
            pageSize: currentData?.pageSize,
            total: currentData?.totalRecords,
          }}
          onRow={record => {
            return {
              onClick: () => {
                setData(record);
                setIsVisibleModalOverview(true);
              },
            };
          }}
        />
      </View>
      <Modal
        open={isVisibleModalAdd}
        onCancel={onCloseModalAdd}
        onClose={onCloseModalAdd}
        footer={null}
        width={'80%'}
        centered
        title={selectedItem ? selectedItem.title : 'Add Module'}>
        <ScrollView style={{ height: (width * 0.8 * 9) / 16 }}>
          <AddModuleContent onDone={onDone} />
        </ScrollView>
      </Modal>

      <Modal
        title="Delete Module"
        open={openDelete}
        onCancel={onCloseDelete}
        onClose={onCloseDelete}
        onOk={() => {
          deleteItem({ _id: selectedItem?._id })
            .unwrap()
            .then(res => {
              refresh();
              setSelectedItem(null);
              onCloseDelete();
            });
        }}>
        <Text>{`Delete Module: ${selectedItem?.title}`}</Text>
      </Modal>
      <ModalBulkData
        title="Bulk Module"
        isVisible={isVisibleModalBulk}
        setIsVisible={setIsVisibleModalBulk}
        onOk={async data => {
          messageApi.loading('Bulk...', 0);
          const apiResponse = await api.post(
            'lesson/BulkModuleWithName',
            data,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            },
          );
          messageApi.destroy();
          if (apiResponse.status === 201) {
            messageApi.success('Bulk Successfully!');
            refresh();
            setIsVisibleModalBulk(false);
            return;
          }
          messageApi.error('Bulk Failed!');
        }}
      />
      <ModalModuleOverview
        data={data}
        isVisible={isVisibleModalOverview}
        setIsVisible={setIsVisibleModalOverview}
      />
      <UpdateModuleForm
        data={dataEdit}
        isVisible={isVisibleModalUpdate}
        setIsVisible={setIsVisibleModalUpdate}
        refresh={refresh}
        setSelectedItem={onCloseModalAdd}
        setIsVisibleModalAdd={onCloseModalAdd}
      />
    </View>
  );
};

export default ModuleManage;
