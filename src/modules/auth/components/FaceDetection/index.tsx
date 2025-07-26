import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import { useRouter } from 'next/navigation';

const FaceDetection = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [showWarning, setShowWarning] = useState(false);
  const offFaceCountRef = useRef(0);
  const router = useRouter();
  useEffect(() => {
    const runFaceMesh = async () => {
      await tf.setBackend('webgl');
      await tf.ready(); // 👈 BẮT BUỘC
      const model = await facemesh.load();
    };

    runFaceMesh();
  }, []);

  useEffect(() => {
    let model = null;

    const runFaceMesh = async () => {
      model = await facemesh.load();
      console.log('✅ FaceMesh model loaded');

      const detect = async () => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
          const video = webcamRef.current.video;
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;

          webcamRef.current.video.width = videoWidth;
          webcamRef.current.video.height = videoHeight;

          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          const predictions = await model.estimateFaces({ input: video });
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, videoWidth, videoHeight);

          if (predictions.length > 0) {
            predictions.forEach(prediction => {
              const keypoints = prediction.scaledMesh;

              // Vẽ các điểm
              keypoints.forEach(([x, y]) => {
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
                ctx.fillStyle = 'aqua';
                ctx.fill();
              });

              // Kiểm tra hướng mặt (dựa trên khoảng cách 2 mắt)
              const leftEye = keypoints[33]; // mắt trái
              const rightEye = keypoints[263]; // mắt phải

              const eyeDx = Math.abs(leftEye[0] - rightEye[0]);

              // Nếu mắt bị lệch nhiều → mặt không nhìn thẳng
              if (eyeDx < 50) {
                offFaceCountRef.current += 1;
              } else {
                offFaceCountRef.current = 0;
              }

              if (offFaceCountRef.current >= 3) {
                setShowWarning(true);
              } else {
                setShowWarning(false);
              }
            });
          } else {
            // Không tìm thấy mặt
            offFaceCountRef.current += 1;
            if (offFaceCountRef.current >= 3) {
              setShowWarning(true);
            }
          }
        }
      };

      setInterval(detect, 300); // Chạy mỗi 300ms
    };

    runFaceMesh();
  }, []);

  return (
    <div style={{ position: 'relative', width: 640, height: 480 }}>
      <Webcam
        ref={webcamRef}
        audio={false}
        videoConstraints={{ facingMode: 'user' }}
        onUserMediaError={err => {
          alert(
            '⚠️ No webcam detected. Please connect a camera to use this feature.',
          );
          router.back(); // 👈 Quay lại trang trước
        }}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 640,
          height: 480,
          zIndex: 1,
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          left: 890,
          top: 0,
          width: 640,
          backgroundColor: 'red',
          height: 480,
          zIndex: 2,
        }}
      />

      {/* Modal cảnh báo nếu không nhìn thẳng */}
      {showWarning && (
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 0, 0, 0.85)',
            color: 'white',
            padding: 20,
            borderRadius: 10,
            zIndex: 1000,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          🚨 Please look straight at the screen!
        </div>
      )}
    </div>
  );
};

export default FaceDetection;
