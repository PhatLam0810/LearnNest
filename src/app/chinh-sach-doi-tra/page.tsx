import LegalPage, { Li, P, Section } from '@components/LegalPage';

export const metadata = {
  title: 'Chính sách đổi trả / hoàn tiền',
  description:
    'Chính sách đổi trả và hoàn tiền cho gói Premium LearnNest: nguyên tắc chung, các trường hợp được xử lý và cách khiếu nại.',
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Chính sách đổi trả / hoàn tiền" updatedAt="03/11/2026">
      <Section heading="1. Nguyên tắc chung">
        <P>
          Gói Premium là dịch vụ số, được kích hoạt và sử dụng được ngay sau khi
          thanh toán thành công. Do đó, đơn Premium đã thanh toán thành công là
          giao dịch chốt, LearnNest <strong>không hoàn tiền</strong> vì lý do
          đổi ý hoặc không còn nhu cầu sử dụng. Thông tin này được hiển thị rõ
          ngay trước khi bạn xác nhận mua, ở bước tạo mã QR thanh toán.
        </P>
      </Section>

      <Section heading="2. Các trường hợp được xử lý/hoàn tiền">
        <P>
          Chúng tôi xử lý hoàn tiền hoặc khắc phục trong các trường hợp sau:
        </P>
        <Li>
          <strong>Lỗi hệ thống</strong>: bạn đã chuyển khoản đúng số tiền, đúng
          nội dung nhưng tài khoản không được cấp quyền Premium do lỗi kỹ thuật
          của LearnNest - chúng tôi cấp quyền thủ công hoặc hoàn tiền nếu không
          thể cấp quyền.
        </Li>
        <Li>
          <strong>Chuyển sai số tiền</strong>: nếu bạn chuyển thiếu, hệ thống
          giữ đơn ở trạng thái chờ và không cấp quyền; nếu bạn chuyển thừa,
          chúng tôi hoàn lại phần chênh lệch sau khi xác minh.
        </Li>
        <Li>
          <strong>Thu phí trùng</strong>: nếu do lỗi kỹ thuật khiến bạn bị trừ
          tiền hai lần cho cùng một gói, chúng tôi hoàn lại khoản thu thừa.
        </Li>
      </Section>

      <Section heading="3. Đơn chưa thanh toán">
        <P>
          Đơn chuyển khoản tạo ra nhưng bạn chưa chuyển tiền không phát sinh
          nghĩa vụ gì. Bạn có thể tự hủy đơn đang chờ thanh toán ngay tại mục
          "Đơn chờ thanh toán" trong trang Hồ sơ, để tạo đơn mới ngay (không cần
          đợi đơn cũ hết hạn).
        </P>
      </Section>

      <Section heading="4. Cách gửi khiếu nại">
        <P>
          Nếu rơi vào một trong các trường hợp ở Mục 2, vui lòng liên hệ Trung
          Tâm Tin Học - Đại Học Văn Hiến qua email info@vhu.edu.vn hoặc hotline
          18001568, kèm theo: mã đơn (hiển thị trong trang Lịch sử giao dịch),
          số tiền, thời điểm chuyển khoản và ảnh chụp biên lai nếu có.
        </P>
        <P>
          Chúng tôi xác nhận đã nhận khiếu nại trong vòng 2 ngày làm việc, và
          phản hồi kết quả xử lý trong vòng 10 ngày làm việc kể từ khi nhận đủ
          thông tin.
        </P>
      </Section>
    </LegalPage>
  );
}
