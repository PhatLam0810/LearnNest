'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import AppButton from '@components/AppButton';
import { asButton } from '@/utils/asButton';
import styles from './styles';

export type ExamItemState =
  'idle' | 'answered' | 'current' | 'correct' | 'wrong';

const ITEM_STYLE = {
  idle: null,
  answered: styles.itemAnswered,
  current: styles.itemCurrent,
  correct: styles.itemCorrect,
  wrong: styles.itemWrong,
} as const;

interface Props {
  timerLabel: string;
  timerText: string;
  warn?: boolean;
  items: ExamItemState[];
  answeredCount: number;
  onJump: (index: number) => void;
  // Bỏ trống = đã nộp, ẩn nút.
  onSubmit?: () => void;
  submitting?: boolean;
  // Màn hẹp: gọn 1 hàng (đồng hồ + NỘP BÀI), lưới số câu ẩn tới khi bấm mở.
  compact?: boolean;
}

// Khung bên phải kiểu phòng thi: đồng hồ + NỘP BÀI + lưới số câu (bấm để nhảy).
const ExamSidebar: React.FC<Props> = ({
  timerLabel,
  timerText,
  warn,
  items,
  answeredCount,
  onJump,
  onSubmit,
  submitting,
  compact,
}) => {
  const [gridOpen, setGridOpen] = useState(!compact);
  return (
    <View style={styles.card}>
      <View style={compact ? styles.compactRow : null}>
        <View>
          <Text style={styles.label}>{timerLabel}</Text>
          <Text
            role="timer"
            style={{ ...styles.time, ...(warn ? styles.timeWarn : null) }}>
            {timerText}
          </Text>
        </View>
        {onSubmit && compact ? (
          <AppButton
            type="primary"
            style={styles.submitCompact}
            loading={submitting}
            onClick={onSubmit}>
            NỘP BÀI
          </AppButton>
        ) : null}
      </View>
      {onSubmit && !compact ? (
        <AppButton
          type="primary"
          style={styles.submit}
          loading={submitting}
          onClick={onSubmit}>
          NỘP BÀI
        </AppButton>
      ) : null}
      {compact ? (
        <View
          {...asButton(() => setGridOpen(o => !o), 'Danh sách câu hỏi')}
          {...({ 'aria-expanded': gridOpen } as object)}
          style={styles.toggle}>
          <Text style={styles.toggleText}>
            {`Đã làm ${answeredCount}/${items.length} câu · ${gridOpen ? 'Ẩn' : 'Xem'} danh sách câu ${gridOpen ? '▴' : '▾'}`}
          </Text>
        </View>
      ) : (
        <Text style={styles.hint}>
          Đã làm {answeredCount}/{items.length} câu. Bấm số để nhảy tới câu.
        </Text>
      )}
      {gridOpen ? (
        <View
          style={{ ...styles.grid, ...(compact ? styles.gridCompact : null) }}>
          {items.map((state, i) => (
            <View
              key={i}
              {...asButton(() => onJump(i), `Câu ${i + 1}`)}
              style={{ ...styles.item, ...ITEM_STYLE[state] }}>
              <Text
                style={{
                  ...styles.itemText,
                  ...(state === 'answered' ? styles.itemTextAnswered : null),
                }}>
                {i + 1}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default ExamSidebar;
