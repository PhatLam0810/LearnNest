'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import dayjs from 'dayjs';
import UserAvatar from '@components/UserAvatar';
import { SubmissionLearner, SubmissionState } from '../../redux/RTKQuery/type';
import SubmissionScoreBadge from '../SubmissionScoreBadge';
import styles from './styles';

interface SubmissionDetailHeaderProps {
  learner: SubmissionLearner | null;
  submittedAt: string;
  scoreLabel: string;
  state: SubmissionState;
}

const SubmissionDetailHeader: React.FC<SubmissionDetailHeaderProps> = ({
  learner,
  submittedAt,
  scoreLabel,
  state,
}) => {
  const extra = [learner?.studentId, learner?.class, learner?.email]
    .filter(Boolean)
    .join(' · ');
  return (
    <View style={styles.header}>
      <View style={styles.identity}>
        <UserAvatar
          size={48}
          avatar={learner?.avatar}
          fullName={learner?.fullName}
          seed={learner?._id}
        />
        <View style={styles.identityText}>
          <Text style={styles.name}>{learner?.fullName || 'Học viên'}</Text>
          <Text style={styles.meta}>
            {`${extra ? `${extra} · ` : ''}Nộp lúc ${dayjs(submittedAt).format(
              'HH:mm DD/MM/YYYY',
            )}`}
          </Text>
        </View>
      </View>
      <View style={styles.scoreBlock}>
        <Text style={styles.score}>{scoreLabel}</Text>
        <SubmissionScoreBadge state={state} />
      </View>
    </View>
  );
};

export default SubmissionDetailHeader;
