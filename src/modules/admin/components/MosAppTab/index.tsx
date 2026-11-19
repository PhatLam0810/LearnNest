'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Button, DatePicker, Input, Modal, Table, Tag } from 'antd';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import type { MosSessionItem } from '~mdAdmin/redux/RTKQuery/type';

const errMsg = (e: unknown, fallback: string) =>
  (e as { data?: { message?: string } })?.data?.message || fallback;

const fmt = (iso?: string) =>
  iso ? new Date(iso).toLocaleString('vi-VN') : '';

// Lịch sử học trên app MOS (máy học viên) + cấp/thu quyền dùng app theo MSSV.
const MosAppTab: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isFetching } = adminQuery.useGetMosSessionsQuery(page, {
    refetchOnMountOrArgChange: true,
  });
  const [setAccess, { isLoading: saving }] =
    adminQuery.useSetMosAccessMutation();
  const [open, setOpen] = useState(false);
  const [ids, setIds] = useState('');
  const [expires, setExpires] = useState<string | undefined>();

  const submit = async (enabled: boolean) => {
    const studentIds = ids
      .split(/[\s,;]+/)
      .map(s => s.trim())
      .filter(Boolean);
    if (!studentIds.length) return;
    try {
      const r = await setAccess({
        studentIds,
        enabled,
        expiresAt: enabled ? expires : undefined,
      }).unwrap();
      const miss = r.notFound.length
        ? `. Không thấy MSSV: ${r.notFound.join(', ')}`
        : '';
      messageApi.success(
        `Đã ${enabled ? 'bật' : 'tắt'} quyền cho ${r.updated} học viên${miss}`,
      );
      if (!r.notFound.length) setOpen(false);
    } catch (e) {
      messageApi.error(errMsg(e, 'Không cập nhật được quyền'));
    }
  };

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row' }}>
        <Button type="primary" onClick={() => setOpen(true)}>
          Cấp / thu quyền dùng app MOS
        </Button>
      </View>
      <Table<MosSessionItem>
        rowKey="_id"
        loading={isFetching}
        dataSource={data?.items ?? []}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: 'Chưa có phiên nào từ app MOS' }}
        pagination={{
          current: page,
          pageSize: data?.pageSize ?? 30,
          total: data?.total ?? 0,
          showSizeChanger: false,
          onChange: setPage,
        }}
        columns={[
          {
            title: 'Học viên',
            render: (_, r) => (
              <Text>
                {`${r.userId?.fullName ?? ''} · ${r.userId?.studentId ?? ''}`}
              </Text>
            ),
          },
          { title: 'Lớp', render: (_, r) => r.userId?.class ?? '' },
          { title: 'Bộ đề', dataIndex: 'pack' },
          { title: 'Chế độ', dataIndex: 'mode' },
          { title: 'Project đã nộp', dataIndex: 'projectsDone' },
          { title: 'Đạt', dataIndex: 'passed' },
          { title: 'Chưa đạt', dataIndex: 'failed' },
          { title: 'Cần xem', dataIndex: 'needReview' },
          {
            title: 'Trạng thái',
            render: (_, r) =>
              r.state === 'completed' ? (
                <Tag color="success">Hoàn thành</Tag>
              ) : (
                <Tag>Đang làm</Tag>
              ),
          },
          { title: 'Cập nhật', render: (_, r) => fmt(r.updatedAt) },
        ]}
      />
      <Modal
        title="Cấp / thu quyền dùng app MOS"
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}>
        <View style={{ gap: 12 }}>
          <Text>
            Dán danh sách MSSV (mỗi dòng một MSSV, hoặc ngăn bằng dấu phẩy).
          </Text>
          <Input.TextArea
            rows={6}
            value={ids}
            onChange={e => setIds(e.target.value)}
            placeholder="231A123456&#10;231A123457"
          />
          <Text>
            Hạn dùng (bỏ trống = không giới hạn, chỉ áp dụng khi bật quyền):
          </Text>
          <DatePicker
            onChange={d =>
              setExpires(d ? d.endOf('day').toISOString() : undefined)
            }
          />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              type="primary"
              loading={saving}
              disabled={!ids.trim()}
              onClick={() => submit(true)}>
              Bật quyền
            </Button>
            <Button
              danger
              loading={saving}
              disabled={!ids.trim()}
              onClick={() => submit(false)}>
              Tắt quyền
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MosAppTab;
