'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native-web';
import styles from './styles';
import { Modal, Space, TableProps } from 'antd';
import { messageApi, useAppPagination, useWindowSize } from '@hooks';
import { Module } from '~mdDashboard/redux/saga/type';
import {
  AddModuleContent,
  ContentToolbar,
  FilteredEmptyState,
  ThemedTable,
} from '~mdAdmin/components';
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
  const [searchQuery, setSearchQuery] = useState('');
  const { listItem, currentData, fetchData, refresh, search } =
    useAppPagination<Module>({
      apiUrl: 'lesson/getAllModule',
    });

  const [deleteItem] = adminQuery.useDeleteModuleMutation();
  // "Tổng bài học" phải tính cả bài thực hành gắn vào phần học, không chỉ
  // library video — trước đây chỉ đếm record.libraries.length nên phần học
  // toàn bài thực hành (không có video nào) luôn hiện "0 bài học" dù thực
  // ra đã có nội dung.
  const { data: allTasks } = adminQuery.useGetPracticeTasksAdminQuery();
  const taskCountByModule = React.useMemo(() => {
    const map: Record<string, number> = {};
    (allTasks || []).forEach(t => {
      if (!t.moduleId) return;
      map[t.moduleId] = (map[t.moduleId] || 0) + 1;
    });
    return map;
  }, [allTasks]);
  const columns: TableProps<Module>['columns'] = [
    {
      title: 'Tên phần học',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Tổng bài học',
      dataIndex: 'Library',
      key: 'Library',
      render: (_, record) => (
        <Text style={styles.metaCell}>
          {record.libraries.length + (taskCountByModule[record._id] || 0)} bài
          học
        </Text>
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

  const onDone = () => {
    refresh();
    setSelectedItem(null);
    setIsVisibleModalAdd(false);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    search(value);
  };

  return (
    <View style={styles.container}>
      <ContentToolbar
        searchPlaceholder="Tìm kiếm phần học"
        onSearch={handleSearch}
        addLabel="Tạo phần học"
        onAdd={() => setIsVisibleModalAdd(true)}
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
          style={{ cursor: 'pointer' }}
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
        width={'80%'}
        centered
        destroyOnClose
        title={selectedItem ? selectedItem.title : 'Thêm phần học'}>
        <ScrollView style={{ height: (width * 0.8 * 9) / 16 }}>
          <AddModuleContent onDone={onDone} />
        </ScrollView>
      </Modal>

      <Modal
        title="Xóa phần học"
        open={openDelete}
        onCancel={onCloseDelete}
        onOk={() => {
          deleteItem({ _id: selectedItem?._id })
            .unwrap()
            .then(res => {
              refresh();
              setSelectedItem(null);
              onCloseDelete();
            })
            .catch((e: any) => {
              messageApi.error(e?.data?.message || 'Xóa phần học thất bại');
            });
        }}>
        <Text>{`Xóa phần học: ${selectedItem?.title}`}</Text>
      </Modal>
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
