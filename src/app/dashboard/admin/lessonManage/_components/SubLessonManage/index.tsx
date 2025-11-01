'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native-web';
import styles from './styles';
import { Button, Input, Modal, Space, Table, TableProps, Tag } from 'antd';
import { messageApi, useAppPagination, useWindowSize } from '@hooks';
import { Sublesson } from '~mdDashboard/redux/saga/type';
import { PlusOutlined } from '@ant-design/icons';
import { AddSubLessonContent, ModalBulkData } from '~mdAdmin/components';
import { adminQuery } from '~mdAdmin/redux';
import api from '@services/api';
import LibraryDetailItem from '~mdDashboard/pages/SubLessonDetailPage/_components/LibraryDetailItem';
import UpdateSubLessonForm from '@/app/dashboard/subLesson/_components/UpdateSubLessonForm';

const SubLessonManage = () => {
  const divRef = useRef(null);

  const [height, setHeight] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Sublesson>(null);
  const [isVisibleModalAdd, setIsVisibleModalAdd] = useState(false);
  const [isVisibleModalUpdate, setIsVisibleModalUpdate] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>();
  const [isVisibleModalBulk, setIsVisibleModalBulk] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [data, setData] = useState<Sublesson>(null);

  const { listItem, currentData, fetchData, refresh, search } =
    useAppPagination<Sublesson>({
      apiUrl: 'lesson/getAllSubLesson',
    });

  const [deleteItem] = adminQuery.useDeleteSubLessonMutation();

  const columns: TableProps<Sublesson>['columns'] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" onClick={e => e.stopPropagation()}>
          <a
            onClick={() => {
              setSelectedItem(record);
              setOpenDelete(true);
            }}>
            Delete
          </a>
          <a
            onClick={() => {
              setSelectedItem(record);
              setDataEdit(record);
              setIsVisibleModalUpdate(true);
            }}>
            Update
          </a>
        </Space>
      ),
    },
    {
      key: 'more',
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
  };

  const onCloseDelete = () => {
    setOpenDelete(false);
  };

  const [modalHeight, setModalHeight] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth * 0.8; // 80% chiều rộng
      const height = (width * 9) / 16; // Tính chiều cao theo 16:9
      setModalHeight(height);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const { Search } = Input;

  const onDone = () => {
    refresh();
    setIsVisibleModalAdd(false);
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
        />
        <View style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 8 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsVisibleModalAdd(true)}>
            Add SubLesson
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
          pagination={{
            current: currentData?.pageNum,
            pageSize: currentData?.pageSize,
            total: currentData?.totalRecords,
          }}
          onRow={record => {
            return {
              onClick: () => {
                setData(record);
              },
            };
          }}
          style={{ cursor: 'pointer' }}
        />
      </View>
      <Modal
        open={isVisibleModalAdd}
        onCancel={onCloseModalAdd}
        onClose={onCloseModalAdd}
        footer={null}
        title="Add SubLesson">
        <AddSubLessonContent initialValues={selectedItem} onDone={onDone} />
      </Modal>

      <Modal
        title="Delete SubLesson"
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
        <Text>{`Delete SubLesson: ${selectedItem?.title}`}</Text>
      </Modal>

      <Modal
        open={!!data}
        onCancel={() => {
          setData(null);
        }}
        footer={null}
        title={data?.title}
        centered
        closeIcon={null}
        width={'80%'}>
        <View style={{ overflow: 'hidden', height: modalHeight }}>
          <FlatList
            style={{ flex: 1 }}
            data={data?.libraries}
            renderItem={({ item }) => {
              return <LibraryDetailItem data={item} />;
            }}
          />
        </View>
      </Modal>
      <UpdateSubLessonForm
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

export default SubLessonManage;
