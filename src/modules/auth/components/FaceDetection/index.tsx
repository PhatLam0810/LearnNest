import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import { usePathname, useRouter } from 'next/navigation';

const FaceDetection = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [showWarning, setShowWarning] = useState(false);
  const [openCamera, setOpenCamera] = useState(true);
  const offFaceCountRef = useRef(0);
  const router = useRouter();
  const animationFrameIdRef = useRef(null);

  useEffect(() => {
    let model = null;
    let isMounted = true; // 👈 để tránh leak vòng lặp

    const runFaceMesh = async () => {
      console.log('🚀 Init TensorFlow backend...');
      await tf.setBackend('webgl');
      await tf.ready();
      console.log('✅ TensorFlow backend ready');

      console.log('📦 Loading FaceMesh model...');
      model = await facemesh.load();
      console.log('✅ FaceMesh model loaded');

      const detect = async () => {
        if (!isMounted) return; // 👈 đã unmount thì dừng hẳn

        try {
          if (!webcamRef.current) {
            console.log('⏸️ webcamRef chưa sẵn sàng');
          } else if (webcamRef.current.video.readyState !== 4) {
            console.log('📷 Camera chưa sẵn sàng');
          } else {
            const video = webcamRef.current.video;
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            // gán kích thước cho canvas và video
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            console.log('🎥 Detecting frame...');
            const predictions = await model.estimateFaces({ input: video });
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, videoWidth, videoHeight);

            if (predictions.length > 0) {
              console.log(`😀 Phát hiện ${predictions.length} khuôn mặt`);

              predictions.forEach((prediction, idx) => {
                const keypoints = prediction.scaledMesh;

                // vẽ keypoints
                keypoints.forEach(([x, y]) => {
                  ctx.beginPath();
                  ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
                  ctx.fillStyle = 'aqua';
                  ctx.fill();
                });

                // check hướng mặt
                const leftEye = keypoints[33];
                const rightEye = keypoints[263];
                const eyeDx = Math.abs(leftEye[0] - rightEye[0]);

                if (eyeDx < 50) {
                  offFaceCountRef.current += 1;
                  console.log(
                    '⚠️ Mặt không nhìn thẳng:',
                    offFaceCountRef.current,
                  );
                } else {
                  offFaceCountRef.current = 0;
                  console.log('✅ Mặt nhìn thẳng');
                }

                if (offFaceCountRef.current >= 3) {
                  setShowWarning(true);
                } else {
                  setShowWarning(false);
                }
              });
            } else {
              offFaceCountRef.current += 1;
              console.log('❌ Không tìm thấy mặt:', offFaceCountRef.current);

              if (offFaceCountRef.current >= 3) {
                setShowWarning(true);
              }
            }
          }
        } catch (err) {
          console.error('❌ detect error:', err);
        }

        // tiếp tục loop nếu còn mounted
        if (isMounted) {
          animationFrameIdRef.current = requestAnimationFrame(detect);
        }
      };

      console.log('▶️ Bắt đầu detection loop...');
      detect();
    };

    if (openCamera) {
      runFaceMesh();
    }

    return () => {
      // cleanup
      isMounted = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
        console.log('🛑 Stop detection loop (cleanup)');
      }
    };
  }, [openCamera]);

  return (
    <div style={{ width: 640, height: 480 }}>
      <Webcam
        ref={webcamRef}
        audio={false}
        videoConstraints={{ facingMode: 'user' }}
        onUserMediaError={err => {
          alert(
            '⚠️ No webcam detected. Please connect a camera to use this feature.',
          );
          router.back(); // 👈 Quay lại trang trước
          setOpenCamera(false);
        }}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 640,
          height: 480,
          backgroundColor: 'black',
          zIndex: 3,
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
          zIndex: 3,
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
