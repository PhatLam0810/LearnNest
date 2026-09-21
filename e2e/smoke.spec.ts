import { test, expect, Page } from '@playwright/test';

// Smoke test: mỗi trang chính phải mở được, không lỗi JS và không tràn ngang
// ở cả 1440px lẫn 375px. Bắt đúng các lỗi hay lọt lên production (vỡ layout
// mobile, trang trắng do exception).
//
// Tài khoản lấy từ biến môi trường, KHÔNG ghi mật khẩu vào repo. Thiếu biến
// thì nhóm test tương ứng tự bỏ qua:
//   E2E_STUDENT_EMAIL / E2E_STUDENT_PASSWORD
//   E2E_ADMIN_EMAIL   / E2E_ADMIN_PASSWORD
// Nên chạy trên bản production thật: E2E_BASE_URL=http://localhost:3000
// (xem playwright.config.ts), vì `next dev` che mất các lỗi style shorthand.

const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '375', width: 375, height: 812 },
];

const STUDENT_PAGES = [
  '/dashboard/home',
  '/dashboard/my-courses',
  '/dashboard/library',
  '/dashboard/practice',
  '/dashboard/results',
  '/dashboard/my-notes',
  '/dashboard/saved',
  '/dashboard/profile',
];

const ADMIN_TABS = Array.from({ length: 15 }, (_, i) => i);

const login = async (page: Page, email: string, password: string) => {
  await page.goto('/login');
  await page.getByPlaceholder('Nhập email của bạn').fill(email);
  await page.getByPlaceholder('Nhập mật khẩu của bạn').fill(password);
  await page.locator('button[type=submit]').click();
  await page.waitForURL(url => !url.pathname.includes('login'), {
    timeout: 20_000,
  });
};

// Lỗi ồn không do code của mình: script Vercel Insights chỉ có trên Vercel,
// và dòng "Failed to load resource" chung chung (đã có HTTP status riêng).
const IGNORED = /_vercel\/insights|Failed to load resource|favicon/;

const checkPage = async (page: Page, url: string) => {
  const errors: string[] = [];
  const onError = (e: Error) => errors.push(`pageerror: ${e.message}`);
  const onConsole = (m: { type(): string; text(): string }) => {
    if (m.type() === 'error' && !IGNORED.test(m.text()))
      errors.push(`console: ${m.text().slice(0, 200)}`);
  };
  page.on('pageerror', onError);
  page.on('console', onConsole);
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    const width = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      inner: window.innerWidth,
      text: document.body.innerText.trim().length,
    }));
    expect(width.text, `${url} trắng trang`).toBeGreaterThan(20);
    expect(width.scroll, `${url} tràn ngang`).toBeLessThanOrEqual(width.inner);
    expect(errors, `${url} có lỗi JS`).toEqual([]);
  } finally {
    page.off('pageerror', onError);
    page.off('console', onConsole);
  }
};

const suite = (
  title: string,
  envPrefix: 'E2E_STUDENT' | 'E2E_ADMIN',
  urls: string[],
) => {
  const email = process.env[`${envPrefix}_EMAIL`];
  const password = process.env[`${envPrefix}_PASSWORD`];

  test.describe(title, () => {
    test.skip(!email || !password, `thiếu ${envPrefix}_EMAIL/_PASSWORD`);
    // Đăng nhập 1 lần mỗi worker, dùng chung cho mọi trang trong nhóm (không
    // dùng mode serial để 1 trang lỗi không làm bỏ qua các trang còn lại).
    let page: Page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await login(page, email!, password!);
    });
    test.afterAll(async () => {
      await page?.close();
    });

    for (const vp of VIEWPORTS) {
      for (const url of urls) {
        test(`${url} @${vp.name}`, async () => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await checkPage(page, url);
        });
      }
    }
  });
};

suite('Học viên', 'E2E_STUDENT', STUDENT_PAGES);
suite(
  'Admin',
  'E2E_ADMIN',
  ADMIN_TABS.map(i => `/dashboard/admin?tab=${i}`),
);
