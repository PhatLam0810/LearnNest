'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Modal, Select } from 'antd';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { apiErrorMessage } from '../practiceClassShared';
import styles from '../ClassFormModal/styles';

interface ClassMoveMembersModalProps {
  open: boolean;
  classId: string;
  userIds: string[];
  onClose: () => void;
  onMoved: () => void;
}

const buttonStyle = { width: 'auto', height: 44 } as const;

const ClassMoveMembersModal: React.FC<ClassMoveMembersModalProps> = ({
  open,
  classId,
  userIds,
  onClose,
  onMoved,
}) => {
  const [toClassId, setToClassId] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  // ponytail: lấy tối đa 100 lớp đang hoạt động (giới hạn pageSize của BE),
  // lọc tìm kiếm trên client - thêm tìm phía server nếu số lớp vượt 100.
  const { data, isFetching } = adminQuery.useGetClassesQuery(
    { status: 'active', pageSize: 100 },
    { skip: !open },
  );
  const [moveMembers, { isLoading }] = adminQuery.useMoveClassMembersMutation();

  const options = (data?.items ?? [])
    .filter(c => c._id !== classId)
    .map(c => ({
      value: c._id,
      label: c.termLabel
        ? `${c.code} · ${c.name} (${c.termLabel})`
        : `${c.code} · ${c.name}`,
    }));
  const target = options.find(o => o.value === toClassId);

  const close = () => {
    setToClassId(undefined);
    setError(undefined);
    onClose();
  };

  const handleSubmit = async () => {
    if (!toClassId) {
      setError('Vui lòng chọn lớp đích.');
      return;
    }
    try {
      const r = await moveMembers({ classId, toClassId, userIds }).unwrap();
      messageApi.success(
        r.skipped > 0
          ? `Đã chuyển ${r.moved} học viên, bỏ qua ${r.skipped} người không còn trong lớp này`
          : `Đã chuyển ${r.moved} học viên`,
      );
      close();
      onMoved();
    } catch (err: unknown) {
      messageApi.error(apiErrorMessage(err, 'Chuyển học viên thất bại'));
    }
  };

  return (
    <Modal
      open={open}
      onCancel={close}
      footer={null}
      closable={false}
      width={520}
      destroyOnHidden
      styles={{ body: { padding: 0 }, content: { padding: 0 } }}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Chuyển sang lớp khác</Text>
            <Text
              style={
                styles.subline
              }>{`${userIds.length} học viên đã chọn`}</Text>
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
              {'Lớp đích '}
              <Text style={styles.required}>*</Text>
            </Text>
            <Select
              showSearch
              size="large"
              aria-label="Lớp đích"
              placeholder="Chọn lớp đang hoạt động"
              status={error ? 'error' : undefined}
              loading={isFetching}
              options={options}
              optionFilterProp="label"
              value={toClassId}
              onChange={v => {
                setToClassId(v);
                setError(undefined);
              }}
              notFoundContent="Không có lớp đang hoạt động nào khác."
            />
            {error && <Text style={styles.error}>{error}</Text>}
          </View>
          {target && (
            <Text style={styles.bodyText}>
              {`Chuyển ${userIds.length} học viên sang lớp "${target.label}". Học viên sẽ được gỡ khỏi lớp hiện tại.`}
            </Text>
          )}
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
              Xác nhận chuyển
            </AppButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ClassMoveMembersModal;
