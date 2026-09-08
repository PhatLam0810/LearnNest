'use client';
import React, { useMemo, useState } from 'react';
import { Button, Input, Popconfirm, Spin } from 'antd';
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
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
  const [updateNote] = useUpdateLessonNoteMutation();
  const [deleteNote] = useDeleteLessonNoteMutation();

  const [text, setText] = useState('');
  // Mốc thời gian "chốt" khi bấm nút đồng hồ; null = ghi chú không gắn mốc.
  const [pinnedSec, setPinnedSec] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const sorted = useMemo(
    () =>
      [...(notes || [])].sort(
        (a, b) => (a.videoTimeSec || 0) - (b.videoTimeSec || 0),
      ),
    [notes],
  );

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
    } catch {
      messageApi.error('Không lưu được ghi chú');
    }
  };

  const handleSaveEdit = async (note: LessonNote) => {
    if (!editingText.trim()) return;
    try {
      await updateNote({
        id: note._id,
        subLessonId,
        content: editingText.trim(),
      }).unwrap();
      setEditingId(null);
    } catch {
      messageApi.error('Không sửa được ghi chú');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote({ id, subLessonId }).unwrap();
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
                        setEditingId(note._id);
                        setEditingText(note.content);
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
                    <Button size="small" onClick={() => setEditingId(null)}>
                      Huỷ
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => handleSaveEdit(note)}>
                      Lưu
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
