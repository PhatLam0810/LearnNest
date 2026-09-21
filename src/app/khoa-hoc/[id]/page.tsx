import { safeJsonLd } from '@/utils/jsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  formatDuration,
  getPublicCourse,
  getPublicCourses,
  toMetaDescription,
  toMinutes,
} from '../_lib/courses';
import styles from '../styles';

export const revalidate = 3600;

// Dựng sẵn trang cho mọi khóa hiện có -> Google nhận HTML đầy đủ ngay, không
// phải chờ render động.
export async function generateStaticParams() {
  const courses = await getPublicCourses();
  return courses.map(c => ({ id: c._id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const course = await getPublicCourse(id);
  if (!course) return { title: 'Không tìm thấy khóa học' };

  const description = toMetaDescription(course.description);
  return {
    title: course.title,
    description,
    alternates: { canonical: `/khoa-hoc/${id}` },
    openGraph: {
      title: `${course.title} | LearnNest`,
      description,
      url: `/khoa-hoc/${id}`,
      type: 'article',
      images: course.thumbnail ? [course.thumbnail] : undefined,
    },
  };
}

export default async function PublicCourseDetailPage({ params }: Props) {
  const { id } = await params;
  const course = await getPublicCourse(id);
  if (!course) notFound();

  const duration = formatDuration(course.totalDuration);

  // schema.org/Course - giúp Google hiểu đây là khóa học và có thể hiển thị
  // nổi bật (rich result) thay vì một trang văn bản thường.
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: toMetaDescription(course.description, 500),
    url: `https://www.learnestvhu.com/khoa-hoc/${id}`,
    inLanguage: 'vi',
    provider: {
      '@type': 'CollegeOrUniversity',
      name: 'Trường Đại học Văn Hiến (VHU) - LearnNest',
      url: 'https://www.learnestvhu.com',
    },
    ...(course.thumbnail ? { image: course.thumbnail } : {}),
    ...(course.learnedSkills?.length ? { teaches: course.learnedSkills } : {}),
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      ...(toMinutes(course.totalDuration)
        ? { courseWorkload: `PT${toMinutes(course.totalDuration)}M` }
        : {}),
    },
    ...(course.ratingCount && course.averageRating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: course.averageRating,
            ratingCount: course.ratingCount,
          },
        }
      : {}),
  };

  return (
    <main style={styles.page}>
      <script
        type="application/ld+json"
        // Dữ liệu tự sinh từ API của chính hệ thống, không phải input người dùng.
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" style={styles.breadcrumb}>
        <Link href="/">Trang chủ</Link> <span aria-hidden>›</span>{' '}
        <Link href="/khoa-hoc">Khóa học</Link> <span aria-hidden>›</span>{' '}
        <span>{course.title}</span>
      </nav>

      <header style={styles.hero}>
        <h1 style={styles.h1}>{course.title}</h1>
        <p style={styles.meta}>
          {course.totalLibraries ? `${course.totalLibraries} bài học` : ''}
          {course.totalLibraries && duration ? ' · ' : ''}
          {duration}
          {course.totalLearners ? ` · ${course.totalLearners} học viên` : ''}
        </p>
      </header>

      {!!course.description && (
        <section style={styles.section}>
          <h2 style={styles.h2}>Giới thiệu khóa học</h2>
          {course.description
            .split('\n')
            .filter(p => p.trim())
            .map((p, i) => (
              <p key={i} style={{ margin: '0 0 10px', color: '#374151' }}>
                {p}
              </p>
            ))}
        </section>
      )}

      {!!course.learnedSkills?.length && (
        <section style={styles.section}>
          <h2 style={styles.h2}>Kỹ năng bạn sẽ đạt được</h2>
          <ul style={styles.list}>
            {course.learnedSkills.map(skill => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </section>
      )}

      {!!course.modules?.length && (
        <section style={styles.section}>
          <h2 style={styles.h2}>Nội dung khóa học</h2>
          <ul style={styles.list}>
            {course.modules
              .filter(m => m?.title)
              .map((m, i) => (
                <li key={m._id || i}>{m.title}</li>
              ))}
          </ul>
        </section>
      )}

      <section style={styles.ctaBox}>
        <strong>Học miễn phí cùng LearnNest</strong>
        <p style={{ margin: '6px 0 0', color: '#374151' }}>
          Đăng ký tài khoản để xem video bài giảng, làm bài thực hành Word/Excel
          và theo dõi tiến độ học tập của bạn.
        </p>
        <Link href="/signup" style={styles.ctaBtn}>
          Đăng ký học ngay
        </Link>
      </section>
    </main>
  );
}
