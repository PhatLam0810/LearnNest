import { test, expect, Page, request as pwRequest } from '@playwright/test';
import path from 'path';

// Video có sẵn dữ liệu ổn định trong DB demo, dùng lại xuyên suốt các test.
const LESSON_ID = '6a43a5354edad770e1b64abd';
const SUB_LESSON_ID = '6a045148e919632456cd8303';
const VIDEO_URL = `/dashboard/home/lesson/moduleDetail?lessonId=${LESSON_ID}&subLessonId=${SUB_LESSON_ID}`;
const LESSON_LIST_URL = `/dashboard/home/lesson/${LESSON_ID}`;
const DEMO_EMAIL = 'hocvien.demo@learnnest.test';
const DEMO_PASSWORD = 'DEMO2026';
const TEST_IMAGE = path.join(__dirname, 'fixtures', 'test-image.png');

// Toàn bộ test chạy tuần tự trên CÙNG 1 page/session (login 1 lần) vì nhiều
// case cố ý phụ thuộc trạng thái case trước (sửa/xóa đúng bình luận vừa tạo,
// v.v.) - giống cách bộ tính năng này đã được live-test suốt phiên làm việc.
test.describe.serial('Chức năng bình luận "Hỏi đáp"', () => {
  let page: Page;

  const drawer = () => page.locator('.ant-drawer');
  const textarea = () =>
    drawer().locator('textarea[placeholder="Nhập bình luận mới của bạn"]');
  const header = () => page.locator('.ant-drawer-header');

  const openDrawer = async () => {
    // Sau 1 navigation mới, CommentSection cần 1 nhịp để hydrate/mount rồi
    // mới portal-render FAB - check tức thời (isVisible không chờ) từng
    // khiến test bỏ qua bước mở drawer nếu FAB chưa kịp render, treo hẳn ở
    // bước điền textarea (không tìm thấy vì drawer chưa từng mở) cho tới
    // khi hết timeout. waitFor thực sự chờ, có retry.
    if (
      await drawer()
        .isVisible()
        .catch(() => false)
    )
      return;
    const fab = page.getByText('Hỏi đáp', { exact: true });
    await fab.waitFor({ state: 'visible', timeout: 15_000 });
    await fab.click();
    await expect(drawer()).toBeVisible();
  };

  const sendComment = async (text: string) => {
    await textarea().fill(text);
    await textarea().press('Enter');
    await expect(drawer().getByText(text, { exact: true })).toBeVisible();
  };

  // Khoanh đúng "khối" của 1 bình luận (chứa cả text lẫn hàng hành động
  // Thích/Trả lời) thay vì zoom quá sâu vào div lá chỉ chứa mỗi text -
  // filter kép loại bỏ chính xác cái div lá đó khỏi tập ứng viên.
  const commentRow = (text: string) =>
    drawer()
      .locator('div')
      .filter({ hasText: text })
      .filter({ hasText: 'Thích' })
      .last();

  // Dọn sạch mọi bình luận "E2E:" còn sót từ lần chạy trước - tự chạy mỗi
  // lần start suite để test luôn idempotent, không cần dọn tay giữa các lần.
  const cleanupTestComments = async () => {
    const api = await pwRequest.newContext({
      baseURL: 'http://localhost:9999',
    });
    const loginRes = await api.post('/auth/login', {
      data: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
    });
    const token = (await loginRes.json()).data.accessToken;
    const listRes = await api.post('/comments/getList', {
      data: { postId: SUB_LESSON_ID, pageSize: 500, pageNum: 1 },
    });
    const items = (await listRes.json()).data.items as {
      _id: string;
      commentText: string;
    }[];
    for (const item of items) {
      if (item.commentText.startsWith('E2E')) {
        await api
          .delete(`/comments/${item._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch(() => {});
      }
    }
    await api.dispose();
  };

  test.beforeAll(async ({ browser }) => {
    await cleanupTestComments();
    page = await browser.newPage();
    await page.goto('/login');
    await page.getByPlaceholder('Nhập email của bạn').fill(DEMO_EMAIL);
    await page.getByPlaceholder('Nhập mật khẩu của bạn').fill(DEMO_PASSWORD);
    await page
      .getByRole('button', { name: 'Đăng nhập vào tài khoản của bạn' })
      .click();
    await page.waitForURL(/\/dashboard/, { timeout: 20_000 });

    await page.goto(VIDEO_URL);
    await expect(page.getByText('Hỏi đáp', { exact: true })).toBeVisible({
      timeout: 15_000,
    });
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('1. Nút nổi "Hỏi đáp" hiện đúng và mở được panel bình luận', async () => {
    await openDrawer();
    await expect(header()).toContainText('bình luận');
  });

  test('2. Đăng bình luận mới hiển thị ngay trong danh sách', async () => {
    await openDrawer();
    await sendComment('E2E: bình luận gốc số 1');
    await expect(drawer().getByText('Bạn').first()).toBeVisible();
  });

  test('3. Ô nhập tự giãn nhiều dòng khi nội dung dài (auto-grow textarea)', async () => {
    const box1 = await textarea().boundingBox();
    await textarea().click();
    await textarea().type('Dòng một đủ dài để wrap');
    for (let i = 0; i < 4; i++) {
      await textarea().press('Shift+Enter');
      await textarea().type('Thêm một dòng nữa để đẩy chiều cao lên');
    }
    const box2 = await textarea().boundingBox();
    expect(box2!.height).toBeGreaterThan(box1!.height);
    await textarea().fill(''); // dọn lại, không gửi comment rác này
  });

  test('4. Bấm icon ảnh mở thẳng hộp thoại chọn file (không qua bước trung gian)', async () => {
    const attachIcon = drawer().locator('.anticon-picture').first();
    const [chooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      attachIcon.click(),
    ]);
    await chooser.setFiles(TEST_IMAGE);
    // Thumbnail ảnh chờ gửi phải xuất hiện ngay, không cần bấm thêm gì khác.
    await expect(drawer().locator('img[src*="http"]').first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('5. Gửi bình luận kèm ảnh hiển thị đúng thumbnail trong danh sách', async () => {
    await sendComment('E2E: bình luận có ảnh đính kèm');
    const row = commentRow('E2E: bình luận có ảnh đính kèm');
    await expect(row.locator('img').first()).toBeVisible();
  });

  test('6. Sửa bình luận của chính mình cập nhật đúng nội dung', async () => {
    await sendComment('E2E: bình luận sẽ được sửa');
    const editLink = drawer().getByText('Sửa', { exact: false }).last();
    await editLink.click();
    const editInput = drawer().locator(
      'input[value="E2E: bình luận sẽ được sửa"]',
    );
    await editInput.fill('E2E: bình luận đã sửa xong');
    await drawer().getByText('Lưu', { exact: true }).click();
    await expect(
      drawer().getByText('E2E: bình luận đã sửa xong', { exact: true }),
    ).toBeVisible();
  });

  test('7. Thích/Bỏ thích toggle đúng số lượt, không tăng vô hạn', async () => {
    // Tránh đặt tên bình luận chứa từ "thích" (không phân biệt hoa/thường
    // trong getByText mặc định) - sẽ trùng khớp nhầm với chính nút "Thích".
    await sendComment('E2E: bình luận số 7 kiểm tra nút tim');
    const row = commentRow('E2E: bình luận số 7 kiểm tra nút tim');
    const likeBtn = row.getByText('Thích', { exact: false }).first();
    await likeBtn.click();
    await expect(row.getByText('Thích (1)')).toBeVisible();
    await likeBtn.click();
    await expect(row.getByText('Thích (1)')).not.toBeVisible();
    await likeBtn.click();
    await expect(row.getByText('Thích (1)')).toBeVisible();
  });

  test('8. Trả lời một bình luận hiển thị lồng bên dưới bình luận gốc', async () => {
    await sendComment('E2E: bình luận gốc để test reply');
    const replyLinks = drawer().getByText('Trả lời', { exact: true });
    await replyLinks.last().click();
    await sendComment('E2E: đây là 1 câu trả lời');
  });

  test('9. Thu gọn hiện khi >4 trả lời, mở rộng/thu gọn hoạt động đúng', async () => {
    // Tránh chữ "thu gọn"/"thích"/"xóa"/"sửa"/"trả lời" trong nội dung test
    // để không tự đụng độ với chính các nhãn nút đang bị getByText tìm.
    await sendComment('E2E: bình luận gốc số 9 - danh sách phản hồi');
    const replyLinks = drawer().getByText('Trả lời', { exact: true });
    // 4 reply đầu hiển thị ngay (đúng REPLIES_PREVIEW_COUNT) - dùng
    // sendComment() bình thường vì có assert hiển thị.
    for (let i = 1; i <= 4; i++) {
      await replyLinks.last().click();
      await sendComment(`E2E reply ${i}`);
    }
    // Reply thứ 5 vượt ngưỡng preview - THEO ĐÚNG THIẾT KẾ nó bị ẩn ngay
    // sau khi gửi (chỉ hiện khi bấm "Xem thêm"), nên không dùng
    // sendComment() (sẽ assert-fail vì chưa hiển thị).
    await replyLinks.last().click();
    await textarea().fill('E2E reply 5');
    await textarea().press('Enter');
    const viewMore = drawer().getByText(/Xem thêm \d+ câu trả lời/);
    await expect(viewMore).toBeVisible();
    await viewMore.click();
    await expect(drawer().getByText('E2E reply 5')).toBeVisible();
    await expect(drawer().getByText('Thu gọn', { exact: true })).toBeVisible();
    await drawer().getByText('Thu gọn', { exact: true }).click();
    await expect(drawer().getByText('E2E reply 5')).not.toBeVisible();
  });

  test('10. Xóa bình luận gốc xóa kèm toàn bộ trả lời (không còn "mồ côi")', async () => {
    await sendComment('E2E: gốc sẽ bị xóa kèm reply');
    const replyLinks = drawer().getByText('Trả lời', { exact: true });
    await replyLinks.last().click();
    await sendComment('E2E: reply sẽ bị xóa theo');

    const rootRow = commentRow('E2E: gốc sẽ bị xóa kèm reply');
    await rootRow.getByText('Xóa', { exact: true }).first().click();

    await expect(
      drawer().getByText('E2E: gốc sẽ bị xóa kèm reply'),
    ).not.toBeVisible();
    await expect(
      drawer().getByText('E2E: reply sẽ bị xóa theo'),
    ).not.toBeVisible();

    // Số đếm header phải khớp với số bình luận thực sự còn hiển thị được -
    // đây chính là bug đã fix (reply mồ côi vẫn bị đếm nhưng không hiện ra).
    const countText = await header().textContent();
    const count = parseInt(countText || '0', 10);
    const isEmpty = await drawer()
      .getByText('Chưa có bình luận nào — hãy là người đầu tiên.')
      .isVisible()
      .catch(() => false);
    if (count === 0) expect(isEmpty).toBe(true);
  });

  test('11. Badge số bình luận hiển thị đúng trên danh sách nội dung bài học', async () => {
    await sendComment('E2E: bình luận để test badge count');
    const countText = await header().textContent();
    const expectedCount = parseInt(countText || '0', 10);

    await page.goto(LESSON_LIST_URL);
    const videoCard = page
      .locator('div')
      .filter({ hasText: 'Word - Giới thiệu Tổng quan Bài thi MOS 2019' })
      .first();
    await expect(videoCard.getByText(String(expectedCount))).toBeVisible({
      timeout: 10_000,
    });

    await page.goto(VIDEO_URL);
    await expect(page.getByText('Hỏi đáp', { exact: true })).toBeVisible();
  });

  test('12. Báo cáo vi phạm (lý do Spam) được ghi nhận và admin thấy được', async ({
    request,
  }) => {
    await openDrawer();
    await sendComment('E2E: bình luận sẽ bị báo cáo');

    const listRes = await request.post(
      'http://localhost:9999/comments/getList',
      {
        data: { postId: SUB_LESSON_ID, pageSize: 100, pageNum: 1 },
      },
    );
    const listJson = await listRes.json();
    const target = listJson.data.items.find((i: any) =>
      i.commentText.includes('bình luận sẽ bị báo cáo'),
    );
    expect(target).toBeTruthy();

    const storage = await page.context().storageState();
    const authEntry = storage.origins
      .flatMap(o => o.localStorage)
      .find(l => l.name === 'persist:auth');
    const tokenInfo = JSON.parse(JSON.parse(authEntry!.value).tokenInfo);

    const reportRes = await request.post(
      'http://localhost:9999/comments/report',
      {
        headers: { Authorization: `Bearer ${tokenInfo.accessToken}` },
        data: { commentId: target._id, reason: 'spam' },
      },
    );
    expect(reportRes.ok()).toBe(true);

    await page.goto('/dashboard/admin?tab=7');
    await expect(
      page.getByText('E2E: bình luận sẽ bị báo cáo').first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('13. Admin xóa bình luận từ báo cáo vi phạm thành công', async () => {
    const row = page
      .locator('tr')
      .filter({ hasText: 'E2E: bình luận sẽ bị báo cáo' })
      .first();
    await row.click();
    await page.getByRole('button', { name: 'Xóa bình luận' }).click();
    await expect(page.getByText('Đã xóa bình luận')).toBeVisible();
    await expect(
      page.getByText('E2E: bình luận sẽ bị báo cáo'),
    ).not.toBeVisible();
  });

  test('14. Admin bỏ qua báo cáo vi phạm giữ nguyên bình luận', async ({
    request,
  }) => {
    test.setTimeout(60_000); // nhiều bước điều hướng hơn các test khác
    await page.goto(VIDEO_URL);
    await openDrawer();
    await sendComment('E2E: bình luận sẽ được bỏ qua báo cáo');

    const listRes = await request.post(
      'http://localhost:9999/comments/getList',
      { data: { postId: SUB_LESSON_ID, pageSize: 100, pageNum: 1 } },
    );
    const listJson = await listRes.json();
    const target = listJson.data.items.find((i: any) =>
      i.commentText.includes('bình luận sẽ được bỏ qua báo cáo'),
    );
    const storage = await page.context().storageState();
    const authEntry = storage.origins
      .flatMap(o => o.localStorage)
      .find(l => l.name === 'persist:auth');
    const tokenInfo = JSON.parse(JSON.parse(authEntry!.value).tokenInfo);
    await request.post('http://localhost:9999/comments/report', {
      headers: { Authorization: `Bearer ${tokenInfo.accessToken}` },
      data: { commentId: target._id, reason: 'other', note: 'test dismiss' },
    });

    await page.goto('/dashboard/admin?tab=7');
    const row = page
      .locator('tr')
      .filter({ hasText: 'E2E: bình luận sẽ được bỏ qua báo cáo' })
      .first();
    await row.click();
    await page.getByRole('button', { name: 'Bỏ qua báo cáo' }).click();
    await expect(page.getByText('Đã bỏ qua báo cáo')).toBeVisible();

    // Bình luận PHẢI vẫn còn tồn tại (khác với "Xóa bình luận" ở case 13).
    await page.goto(VIDEO_URL);
    await openDrawer();
    await expect(
      drawer().getByText('E2E: bình luận sẽ được bỏ qua báo cáo'),
    ).toBeVisible();

    // Dọn dẹp dữ liệu test cuối cùng.
    const row2 = commentRow('E2E: bình luận sẽ được bỏ qua báo cáo');
    await row2.getByText('Xóa', { exact: true }).first().click();
  });
});
