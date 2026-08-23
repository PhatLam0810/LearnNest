'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocket } from './useSocket';

export type UploadStage = 'transcoding' | 'uploading' | 'done';

type UploadProgressPayload = {
  uploadId: string;
  percent: number;
  stage: UploadStage;
};

// Tracks real transcode/upload progress pushed by the backend over socket.io
// for one upload at a time (identified by uploadId).
export const useUploadProgress = () => {
  const socket = useSocket();
  const uploadIdRef = useRef<string>('');
  const [percent, setPercent] = useState<number | null>(null);
  const [stage, setStage] = useState<UploadStage | null>(null);

  useEffect(() => {
    const handleProgress = (payload: UploadProgressPayload) => {
      if (payload.uploadId !== uploadIdRef.current) return;
      setPercent(payload.percent);
      setStage(payload.stage);
    };

    socket.on('uploadProgress', handleProgress);
    return () => {
      socket.off('uploadProgress', handleProgress);
    };
  }, [socket]);

  // Call before starting a new upload — generates a fresh id so progress
  // events from a previous/unrelated upload can't leak into this one.
  const startNewUpload = useCallback(() => {
    uploadIdRef.current = crypto.randomUUID();
    setPercent(null);
    setStage(null);
    return uploadIdRef.current;
  }, []);

  const getUploadId = useCallback(() => uploadIdRef.current, []);

  return { percent, stage, startNewUpload, getUploadId };
};
