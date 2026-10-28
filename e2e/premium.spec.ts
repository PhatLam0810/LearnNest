import { test, expect, Locator, Page } from '@playwright/test';

// Test giao diện Premium với API GIẢ (không cần BE/tài khoản thật), nên chạy
// được ở mọi máy. Phải chạy trên bản `next start` thật với
// NEXT_PUBLIC_API_BASE_URL=http://localhost:9999 (xem .env.local):
//   E2E_BASE_URL=http://localhost:3000 npx playwright test e2e/premium.spec.ts

const API = 'http://localhost:9999';
const DAY = 24 * 3600 * 1000;
const wrap = (data: unknown) => ({ data, status: 200, message: 'ok' });
const iso = (days: number) => new Date(Date.now() + days * DAY).toISOString();

const PLANS = [
  { key: 'month', label: 'Gói 1 tháng', days: 30, amount: 49000 },
  { key: 'year', label: 'Gói 1 năm', days: 365, amount: 399000 },
];
const ORDERS = [
  {
    _id: 'o1',
    plan: 'month',
    days: 30,
    amount: 49000,
    method: 'vnpay',
    txnRef: 'abc123def456',
    status: 'paid',
    createdAt: iso(-1),
    premiumUntil: iso(29),
  },
  {
    _id: 'o2',
    plan: 'month',
    days: 30,
    amount: 0,
    method: 'code',
    txnRef: 'code-ABCDE12345',
    status: 'paid',
    createdAt: iso(-2),
    premiumUntil: iso(59),
  },
  {
    _id: 'o3',
    plan: 'year',
    days: 365,
    amount: 399000,
    method: 'vnpay',
    txnRef: 'failedref99',
    status: 'failed',
    createdAt: iso(-3),
  },
];
ORDERS.push({
  _id: 'o4',
  plan: 'month',
  days: 30,
  amount: 49000,
  method: 'bank',
  txnRef: 'LNPAID2345',
  status: 'paid',
  createdAt: iso(-1),
  premiumUntil: iso(29),
} as never);
// Đơn chuyển khoản chưa thanh toán - để test mục "Đơn chờ thanh toán" + Hủy
// ở trang Lịch sử giao dịch.
ORDERS.push({
  _id: 'o5',
  plan: 'month',
  days: 30,
  amount: 49000,
  method: 'bank',
  txnRef: 'LNPENDWAIT',
  status: 'pending',
  createdAt: iso(0),
} as never);
const ADMIN_PENDING = [
  {
    _id: 'p1',
    txnRef: 'LNWAIT2345',
    amount: 49000,
    plan: 'month',
    method: 'bank',
    status: 'pending',
    createdAt: iso(0),
    userId: { fullName: 'Học viên A', email: 'a@x.vn' },
    note: 'Nhận 50000 thay vì 49000',
  },
];
const EXAMS = [
  {
    _id: 'e1',
    title: 'Đề Excel mở',
    subject: 'Excel',
    durationMinutes: 50,
    taskCount: 5,
    locked: false,
  },
  {
    _id: 'e2',
    title: 'Đề Word khóa',
    subject: 'Word',
    durationMinutes: 50,
    taskCount: 5,
    locked: true,
  },
];
const CODES = [
  { _id: 'c1', code: 'A1B2C3D4E5', plan: 'month', createdAt: iso(-1) },
  {
    _id: 'c2',
    code: 'F6G7H8I9J0',
    plan: 'year',
    createdAt: iso(-1),
    usedAt: iso(0),
  },
];

type Status = { isPremium: boolean; premiumExpiresAt: string | null };
const FREE: Status = { isPremium: false, premiumExpiresAt: null };

