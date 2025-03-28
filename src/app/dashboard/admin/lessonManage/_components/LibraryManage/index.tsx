'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import {
  Button,
  Input,
  MenuProps,
  Modal,
  Space,
  Table,
  TableProps,
  Tag,
} from 'antd';
import { messageApi, useAppPagination, useWindowSize } from '@hooks';
import { PlusOutlined } from '@ant-design/icons';
import { AddLibraryContent, ModalBulkData } from '~mdAdmin/components';
import { adminQuery } from '~mdAdmin/redux';
import { Library } from '~mdDashboard/types';
import LibraryDetailItem from '~mdDashboard/pages/SubLessonDetailPage/_components/LibraryDetailItem';
import { UpdateLibraryForm } from '@/app/dashboard/library/_components';

const LibraryManage = () => {
  const divRef = useRef(null);

  const [height, setHeight] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Library>(null);
  const [isVisibleModalAdd, setIsVisibleModalAdd] = useState(false);
  const [isVisibleModalBulk, setIsVisibleModalBulk] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>();
  const [isVisibleModalUpdate, setIsVisibleModalUpdate] = useState(false);

  const [data, setData] = useState<Library>(null);

  const { listItem, currentData, refresh, fetchData, search } =
    useAppPagination<Library>({
      apiUrl: 'library/getAllLibrary',
    });

  const [deleteItem] = adminQuery.useDeleteLibraryMutation();
  const [bulkLibraryFromYoutube, { isLoading: isLoadingBulkYoutube }] =
    adminQuery.useBulkLibraryFromYoutubeMutation();

  const [bulkLibraryFromGoogleDrive, { isLoading: isLoadingBulkGG }] =
    adminQuery.useBulkLibraryFromGoogleDriveMutation();

  const columns: TableProps<Library>['columns'] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
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
      setHeight(divRef.current.offsetHeight);
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

  const { Search } = Input;

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <a onClick={() => setIsVisibleModalAdd(true)}>Add Library</a>,
    },
  ];
  const onDone = () => {
    refresh();
    setIsVisibleModalAdd(false);
    setDataEdit(null);
    setSelectedItem(null);
  };

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
          allowClear
        />
        <Button
          onClick={() => {
            setIsVisibleModalAdd(true);
            setSelectedItem(null);
          }}
          type="primary"
          icon={<PlusOutlined />}
          style={{
            alignSelf: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 8,
          }}>
          <Text style={{ color: '#FFF' }}>Add Library</Text>
        </Button>
      </View>
      <View ref={divRef} style={{ flex: 1 }}>
        <Table
          scroll={{ y: height - 100 }}
          columns={columns}
          dataSource={listItem}
          onChange={res => {
            fetchData({ pageNum: res.current });
          }}
          onRow={record => {
            return {
              onClick: () => {
                setData(record);
              },
            };
          }}
          pagination={{
            current: currentData?.pageNum,
            pageSize: currentData?.pageSize,
            total: currentData?.totalRecords,
          }}
          style={{ cursor: 'pointer' }}
        />
      </View>
      <Modal
        open={isVisibleModalAdd}
        onCancel={onCloseModalAdd}
        onClose={onCloseModalAdd}
        footer={null}
        title="Add Library">
        <AddLibraryContent initialValues={selectedItem} onDone={onDone} />
      </Modal>

      <Modal
        title="Delete Library"
        open={openDelete}
        onCancel={onCloseDelete}
        onClose={onCloseDelete}
        onOk={() => {
          deleteItem({ _id: selectedItem?._id })
            .unwrap()
            .then(res => {
              refresh();
              onCloseDelete();
            });
        }}>
        <Text>{`Delete Library: ${selectedItem?.title}`}</Text>
      </Modal>

      <Modal
        width={'80%'}
        closeIcon={null}
        styles={{
          content: { padding: 0, backgroundColor: 'transparent' },
        }}
        centered
        style={{ aspectRatio: 16 / 9 }}
        footer={null}
        open={!!data}
        onCancel={() => setData(null)}>
        <LibraryDetailItem data={data} />
      </Modal>
      <UpdateLibraryForm
        data={dataEdit}
        isVisible={isVisibleModalUpdate}
        setIsVisible={setIsVisibleModalUpdate}
        refresh={onDone}
        setSelectedItem={onCloseModalAdd}
        setIsVisibleModalAdd={onCloseModalAdd}
      />
    </View>
  );
};

export default LibraryManage;
