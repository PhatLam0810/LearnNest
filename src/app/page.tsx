import Link from 'next/link';
import Footer from '@components/Footer';
import { lexend } from '@/styles/typography';
import Reveal from './Reveal';
import {
  BookOpen,
  Target,
  Map,
  Bot,
  Library,
  BarChart,
  Sparkles,
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

const FEATURES = [
  {
    icon: <Map size={32} strokeWidth={1.5} />,
    title: 'Lộ trình học cá nhân hóa',
    desc: 'Hệ thống tự động phân tích và đưa ra lộ trình học tối ưu nhất dựa trên mục tiêu của bạn. Tự tin chinh phục MOS, CNTT & AI mà không sợ đi sai hướng.',
    bentoClass: 'landing__feature-large',
  },
  {
    icon: <Bot size={28} strokeWidth={1.5} />,
    title: 'Trợ lý AI đồng hành',
    desc: 'Hỏi đáp lập tức, giải thích lỗi sai thực hành chi tiết nhờ AI tích hợp.',
    bentoClass: '',
  },
  {
    icon: <Target size={28} strokeWidth={1.5} />,
    title: 'Thực hành chấm điểm',
    desc: 'Làm bài thi thử sát đề thật, nhận feedback điểm số ngay lập tức.',
    bentoClass: '',
  },
  {
    icon: <Library size={28} strokeWidth={1.5} />,
    title: 'Thư viện tài nguyên',
    desc: 'Kho tài liệu ôn tập, video bài giảng độc quyền cho sinh viên VHU.',
    bentoClass: '',
  },
  {
    icon: <BarChart size={28} strokeWidth={1.5} />,
    title: 'Theo dõi tiến độ',
    desc: 'Trực quan hóa dữ liệu học tập với biểu đồ. Nắm bắt chính xác tỷ lệ hoàn thành.',
    bentoClass: '',
  },
];

export default async function HomePage() {
  const stats = await getPublicStats();

  return (
    <div className={`landing ${lexend.className}`}>
      {/* 1. STICKY GLASSMORPHISM HEADER */}
      <header className="landing__header">
        <Link href="/" className="landing__brand">
          <img src="/images/LogoVhu.png" alt="LearnNest" />
          <span>LearnNest</span>
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

      {/* 2. MODERN HERO SECTION WITH FLOATING ANIMATION */}
      <section className="landing__hero">
        <div className="landing__hero-text">
          <span className="landing__hero-tag">
            <Sparkles size={16} /> Nền tảng học tập trực tuyến - Văn Hiến (VHU)
          </span>
          <h1>
            Học <span className="text-gradient">MOS - CNTT - AI</span> hiệu quả,
            đúng lộ trình
          </h1>
          <p>
            LearnNest giúp bạn học và luyện tập Tin học văn phòng (MOS), Công
            nghệ thông tin và AI qua bài học thực chiến, module thông minh và
            theo dõi tiến độ rõ ràng từng ngày.
          </p>
          <div className="landing__hero-ctas">
            <Link
              href="/signup"
              className="landing__btn landing__btn--primary landing__btn--large">
              Bắt đầu học ngay
            </Link>
            <Link
              href="/login"
              className="landing__btn landing__btn--outline landing__btn--large">
              Tôi đã có tài khoản
            </Link>
          </div>
        </div>
        <div className="landing__hero-img float-anim">
          {/* Vẫn giữ ảnh cũ nhưng bọc trong class float-anim để tạo cảm giác trôi nổi 3D */}
          <img src="/images/BannerScreen1.png" alt="LearnNest - MOS, IT, AI" />
        </div>
      </section>

      {/* 3. STATS (Overlapping style) */}
      {stats && (
        <div className="landing__stats-wrapper">
          <Reveal>
            <section className="landing__stats">
              <div className="landing__stat">
                <strong>{stats.totalLessons}+</strong>
                <span>Khóa học</span>
              </div>
              <div className="landing__stat">
                <strong>{stats.totalVideos}+</strong>
                <span>Bài giảng video</span>
              </div>
              <div className="landing__stat">
                <strong>{stats.totalPracticeTasks}+</strong>
                <span>Bài thực hành</span>
              </div>
              <div className="landing__stat">
                <strong>{stats.totalUsers}+</strong>
                <span>Học viên tham gia</span>
              </div>
            </section>
          </Reveal>
        </div>
      )}

      {/* 4. FEATURES - BENTO BOX UI */}
      <section className="landing__section">
        <Reveal>
          <div className="landing__section-head">
            <h2>Mọi thứ bạn cần để học hiệu quả</h2>
            <p>
              Được xây dựng chuyên biệt cho việc ôn thi và nâng cao kỹ năng.
            </p>
          </div>
        </Reveal>
        <div className="landing__container">
          <div className="landing__features">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.1}>
                <div className={`landing__feature-card ${f.bentoClass}`}>
                  <div className="landing__feature-icon">{f.icon}</div>
                  <div className="landing__feature-content">
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <Reveal>
        <section className="landing__cta">
          <div className="landing__cta-content">
            <h2>Bắt đầu hành trình học tập hôm nay</h2>
            <p>Tham gia cùng hàng ngàn sinh viên VHU bứt phá điểm số.</p>
            <Link
              href="/signup"
              className="landing__btn landing__btn--primary landing__btn--large landing__btn--glow">
              Đăng ký miễn phí
            </Link>
          </div>
        </section>
      </Reveal>

      <Footer />
    </div>
  );
}