const open = async (
  page: Page,
  opts: {
    status?: Status;
    admin?: boolean;
    payment?: string;
    regenLimited?: boolean;
    orderSeq?: string[];
    createError?: string;
  } = {},
) => {
  const status = opts.status ?? FREE;
  const user = {
    _id: 'u1',
    fullName: 'Hoc Vien Test',
    email: 't@t.vn',
    username: 'test',
    role: { level: opts.admin ? 1 : 9, name: opts.admin ? 'Admin' : 'User' },
  };
  await page.addInitScript(u => {
    localStorage.setItem(
      'persist:auth',
      JSON.stringify({
        tokenInfo: JSON.stringify({
          accessToken: 'x',
          refreshToken: 'y',
          userProfile: u,
        }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      }),
    );
  }, user);
  const calls: { url: string; method: string; body: string }[] = [];
  let regenCalls = 0;
  let orderCalls = 0;
  await page.route(`${API}/**`, route => {
    const req = route.request();
    const url = req.url();
    const method = req.method();
    calls.push({ url, method, body: req.postData() ?? '' });
    const json = (body: unknown, code = 200) =>
      route.fulfill({
        status: code,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    if (url.includes('/lesson/user/u1/export'))
      return route.fulfill({
        status: 200,
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: 'xlsx-bytes',
      });
    if (url.includes('/lesson/user/u1/results'))
      return json({ items: [], total: 0, page: 1, limit: 10 });
    if (url.includes('/ai-coach/history/u1')) return json([]);
    if (url.includes('/lesson/user/u1/my-courses')) return json([]);
    if (url.includes('/practice/my-weak-skills'))
      return json(
        wrap(
          ['Định dạng', 'Công thức', 'Biểu đồ'].map((group, i) => ({
            group,
            attempts: 5,
            passed: i,
            passRate: i * 20,
          })),
        ),
      );
    if (url.endsWith('/ai-coach/regenerate')) {
      regenCalls += 1;
      return opts.regenLimited && regenCalls > 1
        ? json(
            {
              status: 403,
              code: 'PREMIUM_REQUIRED',
              message: 'Gói miễn phí được làm mới lộ trình AI 1 lần mỗi tuần.',
            },
            403,
          )
        : json({ skipped: false });
    }
    if (url.endsWith('/otp/sendTransaction'))
      return json({ success: true, message: 'ok' });
    if (url.endsWith('/premium/status')) return json(wrap(status));
    if (url.endsWith('/premium/plans')) return json(wrap(PLANS));
    if (url.endsWith('/premium/orders/mine')) return json(wrap(ORDERS));
    if (url.includes('/premium/orders/ref/')) {
      const seq = opts.orderSeq ?? ['paid'];
      const st = seq[Math.min(orderCalls, seq.length - 1)];
      orderCalls += 1;
      return json(
        wrap({
          _id: 'o9',
          txnRef: 'LNTEST2345',
          plan: 'month',
          days: 30,
          amount: 49000,
          method: 'bank',
          status: st,
          createdAt: iso(0),
          premiumUntil: st === 'paid' ? iso(30) : undefined,
        }),
      );
    }
    if (url.endsWith('/fake-qr.png'))
      return route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          'base64',
        ),
      });
    if (url.endsWith('/premium/orders') && method === 'POST') {
      if (opts.createError)
        return json({ status: 400, message: opts.createError }, 400);
      const body = JSON.parse(req.postData() || '{}');
      const year = body.plan === 'year';
      return json(
        wrap({
          txnRef: 'LNTEST2345',
          plan: body.plan,
          amount: year ? 399000 : 49000,
          days: year ? 365 : 30,
          transferContent: 'LNTEST2345',
          bank: {
            name: 'MB Bank',
            accountNo: '19031234567890',
            accountName: 'LAM TAN PHAT',
          },
          qrUrl: `${API}/fake-qr.png`,
          expiresAt: iso(0.02),
        }),
      );
    }
    if (url.includes('/premium/orders/') && url.endsWith('/cancel'))
      return json({ status: 200, message: 'ok' });
    if (url.endsWith('/premium/admin/orders/pending'))
      return json(wrap(ADMIN_PENDING));
    if (url.includes('/premium/admin/orders/') && url.endsWith('/confirm'))
      return json({ status: 200, message: 'ok' });
    if (url.endsWith('/premium/redeem')) {
      const code = JSON.parse(req.postData() || '{}').code;
      return code === 'GOODCODE'
        ? json(wrap({ premiumExpiresAt: iso(30) }))
        : json(
            { status: 400, message: 'Mã không hợp lệ hoặc đã được sử dụng' },
            400,
          );
    }
    if (url.endsWith('/premium/admin/codes') && method === 'GET')
      return json(wrap(CODES));
    if (url.endsWith('/premium/admin/codes') && method === 'POST')
      return json(wrap(['NEWCODE001', 'NEWCODE002']));
    if (url.endsWith('/premium/admin/revenue'))
      return json(
        wrap({
          totalRevenue: 448000,
          totalOrders: 2,
          activePremium: 5,
          byPlan: [
            { plan: 'month', revenue: 49000, orders: 1 },
            { plan: 'year', revenue: 399000, orders: 1 },
          ],
          byMonth: [{ month: '2026-10', revenue: 448000, orders: 2 }],
        }),
      );
    if (url.includes('/practice/mock-exams') && method === 'GET')
      return json(wrap(EXAMS));
    if (url.includes('/practice/mock-exams') && url.endsWith('/start'))
      return json(
        {
          status: 403,
          code: 'PREMIUM_REQUIRED',
          message: 'Đề thi thử này dành cho Premium',
        },
        403,
      );
    if (url.includes('/ai-coach/chat'))
      return json(
        {
          status: 403,
          code: 'PREMIUM_REQUIRED',
          message: 'Bạn đã dùng hết 5 lượt hỏi AI miễn phí hôm nay.',
        },
        403,
      );
    return json(wrap([]));
  });
  return calls;
};

