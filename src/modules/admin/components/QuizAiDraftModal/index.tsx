'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import { Checkbox, Modal, Tag, Upload } from 'antd';
import type { UploadFile } from 'antd';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import type { DraftQuestion } from '~mdAdmin/redux/RTKQuery/type';
import { QUESTION_TYPE_LABEL } from '~mdAdmin/utils/questionTypes';
import styles from './styles';

const MAX_FILES = 18;
const ACCEPT = '.png,.jpg,.jpeg,.webp,.pdf,.zip';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  // Nhận các câu admin đã chọn; builder tự thêm vào bài tập để sửa tiếp.
  onUse: (questions: DraftQuestion[]) => void;
}

const QuizAiDraftModal: React.FC<Props> = ({ isVisible, onClose, onUse }) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [drafts, setDrafts] = useState<DraftQuestion[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [note, setNote] = useState('');
  const [generate, { isLoading }] = adminQuery.useGenerateQuizDraftMutation();

  useEffect(() => {
    if (isVisible) {
      setFiles([]);
      setDrafts([]);
      setPicked([]);
      setNote('');
    }
  }, [isVisible]);

  const handleGenerate = async () => {
    const body = new FormData();
    files.forEach(f => body.append('files', f.originFileObj as File));
    try {
      const res = await generate(body).unwrap();
      setDrafts(res.questions);
      setPicked(res.questions.map((_, i) => i));
      const parts = [`Đọc ${res.sourceCount} ảnh/PDF`];
      if (res.skipped) parts.push(`bỏ ${res.skipped} câu AI soạn sai luật`);
      if (res.failedBatches) {
        parts.push(`${res.failedBatches} lượt đọc lỗi, có thể thiếu câu`);
      }
      setNote(parts.join(', '));
      if (res.questions.length === 0) {
        messageApi.warning('AI không tạo được câu hỏi nào từ tài liệu này');
      }
    } catch (e: unknown) {
      messageApi.error(
        (e as { data?: { message?: string } })?.data?.message ||
          'Tạo bản nháp thất bại',
      );
    }
  };

  const togglePick = (i: number, on: boolean) =>
    setPicked(prev => (on ? [...prev, i] : prev.filter(x => x !== i)));

  const handleUse = () => {
    onUse(drafts.filter((_, i) => picked.includes(i)));
    onClose();
  };

  const reviewCount = drafts.filter(
    (d, i) => d.needsReview && picked.includes(i),
  ).length;

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={760}
      centered
      destroyOnHidden
      title="Tạo câu hỏi từ ảnh / PDF / zip bằng AI">
      <View style={styles.body}>
        {drafts.length === 0 ? (
          <>
            <Text style={styles.hint}>
              Chọn ảnh chụp câu hỏi (PNG/JPG/WEBP), file PDF hoặc 1 file zip
              chứa chúng (tối đa {MAX_FILES} ảnh/PDF mỗi lần). AI đọc rồi tạo
              bản nháp - bạn xem lại từng câu trước khi dùng.
            </Text>
            <Upload.Dragger
              multiple
              accept={ACCEPT}
              fileList={files}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFiles(fileList)}>
              <Text style={styles.dropText}>
                Kéo thả file vào đây hoặc bấm để chọn
              </Text>
            </Upload.Dragger>
            <AppButton
              type="primary"
              style={styles.button}
              disabled={files.length === 0}
              loading={isLoading}
              onClick={handleGenerate}>
              {isLoading ? 'AI đang đọc tài liệu...' : 'Tạo bản nháp'}
            </AppButton>
            {isLoading && (
              <Text style={styles.hint}>
                Có thể mất đến 1 phút, vui lòng không đóng cửa sổ này.
              </Text>
            )}
          </>
        ) : (
          <>
            <Text style={styles.hint}>
              {note}. Chọn các câu muốn dùng
              {reviewCount > 0
                ? ` - ${reviewCount} câu gắn nhãn "cần kiểm tra" vì AI không thấy đáp án đúng trong tài liệu, hãy xem kỹ trước khi lưu.`
                : '.'}
            </Text>
            <View style={styles.list}>
              {drafts.map((d, i) => (
                <View key={i} style={styles.item}>
                  <Checkbox
                    checked={picked.includes(i)}
                    onChange={e => togglePick(i, e.target.checked)}
                  />
                  <View style={styles.itemBody}>
                    <View style={styles.tags}>
                      <Tag color="blue">{QUESTION_TYPE_LABEL[d.type]}</Tag>
                      {d.needsReview && <Tag color="orange">Cần kiểm tra</Tag>}
                    </View>
                    <Text style={styles.question}>{d.questionText}</Text>
                    {d.answers.map((a, ai) => (
                      <Text
                        key={ai}
                        style={a.isCorrect ? styles.correct : styles.answer}>
                        {a.isCorrect ? '✓ ' : '• '}
                        {a.text}
                        {a.blankIndex ? `  (ô {{${a.blankIndex}}})` : ''}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.footer}>
              <AppButton style={styles.button} onClick={() => setDrafts([])}>
                Chọn tài liệu khác
              </AppButton>
              <AppButton
                type="primary"
                style={styles.button}
                disabled={picked.length === 0}
                onClick={handleUse}>
                Thêm {picked.length} câu vào bài tập
              </AppButton>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

export default QuizAiDraftModal;
