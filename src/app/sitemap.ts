import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://learnestvhu.com';

// Các route (hoặc tiền tố route) không nên xuất hiện trong sitemap công khai:
// - '/dashboard': toàn bộ nằm sau đăng nhập, Google không truy cập được nếu chưa xác thực
// - '/forgotPassword/changePassword': trang xử lý theo token đặt lại mật khẩu, không có giá trị index
const EXCLUDED_PREFIXES = ['/dashboard', '/forgotPassword/changePassword'];

const PAGE_FILE_NAMES = new Set(['page.tsx', 'page.ts', 'page.jsx', 'page.js']);

function isTraversableSegment(name: string): boolean {
  if (name.startsWith('_')) return false; // thư mục private của Next.js
  if (name.startsWith('.')) return false;
  if (name.startsWith('@')) return false; // parallel routes
  if (name.includes('[')) return false; // dynamic segment -> bỏ qua vì cần params
  return true;
}

function collectStaticRoutes(
  dir: string,
  urlSegments: string[] = [],
): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const routes: string[] = [];

  const hasPage = entries.some(
    entry => entry.isFile() && PAGE_FILE_NAMES.has(entry.name),
  );

  if (hasPage) {
    routes.push(urlSegments.length === 0 ? '/' : `/${urlSegments.join('/')}`);
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || !isTraversableSegment(entry.name)) continue;

    // Route group dạng (auth) không xuất hiện trong URL thực tế
    const isRouteGroup = entry.name.startsWith('(') && entry.name.endsWith(')');
    const nextSegments = isRouteGroup
      ? urlSegments
      : [...urlSegments, entry.name];

    routes.push(
      ...collectStaticRoutes(path.join(dir, entry.name), nextSegments),
    );
  }

  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const appDir = path.join(process.cwd(), 'src', 'app');
  const allRoutes = Array.from(new Set(collectStaticRoutes(appDir)));

  const publicRoutes = allRoutes
    .filter(route => route !== '/')
    .filter(
      route =>
        !EXCLUDED_PREFIXES.some(
          prefix => route === prefix || route.startsWith(`${prefix}/`),
        ),
    );

  const lastModified = new Date();

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...publicRoutes.map(route => ({
      url: `${BASE_URL}${route}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