// Gửi + điền OTP trước khi bấm "Tạo mã QR thanh toán" (BE giả luôn thành
// công ở /otp/sendTransaction, giá trị mã không quan trọng).
const fillOtp = async (dialog: Locator) => {
  await dialog.getByRole('button', { name: 'Gửi OTP' }).click();
  await dialog.getByLabel(/Mã OTP xác nhận mua/).fill('123456');
};

const noOverflow = async (page: Page) => {
  const w = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    window.innerWidth,
  ]);
  expect(w[0]).toBeLessThanOrEqual(w[1]);
};

test.describe('Trang /dashboard/premium', () => {
  test('1. tài khoản free: hero, thẻ gói miễn phí, 2 gói giá, tiết kiệm 32%', async ({
    page,
  }) => {
    await open(page);
    await page.goto('/dashboard/premium');
    await expect(
      page.getByRole('heading', { name: 'Học MOS không giới hạn' }),
    ).toBeVisible();
    await expect(page.getByText('Gói miễn phí', { exact: true })).toBeVisible();
    await expect(page.getByText('49.000 ₫').first()).toBeVisible();
    await expect(page.getByText('399.000 ₫').first()).toBeVisible();
    await expect(page.getByText('Tiết kiệm 32%')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Mua gói', exact: true }),
    ).toHaveCount(2);
  });

  test('2. liệt kê đủ 11 quyền lợi và bảng so sánh', async ({ page }) => {
    await open(page);
    await page.goto('/dashboard/premium');
    for (const t of [
      'AI không giới hạn',
      'Thi thử MOS đầy đủ',
      'Luyện tập Word/Excel đầy đủ',
      'Chấm bài không giới hạn',
      'Khóa học Premium',
      'Ghi chú và dấu trang không giới hạn',
      'Phân tích kỹ năng yếu đầy đủ',
      'Lộ trình AI làm mới theo ý',
      'Xuất báo cáo tiến độ Excel',
      'Huy hiệu Premium',
      'Ưu tiên hỗ trợ',
    ])
      await expect(page.getByText(t, { exact: true }).first()).toBeVisible();
    await expect(page.getByText('5 lượt/ngày')).toBeVisible();
    await expect(page.getByText('10 lượt/ngày')).toBeVisible();
    await expect(page.getByText('20 ghi chú, 20 mục lưu')).toBeVisible();
    await expect(page.getByText('3 kỹ năng yếu nhất').first()).toBeVisible();
    await expect(page.getByText('1 lần/tuần')).toBeVisible();
  });

  test('3. đang Premium còn 30 ngày: hiện ngày hết hạn, KHÔNG cho mua tiếp (nút khóa, không có Gia hạn)', async ({
    page,
  }) => {
    await open(page, {
      status: { isPremium: true, premiumExpiresAt: iso(30) },
    });
    await page.goto('/dashboard/premium');
    await expect(page.getByText('Gói Premium đang hoạt động')).toBeVisible();
    await expect(page.getByText(/còn (29|30) ngày/)).toBeVisible();
    await expect(page.getByText(/Gói sắp hết hạn/)).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Gia hạn' })).toHaveCount(0);
    const used = page.getByRole('button', { name: 'Đang sử dụng' });
    await expect(used).toHaveCount(2);
    await expect(used.first()).toBeDisabled();
    await expect(
      page.getByRole('button', { name: 'Mua gói', exact: true }),
    ).toHaveCount(0);
    await expect(page.getByLabel('Mã kích hoạt')).toBeDisabled();
    await expect(
      page.getByRole('button', { name: /^(loading )?Kích hoạt$/ }),
    ).toBeDisabled();
  });

  test('4. còn 5 ngày: cảnh báo sắp hết hạn, được GIA HẠN (mở form xác nhận, tạo đơn gói tháng)', async ({
    page,
  }) => {
    const calls = await open(page, {
      status: { isPremium: true, premiumExpiresAt: iso(5) },
      orderSeq: ['pending'],
    });
    await page.goto('/dashboard/premium');
    await expect(
      page.getByText(/Gói sắp hết hạn trong (4|5) ngày/),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Đang sử dụng' }),
    ).toHaveCount(0);
    const renew = page.getByRole('button', { name: 'Gia hạn', exact: true });
    await expect(renew).toHaveCount(3); // thẻ trạng thái + 2 gói
    await renew.nth(1).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Xác nhận đơn Premium')).toBeVisible();
    await fillOtp(dialog);
    await dialog.getByRole('button', { name: 'Tạo mã QR thanh toán' }).click();
    await expect(dialog.getByText('Quét mã để thanh toán')).toBeVisible();
    const create = calls.find(
      c => c.url.endsWith('/premium/orders') && c.method === 'POST',
    );
    expect(JSON.parse(create!.body).plan).toBe('month');
  });

  test('4b. còn đúng 8 ngày: vẫn khóa, chưa cho gia hạn', async ({ page }) => {
    await open(page, { status: { isPremium: true, premiumExpiresAt: iso(8) } });
    await page.goto('/dashboard/premium');
    await expect(
      page.getByRole('button', { name: 'Đang sử dụng' }),
    ).toHaveCount(2);
    await expect(
      page.getByRole('button', { name: 'Gia hạn', exact: true }),
    ).toHaveCount(0);
  });

  test('5. đã hết hạn: báo hết hạn, mua lại được, không còn huy hiệu', async ({
    page,
  }) => {
    await open(page, {
      status: { isPremium: false, premiumExpiresAt: iso(-3) },
    });
    await page.goto('/dashboard/premium');
    await expect(page.getByText('Gói Premium đã hết hạn')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mua lại' })).toHaveCount(3);
    await expect(
      page.getByRole('button', { name: /Thành viên Premium/ }),
    ).toHaveCount(0);
  });

  test('6. quản trị: có quyền Premium không ngày hết hạn, không nút nâng cấp, không huy hiệu', async ({
    page,
  }) => {
    await open(page, {
      admin: true,
      status: { isPremium: true, premiumExpiresAt: null },
    });
    await page.goto('/dashboard/premium');
    await expect(page.getByText('Quyền Premium của quản trị')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Nâng cấp', exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: /Thành viên Premium/ }),
    ).toHaveCount(0);
  });

  test('7. mua gói năm: form xác nhận -> tạo đơn -> hiện QR + thông tin chuyển khoản đúng', async ({
    page,
  }) => {
    const calls = await open(page, { orderSeq: ['pending'] });
    await page.goto('/dashboard/premium');
    await page
      .getByRole('button', { name: 'Mua gói', exact: true })
      .nth(1)
      .click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Xác nhận đơn Premium')).toBeVisible();
    await expect(dialog.getByText('399.000 ₫')).toBeVisible();
    await expect(dialog.getByText('365 ngày')).toBeVisible();
    await expect(dialog.getByLabel('Họ tên người thanh toán')).toHaveValue(
      'Hoc Vien Test',
    );
    await dialog.getByLabel('Họ tên người thanh toán').fill('Nguyễn Văn A');
    await fillOtp(dialog);
    await dialog.getByRole('button', { name: 'Tạo mã QR thanh toán' }).click();

    await expect(dialog.getByText('Quét mã để thanh toán')).toBeVisible();
    await expect(
      dialog.getByRole('img', { name: /Mã QR chuyển khoản/ }),
    ).toBeVisible();
    await expect(dialog.getByText('MB Bank')).toBeVisible();
    await expect(dialog.getByText('LAM TAN PHAT')).toBeVisible();
    await expect(dialog.getByText('399.000 ₫')).toBeVisible();
    await expect(dialog.getByText('19031234567890')).toBeVisible();
    await expect(dialog.getByText('LNTEST2345')).toBeVisible();
    await expect(dialog.getByRole('button', { name: /Chép/ })).toHaveCount(0); // đã bỏ nút Chép, chỉ còn text
    await expect(dialog.getByText(/Đang chờ nhận tiền/)).toBeVisible();
    const create = calls.find(
      c => c.url.endsWith('/premium/orders') && c.method === 'POST',
    );
    expect(JSON.parse(create!.body)).toEqual({
      plan: 'year',
      fullName: 'Nguyễn Văn A',
      otp: '123456',
    });
  });

  test('7b. bỏ trống tên bị chặn tại chỗ, không gọi API', async ({ page }) => {
    const calls = await open(page);
    await page.goto('/dashboard/premium');
    await page
      .getByRole('button', { name: 'Mua gói', exact: true })
      .first()
      .click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Họ tên người thanh toán').fill('   ');
    await dialog.getByRole('button', { name: 'Tạo mã QR thanh toán' }).click();
    await expect(
      dialog.getByText('Vui lòng nhập họ tên người thanh toán'),
    ).toBeVisible();
    expect(
      calls.some(c => c.url.endsWith('/premium/orders') && c.method === 'POST'),
    ).toBe(false);
  });

  test('7c. BE từ chối tạo đơn: hiện lỗi trong form, không hiện QR', async ({
    page,
  }) => {
    await open(page, {
      createError:
        'Bạn đang dùng Premium đến 01/12/2026. Có thể gia hạn từ 24/11/2026 (khi còn 7 ngày).',
    });
    await page.goto('/dashboard/premium');
    await page
      .getByRole('button', { name: 'Mua gói', exact: true })
      .first()
      .click();
    const dialog = page.getByRole('dialog');
    await fillOtp(dialog);
    await dialog.getByRole('button', { name: 'Tạo mã QR thanh toán' }).click();
    await expect(dialog.getByText(/Có thể gia hạn từ/)).toBeVisible();
    await expect(
      dialog.getByRole('img', { name: /Mã QR chuyển khoản/ }),
    ).toHaveCount(0);
  });

  test('7d. bấm Hủy đóng form, không gọi API', async ({ page }) => {
    const calls = await open(page);
    await page.goto('/dashboard/premium');
    await page
      .getByRole('button', { name: 'Mua gói', exact: true })
      .first()
      .click();
    await page.getByRole('dialog').getByRole('button', { name: 'Hủy' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    expect(
      calls.some(c => c.url.endsWith('/premium/orders') && c.method === 'POST'),
    ).toBe(false);
  });

  test('7e. chưa nhập OTP: chặn tại chỗ, không gọi API tạo đơn', async ({
    page,
  }) => {
    const calls = await open(page);
    await page.goto('/dashboard/premium');
    await page
      .getByRole('button', { name: 'Mua gói', exact: true })
      .first()
      .click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Tạo mã QR thanh toán' }).click();
    await expect(
      dialog.getByText('Vui lòng nhập mã OTP đã gửi về email'),
    ).toBeVisible();
    expect(
      calls.some(c => c.url.endsWith('/premium/orders') && c.method === 'POST'),
    ).toBe(false);
  });

  test('7f. đang có đơn chưa thanh toán: BE chặn, hiện lỗi hướng dẫn qua Lịch sử giao dịch', async ({
    page,
  }) => {
    await open(page, {
      createError:
        'Bạn đang có 1 đơn chuyển khoản chưa thanh toán. Vào trang Lịch sử giao dịch (Hồ sơ) để hủy đơn đó, hoặc đợi hết hạn (5 phút) rồi thử lại.',
    });
    await page.goto('/dashboard/premium');
    await page
      .getByRole('button', { name: 'Mua gói', exact: true })
      .first()
      .click();
    const dialog = page.getByRole('dialog');
    await fillOtp(dialog);
    await dialog.getByRole('button', { name: 'Tạo mã QR thanh toán' }).click();
    await expect(dialog.getByText(/Lịch sử giao dịch/)).toBeVisible();
    await expect(
      dialog.getByRole('img', { name: /Mã QR chuyển khoản/ }),
    ).toHaveCount(0);
  });

  test('8. real time: đang chờ -> tiền về (hỏi 3 giây/lần) -> modal kích hoạt thành công, dừng hỏi', async ({
    page,
  }) => {
    const calls = await open(page, {
      orderSeq: ['pending', 'pending', 'paid'],
    });
    await page.goto('/dashboard/premium');
    await page
      .getByRole('button', { name: 'Mua gói', exact: true })
      .first()
      .click();
    await fillOtp(page.getByRole('dialog'));
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Tạo mã QR thanh toán' })
      .click();
    await expect(page.getByText(/Đang chờ nhận tiền/)).toBeVisible();
    const success = page
      .getByRole('dialog')
      .getByText('Kích hoạt Premium thành công');
    await expect(success).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByRole('dialog').getByText(/Mã đơn: LNTEST2345/),
    ).toBeVisible();
    await expect(
      page
        .getByRole('dialog')
        .getByText(/hiệu lực đến ngày \d{2}\/\d{2}\/\d{4}/),
    ).toBeVisible();
    const polls = () =>
      calls.filter(c => c.url.includes('/premium/orders/ref/LNTEST2345'))
        .length;
    expect(polls()).toBeGreaterThanOrEqual(3);
    await expect(
      page.getByRole('dialog').getByText(/Đang chờ nhận tiền/),
    ).toHaveCount(0);
    const n = polls();
    await page.waitForTimeout(3500);
    expect(polls()).toBe(n); // đã paid thì dừng hỏi
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Xem lịch sử đơn' })
      .click();
    await page.waitForURL(/\/dashboard\/profile/);
  });

  test('8b. đóng modal QR giữa chừng: dừng hỏi, không có modal thành công', async ({
    page,
  }) => {
    const calls = await open(page, { orderSeq: ['pending'] });
    await page.goto('/dashboard/premium');
    await page
      .getByRole('button', { name: 'Mua gói', exact: true })
      .first()
      .click();
    await fillOtp(page.getByRole('dialog'));
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Tạo mã QR thanh toán' })
      .click();
    await expect(page.getByText(/Đang chờ nhận tiền/)).toBeVisible();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /Đóng \(đơn vẫn được giữ\)/ })
      .click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    const n = calls.filter(c => c.url.includes('/premium/orders/ref/')).length;
    await page.waitForTimeout(3500);
    expect(
      calls.filter(c => c.url.includes('/premium/orders/ref/')).length,
    ).toBe(n);
  });

  test('9. mã kích hoạt: rỗng báo lỗi tại chỗ; mã sai báo lỗi từ BE; mã đúng gửi đúng nội dung', async ({
    page,
  }) => {
    const calls = await open(page);
    await page.goto('/dashboard/premium');
    await page.getByRole('button', { name: /^(loading )?Kích hoạt$/ }).click();
    await expect(page.getByText('Vui lòng nhập mã kích hoạt')).toBeVisible();
    await page.getByLabel('Mã kích hoạt').fill('SAI');
    await page.getByRole('button', { name: /^(loading )?Kích hoạt$/ }).click();
    await expect(
      page.getByText('Mã không hợp lệ hoặc đã được sử dụng'),
    ).toBeVisible();
    await page.getByLabel('Mã kích hoạt').fill('GOODCODE');
    await page.getByRole('button', { name: /^(loading )?Kích hoạt$/ }).click();
    await expect(
      page.getByText('Mã không hợp lệ hoặc đã được sử dụng'),
    ).toHaveCount(0);
    const last = calls.filter(c => c.url.endsWith('/premium/redeem')).pop();
    expect(JSON.parse(last!.body)).toEqual({ code: 'GOODCODE' });
  });

  test('10. FAQ hiển thị', async ({ page }) => {
    await open(page);
    await page.goto('/dashboard/premium');
    await expect(
      page.getByText('Đang dùng Premium có mua thêm được không?'),
    ).toBeVisible();
  });

  test('11. 375px không tràn ngang, bố cục vẫn đủ nội dung', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await open(page);
    await page.goto('/dashboard/premium');
    await expect(page.getByText('399.000 ₫').first()).toBeVisible();
    await noOverflow(page);
  });
});

