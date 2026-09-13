// Nguồn dữ liệu cho các trang khóa học CÔNG KHAI (không cần đăng nhập) - đây là
// nội dung duy nhất Google có thể index, vì mọi thứ trong /dashboard đều nằm sau
// đăng nhập. Dùng 2 endpoint vốn đã public sẵn của BE.
const API = process.env.NEXT_PUBLIC_API_BASE_URL;

// Cache 1 giờ: nội dung khóa học đổi rất chậm, không cần gọi API mỗi lượt xem.
const REVALIDATE_SECONDS = 3600;

export type PublicCourseModule = {
  _id?: string;
  title?: string;
};

export type PublicCourse = {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  learnedSkills?: string[];
  modules?: PublicCourseModule[];
  totalLibraries?: number;
  totalDuration?: number;
  totalLearners?: number;
  averageRating?: number;
  ratingCount?: number;
};

export async function getPublicCourses(): Promise<PublicCourse[]> {
  if (!API) return [];
  try {
    const res = await fetch(`${API}/lesson/getAllLesson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageNum: 1, pageSize: 50 }),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json?.data?.items as PublicCourse[]) || [];
  } catch {
    // API lỗi thì trả rỗng thay vì làm hỏng cả build/trang.
    return [];
  }
}

export async function getPublicCourse(
  id: string,
): Promise<PublicCourse | null> {
  if (!API) return null;
  try {
    const res = await fetch(`${API}/lesson/${id}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data as PublicCourse) || null;
  } catch {
    return null;
  }
}

/**
 * "4 giờ 50 phút". LƯU Ý: API trả totalDuration theo GIÂY (khóa Word =
 * 17435.98 -> đúng 4 giờ 50 phút như dashboard hiển thị), không phải phút.
 */
export function formatDuration(totalSeconds?: number): string {
  const minutes = toMinutes(totalSeconds);
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} phút`;
  return m ? `${h} giờ ${m} phút` : `${h} giờ`;
}

/** Đổi totalDuration (giây) sang số phút tròn - dùng cho schema.org. */
export function toMinutes(totalSeconds?: number): number {
  if (!totalSeconds || totalSeconds <= 0) return 0;
  return Math.round(totalSeconds / 60);
}

/** Mô tả ngắn cho thẻ meta - cắt gọn, bỏ xuống dòng. */
export function toMetaDescription(text: string | undefined, max = 160): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}
