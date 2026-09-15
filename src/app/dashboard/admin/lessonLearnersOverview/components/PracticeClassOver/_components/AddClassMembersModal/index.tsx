import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Input, Modal, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { adminQuery } from '~mdAdmin/redux';
import { useAppPagination } from '@hooks';
import { LessonLearnerPoolItem } from '~mdAdmin/redux/RTKQuery/type';

type Props = {
  open: boolean;
  onClose: () => void;
  classId: string;
  lessonId?: string;
  onAdded: () => void;
};

// Danh sách học viên có thể thêm vào lớp thực hành ĐÃ TẠO - tái dùng đúng
// "pool" đã có (admin/lessons/:lessonId/learners/pool, isSelected != true)
// giống CreatePracticeClassModal, để không hiện học viên đã ở lớp khác.
const AddClassMembersModal: React.FC<Props> = ({
  open,
  onClose,
  classId,
  lessonId,
  onAdded,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<LessonLearnerPoolItem[]>(
    [],
  );
  const [searchText, setSearchText] = useState('');
  const [addMembers, { isLoading }] =
    adminQuery.useAddPracticeClassMembersMutation();
  const { listItem, currentData, fetchData, search, refresh } =
    useAppPagination<any>({
      apiUrl: `admin/lessons/${lessonId}/learners/pool`,
      isLazy: true,
      params: { isFull: true },
    });

  useEffect(() => {
    if (open && lessonId) {
      fetchData();
      refresh();
      setSelectedUsers([]);
      setSearchText('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lessonId]);

  const handleSubmit = async () => {
    if (!selectedUsers.length) return;
    try {
      const res = await addMembers({
        classId,
        userIds: selectedUsers.map(u => u._id),
      }).unwrap();
      message.success(`Đã thêm ${res.added} học viên vào lớp`);
      onAdded();
      onClose();
    } catch (error: any) {
      message.error(error?.data?.message || 'Thêm học viên thất bại');
    }
  };

  const columns: ColumnsType<LessonLearnerPoolItem> = [
    {
      title: (
        <Checkbox
          checked={
            !!listItem.length && selectedUsers.length === listItem.length
          }
          onChange={e => setSelectedUsers(e.target.checked ? listItem : [])}
        />
      ),
      key: 'select',
      width: 60,
      render: (_, record) => (
        <Checkbox
          checked={selectedUsers.some(item => item._id === record._id)}
          onChange={e => {
            setSelectedUsers(
              e.target.checked
                ? [...selectedUsers, record]
                : selectedUsers.filter(item => item._id !== record._id),
            );
          }}
        />
      ),
    },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Lớp', dataIndex: 'class', key: 'class' },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Thêm học viên vào lớp"
      width="80%"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onClose}>Đóng</Button>
          <Button
            type="primary"
            loading={isLoading}
            disabled={!selectedUsers.length}
            onClick={handleSubmit}>
            Thêm {selectedUsers.length || ''} học viên
          </Button>
        </div>
      }>
      <div style={{ marginBottom: 12, fontWeight: 600 }}>
        Đã chọn: {selectedUsers.length} / {currentData?.totalRecords || 0} học
        viên chưa thuộc lớp nào
      </div>
      <Input.Search
        placeholder="Tìm học viên"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        onSearch={value => {
          setSearchText(value);
          search(value);
        }}
        style={{ marginBottom: 12 }}
      />
      <Table
        columns={columns}
        dataSource={listItem}
        rowKey="_id"
        onChange={res => fetchData({ pageNum: res.current })}
        onRow={record => ({
          onClick: () => {
            const isSelected = selectedUsers.some(
              item => item._id === record._id,
            );
            setSelectedUsers(
              isSelected
                ? selectedUsers.filter(item => item._id !== record._id)
                : [...selectedUsers, record],
            );
          },
        })}
        pagination={{
          current: currentData?.pageNum,
          total: currentData?.totalRecords,
          pageSize: currentData?.pageSize,
          showSizeChanger: false,
          position: ['bottomCenter'],
        }}
        locale={{ emptyText: 'Không còn học viên nào chưa được xếp lớp' }}
      />
    </Modal>
  );
};

export default AddClassMembersModal;
