// Chuỗi JSON an toàn để nhúng vào <script type="application/ld+json">.
// JSON.stringify không escape "<" nên tiêu đề/mô tả chứa "</script>" sẽ thoát
// khỏi thẻ script (XSS). Đổi "<" thành < (vẫn là JSON hợp lệ), cùng
// dấu ngắt dòng Unicode (mã 0x2028/0x2029) để không làm vỡ chuỗi ở trình
// phân tích cũ. Import thẳng '@/utils/jsonLd', không qua barrel '@utils'
// (xem CLAUDE.md).
const LINE_SEP = String.fromCharCode(0x2028);
const PARA_SEP = String.fromCharCode(0x2029);

export const safeJsonLd = (data: unknown): string =>
  JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .split(LINE_SEP)
    .join('\\u2028')
    .split(PARA_SEP)
    .join('\\u2029');
