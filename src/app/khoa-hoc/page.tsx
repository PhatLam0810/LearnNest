import type { Metadata } from 'next';
import Link from 'next/link';
import {
  formatDuration,
  getPublicCourses,
  toMetaDescription,
} from './_lib/courses';
import styles from './styles';

export const revalidate = 3600;

const TITLE = 'Khóa học tin học & luyện thi MOS';
const DESCRIPTION =
  'Danh sách khóa học trực tuyến tại LearnNest - Trường Đại học Văn Hiến (VHU): Microsoft Word, Excel, luyện thi chứng chỉ MOS, React, Mobile và Chuyên gia AI ứng dụng.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/khoa-hoc' },
  openGraph: {
    title: `${TITLE} | LearnNest`,
    description: DESCRIPTION,
    url: '/khoa-hoc',
    type: 'website',
  },
};

export default async function PublicCoursesPage() {
  const courses = await getPublicCourses();

  return (
    <main style={styles.page}>
      <nav aria-label="Breadcrumb" style={styles.breadcrumb}>
        <Link href="/">Trang chủ</Link> <span aria-hidden>›</span>{' '}
        <span>Khóa học</span>
      </nav>

      <h1 style={styles.h1}>{TITLE}</h1>
      <p style={styles.lead}>{DESCRIPTION}</p>

      {courses.length === 0 ? (
        <p style={styles.empty}>
          Danh sách khóa học đang được cập nhật. Vui lòng quay lại sau.
        </p>
      ) : (
        <ul style={styles.grid}>
          {courses.map(course => {
            const duration = formatDuration(course.totalDuration);
            return (
              <li key={course._id} style={styles.card}>
                <h2 style={styles.cardTitle}>
                  <Link
                    href={`/khoa-hoc/${course._id}`}
                    style={styles.cardLink}>
                    {course.title}
                  </Link>
                </h2>
                <p style={styles.cardDesc}>
                  {toMetaDescription(course.description, 180)}
                </p>
                <p style={styles.meta}>
                  {course.totalLibraries
                    ? `${course.totalLibraries} bài học`
                    : ''}
                  {course.totalLibraries && duration ? ' · ' : ''}
                  {duration}
                </p>
                {!!course.learnedSkills?.length && (
                  <p style={styles.skills}>
                    <strong>Kỹ năng đạt được:</strong>{' '}
                    {course.learnedSkills.slice(0, 4).join(', ')}
                  </p>
                )}
                <Link href={`/khoa-hoc/${course._id}`} style={styles.cta}>
                  Xem chi tiết khóa học
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
