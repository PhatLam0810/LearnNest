'use client';
import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import { Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@redux';
import { dashboardAction } from '~mdDashboard/redux';

type FaceDetectionProps = {
  onPauseVideo: () => void;
};

const FaceDetection: React.FC<FaceDetectionProps> = ({ onPauseVideo }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offFaceCountRef = useRef(0);
  const [showWarning, setShowWarning] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    let model: facemesh.FaceMesh | null = null;
    let animationFrameId: number;
    let isMounted = true;

    // 🚀 Khởi tạo webcam thật
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        Modal.error({
          title: 'Không thể mở camera 🚫',
          content:
            'Vui lòng kiểm tra lại kết nối camera và cho phép truy cập webcam.',
          onOk: () => router.back(),
        });
      }
    };

    const runFaceMesh = async () => {
      await tf.setBackend('webgl');
      await tf.ready();

      model = await facemesh.load();

      const detect = async () => {
        if (!isMounted || !videoRef.current || !canvasRef.current || !model)
          return;
        const video = videoRef.current;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const predictions = await model.estimateFaces(video);

        ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        if (predictions.length > 0) {
          const keypoints = predictions[0].scaledMesh;
          offFaceCountRef.current = 0;

          const leftCheek = keypoints[234];
          const rightCheek = keypoints[454];

          const yaw = (rightCheek[0] - leftCheek[0]) / 200; // quay trái/phải

          let offCenter = false;

          if (yaw < 0.5) {
            offCenter = true;
          }

          if (offCenter) {
            setShowWarning(true);
            dispatch(dashboardAction.setVideoStatus(false));
          } else {
            setShowWarning(false);
            dispatch(dashboardAction.setVideoStatus(true));
          }
        } else {
          offFaceCountRef.current += 1;
          if (offFaceCountRef.current >= 10) {
            setShowWarning(true);
            onPauseVideo();
          }
        }

        if (isMounted) animationFrameId = requestAnimationFrame(detect);
      };

      detect();
    };

    setupCamera().then(runFaceMesh);

    return () => {
      isMounted = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      model = null;
    };
  }, [router]);

  return (
    <div style={{ display: 'flex', width: '100%', flex: 1 }}>
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: 240,
          maxHeight: 260,
          aspectRatio: '4 / 3',
          objectFit: 'cover',
          display: 'block',
          overflow: 'hidden',
          zIndex: 4,
        }}
      />
      <canvas
        ref={canvasRef}
        width="200"
        height="480"
        style={{
          display: 'none',
        }}
      />

      <Modal
        open={showWarning}
        centered
        closable={false}
        footer={null}
        style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>
          🚨 Không phát hiện khuôn mặt!
        </p>
      </Modal>
    </div>
  );
};

export default FaceDetection;
