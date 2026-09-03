import { test, expect } from '@playwright/test';

// Đo hiệu năng ModuleDetailPage/LibraryDetailItem: video-tracking interval
// bị dựng lại (clearInterval + setInterval MỚI) MỖI GIÂY vì lastPlayed và
// maxWatched (chính 2 state mà interval đó tự cập nhật mỗi tick) nằm trong
// dependency array của useEffect chứa nó - tick nào cũng khiến effect
// cleanup+re-run, kéo theo renderMedia() bị tính toán lại toàn bộ dù không
// cần thiết. Có 2 effect như vậy chạy song song (1 cho YouTube, 1 cho HTML5
// <video>) dù chỉ 1 loại đang thực sự dùng - cái còn lại vẫn no-op nhưng vẫn
// bị tạo/hủy lại đều đặn.
//
// DOM-mutation-based measurement không bắt được vấn đề này (key={data._id}
// giúp React patch tại chỗ, không unmount/remount DOM thật) - phải đo trực
// tiếp số lần setInterval/clearInterval được gọi bằng cách monkey-patch
// window.setInterval/clearInterval TRƯỚC khi trang tải (addInitScript).
const LESSON_ID = '6a43a5354edad770e1b64abd';
const SUB_LESSON_ID = '6a045148e919632456cd8303';
const VIDEO_URL = `/dashboard/home/lesson/moduleDetail?lessonId=${LESSON_ID}&subLessonId=${SUB_LESSON_ID}`;
const DEMO_EMAIL = 'hocvien.demo@learnnest.test';
const DEMO_PASSWORD = 'DEMO2026';

test.describe('Hiệu năng ModuleDetailPage (video-tracking interval churn)', () => {
  test.beforeEach(async ({ page }) => {
    // Đếm setInterval/clearInterval theo từng khoảng thời gian gọi (delay)
    // để tách interval "mỗi giây" (nghi phạm chính) khỏi các interval hợp lệ
    // khác trong app (vd polling 10s của flushTracking, animation timers...).
    await page.addInitScript(() => {
      (window as any).__intervalCallsByDelay = {};
      const origSet = window.setInterval.bind(window);
      window.setInterval = ((fn: any, delay?: number, ...rest: any[]) => {
        const key = String(delay);
        (window as any).__intervalCallsByDelay[key] =
          ((window as any).__intervalCallsByDelay[key] || 0) + 1;
        return origSet(fn, delay, ...rest);
      }) as any;
    });

    await page.goto('/login');
    await page.getByPlaceholder('Nhập email của bạn').fill(DEMO_EMAIL);
    await page.getByPlaceholder('Nhập mật khẩu của bạn').fill(DEMO_PASSWORD);
    await page
      .getByRole('button', { name: 'Đăng nhập vào tài khoản của bạn' })
      .click();
    await page.waitForURL(/\/dashboard/, { timeout: 20_000 });
    await page.goto(VIDEO_URL);
    await page.waitForSelector('video, iframe', { timeout: 15_000 });
    // Bug chỉ lộ ra khi currentTime THỰC SỰ đang tăng (đang phát) - video
    // mặc định autoPlay=false, đứng yên ở currentTime=0 thì lastPlayed/
    // maxWatched không đổi, effect không re-run, che mất vấn đề hoàn toàn.
    await page.evaluate(() => {
      const v = document.querySelector('video');
      v?.play().catch(() => {});
    });
    await page.waitForTimeout(1500); // cho currentTime kịp nhích khỏi 0
  });

  test('interval theo dõi tiến độ video (delay=1000ms) không nên bị tạo lại mỗi giây', async ({
    page,
  }) => {
    // Trạng thái đầu khi trang vừa vào (mount effect lần đầu) đã tính vài
    // lần tạo - reset bộ đếm rồi mới đo cửa sổ ổn định (video đang phát,
    // không thao tác gì khác).
    await page.evaluate(() => {
      (window as any).__intervalCallsByDelay = {};
    });
    await page.waitForTimeout(6000);
    const counts = await page.evaluate(
      () => (window as any).__intervalCallsByDelay,
    );
    console.log(
      'setInterval CALLS BY DELAY (6s window) BEFORE FIX CHECK:',
      JSON.stringify(counts),
    );
    const calls1000ms = counts['1000'] || 0;
    console.log('setInterval(fn, 1000) call count in 6s:', calls1000ms);
    // Video-tracking chỉ nên được tạo 1 LẦN (khi mount/đổi bài), không phải
    // mỗi giây - trong cửa sổ ổn định 6s, con số này phải gần 0 (cho phép 1
    // lần dự phòng do timing), KHÔNG PHẢI ~6-12 (2 effect x 6 giây) như khi
    // còn bug.
    expect(calls1000ms).toBeLessThanOrEqual(1);
  });
});
