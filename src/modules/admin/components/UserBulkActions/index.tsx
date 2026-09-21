'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Button, Modal, Select } from 'antd';
import { adminQuery } from '~mdAdmin/redux';
import { messageApi } from '@hooks';
import styles from './styles';

// Đặt lại mật khẩu chạy theo lô nhỏ nối tiếp: mỗi người bcrypt + 1 email nên
// gửi 1 lần cả trăm người vừa lâu vừa nghẽn VPS 1 vCPU (BE cũng giới hạn 100).
const RESET_BATCH_SIZE = 25;

interface Outcome {
  userId: string;
  fullName: string;
  reason: string;
}

interface Props {
  selectedIds: string[];
  onClear: () => void;
}

// Thanh thao tác hàng loạt hiện ra khi có dòng được chọn ở danh sách người dùng.
const UserBulkActions: React.FC<Props> = ({ selectedIds, onClear }) => {
  const [classOpen, setClassOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [summary, setSummary] = useState<{
    reset: number;
    total: number;
    issues: Outcome[];
  } | null>(null);
  const [classId, setClassId] = useState<string | undefined>();
  const [resetting, setResetting] = useState<{
    done: number;
    total: number;
  } | null>(null);

  const { data: classData, isFetching: loadingClasses } =
    adminQuery.useGetClassesQuery(
      { status: 'active', pageSize: 100 },
      { skip: !classOpen },
    );
  const [addMembers, { isLoading: adding }] =
    adminQuery.useAddPracticeClassMembersMutation();
  const [resetPasswords] = adminQuery.useResetUserPasswordsMutation();

  const count = selectedIds.length;

  const handleAddToClass = async () => {
    if (!classId) return;
    try {
      const r = await addMembers({ classId, userIds: selectedIds }).unwrap();
      const already = count - r.added;
      messageApi.success(
        already > 0
          ? `Đã thêm ${r.added} người vào lớp (${already} người đã có sẵn)`
          : `Đã thêm ${r.added} người vào lớp`,
      );
      setClassOpen(false);
      setClassId(undefined);
      onClear();
    } catch (e: unknown) {
      messageApi.error(
        (e as { data?: { message?: string } })?.data?.message ||
          'Không thêm được vào lớp',
      );
    }
  };

  const runReset = async () => {
    let reset = 0;
    const skipped: Outcome[] = [];
    const failed: Outcome[] = [];
    setResetting({ done: 0, total: count });
    try {
      for (let i = 0; i < count; i += RESET_BATCH_SIZE) {
        const r = await resetPasswords({
          userIds: selectedIds.slice(i, i + RESET_BATCH_SIZE),
        }).unwrap();
        reset += r.reset;
        skipped.push(...r.skipped);
        failed.push(...r.failed);
        setResetting({
          done: Math.min(i + RESET_BATCH_SIZE, count),
          total: count,
        });
      }
    } catch (e: unknown) {
      // Lô đã xong vẫn được báo; lỗi giữa chừng thì dừng, không thử lô sau.
      messageApi.error(
        (e as { data?: { message?: string } })?.data?.message ||
          'Đặt lại mật khẩu bị gián đoạn',
      );
    } finally {
      setResetting(null);
    }

    setSummary({ reset, total: count, issues: [...skipped, ...failed] });
    onClear();
  };

  return (
    <>
      {count > 0 && (
        <View
          style={styles.bar}
          {...({
            role: 'region',
            'aria-label': 'Thao tác hàng loạt',
          } as object)}>
          <Text style={styles.count}>Đã chọn {count} người</Text>
          <View style={styles.actions}>
            <Button onClick={() => setClassOpen(true)} disabled={!!resetting}>
              Thêm vào lớp
            </Button>
            <Button
              danger
              onClick={() => setConfirmOpen(true)}
              loading={!!resetting}
              disabled={!!resetting}>
              {resetting
                ? `Đang đặt lại ${resetting.done}/${resetting.total}`
                : 'Đặt lại mật khẩu'}
            </Button>
            <Button type="text" onClick={onClear} disabled={!!resetting}>
              Bỏ chọn
            </Button>
          </View>
        </View>
      )}

      <Modal
        title={`Đặt lại mật khẩu cho ${count} người?`}
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onOk={async () => {
          setConfirmOpen(false);
          await runReset();
        }}
        okText="Đặt lại"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}>
        <Text style={styles.resultText}>
          Mỗi người nhận một mật khẩu tạm ngẫu nhiên qua email và phải đổi mật
          khẩu ở lần đăng nhập tới. Các phiên đang đăng nhập của họ sẽ bị đăng
          xuất. Tài khoản quản trị, chính bạn và địa chỉ email không nhận được
          thư sẽ được bỏ qua.
        </Text>
      </Modal>

      <Modal
        title={`Đã đặt lại mật khẩu cho ${summary?.reset ?? 0}/${summary?.total ?? 0} người`}
        open={!!summary}
        onCancel={() => setSummary(null)}
        footer={
          <Button type="primary" onClick={() => setSummary(null)}>
            Đóng
          </Button>
        }
        width={520}>
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            Mỗi người nhận mật khẩu tạm qua email và phải đổi mật khẩu ở lần
            đăng nhập tới. Các phiên đang đăng nhập đã bị đăng xuất.
          </Text>
          {!!summary?.issues.length && (
            <>
              <Text style={styles.resultTitle}>
                {summary.issues.length} người không được đặt lại:
              </Text>
              <View style={styles.issueList}>
                {summary.issues.slice(0, 20).map(o => (
                  <Text key={o.userId} style={styles.issueRow}>
                    {o.fullName || o.userId} — {o.reason}
                  </Text>
                ))}
                {summary.issues.length > 20 && (
                  <Text style={styles.issueRow}>
                    ... và {summary.issues.length - 20} người khác
                  </Text>
                )}
              </View>
            </>
          )}
        </View>
      </Modal>

      <Modal
        title={`Thêm ${count} người vào lớp`}
        open={classOpen}
        onCancel={() => setClassOpen(false)}
        onOk={handleAddToClass}
        okText="Thêm vào lớp"
        cancelText="Hủy"
        okButtonProps={{ disabled: !classId, loading: adding }}>
        <Select
          showSearch
          style={{ width: '100%' }}
          aria-label="Chọn lớp"
          placeholder="Chọn lớp"
          loading={loadingClasses}
          optionFilterProp="label"
          value={classId}
          onChange={setClassId}
          options={(classData?.items ?? []).map(c => ({
            value: c._id,
            label: `${c.code} - ${c.name}`,
          }))}
        />
      </Modal>
    </>
  );
};

export default UserBulkActions;
