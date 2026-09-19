'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { MenuProps, Modal, Space, TableProps } from 'antd';
import { messageApi, useAppPagination, useWindowSize } from '@hooks';
import {
  AddLibraryContent,
  ContentToolbar,
  FilteredEmptyState,
  ThemedTable,
} from '~mdAdmin/components';
import { adminQuery } from '~mdAdmin/redux';
import { Library } from '~mdDashboard/types';
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
  const [searchQuery, setSearchQuery] = useState('');

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
      width: 260,
      render: (_, record) => (
        <Space size={10} onClick={e => e.stopPropagation()}>
          <button
            style={styles.actionButton}
            onClick={() => {
              setSelectedItem(record);
              setOpenDelete(true);
            }}>
            <Text style={styles.actionButtonText}>Xóa</Text>
          </button>
          <button
            style={styles.actionButton}
            onClick={() => {
              setSelectedItem(record);
              setDataEdit(record);
              setIsVisibleModalUpdate(true);
            }}>
            <Text style={styles.actionButtonText}>Cập nhật</Text>
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

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <a onClick={() => setIsVisibleModalAdd(true)}>Thêm bài học</a>,
    },
  ];
  const onDone = () => {
    refresh();
    setIsVisibleModalAdd(false);
    setDataEdit(null);
    setSelectedItem(null);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    search(value);
  };

  return (
    <View style={styles.container}>
      <ContentToolbar
        searchPlaceholder="Tìm kiếm bài học"
        onSearch={handleSearch}
        addLabel="Thêm bài học"
        onAdd={() => {
          setIsVisibleModalAdd(true);
          setSelectedItem(null);
        }}
      />
      <View ref={divRef} style={{ flex: 1 }}>
        <ThemedTable
          rowKey="_id"
          scroll={{ y: height - 100 }}
          columns={columns}
          dataSource={listItem}
          onChange={res => {
            fetchData({ pageNum: res.current, replace: true });
          }}
          pagination={{
            current: currentData?.pageNum,
            pageSize: currentData?.pageSize,
            total: currentData?.totalRecords,
            showSizeChanger: false,
          }}
          locale={{
            emptyText: searchQuery ? (
              <FilteredEmptyState
                query={searchQuery}
                onClear={() => handleSearch('')}
              />
            ) : undefined,
          }}
        />
      </View>
      <Modal
        open={isVisibleModalAdd}
        onCancel={onCloseModalAdd}
        footer={null}
        title="Thêm bài học">
        <AddLibraryContent initialValues={selectedItem} onDone={onDone} />
      </Modal>

      <Modal
        title="Xóa bài học "
        open={openDelete}
        onCancel={onCloseDelete}
        onOk={() => {
          deleteItem({ _id: selectedItem?._id })
            .unwrap()
            .then(res => {
              refresh();
              onCloseDelete();
            })
            .catch((e: any) => {
              messageApi.error(e?.data?.message || 'Xóa bài học thất bại');
            });
        }}>
        <Text>{`Xóa bài học: ${selectedItem?.title}`}</Text>
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
