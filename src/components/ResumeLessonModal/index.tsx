import React from 'react';
import { Modal, Button } from 'antd';
import {
  InfoCircleOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import './styles.scss';

const ResumeLessonModal = ({ open, resumeInfo, onRestart, onResume }) => {
  return (
    <Modal
      open={open}
      width={420}
      centered
      closable={false}
      maskClosable={false}
      title={
        <div className="resume-modal-title">
          <InfoCircleOutlined />
          <span>Tiếp tục bài học?</span>
        </div>
      }
      footer={
        <div className="resume-modal-footer">
          <Button
            icon={<ReloadOutlined />}
            className="resume-modal-btn"
            onClick={onRestart}>
            Xem lại từ đầu
          </Button>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            className="resume-modal-btn"
            onClick={onResume}>
            Tiếp tục xem
          </Button>
        </div>
      }>
      {resumeInfo && (
        <div className="resume-modal-body">
          Bạn đã dừng lại ở:{' '}
          <span className="resume-modal-time-tag">
            <PlayCircleOutlined />
            {Math.floor(resumeInfo.lastPosition / 60) > 0
              ? `${Math.floor(resumeInfo.lastPosition / 60)} phút ${Math.floor(resumeInfo.lastPosition % 60)} giây`
              : `${Math.floor(resumeInfo.lastPosition % 60)} giây`}
          </span>
        </div>
      )}
    </Modal>
  );
};

export default ResumeLessonModal;
