'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import { Modal, Space, TableProps } from 'antd';
import { messageApi, useAppPagination } from '@hooks';
import { Lesson } from '~mdDashboard/redux/saga/type';
import { adminQuery } from '~mdAdmin/redux';
import {
  ContentToolbar,
  CreateCourseModal,
  FilteredEmptyState,
  ThemedTable,
} from '~mdAdmin/components';
import { ModalLessonOverview } from './_components';

const LessonManage = () => {
  const divRef = useRef(null);

  const [height, setHeight] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Lesson>(null);
  const [isVisibleModalAdd, setIsVisibleModalAdd] = useState(false);
  const [dataEdit, setDataEdit] = useState<Lesson | null>(null);
  const [isVisibleModalUpdate, setIsVisibleModalUpdate] = useState(false);
  const [isVisibleModalOverview, setIsVisibleModalModalOverview] =
    useState(false);
  const [data, setData] = useState<Lesson>();
  const [openDelete, setOpenDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { listItem, currentData, fetchData, refresh, search } =
    useAppPagination<Lesson>({
      apiUrl: 'lesson/getAllLesson',
    });

  const [deleteItem] = adminQuery.useDeleteLessonMutation();

  const columns: TableProps<Lesson>['columns'] = [
    {
      title: 'Tên khóa học',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'instructor',
      key: 'instructor',
      render: (value?: string) => value || '—',
    },
    {
      title: 'Tổng phần học',
      dataIndex: 'Module',
      key: 'Module',
      render: (_, record) => (
        <Text style={styles.metaCell}>Phần học: {record.modules.length}</Text>
      ),
    },
    {
      title: 'Hành động',
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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    search(value);
  };

  return (
    <View style={styles.container}>
      <ContentToolbar
        searchPlaceholder="Tìm kiếm khóa học"
        onSearch={handleSearch}
        addLabel="Thêm khóa học"
        onAdd={() => {
          setDataEdit(null);
          setIsVisibleModalAdd(true);
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
          style={{ cursor: 'pointer' }}
          onRow={record => ({
            onClick: () => {
              setData(record);
              setIsVisibleModalModalOverview(true);
            },
          })}
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

      {/* 1 modal cho cả tạo (dataEdit=null) lẫn cập nhật. dataEdit giữ nguyên
          sau khi đóng để tiêu đề không nhảy về "Thêm khóa học" lúc đang mờ
          dần. */}
      <CreateCourseModal
        isVisible={isVisibleModalAdd || isVisibleModalUpdate}
        onClose={onCloseModalAdd}
        onDone={refresh}
        initialValues={dataEdit}
      />

      <Modal
        title="Xóa khóa học"
        open={openDelete}
        onCancel={onCloseDelete}
        onOk={() => {
          deleteItem({ _id: selectedItem?._id })
            .unwrap()
            .then(() => {
              refresh();
              onCloseDelete();
            })
            .catch((e: any) => {
              messageApi.error(e?.data?.message || 'Xóa khóa học thất bại');
            });
        }}>
        <Text>{`Xóa khóa học: ${selectedItem?.title}`}</Text>
      </Modal>

      <ModalLessonOverview
        data={data}
        isVisible={isVisibleModalOverview}
        setIsVisible={setIsVisibleModalModalOverview}
      />
    </View>
  );
};

export default LessonManage;
