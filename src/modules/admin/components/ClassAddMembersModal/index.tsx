'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native-web';
import { Modal, Select } from 'antd';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { apiErrorMessage } from '../practiceClassShared';
import styles from '../ClassFormModal/styles';

interface ClassAddMembersModalProps {
  open: boolean;
  classId: string;
  onClose: () => void;
}

interface PickedUser {
  value: string;
  label: string;
}

const buttonStyle = { width: 'auto', height: 44 } as const;

const ClassAddMembersModal: React.FC<ClassAddMembersModalProps> = ({
  open,
  classId,
  onClose,
}) => {
  const [picked, setPicked] = useState<PickedUser[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | undefined>();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { data: users = [], isFetching: isSearching } =
    adminQuery.useSearchSelectableUsersQuery(search, { skip: !open });
  const [addMembers, { isLoading }] =
    adminQuery.useAddPracticeClassMembersMutation();

  useEffect(() => () => clearTimeout(timer.current), []);

  const close = () => {
    setPicked([]);
    setSearch('');
    setError(undefined);
    onClose();
  };

  const handleSubmit = async () => {
    if (!picked.length) {
      setError('Vui lòng chọn ít nhất 1 học viên.');
      return;
    }
    try {
      const r = await addMembers({
        classId,
        userIds: picked.map(p => p.value),
      }).unwrap();
      const already = picked.length - r.added;
      messageApi.success(
        already > 0
          ? `Đã thêm ${r.added} học viên, ${already} người đã có trong lớp`
          : `Đã thêm ${r.added} học viên`,
      );
      close();
    } catch (err: unknown) {
      messageApi.error(apiErrorMessage(err, 'Thêm học viên thất bại'));
    }
  };

  return (
    <Modal
      open={open}
      onCancel={close}
      footer={null}
      closable={false}
      width={720}
      destroyOnHidden
      styles={{ body: { padding: 0 }, content: { padding: 0 } }}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Thêm học viên vào lớp</Text>
            <Text style={styles.subline}>
              Tìm và chọn nhiều học viên cùng lúc.
            </Text>
          </View>
          <button
            type="button"
            aria-label="Đóng"
            onClick={close}
            style={styles.closeButton as React.CSSProperties}>
            Đóng
          </button>
        </View>
        <View style={styles.body}>
          <View style={styles.field}>
            <Text style={styles.label}>
              {'Học viên '}
              <Text style={styles.required}>*</Text>
            </Text>
            <Select
              mode="multiple"
              labelInValue
              showSearch
              filterOption={false}
              size="large"
              aria-label="Chọn học viên"
              placeholder="Tìm theo tên, email hoặc MSSV"
              status={error ? 'error' : undefined}
              loading={isSearching}
              value={picked}
              onChange={v => {
                setPicked(v as PickedUser[]);
                setError(undefined);
              }}
              onSearch={v => {
                clearTimeout(timer.current);
                timer.current = setTimeout(() => setSearch(v), 300);
              }}
              options={users.map(u => ({
                value: u._id,
                label: `${u.fullName || u.email}${u.studentId ? ` · ${u.studentId}` : ''}`,
              }))}
            />
            {error && <Text style={styles.error}>{error}</Text>}
          </View>
          <View style={styles.footer}>
            <AppButton style={buttonStyle} disabled={isLoading} onClick={close}>
              Hủy
            </AppButton>
            <AppButton
              type="primary"
              style={buttonStyle}
              loading={isLoading}
              disabled={isLoading}
              onClick={handleSubmit}>
              {picked.length
                ? `Thêm ${picked.length} học viên`
                : 'Thêm học viên'}
            </AppButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ClassAddMembersModal;
