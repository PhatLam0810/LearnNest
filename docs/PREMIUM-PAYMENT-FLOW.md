# Kịch bản luồng thanh toán Premium

Nguyên tắc: **BE là lớp bảo vệ duy nhất.** FE chỉ hiển thị và dẫn người dùng.
Thanh toán một lần bằng **chuyển khoản QR (VietQR)**, SePay báo
tiền về bằng webhook. Không lưu thẻ, không tự động gia hạn. VNPay đã gỡ; đơn cũ
qua VNPay vẫn hiện trong lịch sử.

## Cấu hình (BE `.env`)

| Biến                | Ý nghĩa                                              |
| ------------------- | ---------------------------------------------------- |
| `BANK_ACCOUNT_NO`   | Số tài khoản nhận tiền                               |
| `BANK_ACCOUNT_NAME` | Tên chủ tài khoản (hiện trên QR)                     |
| `BANK_BIN`          | Mã VietQR của ngân hàng (MB Bank = `970422`)         |
| `BANK_NAME`         | Tên ngân hàng hiển thị                               |
| `SEPAY_API_KEY`     | Khóa SePay gắn vào webhook (`Authorization: Apikey`) |
| `FRONTEND_URL`      | Địa chỉ FE                                           |

Webhook SePay: `POST https://<domain BE>/premium/sepay/webhook`.

## Luồng mua

1. Ở `/dashboard/premium` bấm **Bắt đầu** (hoặc **Gia hạn / Mua lại**).
2. Form **Xác nhận đơn**: gói, thời hạn, số tiền cố định theo gói (BE tự tính),
   họ tên tự điền từ hồ sơ.
3. **Tạo mã QR** → `POST /premium/orders { plan, fullName }`. BE kiểm tra gói,
   kiểm tra user **không còn Premium hạn xa (> 7 ngày)**, ghi đơn `pending` với
   mã đơn dạng `LN` + 8 ký tự (cũng là **nội dung chuyển khoản**) và trả về QR
   VietQR đã điền sẵn số tiền + nội dung.
4. Khách quét QR chuyển khoản (đúng số tiền, đúng nội dung).
5. SePay phát hiện tiền vào và gọi webhook. BE kiểm: khóa API, loại giao dịch
   là tiền vào, đúng số tài khoản, chưa xử lý mã giao dịch này, tìm thấy mã đơn
   trong nội dung (không phân biệt hoa/thường, chịu được ký tự lạ), **số tiền
   khớp tuyệt đối**. Đạt thì chuyển đơn `pending → paid` bằng một thao tác
   nguyên tử rồi cấp hạn.
6. Modal QR hỏi `GET /premium/orders/ref/:ref` **mỗi 3 giây**; thấy `paid` thì
   dừng hỏi và hiện modal **Kích hoạt Premium thành công**.
7. Lịch sử đơn: **Hồ sơ → Lịch sử đơn Premium**.

Webhook không về (lỗi mạng, SePay trễ): admin kiểm sao kê rồi bấm **Xác nhận đã
nhận tiền** ở tab Premium.

## Bảng kịch bản

| #   | Kịch bản                                                     | Kết quả mong đợi                                                 | Test phủ                  |
| --- | ------------------------------------------------------------ | ---------------------------------------------------------------- | ------------------------- |
| S1  | Tạo đơn                                                      | Đơn `pending`, mã đơn = nội dung CK, QR đúng TK/số tiền/nội dung | BE integration, e2e 7     |
| S2  | Tiền về đúng mã + đúng số tiền + đúng TK                     | `paid`, lưu mã GD ngân hàng, cấp 30/365 ngày                     | BE integration, e2e 8     |
| S3  | Mã đơn nằm ở trường `code` hoặc bị đổi hoa/thường/chèn ký tự | Vẫn khớp                                                         | BE integration            |
| S4  | SePay gọi lại cùng giao dịch / 5 webhook song song           | Chỉ cấp hạn **một lần**                                          | BE integration            |
| S5  | Hai giao dịch khác nhau cùng trả một đơn                     | Giao dịch sau không cấp thêm                                     | BE integration            |
| S6  | Nhận thiếu hoặc thừa tiền                                    | **Không cấp hạn**, đơn vẫn `pending`, ghi chú cho admin          | BE integration, e2e 26    |
| S7  | Tiền ra, sai tài khoản, không có mã, mã lạ, thiếu id         | Bỏ qua, DB không đổi                                             | BE integration            |
| S8  | Sai khóa webhook                                             | 401                                                              | BE webhook spec           |
| S9  | Cấp hạn lỗi giữa chừng                                       | Đơn về `pending`, bỏ mã GD, webhook gọi lại cấp được             | BE integration            |
| S10 | Còn hạn > 7 ngày mà tạo đơn / dùng mã                        | BE từ chối, không tạo đơn rác, mã không bị đốt                   | BE integration, e2e 3, 4b |
| S11 | Còn ≤ 7 ngày (gia hạn)                                       | Được; ngày mới **cộng nối tiếp**                                 | BE integration, e2e 4     |
| S12 | Đã hết hạn                                                   | Mua lại, hạn tính từ bây giờ                                     | BE integration, e2e 5     |
| S13 | Admin xác nhận tay; webhook về sau đó                        | Cấp 1 lần; webhook sau báo `already-processed`                   | BE integration, e2e 26    |
| S14 | Đóng modal QR / đã paid                                      | Dừng hỏi trạng thái                                              | e2e 8, 8b                 |
| S15 | Bỏ trống tên / BE từ chối tạo đơn / Hủy                      | Báo lỗi tại form, không gọi API / không hiện QR                  | e2e 7b, 7c, 7d            |
| S16 | Xem đơn của người khác                                       | BE không trả                                                     | BE integration            |
| S17 | Mã kích hoạt                                                 | Dùng 1 lần; 5 người cùng bấm chỉ 1 người thành công              | BE integration            |

## Giới hạn đã biết

- Chưa thử với SePay thật: cần tài khoản SePay liên kết MB Bank và khai báo
  địa chỉ webhook công khai. Định dạng payload theo tài liệu SePay (`id`,
  `accountNumber`, `transferType`, `transferAmount`, `content`, `code`).
- QR được dựng bằng dịch vụ ảnh `img.vietqr.io` (công khai, không cần khóa).
- Không có tính năng hoàn tiền; đơn đã thanh toán là chốt, xử lý ngoài hệ
  thống nếu cần (ví dụ admin tự chuyển khoản trả lại rồi nói học viên biết).
- Hai đơn `pending` cùng trả tiền: cả hai đều được cấp (cộng dồn), vì tiền đã thu.
