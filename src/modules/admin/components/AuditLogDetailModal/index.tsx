'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { Modal, Tag, message } from 'antd';
import dayjs from 'dayjs';
import AppButton from '@components/AppButton';
import {
  AuditLogItem,
  TARGET_SUMMARY_FIELDS,
  buildActionSummary,
  formatMetaEntries,
} from '../auditLogShared';
import styles from './styles';

const StatusTag: React.FC<{ status: 'success' | 'error' }> = ({ status }) => (
  <Tag
    style={{
      border: 'none',
      margin: 0,
      borderRadius: 999,
      fontWeight: 500,
      color: status === 'success' ? '#16a34a' : '#dc2626',
      background: status === 'success' ? '#f0fdf4' : '#fef2f2',
    }}>
    {status === 'success' ? 'Thành công' : 'Lỗi'}
  </Tag>
);

interface AuditLogDetailModalProps {
  selected: AuditLogItem | null;
  onClose: () => void;
}

const AuditLogDetailModal: React.FC<AuditLogDetailModalProps> = ({
  selected,
  onClose,
}) => {
  const handleCopyJson = () => {
    if (!selected) return;
    navigator.clipboard
      .writeText(JSON.stringify(selected, null, 2))
      .then(() => message.success('Đã sao chép JSON'))
      .catch(() => message.error('Không sao chép được'));
  };

  const targetName =
    selected?.meta?.targetUserName || selected?.meta?.targetTaskTitle;
  const targetEmail = selected?.meta?.targetUserEmail;

  return (
    <Modal
      open={!!selected}
      onCancel={onClose}
      footer={null}
      width={720}
      closeIcon={null}
      styles={{
        body: { padding: 0 },
        content: { padding: 0, borderRadius: 14, overflow: 'hidden' },
        mask: { background: 'rgba(17,24,39,0.45)' },
      }}>
      {selected && (
        <View>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTop}>
              <Text style={styles.modalTitle}>Chi tiết thao tác</Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 14,
                  alignItems: 'center',
                }}>
                <StatusTag status={selected.status} />
                <span
                  onClick={onClose}
                  style={styles.modalCloseIcon as React.CSSProperties}>
                  ✕
                </span>
              </View>
            </View>
            {/* Thiết kế gốc có kèm "· IP {{ip}}" ở đây - bỏ theo yêu cầu
                (dữ liệu này không cần thiết với người không rành kỹ thuật,
                xem trao đổi ngày 14/09). */}
            <Text style={styles.modalTimestamp}>
              {dayjs(selected.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </Text>
          </View>

          <View style={styles.modalBody}>
            <View style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Text style={styles.sectionLabel}>HÀNH ĐỘNG</Text>
              <Text style={styles.actionHeadline}>
                {buildActionSummary(selected)}
              </Text>
            </View>

            <View
              style={{
                ...styles.cardsRow,
                gridTemplateColumns:
                  targetName || selected.targetId ? 'repeat(2, 1fr)' : '1fr',
              }}>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Người thực hiện</Text>
                <Text style={styles.cardName}>{selected.actorName || '—'}</Text>
                {!!selected.actorEmail && (
                  <Text style={styles.cardEmail}>{selected.actorEmail}</Text>
                )}
              </View>
              {!!(targetName || selected.targetId) && (
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Đối tượng</Text>
                  <Text style={styles.cardName}>
                    {(targetName as string) || selected.targetId}
                  </Text>
                  {!!targetEmail && (
                    <Text style={styles.cardEmail}>
                      {targetEmail as string}
                    </Text>
                  )}
                </View>
              )}
            </View>

            {selected.errorMessage && (
              <View style={styles.errorBox}>
                <Text style={{ color: '#cf1322' }}>
                  {selected.errorMessage}
                </Text>
              </View>
            )}

            {(() => {
              const entries = formatMetaEntries(
                selected.meta,
                TARGET_SUMMARY_FIELDS,
              );
              if (!entries.length) return null;
              return (
                <View
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Text style={styles.sectionLabel}>CHI TIẾT</Text>
                  <View style={styles.detailTable}>
                    {entries.map(([label, value]) => (
                      <View
                        key={label}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '220px 1fr',
                          gap: 16,
                          paddingTop: 13,
                          paddingBottom: 13,
                          paddingLeft: 18,
                          paddingRight: 18,
                          alignItems: 'center',
                          borderBottom: '1px solid #f4f6fa',
                        }}>
                        <Text style={{ fontSize: 13, color: '#6b7280' }}>
                          {label}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: '#111827',
                            wordBreak: 'break-all',
                          }}>
                          {value}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })()}

            <View style={styles.modalFooter}>
              <Text style={styles.userAgentText}>
                User agent: {selected.userAgent || '—'}
              </Text>
              <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                <AppButton
                  style={styles.secondaryBtnStyle}
                  onClick={handleCopyJson}>
                  Sao chép JSON
                </AppButton>
                <AppButton
                  type="primary"
                  style={styles.primaryBtnStyle}
                  onClick={onClose}>
                  Đóng
                </AppButton>
              </View>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
};

export default AuditLogDetailModal;
