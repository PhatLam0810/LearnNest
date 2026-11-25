'use client';
import React from 'react';
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
}) => (
  <View style={styles.card}>
    <View>
      <Text style={styles.label}>{timerLabel}</Text>
      <Text
        role="timer"
        style={{ ...styles.time, ...(warn ? styles.timeWarn : null) }}>
        {timerText}
      </Text>
    </View>
    {onSubmit ? (
      <AppButton
        type="primary"
        style={styles.submit}
        loading={submitting}
        onClick={onSubmit}>
        NỘP BÀI
      </AppButton>
    ) : null}
    <Text style={styles.hint}>
      Đã làm {answeredCount}/{items.length} câu. Bấm số để nhảy tới câu.
    </Text>
    <View style={styles.grid}>
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
  </View>
);

export default ExamSidebar;
