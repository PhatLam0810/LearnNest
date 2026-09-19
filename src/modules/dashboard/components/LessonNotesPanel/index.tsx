'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Popconfirm, Spin } from 'antd';
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { messageApi } from '@hooks';
import {
  useCreateLessonNoteMutation,
  useDeleteLessonNoteMutation,
  useGetLessonNotesQuery,
  useUpdateLessonNoteMutation,
} from '~mdDashboard/redux';
import type { LessonNote } from '~mdDashboard/redux/RTKQuery/types';
import { formatVideoTimestamp } from '@/utils/time';
import styles from './styles';

interface LessonNotesPanelProps {
  subLessonId: string;
  lessonId?: string;
  // Bài dạng video -> cho phép neo ghi chú vào mốc thời gian đang phát.
  isVideo?: boolean;
  getCurrentTimeSec?: () => number;
  onSeek?: (sec: number) => void;
}

const LessonNotesPanel: React.FC<LessonNotesPanelProps> = ({
  subLessonId,
  lessonId,
  isVideo,
  getCurrentTimeSec,
  onSeek,
}) => {
  const { data: notes, isFetching } = useGetLessonNotesQuery(subLessonId, {
    skip: !subLessonId,
  });
  const [createNote, { isLoading: creating }] = useCreateLessonNoteMutation();
  const [updateNote, { isLoading: updating }] = useUpdateLessonNoteMutation();
  const [deleteNote] = useDeleteLessonNoteMutation();

  const [text, setText] = useState('');
  // Mốc thời gian "chốt" khi bấm nút đồng hồ; null = ghi chú không gắn mốc.
  const [pinnedSec, setPinnedSec] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  // Lần lưu/sửa/xoá thành công gần nhất trong phiên; chưa có lần nào thì
  // không hiện "Đã lưu lúc".
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  // Nội dung sửa đã gửi lên server gần nhất — so với nó (không phải cache
  // server) để tự lưu không bị đặt lại khi server trả bản ghi về.
  const lastSentRef = useRef<string | null>(null);

  const sorted = useMemo(
    () =>
      [...(notes || [])].sort(
        (a, b) => (a.videoTimeSec || 0) - (b.videoTimeSec || 0),
      ),
    [notes],
  );

  // Đổi sang bài học khác thì mốc "đã lưu" của bài trước không còn đúng.
  useEffect(() => {
    setLastSavedAt(null);
  }, [subLessonId]);

  const handleCaptureTime = () => {
    const sec = Math.max(0, Math.floor(getCurrentTimeSec?.() ?? 0));
    setPinnedSec(sec);
  };

  const handleCreate = async () => {
    if (!text.trim()) return;
    try {
      await createNote({
        subLessonId,
        lessonId,
        videoTimeSec: pinnedSec ?? 0,
        content: text.trim(),
      }).unwrap();
      setText('');
      setPinnedSec(null);
      setLastSavedAt(new Date());
    } catch {
      messageApi.error('Không lưu được ghi chú');
    }
  };

  // closeEditor=false: tự lưu khi đang gõ, giữ nguyên chế độ sửa.
  // closeEditor=true ("Xong"): lưu nốt phần chưa lưu (nếu có) rồi đóng.
  const handleSaveEdit = async (
    note: LessonNote,
    content: string,
    closeEditor: boolean,
  ) => {
    const next = content.trim();
    // Rỗng hoặc không đổi so với lần gửi gần nhất -> không gọi API.
    if (!next || next === lastSentRef.current) {
      if (closeEditor) setEditingId(null);
      return;
    }
    lastSentRef.current = next;
    try {
      await updateNote({
        id: note._id,
        subLessonId,
        content: next,
      }).unwrap();
      setLastSavedAt(new Date());
      if (closeEditor) setEditingId(null);
    } catch {
      lastSentRef.current = null;
      messageApi.error('Không sửa được ghi chú');
    }
  };

  // Sửa ghi chú đã có thì tự lưu sau 1,5 giây ngừng gõ (tạo mới vẫn bấm nút
  // "Lưu ghi chú"). Nút "Xong" đóng chế độ sửa và lưu nốt nếu còn thay đổi.
  const editingNote = notes?.find(n => n._id === editingId);
  useEffect(() => {
    if (!editingNote) return;
    const timer = setTimeout(
      () => handleSaveEdit(editingNote, editingText, false),
      1500,
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingText, editingId]);

  const handleDelete = async (id: string) => {
    try {
      await deleteNote({ id, subLessonId }).unwrap();
      setLastSavedAt(new Date());
    } catch {
      messageApi.error('Không xoá được ghi chú');
    }
  };

  return (
    <div className="lesson-notes-panel" style={styles.wrap}>
      <div style={styles.composer}>
        <Input.TextArea
          value={text}
          onChange={e => setText(e.target.value)}
          autoSize={{ minRows: 2, maxRows: 6 }}
          maxLength={2000}
          placeholder="Ghi lại ý chính, chỗ chưa hiểu, mẹo làm bài..."
        />
        <div style={styles.composerFooter}>
          {isVideo && (
            <Button
              size="small"
              icon={<ClockCircleOutlined />}
              onClick={handleCaptureTime}>
              {pinnedSec === null
                ? 'Gắn mốc thời gian đang xem'
                : `Mốc: ${formatVideoTimestamp(pinnedSec)}`}
            </Button>
          )}
          {pinnedSec !== null && (
            <Button size="small" type="text" onClick={() => setPinnedSec(null)}>
              Bỏ mốc
            </Button>
          )}
          <div style={{ flex: 1 }} />
          <Button
            type="primary"
            size="small"
            loading={creating}
            disabled={!text.trim()}
            onClick={handleCreate}>
            Lưu ghi chú
          </Button>
        </div>
      </div>

      {(updating || lastSavedAt) && (
        <div style={styles.savedAt} role="status">
          {updating
            ? 'Đang lưu...'
            : `Đã lưu lúc ${dayjs(lastSavedAt).format('HH:mm')}`}
        </div>
      )}

      {isFetching && !notes ? (
        <div style={styles.center}>
          <Spin size="small" />
        </div>
      ) : sorted.length === 0 ? (
        <div style={styles.empty}>Chưa có ghi chú nào cho bài học này.</div>
      ) : (
        <div style={styles.list}>
          {sorted.map(note => (
            <div key={note._id} style={styles.item}>
              <div style={styles.itemHead}>
                {isVideo && (
                  <button
                    type="button"
                    style={styles.tsChip}
                    onClick={() => onSeek?.(note.videoTimeSec || 0)}>
                    <ClockCircleOutlined />{' '}
                    {formatVideoTimestamp(note.videoTimeSec || 0)}
                  </button>
                )}
                <div style={{ flex: 1 }} />
                {editingId !== note._id && (
                  <>
                    <EditOutlined
                      style={styles.actionIcon}
                      onClick={() => {
                        // Đang sửa ghi chú khác: lưu nốt phần chưa lưu trước
                        // khi đổi editingId (timer tự lưu sẽ bị hủy khi đổi).
                        if (editingNote) {
                          handleSaveEdit(editingNote, editingText, false);
                        }
                        setEditingId(note._id);
                        setEditingText(note.content);
                        lastSentRef.current = note.content.trim();
                      }}
                    />
                    <Popconfirm
                      title="Xoá ghi chú này?"
                      okText="Xoá"
                      cancelText="Huỷ"
                      onConfirm={() => handleDelete(note._id)}>
                      <DeleteOutlined
                        style={{ ...styles.actionIcon, color: '#c0392b' }}
                      />
                    </Popconfirm>
                  </>
                )}
              </div>
              {editingId === note._id ? (
                <div style={styles.editRow}>
                  <Input.TextArea
                    value={editingText}
                    onChange={e => setEditingText(e.target.value)}
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    maxLength={2000}
                  />
                  <div style={styles.editActions}>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => handleSaveEdit(note, editingText, true)}>
                      Xong
                    </Button>
                  </div>
                </div>
              ) : (
                <div style={styles.content}>{note.content}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonNotesPanel;
