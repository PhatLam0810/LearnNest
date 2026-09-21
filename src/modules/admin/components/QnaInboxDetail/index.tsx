'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { Input, Tag } from 'antd';
import { typography } from '@styles';
import { PlayCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AppButton from '@components/AppButton';
import UserAvatar from '@components/UserAvatar';
import { questionState } from '../qnaShared';
import { AnswerInfo, QuestionItem, QuickTemplate } from './type';
import styles from './styles';

// Mẫu trả lời nhanh - bấm để chèn vào ô soạn, vẫn sửa được trước khi gửi.
export const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    key: 'thanks',
    label: 'Cảm ơn câu hỏi',
    text: 'Cảm ơn bạn đã đặt câu hỏi! ',
  },
  {
    key: 'watch-again',
    label: 'Xem lại video',
    text: 'Bạn thử xem lại đoạn video liên quan nhé, nội dung này đã được giải thích khá kỹ ở đó.',
  },
  {
    key: 'will-check',
    label: 'Sẽ kiểm tra và phản hồi',
    text: 'Mình sẽ kiểm tra kỹ hơn và phản hồi lại bạn sớm nhất có thể nhé.',
  },
  {
    key: 'redo',
    label: 'Cho làm lại bài',
    text: 'Bạn làm lại bài này nhé, hệ thống sẽ chấm lại điểm mới nhất cho bạn.',
  },
];

interface QnaInboxDetailProps {
  selected: QuestionItem | null;
  answer: AnswerInfo | null;
  loadingAnswer: boolean;
  draft: string;
  setDraft: (v: string) => void;
  sending: boolean;
  dismissing: boolean;
  reopening: boolean;
  onReply: () => void;
  onDismiss: () => void;
  onReopen: () => void;
  onOpenLesson: (link: string) => void;
}

const QnaInboxDetail: React.FC<QnaInboxDetailProps> = ({
  selected,
  answer,
  loadingAnswer,
  draft,
  setDraft,
  sending,
  dismissing,
  reopening,
  onReply,
  onDismiss,
  onReopen,
  onOpenLesson,
}) => {
  if (!selected) {
    return (
      <View style={styles.detailPanel}>
        <Text style={styles.detailEmpty}>
          Chọn 1 câu hỏi bên trái để xem chi tiết.
        </Text>
      </View>
    );
  }

  const st = questionState(selected);

  return (
    <View style={styles.detailPanel}>
      <View style={styles.detailHeader}>
        <View style={styles.detailHeaderLeft}>
          <UserAvatar
            size={44}
            avatar={selected.user?.avatar}
            fullName={selected.user?.fullName}
            seed={selected.user?._id}
          />
          <View style={{ gap: 4, minWidth: 0 }}>
            <Text style={styles.detailName}>
              {selected.user?.fullName || 'Học viên'}
            </Text>
            <Text style={styles.detailMeta}>
              {selected.user?.email ? `${selected.user.email} · ` : ''}
              {dayjs(selected.createdAt).format('DD/MM/YYYY HH:mm')}
            </Text>
          </View>
        </View>
        <Tag
          style={{
            color: st.color,
            background: st.bg,
            borderWidth: 0,
            borderRadius: 999,
            margin: 0,
          }}>
          {st.label}
        </Tag>
      </View>

      <View style={styles.detailBody}>
        {!!selected.contextTitle && (
          <View style={styles.lessonCard}>
            <View style={styles.lessonIconWrap}>
              <PlayCircleOutlined
                style={{ color: 'var(--color-vhu-primary)' }}
              />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.lessonTitle}>{selected.contextTitle}</Text>
            </View>
            {!!selected.link && (
              <AppButton
                style={{ width: 'auto', flexShrink: 0 }}
                onClick={() => onOpenLesson(selected.link as string)}>
                Xem bài học
              </AppButton>
            )}
          </View>
        )}

        <View style={{ gap: 10 }}>
          <Text style={styles.sectionLabel}>CÂU HỎI</Text>
          <Text style={styles.questionText}>{selected.commentText}</Text>
        </View>

        {selected.isAnswered && (
          <View style={styles.answerBox}>
            {loadingAnswer ? (
              <Text style={styles.answerByTime}>Đang tải...</Text>
            ) : answer ? (
              <>
                <View style={styles.answerByRow}>
                  <Text style={styles.answerByName}>
                    {answer.fullName || 'Quản trị viên'}
                  </Text>
                  <Text style={styles.answerByTime}>
                    {dayjs(answer.createdAt).fromNow()}
                  </Text>
                </View>
                <Text style={styles.answerText}>{answer.commentText}</Text>
              </>
            ) : (
              <Text style={styles.answerByTime}>
                Không tải được câu trả lời.
              </Text>
            )}
          </View>
        )}

        {!selected.isAnswered && !selected.dismissedAt && (
          <View style={{ gap: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
              }}>
              <Text style={styles.sectionLabel}>TRẢ LỜI</Text>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                {QUICK_TEMPLATES.map(tp => (
                  <Tag
                    key={tp.key}
                    style={{
                      height: 30,
                      paddingTop: 0,
                      paddingRight: 12,
                      paddingBottom: 0,
                      paddingLeft: 12,
                      borderRadius: 999,
                      fontSize: 12,
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      margin: 0,
                    }}
                    onClick={() => setDraft(tp.text)}>
                    {tp.label}
                  </Tag>
                ))}
              </View>
            </View>
            <Input.TextArea
              rows={4}
              placeholder="Nhập câu trả lời cho học viên..."
              value={draft}
              onChange={e => setDraft(e.target.value)}
              style={styles.replyTextarea as React.CSSProperties}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
              }}>
              <Text
                style={{
                  ...typography.caption,
                  fontSize: 12,
                  color: '#6b7280',
                }}>
                {draft.trim() ? `${draft.trim().length} ký tự · ` : ''}
                Học viên nhận email ngay khi bạn gửi trả lời
              </Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <AppButton
                  style={{ width: 'auto' }}
                  disabled={dismissing}
                  onClick={onDismiss}>
                  Không cần trả lời
                </AppButton>
                <AppButton
                  type="primary"
                  style={{
                    width: 'auto',
                    background: draft.trim()
                      ? 'var(--color-vhu-primary)'
                      : '#9fb0cc',
                  }}
                  disabled={!draft.trim() || sending}
                  onClick={onReply}>
                  Gửi trả lời
                </AppButton>
              </View>
            </View>
          </View>
        )}

        {!selected.isAnswered && !!selected.dismissedAt && (
          <View style={styles.skippedBox}>
            <Text style={styles.skippedText}>
              Câu hỏi này đã được đánh dấu không cần trả lời.
            </Text>
            <AppButton
              style={{ width: 'auto', flexShrink: 0 }}
              disabled={reopening}
              onClick={onReopen}>
              Mở lại
            </AppButton>
          </View>
        )}
      </View>
    </View>
  );
};

export default QnaInboxDetail;
