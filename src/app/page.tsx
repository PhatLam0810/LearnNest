import Link from 'next/link';
import Footer from '@components/Footer';
import { lexend } from '@/styles/typography';
import Reveal from './Reveal';
import LandingProductShowcase from './_components/LandingProductShowcase';
import {
  BookOpen,
  Target,
  Map,
  Bot,
  Library,
  BarChart,
  Sparkles,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
  Star,
  Users,
} from 'lucide-react';
import './landing.css';

type PublicStats = {
  totalLessons: number;
  totalPracticeTasks: number;
  totalUsers: number;
  totalVideos: number;
};

async function getPublicStats(): Promise<PublicStats | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/lesson/publicStats`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const stats = await getPublicStats();

  return (
    <div className={`landing ${lexend.className}`}>
      {/* 1. STICKY GLASSMORPHISM HEADER */}
      <header className="landing__header">
        <Link href="/" className="landing__brand">
          <img src="/images/LogoVhu.png" alt="LearnNest - Đại học Văn Hiến" />
          <div className="landing__brand-text">
            <span className="brand-name">LearnNest</span>
            <span className="brand-sub">Đại học Văn Hiến</span>
          </div>
        </Link>
        <div className="landing__header-actions">
          <Link href="/login" className="landing__btn landing__btn--outline">
            Đăng nhập
          </Link>
          <Link href="/signup" className="landing__btn landing__btn--primary">
            Đăng ký miễn phí
          </Link>
        </div>
      </header>

      {/* 2. MODERN HERO SECTION WITH FLOATING 3D BADGES */}
      <section className="landing__hero">
        <div className="landing__hero-text">
          <div className="landing__hero-tag">
            <Sparkles size={16} className="text-secondary" />
            <span>Nền tảng học tập số chuẩn Đại học Văn Hiến</span>
          </div>
          <h1>
            Học Word, Excel, AI & Tiếng Anh Cùng{' '}
            <span className="text-gradient">Trợ Lý AI Thực Chiến</span>
          </h1>
          <p>
            LearnNest đồng hành cùng sinh viên VHU nâng kỹ năng số và ngoại ngữ:
            luyện Word & Excel sát đề MOS, học AI ứng dụng, rèn Tiếng Anh qua
            trắc nghiệm theo chủ đề, nhận phản hồi tự động và theo dõi tiến độ
            rõ ràng từng ngày.
          </p>
          <div className="landing__hero-ctas">
            <Link
              href="/signup"
              className="landing__btn landing__btn--primary landing__btn--large landing__btn--glow">
              Bắt đầu học ngay <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="landing__btn landing__btn--outline landing__btn--large">
              Đăng nhập tài khoản
            </Link>
          </div>

          {/* Social Proof Mini Bar */}
          <div className="landing__hero-social-proof">
            <div className="proof-avatars">
              <span
                className="proof-avatar"
                style={{ backgroundColor: '#1d418a' }}>
                VH
              </span>
              <span
                className="proof-avatar"
                style={{ backgroundColor: '#f0c356', color: '#111827' }}>
                MS
              </span>
              <span
                className="proof-avatar"
                style={{ backgroundColor: '#15803d' }}>
                IT
              </span>
              <span
                className="proof-avatar"
                style={{ backgroundColor: '#7c3aed' }}>
                AI
              </span>
            </div>
            <div className="proof-text">
              <div className="proof-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#f0c356" color="#f0c356" />
                ))}
              </div>
              <span>
                Hơn <strong>2,500+</strong> sinh viên VHU đang ôn luyện
              </span>
            </div>
          </div>
        </div>

        {/* Hero Visual Column with Floating Badges */}
        <div className="landing__hero-visual">
          <div className="landing__hero-img-wrap">
            <img
              src="/images/BannerScreen1.png"
              alt="LearnNest - nền tảng học Word, Excel, AI và Tiếng Anh"
              className="landing__hero-main-img"
            />

            {/* Floating Badge 1: Tỷ lệ đạt */}
            <div className="floating-badge floating-badge--top-left float-anim-1">
              <div className="floating-badge__icon floating-badge__icon--fire">
                <Flame size={20} />
              </div>
              <div className="floating-badge__content">
                <strong>98.6% Tỷ lệ Đậu</strong>
                <span>Chứng chỉ MOS Word & Excel</span>
              </div>
            </div>

            {/* Floating Badge 2: AI Chấm Thi Siêu Tốc */}
            <div className="floating-badge floating-badge--bottom-right float-anim-2">
              <div className="floating-badge__icon floating-badge__icon--zap">
                <Zap size={20} />
              </div>
              <div className="floating-badge__content">
                <strong>Chấm AI Tự Động</strong>
                <span>Kết quả chi tiết sau 3 giây</span>
              </div>
            </div>

            {/* Floating Badge 3: Điểm Tuyệt Đối */}
            <div className="floating-badge floating-badge--bottom-left float-anim-3">
              <div className="floating-badge__icon floating-badge__icon--trophy">
                <Award size={20} />
              </div>
              <div className="floating-badge__content">
                <strong>1,000/1,000 Điểm</strong>
                <span>Kỷ lục sinh viên VHU đạt được</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOCIAL PROOF / VHU STUDENT TESTIMONIALS */}
      <section className="landing__testimonials-section">
        <div className="landing__container">
          <Reveal>
            <div className="landing__section-head">
              <span className="section-pill">CẢM NHẬN SINH VIÊN</span>
              <h2>Sinh Viên Đại Học Văn Hiến Nói Gì Về LearnNest?</h2>
              <p>
                Câu chuyện thật từ các bạn sinh viên đã trải nghiệm kỳ thi MOS
                tại Đại học Văn Hiến.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="interview-video">
              {/* preload="none": file ~13MB chỉ tải khi người xem bấm phát. */}
              <video
                controls
                playsInline
                preload="none"
                poster="/videos/phong-van-sinh-vien.jpg"
                aria-label="Sinh viên Đại học Văn Hiến chia sẻ kinh nghiệm thi MOS"
                className="interview-video__player">
                <source
                  src="/videos/phong-van-sinh-vien.mp4"
                  type="video/mp4"
                />
              </video>
              <p className="interview-video__caption">
                Chia sẻ từ các bạn sinh viên đã trải nghiệm kỳ thi MOS tại VHU:
                cách ôn tập, giữ tâm lý và những lưu ý khi làm bài.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. REAL-TIME PUBLIC STATS GRID */}
      {stats && (
        <div className="landing__stats-wrapper">
          <Reveal>
            <section className="landing__stats">
              <div className="landing__stat">
                <div className="stat-icon-wrap stat-icon-wrap--primary">
                  <BookOpen size={24} />
                </div>
                <strong>{stats.totalLessons}+</strong>
                <span>Khóa học chuyên sâu</span>
              </div>
              <div className="landing__stat">
                <div className="stat-icon-wrap stat-icon-wrap--accent">
                  <Library size={24} />
                </div>
                <strong>{stats.totalVideos}+</strong>
                <span>Bài giảng video HD</span>
              </div>
              <div className="landing__stat">
                <div className="stat-icon-wrap stat-icon-wrap--success">
                  <Target size={24} />
                </div>
                <strong>{stats.totalPracticeTasks}+</strong>
                <span>Bài tập thực hành</span>
              </div>
              <div className="landing__stat">
                <div className="stat-icon-wrap stat-icon-wrap--warning">
                  <Users size={24} />
                </div>
                <strong>{stats.totalUsers}+</strong>
                <span>Sinh viên VHU đăng ký</span>
              </div>
            </section>
          </Reveal>
        </div>
      )}

      {/* 5. BENTO BOX FEATURES (CORE PILLARS) */}
      <section className="landing__section">
        <div className="landing__container">
          <Reveal>
            <div className="landing__section-head">
              <span className="section-pill">TÍNH NĂNG VƯỢT TRỘI</span>
              <h2>Mọi Công Cụ Bạn Cần Để Học Tốt Và Đạt Điểm Cao</h2>
              <p>
                Từ luyện thi MOS Word & Excel đến học AI và Tiếng Anh, tất cả
                được tối ưu riêng cho sinh viên Đại học Văn Hiến.
              </p>
            </div>
          </Reveal>

          <div className="landing__features">
            {/* Bento Card 1: Large - Luyện thi thực hành */}
            <Reveal className="bento-span-2">
              <div className="landing__feature-card landing__feature-card--large">
                <div className="landing__feature-card-content">
                  <div className="landing__feature-icon landing__feature-icon--primary">
                    <Target size={30} />
                  </div>
                  <h3>Luyện Thi MOS Word & Excel Bám Sát Đề Thi Thật</h3>
                  <p>
                    Kho đề thi thử mô phỏng 100% định dạng Certiport với đầy đủ
                    các dự án (Multi-project), thời gian đếm ngược 50 phút và
                    file dữ liệu mẫu chuẩn hóa.
                  </p>
                  <ul className="feature-checklist">
                    <li>
                      <CheckCircle2 size={16} color="#15803d" /> Bộ tiêu chí
                      chấm điểm bám sát đề thi 2016, 2019 và 365
                    </li>
                    <li>
                      <CheckCircle2 size={16} color="#15803d" /> Hướng dẫn từng
                      bước cách giải và mẹo làm bài tránh bẫy
                    </li>
                  </ul>
                </div>
                <div className="landing__feature-visual-demo">
                  <div className="mini-demo-card">
                    <div className="demo-header">
                      <span>MOS Project #01</span>
                      <span className="demo-tag">Excel 2019</span>
                    </div>
                    <div className="demo-body">
                      <div className="demo-row">
                        <span>Hàm VLOOKUP & IF</span>
                        <span className="badge-pass">Pass 100%</span>
                      </div>
                      <div className="demo-row">
                        <span>PivotTable & Slicer</span>
                        <span className="badge-pass">Pass 100%</span>
                      </div>
                      <div className="demo-row">
                        <span>Conditional Formatting</span>
                        <span className="badge-pass">Pass 100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Bento Card 2: AI Coach */}
            <Reveal delay={0.1}>
              <div className="landing__feature-card">
                <div className="landing__feature-icon landing__feature-icon--ai">
                  <Bot size={28} />
                </div>
                <h3>Trợ Lý AI Coach Đồng Hành 24/7</h3>
                <p>
                  Phân tích lỗi sai, giải thích cặn kẽ vì sao bị trừ điểm và đề
                  xuất bài tập khắc phục ngay lập tức, từ Excel đến AI và Tiếng
                  Anh.
                </p>
                <div className="mini-chat-bubble">
                  <div className="chat-avatar">AI</div>
                  <div className="chat-text">
                    "Bạn quên cố định cột $A trong hàm SUMIFS, hãy bấm F4 để
                    khóa vùng nhé!"
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Bento Card 3: Lộ trình cá nhân hóa */}
            <Reveal delay={0.2}>
              <div className="landing__feature-card">
                <div className="landing__feature-icon landing__feature-icon--roadmap">
                  <Map size={28} />
                </div>
                <h3>Lộ Trình Học Cá Nhân Hóa</h3>
                <p>
                  AI đánh giá năng lực đầu vào và phân bổ thời gian ôn tập thông
                  minh, giúp bạn về đích đúng hạn trước ngày thi.
                </p>
                <div className="mini-progress-pill">
                  <div className="progress-fill" style={{ width: '78%' }} />
                  <span className="progress-label">
                    Tiến độ: 78% Sẵn sàng thi
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Bento Card 4: Gamification & Streak */}
            <Reveal delay={0.1}>
              <div className="landing__feature-card">
                <div className="landing__feature-icon landing__feature-icon--streak">
                  <Flame size={28} />
                </div>
                <h3>Duy Trì Chuỗi Học Streak 🔥</h3>
                <p>
                  Học mỗi ngày để tích lũy XP, mở khóa huy hiệu danh dự và vinh
                  danh trên Bảng xếp hạng thành tích sinh viên VHU.
                </p>
                <div className="mini-streak-badge">
                  <span>🔥 Chuỗi 14 ngày học liên tiếp</span>
                  <strong>+350 XP</strong>
                </div>
              </div>
            </Reveal>

            {/* Bento Card 5: Thư viện & Video */}
            <Reveal delay={0.2}>
              <div className="landing__feature-card">
                <div className="landing__feature-icon landing__feature-icon--lib">
                  <Library size={28} />
                </div>
                <h3>Học Đa Lĩnh Vực, Một Nơi Duy Nhất</h3>
                <p>
                  Bài giảng video, tài liệu và bộ câu hỏi trắc nghiệm được chia
                  rõ theo từng môn, mở rộng dần để bạn học mọi kỹ năng cần thiết
                  ở cùng một tài khoản.
                </p>
                <div className="mini-resource-tag">
                  <span>📚 Word · Excel · AI · Tiếng Anh</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE PRODUCT SHOWCASE (Mô Phỏng Phòng Thi MOS & AI Grading) */}
      <section className="landing__showcase-section">
        <div className="landing__container">
          <Reveal>
            <div className="landing__section-head">
              <span className="section-pill">THỰC HÀNH MOS</span>
              <h2>Trải Nghiệm Phòng Thi MOS Mô Phỏng Ngay Trên Web</h2>
              <p>
                Giao diện mô phỏng sát đề thi quốc tế Certiport cùng công nghệ
                AI phân tích trực tiếp cấu trúc file Word (.docx) và Excel
                (.xlsx).
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <LandingProductShowcase />
          </Reveal>
        </div>
      </section>

      {/* 7. HIGH-CONVERTING CTA SECTION */}
      <section className="landing__cta-wrap">
        <div className="landing__container">
          <Reveal>
            <div className="landing__cta-card">
              <div className="cta-shape cta-shape--1" />
              <div className="cta-shape cta-shape--2" />
              <div className="landing__cta-content">
                <span className="cta-pill">ĐĂNG KÝ HOÀN TOÀN MIỄN PHÍ</span>
                <h2>Sẵn Sàng Nâng Cấp Kỹ Năng Của Bạn Hôm Nay?</h2>
                <p>
                  Tham gia cùng hơn 2,500+ sinh viên Đại học Văn Hiến bứt phá kỹ
                  năng số, tiếng Anh và hoàn thành chuẩn đầu ra dễ dàng.
                </p>
                <div className="cta-action-group">
                  <Link
                    href="/signup"
                    className="landing__btn landing__btn--cta-gold">
                    Tạo tài khoản học ngay <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/login"
                    className="landing__btn landing__btn--cta-outline">
                    Đăng nhập tài khoản
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
