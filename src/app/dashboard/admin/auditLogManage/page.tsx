'use client';
import React, { useState } from 'react';
import { View } from 'react-native-web';
import { useAppPagination } from '@hooks';
import AuditLogTable from '~mdAdmin/components/AuditLogTable';
import AuditLogDetailModal from '~mdAdmin/components/AuditLogDetailModal';
import { AuditLogItem } from '~mdAdmin/components/auditLogShared';
import AdminGuide from '~mdAdmin/components/AdminGuide';
import styles from './styles';

const AuditLogManage: React.FC = () => {
  const { listItem, currentData, fetchData } = useAppPagination<AuditLogItem>({
    apiUrl: 'admin/audit-logs',
  });
  const [selected, setSelected] = useState<AuditLogItem | null>(null);

  return (
    <View style={styles.container}>
      <AdminGuide
        title="xem nhật ký thao tác"
        steps={[
          'Bảng ghi lại các thao tác quản trị: ai làm, làm gì, lúc nào.',
          'Bấm vào một dòng để xem chi tiết thao tác.',
          'Dùng khi cần tra lại ai đã xóa, sửa hay cấp quyền một dữ liệu nào đó.',
        ]}
      />
      <h1 style={{ marginTop: 0, marginBottom: 16 }}>Nhật ký thao tác</h1>

      <AuditLogTable
        listItem={listItem}
        currentData={currentData}
        onChangePage={pageNum => fetchData({ pageNum, replace: true })}
        onRowClick={setSelected}
      />

      <AuditLogDetailModal
        selected={selected}
        onClose={() => setSelected(null)}
      />
    </View>
  );
};

export default AuditLogManage;
