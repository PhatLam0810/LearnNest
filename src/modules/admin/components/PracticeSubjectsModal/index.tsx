'use client';
import React, { useState } from 'react';
import { Text } from 'react-native-web';
import { Button, Input, List, Modal, Space } from 'antd';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';

const errMsg = (e: unknown, fallback: string) =>
  (e as { data?: { message?: string } })?.data?.message || fallback;

// Thêm / đổi tên / xóa mục của trang Luyện tập (AI, Tiếng Anh...).
const PracticeSubjectsModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { data: subjects, isFetching } =
    adminQuery.useGetPracticeSubjectsQuery();
  const [create, { isLoading: creating }] =
    adminQuery.useCreatePracticeSubjectMutation();
  const [rename, { isLoading: renaming }] =
    adminQuery.useRenamePracticeSubjectMutation();
  const [remove, { isLoading: removing }] =
    adminQuery.useDeletePracticeSubjectMutation();

  const [newLabel, setNewLabel] = useState('');
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [deleting, setDeleting] = useState<{
    key: string;
    label: string;
  } | null>(null);

  const handleCreate = async () => {
    try {
      await create(newLabel).unwrap();
      setNewLabel('');
      messageApi.success('Đã thêm mục');
    } catch (e) {
      messageApi.error(errMsg(e, 'Không thêm được mục'));
    }
  };

  const handleRename = async () => {
    if (!editKey) return;
    try {
      await rename({ key: editKey, label: editLabel }).unwrap();
      setEditKey(null);
      messageApi.success('Đã đổi tên mục');
    } catch (e) {
      messageApi.error(errMsg(e, 'Không đổi được tên'));
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await remove(deleting.key).unwrap();
      setDeleting(null);
      messageApi.success('Đã xóa mục');
    } catch (e) {
      setDeleting(null);
      messageApi.error(errMsg(e, 'Không xóa được mục'));
    }
  };

  return (
    <>
      <Modal
        title="Quản lý mục luyện tập"
        open={open}
        footer={null}
        onCancel={onClose}>
        <Text>
          Mỗi mục là một tab ở trang Luyện tập của học viên (MOS luôn có sẵn).
        </Text>
        <Space.Compact style={{ width: '100%', margin: '12px 0' }}>
          <Input
            placeholder="Tên mục mới (vd: Tiếng Anh)"
            maxLength={40}
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onPressEnter={handleCreate}
          />
          <AppButton
            type="primary"
            style={{ width: 'auto', height: 32 }}
            loading={creating}
            disabled={!newLabel.trim()}
            onClick={handleCreate}>
            Thêm
          </AppButton>
        </Space.Compact>
        <List
          loading={isFetching}
          dataSource={subjects ?? []}
          locale={{ emptyText: 'Chưa có mục nào' }}
          renderItem={s => (
            <List.Item
              actions={
                editKey === s.key
                  ? [
                      <Button
                        key="save"
                        size="small"
                        type="primary"
                        loading={renaming}
                        onClick={handleRename}>
                        Lưu
                      </Button>,
                      <Button
                        key="cancel"
                        size="small"
                        onClick={() => setEditKey(null)}>
                        Hủy
                      </Button>,
                    ]
                  : [
                      <Button
                        key="edit"
                        size="small"
                        onClick={() => {
                          setEditKey(s.key);
                          setEditLabel(s.label);
                        }}>
                        Sửa
                      </Button>,
                      <Button
                        key="del"
                        size="small"
                        danger
                        onClick={() => setDeleting(s)}>
                        Xóa
                      </Button>,
                    ]
              }>
              {editKey === s.key ? (
                <Input
                  autoFocus
                  maxLength={40}
                  value={editLabel}
                  onChange={e => setEditLabel(e.target.value)}
                  onPressEnter={handleRename}
                />
              ) : (
                <Text>{s.label}</Text>
              )}
            </List.Item>
          )}
        />
      </Modal>
      <Modal
        title="Xóa mục luyện tập?"
        open={!!deleting}
        okText="Xóa mục"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        confirmLoading={removing}
        onCancel={() => setDeleting(null)}
        onOk={handleDelete}>
        <Text>
          {`Xóa mục "${deleting?.label}"? Chỉ xóa được khi mục không còn bài tập nào.`}
        </Text>
      </Modal>
    </>
  );
};

export default PracticeSubjectsModal;
