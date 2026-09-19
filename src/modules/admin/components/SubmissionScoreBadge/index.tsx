'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { SubmissionState } from '../../redux/RTKQuery/type';
import { SUBMISSION_STATE } from '../submissionShared';
import styles from './styles';

interface SubmissionScoreBadgeProps {
  state: SubmissionState;
  scoreLabel?: string;
}

// Trạng thái luôn kèm chữ ("Đạt"/"Chưa đạt"/"Chưa chấm") - không truyền đạt
// chỉ bằng màu (UI-UX.md §10).
const SubmissionScoreBadge: React.FC<SubmissionScoreBadgeProps> = ({
  state,
  scoreLabel,
}) => {
  const { label, color, bg } = SUBMISSION_STATE[state];
  return (
    <View style={{ ...styles.badge, backgroundColor: bg }}>
      <Text style={{ ...styles.text, color }}>
        {scoreLabel ? `${scoreLabel} · ${label}` : label}
      </Text>
    </View>
  );
};

export default SubmissionScoreBadge;