test.describe('Huy hiệu header, hồ sơ, khóa/modal', () => {
  test('12. Premium còn hạn: huy hiệu ở header, bấm mở trang Premium', async ({
    page,
  }) => {
    await open(page, {
      status: { isPremium: true, premiumExpiresAt: iso(20) },
    });
    await page.goto('/dashboard/practice');
    const badge = page.getByRole('button', { name: /Thành viên Premium, còn/ });
    await expect(badge).toBeVisible();
    await badge.click();
    await page.waitForURL(/\/dashboard\/premium/);
  });

  test('13. tài khoản free: không có huy hiệu', async ({ page }) => {
    await open(page);
    await page.goto('/dashboard/practice');
    await expect(
      page.getByRole('button', { name: /Thành viên Premium/ }),
    ).toHaveCount(0);
  });

  test('14. hồ sơ: thẻ gói + lịch sử đơn (đúng nhãn, tiền, trạng thái)', async ({
    page,
  }) => {
    await open(page, {
      status: { isPremium: true, premiumExpiresAt: iso(10) },
    });
    await page.goto('/dashboard/profile');
    await expect(page.getByText('Gói Premium đang hoạt động')).toBeVisible();
    await expect(page.getByText('Lịch sử đơn Premium')).toBeVisible();
    await expect(page.getByText('abc123def456')).toBeVisible();
    await expect(
      page.getByText('Mã kích hoạt', { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText('Miễn phí', { exact: true }).first(),
    ).toBeVisible();
    await expect(page.getByText('Thất bại')).toBeVisible();
  });

  test('14b. hồ sơ: đơn chuyển khoản chờ thanh toán hiện ở mục riêng, bấm Hủy gọi đúng API', async ({
    page,
  }) => {
    const calls = await open(page);
    await page.goto('/dashboard/profile');
    await expect(page.getByText('Đơn chờ thanh toán')).toBeVisible();
    await expect(page.getByText(/LNPENDWAIT/).first()).toBeVisible();
    await page.getByRole('button', { name: 'Hủy đơn' }).click();
    await expect(
      page.getByText('Đã hủy đơn, bạn có thể mua lại ngay'),
    ).toBeVisible();
    const cancel = calls.find(c =>
      c.url.endsWith('/premium/orders/LNPENDWAIT/cancel'),
    );
    expect(cancel).toBeTruthy();
  });

  test('15. luyện tập: đề khóa có nhãn Premium; bấm mở modal nâng cấp với đủ quyền lợi', async ({
    page,
  }) => {
    await open(page);
    await page.goto('/dashboard/practice');
    await expect(page.getByText('Đề Word khóa')).toBeVisible();
    await page
      .getByRole('button', { name: 'Nâng cấp Premium để mở khóa' })
      .click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Nâng cấp LearnNest Premium')).toBeVisible();
    await expect(dialog.getByText('✓ Ưu tiên hỗ trợ')).toBeVisible();
    await dialog.getByRole('button', { name: 'Xem gói Premium' }).click();
    await page.waitForURL(/\/dashboard\/premium/);
  });

  test('16. đề mở (locked=false) không bị phủ nút khóa', async ({ page }) => {
    await open(page);
    await page.goto('/dashboard/practice');
    await expect(
      page.getByRole('button', { name: 'Nâng cấp Premium để mở khóa' }),
    ).toHaveCount(1);
  });

  test('17. BE trả PREMIUM_REQUIRED ở bất kỳ API nào: modal nâng cấp tự mở với câu của BE', async ({
    page,
  }) => {
    await open(page);
    await page.goto('/dashboard/practice');
    await page.getByText('AI Tư Vấn', { exact: true }).click();
    const box = page.getByRole('textbox').last();
    await box.fill('Xin chào');
    await box.press('Enter');
    await expect(
      page.getByRole('dialog').getByText(/dùng hết 5 lượt hỏi AI/),
    ).toBeVisible();
  });
});

test.describe('Quyền lợi mới', () => {
  test('20. xuất Excel: free bấm thì mở modal nâng cấp, không gọi API xuất', async ({
    page,
  }) => {
    const calls = await open(page);
    await page.goto('/dashboard/results');
    await page.getByRole('button', { name: /Xuất Excel \(Premium\)/ }).click();
    await expect(
      page.getByRole('dialog').getByText(/Xuất báo cáo tiến độ dành cho/),
    ).toBeVisible();
    expect(calls.some(c => c.url.includes('/export'))).toBe(false);
  });

  test('21. xuất Excel: Premium bấm thì gọi API xuất và tải file về', async ({
    page,
  }) => {
    const calls = await open(page, {
      status: { isPremium: true, premiumExpiresAt: iso(20) },
    });
    await page.goto('/dashboard/results');
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Xuất Excel', exact: true }).click();
    expect((await download).suggestedFilename()).toBe('tien-do-hoc-tap.xlsx');
    expect(calls.some(c => c.url.includes('/lesson/user/u1/export'))).toBe(
      true,
    );
  });

  test('22. lộ trình AI: làm mới lần 1 được, lần 2 hết lượt free thì hiện modal nâng cấp', async ({
    page,
  }) => {
    const calls = await open(page, { regenLimited: true });
    await page.goto('/dashboard/my-roadmap');
    const btn = page.getByRole('button', { name: 'Làm mới lộ trình' });
    await btn.click();
    await expect(page.getByText('Đã làm mới lộ trình học tập')).toBeVisible();
    await btn.click();
    await expect(
      page.getByRole('dialog').getByText(/làm mới lộ trình AI 1 lần mỗi tuần/),
    ).toBeVisible();
    expect(
      calls.filter(c => c.url.endsWith('/ai-coach/regenerate')),
    ).toHaveLength(2);
  });

  test('23. kỹ năng yếu: free thấy đúng 3 mục và lời mời nâng cấp', async ({
    page,
  }) => {
    await open(page);
    await page.goto('/dashboard/practice');
    await expect(page.getByText('Điểm yếu của bạn')).toBeVisible();
    await expect(page.getByText('Biểu đồ')).toBeVisible();
    await expect(
      page.getByText('Gói miễn phí chỉ hiện 3 kỹ năng yếu nhất.'),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Nâng cấp để xem đầy đủ' }).click();
    await expect(
      page.getByRole('dialog').getByText(/xem đầy đủ kỹ năng yếu/),
    ).toBeVisible();
  });

  test('24. kỹ năng yếu: Premium không có lời mời nâng cấp', async ({
    page,
  }) => {
    await open(page, {
      status: { isPremium: true, premiumExpiresAt: iso(20) },
    });
    await page.goto('/dashboard/practice');
    await expect(page.getByText('Điểm yếu của bạn')).toBeVisible();
    await expect(
      page.getByText('Gói miễn phí chỉ hiện 3 kỹ năng yếu nhất.'),
    ).toHaveCount(0);
  });
});

test.describe('Admin', () => {
  test('18. tab Premium: tạo mã gửi đúng gói/số lượng và hiện mã mới', async ({
    page,
  }) => {
    const calls = await open(page, { admin: true });
    await page.goto('/dashboard/admin?tab=15');
    await expect(page.getByText('A1B2C3D4E5')).toBeVisible();
    await expect(page.getByText(/Đã dùng/)).toBeVisible();
    await page.getByRole('button', { name: 'Tạo mã' }).click();
    await expect(page.getByText('NEWCODE001')).toBeVisible();
    const post = calls.find(
      c => c.url.endsWith('/premium/admin/codes') && c.method === 'POST',
    );
    expect(JSON.parse(post!.body)).toEqual({ plan: 'month', count: 10 });
  });

  test('18b. tab Premium: báo cáo doanh thu hiện đúng tổng, theo gói, theo tháng', async ({
    page,
  }) => {
    await open(page, { admin: true });
    await page.goto('/dashboard/admin?tab=15');
    await expect(page.getByText('448.000 ₫').first()).toBeVisible();
    await expect(page.getByText('2 đơn đã thanh toán')).toBeVisible();
    await expect(page.getByText('5', { exact: true })).toBeVisible();
    await expect(page.getByText('49.000 ₫').first()).toBeVisible();
    await expect(page.getByText('399.000 ₫').first()).toBeVisible();
    await expect(page.getByText('Tháng 10/2026')).toBeVisible();
  });

  test('19. người dùng thường gõ thẳng URL tab admin bị đưa về trang chủ', async ({
    page,
  }) => {
    await open(page);
    await page.goto('/dashboard/admin?tab=15');
    await page.waitForURL(/\/dashboard\/home/);
  });

  test('26. admin: đơn chờ xác nhận tay hiện ghi chú nhận sai tiền; xác nhận gọi đúng API', async ({
    page,
  }) => {
    const calls = await open(page, { admin: true });
    await page.goto('/dashboard/admin?tab=15');
    await expect(page.getByText('LNWAIT2345')).toBeVisible();
    await expect(page.getByText('Nhận 50000 thay vì 49000')).toBeVisible();
    await page.getByRole('button', { name: 'Xác nhận đã nhận tiền' }).click();
    await page
      .getByRole('button', { name: 'Đã nhận tiền', exact: true })
      .click();
    await expect
      .poll(() =>
        calls.some(c =>
          c.url.endsWith('/premium/admin/orders/LNWAIT2345/confirm'),
        ),
      )
      .toBe(true);
  });
});
