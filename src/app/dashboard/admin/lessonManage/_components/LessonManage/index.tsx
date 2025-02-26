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

const LessonManage = () => {
  const divRef = useRef(null);
  const { width } = useWindowSize();

  const [height, setHeight] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Lesson>(null);
  const [isVisibleModalAdd, setIsVisibleModalAdd] = useState(false);
  const [isVisibleModalBulk, setIsVisibleModalBulk] = useState(false);
  const [isVisibleModalBulkGGS, setIsVisibleModalBulkGGS] = useState(false);
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
              setIsVisibleModalAdd(true);
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsVisibleModalBulk(true)}>
            Bulk Lesson
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsVisibleModalBulkGGS(true)}>
            Bulk Lesson GoogleSheet Json
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
          <AddLessonContent initialValues={selectedItem} />
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
      <ModalBulkData
        title="Bulk Lesson"
        isVisible={isVisibleModalBulk}
        setIsVisible={setIsVisibleModalBulk}
        onOk={async data => {
          messageApi.loading('Bulk...', 0);
          const apiResponse = await api.post(
            'lesson/BulkLessonWithName',
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
            setIsVisibleModalBulkGGS(false);
            return;
          }
          messageApi.error('Bulk Failed!');
        }}
      />
      <ModalBulkData
        title="Bulk Lesson"
        isVisible={isVisibleModalBulkGGS}
        setIsVisible={setIsVisibleModalBulkGGS}
        onOk={async data => {
          messageApi.loading('Bulk...', 0);
          const apiResponse = await api.post(
            'lesson/BulkLessonWithNameByGoogleSheetJson',
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
      <ModalLessonOverview
        data={data}
        isVisible={isVisibleModalOverview}
        setIsVisible={setIsVisibleModalModalOverview}
      />
    </View>
  );
};

export default LessonManage;
