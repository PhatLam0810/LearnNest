'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native-web';
import styles from './styles';
import { Button, Input, Modal, Space, Table, TableProps, Tag } from 'antd';
import { messageApi, useAppPagination, useWindowSize } from '@hooks';
import { Lesson } from '~mdDashboard/redux/saga/type';
import { PlusOutlined } from '@ant-design/icons';
import { AddLessonContent, ModalBulkData } from '~mdAdmin/components';
import { adminQuery } from '~mdAdmin/redux';
import api from '@services/api';
import { ModalLessonOverview } from './_components';
import { UpdateLessonForm } from '@/app/dashboard/lesson/_components';

const LessonManage = () => {
  const divRef = useRef(null);
  const { width } = useWindowSize();

  const [height, setHeight] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Lesson>(null);
  const [isVisibleModalAdd, setIsVisibleModalAdd] = useState(false);
  const [isVisibleModalBulk, setIsVisibleModalBulk] = useState(false);
  const [isVisibleModalBulkGGS, setIsVisibleModalBulkGGS] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>();
  const [isVisibleModalUpdate, setIsVisibleModalUpdate] = useState(false);

  const [isVisibleModalOverview, setIsVisibleModalModalOverview] =
    useState(false);
  const [data, setData] = useState<Lesson>();
  const [openDelete, setOpenDelete] = useState(false);
  const { listItem, currentData, fetchData, refresh, search } =
    useAppPagination<Lesson>({
      apiUrl: 'lesson/getAllLesson',
    });

  const [deleteItem] = adminQuery.useDeleteLessonMutation();

  const columns: TableProps<Lesson>['columns'] = [
    {
      title: 'Id',
      dataIndex: '_id',
      key: '_id',
    },
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
            onClick={e => {
              setSelectedItem(record);
              setOpenDelete(true);
            }}>
            Delete
          </a>
          <a
            onClick={e => {
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
      setHeight(divRef.current.offsetHeight);
    }
  }, []);

  const onCloseModalAdd = () => {
    setSelectedItem(null);
    setIsVisibleModalAdd(false);
  };

  const onCloseDelete = () => {
    setOpenDelete(false);
  };
  const onDone = () => {
    refresh();
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
          placeholder="input search text"
          onSearch={search}
          style={{ width: '50%' }}
        />
        <View style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 8 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsVisibleModalAdd(true)}>
            Add Lesson
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
          style={{ cursor: 'pointer' }}
          onRow={record => {
            return {
              onClick: () => {
                setData(record);
                setIsVisibleModalModalOverview(true);
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
        title={selectedItem ? selectedItem.title : 'Add Lesson'}>
        <ScrollView
          style={{ height: (width * 0.8 * 9) / 16, scrollbarWidth: 'none' }}>
          <AddLessonContent initialValues={selectedItem} onDone={onDone} />
        </ScrollView>
      </Modal>

      <Modal
        title="Delete Lesson"
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
        <Text>{`Delete Lesson: ${selectedItem?.title}`}</Text>
      </Modal>

      <ModalLessonOverview
        data={data}
        isVisible={isVisibleModalOverview}
        setIsVisible={setIsVisibleModalModalOverview}
      />
      <UpdateLessonForm
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

export default LessonManage;
