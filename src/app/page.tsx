import Link from 'next/link';
import Footer from '@components/Footer';
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
    icon: '📚',
    title: 'Bài học theo Module',
    desc: 'Nội dung MOS, CNTT, AI được chia thành từng Module - Bài học rõ ràng, học tới đâu chắc tới đó.',
  },
  {
    icon: '✍️',
    title: 'Luyện tập có chấm điểm',
    desc: 'Làm bài thực hành sát đề thi thật, nộp bài và nhận đánh giá cho từng tiêu chí cụ thể.',
  },
  {
    icon: '🗺️',
    title: 'Lộ trình học cá nhân hóa',
    desc: 'Gợi ý lộ trình học phù hợp với tiến độ và mục tiêu của riêng bạn.',
  },
  {
    icon: '🤖',
    title: 'Trợ lý AI đồng hành',
    desc: 'Hỏi đáp, gợi ý cách học ngay trong quá trình học - không cần rời trang.',
  },
  {
    icon: '🗂️',
    title: 'Thư viện tài liệu',
    desc: 'Kho tài liệu, video tổng hợp phục vụ ôn tập MOS, Word, Excel, PowerPoint, AI.',
  },
  {
    icon: '📈',
    title: 'Theo dõi tiến độ chi tiết',
    desc: 'Xem % hoàn thành từng bài học, lịch sử học gần nhất, không bỏ sót nội dung nào.',
  },
];

export default async function HomePage() {
  const stats = await getPublicStats();

  return (
    <div className="landing">
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

      <section className="landing__hero">
        <div className="landing__hero-text">
          <span className="landing__hero-tag">
            Nền tảng học tập trực tuyến - Văn Hiến (VHU)
          </span>
          <h1>
            Học <span>MOS - CNTT - AI</span> hiệu quả, đúng lộ trình
          </h1>
          <p>
            LearnNest (learnestvhu.com) giúp bạn học và luyện tập Tin học văn
            phòng (MOS), Công nghệ thông tin và AI qua bài học theo Module, bài
            thực hành chấm điểm và theo dõi tiến độ rõ ràng từng ngày.
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
        <div className="landing__hero-img">
          <img src="/images/BannerScreen1.png" alt="LearnNest - MOS, IT, AI" />
        </div>
      </section>

      {stats && (
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
      )}

      <section className="landing__section">
        <div className="landing__section-head">
          <h2>Mọi thứ bạn cần để học hiệu quả</h2>
          <p>Được xây dựng riêng cho việc luyện thi MOS, CNTT và AI.</p>
        </div>
        <div className="landing__container">
          <div className="landing__features">
            {FEATURES.map(f => (
              <div className="landing__feature-card" key={f.title}>
                <div className="landing__feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing__cta">
        <h2>Bắt đầu hành trình học tập hôm nay</h2>
        <p>Đăng ký miễn phí và học ngay bài học đầu tiên.</p>
        <Link
          href="/signup"
          className="landing__btn landing__btn--primary landing__btn--large">
          Đăng ký miễn phí
        </Link>
      </section>

      <Footer />
    </div>
  );
}
