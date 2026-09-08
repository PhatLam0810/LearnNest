'use client';
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Empty, Popconfirm, Spin } from 'antd';
import { ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { messageApi } from '@hooks';
import {
  useDeleteLessonNoteMutation,
  useGetMyLessonNotesQuery,
} from '~mdDashboard/redux';
import type { LessonNote } from '~mdDashboard/redux/RTKQuery/types';
import { formatVideoTimestamp } from '@/utils/time';
import './styles.scss';

type Group = {
  subLessonId: string;
  title: string;
  lessonId?: string;
  isVideo: boolean;
  notes: LessonNote[];
};

const subInfo = (n: LessonNote) =>
  typeof n.subLessonId === 'string'
    ? { _id: n.subLessonId, title: 'Bài học', type: '' }
    : n.subLessonId;

const MyNotesPage: React.FC = () => {
  const router = useRouter();
  const { data, isFetching } = useGetMyLessonNotesQuery({ pageSize: 100 });
  const [deleteNote] = useDeleteLessonNoteMutation();

  const groups = useMemo<Group[]>(() => {
    const map = new Map<string, Group>();
    for (const n of data?.items || []) {
      const s = subInfo(n);
      const g = map.get(s._id) || {
        subLessonId: s._id,
        title: s.title,
        lessonId: n.lessonId,
        isVideo: ['Youtube', 'Video', 'Short'].includes(s.type),
        notes: [],
      };
      g.notes.push(n);
      map.set(s._id, g);
    }
    for (const g of map.values()) {
      g.notes.sort((a, b) => (a.videoTimeSec || 0) - (b.videoTimeSec || 0));
    }
    return [...map.values()];
  }, [data]);

  const openLesson = (g: Group) => {
    if (g.lessonId) {
      router.push(
        `/dashboard/home/lesson/moduleDetail?lessonId=${g.lessonId}&subLessonId=${g.subLessonId}`,
      );
    } else {
      messageApi.info('Không xác định được khoá học của bài này.');
    }
  };

  const handleDelete = async (n: LessonNote) => {
    try {
      await deleteNote({
        id: n._id,
        subLessonId: subInfo(n)._id,
      }).unwrap();
    } catch {
      messageApi.error('Không xoá được ghi chú');
    }
  };

  if (isFetching && !data) {
    return (
      <div className="my-notes-center">
        <Spin />
      </div>
    );
  }

  return (
    <div className="my-notes-page">
      <h1 className="my-notes-heading">Ghi chú của tôi</h1>
      <p className="my-notes-sub">
        Tất cả ghi chú bạn đã tạo trong các bài học.
      </p>

      {groups.length === 0 ? (
        <Empty description="Bạn chưa có ghi chú nào." />
      ) : (
        <div className="my-notes-groups">
          {groups.map(g => (
            <div key={g.subLessonId} className="my-notes-group">
              <div className="my-notes-group-head">
                <span className="my-notes-group-title">{g.title}</span>
                <button
                  type="button"
                  className="my-notes-open-link"
                  onClick={() => openLesson(g)}>
                  Mở bài học →
                </button>
              </div>
              <div className="my-notes-items">
                {g.notes.map(n => (
                  <div key={n._id} className="my-notes-item">
                    {g.isVideo && (
                      <span className="my-notes-ts">
                        <ClockCircleOutlined />{' '}
                        {formatVideoTimestamp(n.videoTimeSec || 0)}
                      </span>
                    )}
                    <span className="my-notes-content">{n.content}</span>
                    <Popconfirm
                      title="Xoá ghi chú này?"
                      okText="Xoá"
                      cancelText="Huỷ"
                      onConfirm={() => handleDelete(n)}>
                      <DeleteOutlined className="my-notes-del" />
                    </Popconfirm>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNotesPage;
