'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { Modal, Space, TableProps } from 'antd';
import { messageApi, useAppPagination } from '@hooks';
import {
  ContentToolbar,
  FilteredEmptyState,
  ThemedTable,
} from '~mdAdmin/components';
import { adminQuery } from '~mdAdmin/redux';
import { Library } from '~mdDashboard/types';
// Import thẳng, không qua barrel ~mdAdmin/components - modal kéo theo
// AddLibraryContent (tiptap + CSS side-effect).
import CreateLibraryModal from '~mdAdmin/components/CreateLibraryModal';

const LibraryManage = () => {
  const divRef = useRef(null);

  const [height, setHeight] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Library>(null);
  const [isVisibleModalAdd, setIsVisibleModalAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [dataEdit, setDataEdit] = useState<Library | null>(null);
  const [isVisibleModalUpdate, setIsVisibleModalUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { listItem, currentData, refresh, fetchData, search } =
    useAppPagination<Library>({
      apiUrl: 'library/getAllLibrary',
    });

  const [deleteItem] = adminQuery.useDeleteLibraryMutation();

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

  const onDone = () => {
    refresh();
    setIsVisibleModalAdd(false);
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
          setDataEdit(null);
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

      {/* 1 modal cho cả tạo (dataEdit=null) lẫn cập nhật. dataEdit giữ nguyên
          sau khi đóng để tiêu đề không nhảy về "Thêm bài học" lúc đang mờ dần. */}
      <CreateLibraryModal
        isVisible={isVisibleModalAdd || isVisibleModalUpdate}
        onClose={onCloseModalAdd}
        initialValues={dataEdit}
        onCreated={onDone}
        onUpdated={onDone}
      />
    </View>
  );
};

export default LibraryManage;
