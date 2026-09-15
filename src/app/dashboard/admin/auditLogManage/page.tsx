'use client';
import React, { useState } from 'react';
import { View } from 'react-native-web';
import { useAppPagination } from '@hooks';
import AuditLogTable from '~mdAdmin/components/AuditLogTable';
import AuditLogDetailModal from '~mdAdmin/components/AuditLogDetailModal';
import { AuditLogItem } from '~mdAdmin/components/auditLogShared';
import styles from './styles';

const AuditLogManage: React.FC = () => {
  const { listItem, currentData, fetchData } = useAppPagination<AuditLogItem>({
    apiUrl: 'admin/audit-logs',
  });
  const [selected, setSelected] = useState<AuditLogItem | null>(null);

  return (
    <View style={styles.container}>
      <h1 style={{ marginTop: 0, marginBottom: 16 }}>Nhật ký thao tác</h1>

      <AuditLogTable
        listItem={listItem}
        currentData={currentData}
        onChangePage={pageNum => fetchData({ pageNum })}
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
