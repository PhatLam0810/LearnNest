'use client';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Text, View } from 'react-native-web';
import { Document, Page } from 'react-pdf';
import { Button, Spin } from 'antd';
import {
  CheckCircleOutlined,
  DownloadOutlined,
  ExportOutlined,
  LeftOutlined,
  PrinterOutlined,
  RightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import api from '@/services/api';
import { messageApi } from '@hooks';
import { Library } from '~mdDashboard/types';
import styles from './styles';

// pdfjs worker đã được cấu hình 1 lần ở app/RootLayoutClient.tsx.

type Props = {
  data: Library & { allowDownload?: boolean };
  lessonId?: string;
  userId?: string;
  // Gọi khi tài liệu được coi là hoàn thành (đọc hết trang cuối hoặc bấm
  // "Đã đọc xong") — tái dùng đúng callback onWatchFinish của video để
  // rollup tiến độ khóa học.
  onComplete?: () => void;
};

const MIN_SCALE = 0.6;
const MAX_SCALE = 2.5;
const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

const PdfLessonViewer: React.FC<Props> = ({
  data,
  lessonId,
  userId,
  onComplete,
}) => {
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [maxPageSeen, setMaxPageSeen] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [baseWidth, setBaseWidth] = useState(760);

  const scrollRef = useRef<any>(null);
  const lastSentRef = useRef(0);
  const allowDownload = data.allowDownload !== false;

  useLayoutEffect(() => {
    const el = scrollRef.current as HTMLElement | null;
    if (!el) return;
    const measure = () =>
      setBaseWidth(Math.max(320, Math.min(el.clientWidth - 32, 900)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Resume tới trang đọc dở lần trước.
  useEffect(() => {
    if (!userId || !data?._id) return;
    api
      .get(`/lesson/user/${userId}/sublesson/${data._id}/progress`, {
        params: { lessonId },
      })
      .then(res => {
        const d = res?.data?.data ?? res?.data;
        if (d?.completed) setCompleted(true);
        const last = Number(d?.lastPosition) || 0;
        if (last > 1) {
          setPage(last);
          setMaxPageSeen(last);
        }
      })
      .catch(() => {});
  }, [userId, data?._id, lessonId]);

  const sendProgress = useCallback(
    (pageReached: number, total: number, done?: boolean) => {
      if (!userId || !data?._id || !total) return;
      const payload: Record<string, unknown> = {
        userId,
        subLessonId: data._id,
        duration: total,
        watchedSeconds: pageReached,
        currentTime: pageReached,
        lastPosition: pageReached,
        progress: done ? 100 : Math.round((pageReached / total) * 100),
        completed: done || pageReached >= total,
      };
      if (lessonId) payload.lessonId = lessonId;
      api
        .post('/lesson/video/track', payload, { timeout: 4000 })
        .catch(() => {});
    },
    [userId, data?._id, lessonId],
  );

  // Gửi tiến độ mỗi khi mốc trang xa nhất tăng (kèm chặn spam 1.5s, trừ
  // lần chạm trang cuối thì gửi ngay).
  useEffect(() => {
    if (!numPages) return;
    const done = maxPageSeen >= numPages;
    const now = Date.now();
    if (!done && now - lastSentRef.current < 1500) return;
    lastSentRef.current = now;
    sendProgress(maxPageSeen, numPages, done);
    if (done && !completed) {
      setCompleted(true);
      onComplete?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPageSeen, numPages]);

  const goTo = (next: number) => {
    if (!numPages) return;
    const p = Math.min(numPages, Math.max(1, next));
    setPage(p);
    setMaxPageSeen(prev => Math.max(prev, p));
    const el = scrollRef.current as HTMLElement | null;
    el?.scrollTo({ top: 0 });
  };

  const markDone = () => {
    const total = numPages || maxPageSeen || 1;
    sendProgress(total, total, true);
    setCompleted(true);
    onComplete?.();
    messageApi.success('Đã đánh dấu hoàn thành tài liệu.');
  };

  const download = async () => {
    try {
      const res = await fetch(data.url);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = `${data.title || 'tai-lieu'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch {
      window.open(data.url, '_blank', 'noopener');
    }
  };

  const openInTab = () => window.open(data.url, '_blank', 'noopener');

  if (!data.url || loadError) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.muted}>Không tải được tài liệu PDF.</Text>
        {data.url ? (
          <Button icon={<ExportOutlined />} onClick={openInTab}>
            Mở tab mới
          </Button>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Button
          size="small"
          icon={<LeftOutlined />}
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
        />
        <Text style={styles.pageInfo}>
          Trang {page}/{numPages || '—'}
        </Text>
        <Button
          size="small"
          icon={<RightOutlined />}
          disabled={!numPages || page >= numPages}
          onClick={() => goTo(page + 1)}
        />
        <Button
          size="small"
          icon={<ZoomOutOutlined />}
          disabled={scale <= MIN_SCALE}
          onClick={() => setScale(s => clampScale(s - 0.2))}
        />
        <Text style={styles.pageInfo}>{Math.round(scale * 100)}%</Text>
        <Button
          size="small"
          icon={<ZoomInOutlined />}
          disabled={scale >= MAX_SCALE}
          onClick={() => setScale(s => clampScale(s + 0.2))}
        />

        <View style={styles.spacer} />

        {completed ? (
          <Text style={styles.doneTag}>
            <CheckCircleOutlined /> Đã hoàn thành
          </Text>
        ) : (
          <Button size="small" type="primary" onClick={markDone}>
            Đã đọc xong
          </Button>
        )}

        {allowDownload ? (
          <>
            <Button size="small" icon={<DownloadOutlined />} onClick={download}>
              Tải về
            </Button>
            <Button size="small" icon={<PrinterOutlined />} onClick={openInTab}>
              In
            </Button>
          </>
        ) : null}
      </View>

      <View
        ref={scrollRef}
        style={styles.scrollArea}
        onContextMenu={(e: any) => {
          if (!allowDownload) e.preventDefault();
        }}>
        <Document
          file={data.url}
          loading={<Spin style={{ marginTop: 40 }} />}
          onLoadSuccess={({ numPages: n }) => {
            setNumPages(n);
            setPage(p => Math.min(p, n));
          }}
          onLoadError={() => setLoadError(true)}>
          <Page
            pageNumber={page}
            width={baseWidth}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={<Spin style={{ marginTop: 40 }} />}
          />
        </Document>
      </View>
    </View>
  );
};

export default PdfLessonViewer;
