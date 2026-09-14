import type { MetadataRoute } from 'next';
import { getPublicCourses } from './khoa-hoc/_lib/courses';

const BASE_URL = 'https://www.learnestvhu.com'; // domain thật (apex redirect 308 sang đây)

// Route công khai đáng để Google index, khai TƯỜNG MINH.
//
// Trước đây hàm này tự quét thư mục src/app bằng fs để tìm route. Cách đó hỏng
// khi sitemap chuyển sang chạy lúc runtime (từ khi thêm fetch danh sách khóa
// học): bundle serverless trên Vercel KHÔNG có thư mục mã nguồn, fs đọc không
// ra gì -> sitemap tụt từ 12 xuống 7 URL và mất luôn /khoa-hoc. Cả site chỉ có
// 8 trang công khai nên một mảng tường minh vừa đúng vừa không thể hỏng.
//
// Cố ý BỎ /login, /forgotPassword, /forgotPassword/changePassword và
// /signup/createAccount: là trang tiện ích, không có giá trị tìm kiếm.
const PUBLIC_ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/khoa-hoc', priority: 0.9 },
  { path: '/signup', priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // Trang chi tiết khóa học là route động (/khoa-hoc/[id]) - lấy id từ API.
  // API lỗi thì getPublicCourses trả [] và sitemap vẫn còn các route tĩnh.
  const courses = await getPublicCourses();

  return [
    ...PUBLIC_ROUTES.map(route => ({
      url: route.path === '/' ? BASE_URL : `${BASE_URL}${route.path}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: route.priority,
    })),
    ...courses.map(course => ({
      url: `${BASE_URL}/khoa-hoc/${course._id}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
