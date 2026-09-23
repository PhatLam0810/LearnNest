'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  FileSpreadsheet,
  Cpu,
  Trophy,
  ArrowRight,
} from 'lucide-react';

export default function LandingProductShowcase() {
  const [activeTab, setActiveTab] = useState<'exam' | 'ai'>('exam');

  return (
    <div className="showcase">
      {/* Thanh tiêu đề cửa sổ mô phỏng ứng dụng web (App Window Bar) */}
      <div className="showcase__window-bar">
        <div className="showcase__window-dots">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>
        <div className="showcase__window-address">
          <span className="showcase__lock-icon">🔒</span>
          learnnest.vhu.edu.vn/exam/mos-excel-specialist-2019
        </div>
        <div className="showcase__window-badge">
          <span className="live-indicator" /> PHÒNG THI MÔ PHỎNG REAL-TIME
        </div>
      </div>

      {/* Header bên trong phòng thi */}
      <div className="showcase__inner-header">
        <div className="showcase__exam-info">
          <div className="showcase__exam-icon">
            <FileSpreadsheet size={22} color="#107c41" />
          </div>
          <div>
            <div className="showcase__exam-name">
              MOS Excel Associate 2019 - Practice Exam 01
            </div>
            <div className="showcase__exam-sub">
              Dự án 3/7: Quản Lý Doanh Thu & Điểm Thưởng Khách Hàng
            </div>
          </div>
        </div>

        <div className="showcase__timer-box">
          <Clock size={16} className="showcase__timer-icon" />
          <span className="showcase__timer-text">38:45</span>
          <span className="showcase__timer-sub">/ 50:00</span>
        </div>

        <div className="showcase__tab-controls">
          <button
            type="button"
            className={`showcase__tab-btn ${activeTab === 'exam' ? 'showcase__tab-btn--active' : ''}`}
            onClick={() => setActiveTab('exam')}>
            Đề bài & Nhiệm vụ
          </button>
          <button
            type="button"
            className={`showcase__tab-btn ${activeTab === 'ai' ? 'showcase__tab-btn--active' : ''}`}
            onClick={() => setActiveTab('ai')}>
            <Sparkles size={14} /> AI Chấm Điểm
          </button>
        </div>
      </div>

      {/* Nội dung bên trong phòng thi */}
      <div className="showcase__body">
        {activeTab === 'exam' ? (
          <div className="showcase__grid">
            {/* Cột trái: Danh sách Task đề thi MOS */}
            <div className="showcase__tasks-col">
              <div className="showcase__section-title">
                <span>Nhiệm vụ cần thực hiện (Tasks)</span>
                <span className="showcase__task-counter">3 / 5 hoàn thành</span>
              </div>

              <div className="showcase__task-item showcase__task-item--done">
                <div className="showcase__task-check">
                  <CheckCircle2 size={18} color="#15803d" />
                </div>
                <div className="showcase__task-content">
                  <div className="showcase__task-header">
                    <strong>Task 1: Chèn hàm tính toán</strong>
                    <span className="badge badge--success">Đã hoàn thành</span>
                  </div>
                  <p>
                    Tại ô <code>G5:G25</code>, sử dụng hàm <code>VLOOKUP</code>{' '}
                    kết hợp với bảng dữ liệu <code>RateTable</code> để xác định
                    tỷ lệ chiết khấu theo phân loại hội viên.
                  </p>
                </div>
              </div>

              <div className="showcase__task-item showcase__task-item--done">
                <div className="showcase__task-check">
                  <CheckCircle2 size={18} color="#15803d" />
                </div>
                <div className="showcase__task-content">
                  <div className="showcase__task-header">
                    <strong>Task 2: Định dạng bảng biểu</strong>
                    <span className="badge badge--success">Đã hoàn thành</span>
                  </div>
                  <p>
                    Áp dụng kiểu bảng <code>Table Style Medium 9</code> cho toàn
                    bộ vùng <code>A4:H25</code>. Bật tùy chọn Total Row.
                  </p>
                </div>
              </div>

              <div className="showcase__task-item showcase__task-item--active">
                <div className="showcase__task-check">
                  <span className="task-number">3</span>
                </div>
                <div className="showcase__task-content">
                  <div className="showcase__task-header">
                    <strong>Task 3: Vẽ biểu đồ cột 3-D Clustered Column</strong>
                    <span className="badge badge--primary">Đang làm</span>
                  </div>
                  <p>
                    Tạo biểu đồ cột thể hiện Doanh thu theo từng Quý, đặt tiêu
                    đề biểu đồ là <code>Q1-Q4 Revenue Summary</code> và di
                    chuyển sang Sheet mới.
                  </p>
                </div>
              </div>
            </div>

            {/* Cột phải: Khung mô phỏng bảng tính Excel & Trợ lý */}
            <div className="showcase__preview-col">
              <div className="showcase__excel-card">
                <div className="showcase__excel-bar">
                  <span className="fx-label">fx</span>
                  <div className="fx-input">
                    =VLOOKUP(D5, RateTable!$A$2:$C$10, 2, FALSE)
                  </div>
                </div>
                <div className="showcase__sheet-mock">
                  <div className="sheet-row sheet-row--head">
                    <span className="col-idx">#</span>
                    <span>Mã KH</span>
                    <span>Họ và Tên</span>
                    <span>Doanh Thu</span>
                    <span>Chiết Khấu</span>
                  </div>
                  <div className="sheet-row">
                    <span className="col-idx">5</span>
                    <span>KH-0192</span>
                    <span>Nguyễn Văn An</span>
                    <span className="num">24,500,000 đ</span>
                    <span className="tag-pct">15%</span>
                  </div>
                  <div className="sheet-row sheet-row--highlight">
                    <span className="col-idx">6</span>
                    <span>KH-0418</span>
                    <span>Trần Thị Mai</span>
                    <span className="num">38,200,000 đ</span>
                    <span className="tag-pct">20%</span>
                  </div>
                  <div className="sheet-row">
                    <span className="col-idx">7</span>
                    <span>KH-0891</span>
                    <span>Lê Hoàng Nam</span>
                    <span className="num">12,800,000 đ</span>
                    <span className="tag-pct">10%</span>
                  </div>
                </div>
              </div>

              {/* Hộp gợi ý thông minh của AI */}
              <div className="showcase__ai-tip">
                <div className="ai-tip-icon">
                  <Cpu size={18} color="#1d418a" />
                </div>
                <div className="ai-tip-text">
                  <strong>LearnNest AI Coach:</strong> "Công thức VLOOKUP của
                  bạn đã khóa tuyệt đối vùng tham chiếu <code>$A$2:$C$10</code>{' '}
                  rất chính xác! Hãy lưu ý tiếp tục định dạng cột Chiết Khấu
                  sang kiểu Percentage."
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Màn hình kết quả chấm điểm AI */
          <div className="showcase__grading-view">
            <div className="grading-score-card">
              <div className="grading-score-header">
                <div className="trophy-badge">
                  <Trophy size={28} color="#f0c356" />
                </div>
                <div>
                  <div className="grading-verdict">
                    XẾP LOẠI: XUẤT SẮC (PASS)
                  </div>
                  <div className="grading-title">
                    Chứng Chỉ Tin Học Văn Phòng MOS Excel 2019
                  </div>
                </div>
              </div>

              <div className="grading-score-stat">
                <div className="score-num">
                  965<span>/1000</span>
                </div>
                <div className="score-desc">
                  Vượt ngưỡng chuẩn đầu ra VHU (Yêu cầu tối thiểu 700/1000 điểm)
                </div>
              </div>
            </div>

            <div className="grading-criteria-list">
              <div className="criteria-item">
                <CheckCircle2 size={18} color="#15803d" />
                <span className="criteria-name">
                  Cấu trúc bảng & Total Row (ExcelJS AST)
                </span>
                <span className="criteria-pts">+200 pts</span>
              </div>
              <div className="criteria-item">
                <CheckCircle2 size={18} color="#15803d" />
                <span className="criteria-name">
                  Độ chính xác công thức VLOOKUP & SUMIFS
                </span>
                <span className="criteria-pts">+250 pts</span>
              </div>
              <div className="criteria-item">
                <CheckCircle2 size={18} color="#15803d" />
                <span className="criteria-name">
                  Định dạng Number Format & Conditional Formatting
                </span>
                <span className="criteria-pts">+215 pts</span>
              </div>
              <div className="criteria-item">
                <CheckCircle2 size={18} color="#15803d" />
                <span className="criteria-name">
                  Biểu đồ 3-D Column Chart & Data Labels
                </span>
                <span className="criteria-pts">+300 pts</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer bar của mockup */}
      <div className="showcase__footer">
        <div className="showcase__footer-info">
          💡 Hệ thống chấm tự động phân tích sâu từng cell XML, trả kết quả tức
          thì trong 3 giây.
        </div>
        <a href="/login" className="showcase__cta-link">
          Trải nghiệm thi thử miễn phí ngay <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}
