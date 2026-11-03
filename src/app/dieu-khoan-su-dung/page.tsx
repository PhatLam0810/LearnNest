import LegalPage, { Li, P, Section } from '@components/LegalPage';

export const metadata = {
  title: 'Điều khoản sử dụng',
  description:
    'Điều khoản sử dụng dịch vụ LearnNest: tài khoản, gói Premium, quy tắc sử dụng và giới hạn trách nhiệm.',
};

export default function TermsOfUsePage() {
  return (
    <LegalPage title="Điều khoản sử dụng" updatedAt="03/11/2026">
      <Section heading="1. Giới thiệu">
        <P>
          LearnNest là nền tảng học trực tuyến của Trung Tâm Tin Học - Đại Học
          Văn Hiến, hỗ trợ luyện thi MOS (Word, Excel) và các kỹ năng tin học
          văn phòng. Khi tạo tài khoản hoặc tiếp tục sử dụng dịch vụ, bạn đồng ý
          với các điều khoản dưới đây.
        </P>
      </Section>

      <Section heading="2. Tài khoản của bạn">
        <Li>
          Bạn chịu trách nhiệm giữ bí mật mật khẩu và mọi hoạt động diễn ra dưới
          tài khoản của mình.
        </Li>
        <Li>
          Thông tin đăng ký (họ tên, MSSV, email) phải chính xác, thuộc về chính
          bạn.
        </Li>
        <Li>
          Chúng tôi có quyền tạm khóa hoặc thu hồi tài khoản vi phạm điều khoản
          này, hoặc dùng để gian lận/phá hoại hệ thống.
        </Li>
      </Section>

      <Section heading="3. Gói Premium">
        <Li>
          Premium là gói trả phí một lần theo thời hạn (1 tháng hoặc 1 năm),
          thanh toán qua chuyển khoản ngân hàng (QR) hoặc mã kích hoạt.
        </Li>
        <Li>
          Gói Premium không tự động gia hạn. Hết hạn, tài khoản quay về quyền
          lợi miễn phí; dữ liệu học tập (điểm, lịch sử, bài nộp) được giữ
          nguyên.
        </Li>
        <Li>
          Đơn Premium đã thanh toán thành công là giao dịch chốt, không hoàn
          tiền, trừ các trường hợp nêu tại{' '}
          <a href="/chinh-sach-doi-tra">Chính sách đổi trả/hoàn tiền</a>.
        </Li>
        <Li>
          Mua thêm/gia hạn khi gói hiện tại còn hạn xa sẽ bị hệ thống chặn, để
          tránh bạn trả tiền hai lần cho cùng khoảng thời gian; chỉ mở lại khi
          còn ≤ 7 ngày.
        </Li>
      </Section>

      <Section heading="4. Quy tắc sử dụng">
        <P>Khi dùng LearnNest, bạn đồng ý không:</P>
        <Li>
          Chia sẻ tài khoản cho người khác dùng chung, hoặc dùng tài khoản của
          người khác.
        </Li>
        <Li>
          Can thiệp, dò quét lỗ hổng, hoặc cố truy cập trái phép vào hệ thống,
          dữ liệu của người dùng khác.
        </Li>
        <Li>
          Dùng AI Tư Vấn / Chatbox AI để tạo nội dung vi phạm pháp luật, xúc
          phạm, hoặc gây hại.
        </Li>
        <Li>
          Sao chép, phân phối lại nội dung khóa học, đề thi thử khi chưa được
          phép.
        </Li>
      </Section>

      <Section heading="5. Sở hữu trí tuệ">
        <P>
          Nội dung khóa học, đề luyện tập, đề thi thử, giao diện và mã nguồn
          LearnNest thuộc quyền sở hữu của Trung Tâm Tin Học - Đại Học Văn Hiến
          hoặc được cấp phép sử dụng hợp pháp. Bạn được dùng cho mục đích học
          tập cá nhân, không được khai thác thương mại.
        </P>
      </Section>

      <Section heading="6. Giới hạn trách nhiệm">
        <P>
          LearnNest nỗ lực duy trì dịch vụ ổn định nhưng không cam kết hệ thống
          hoạt động liên tục, không gián đoạn. Chúng tôi không chịu trách nhiệm
          cho thiệt hại gián tiếp phát sinh từ việc gián đoạn dịch vụ ngoài tầm
          kiểm soát hợp lý (sự cố hạ tầng, bên thứ ba cung cấp dịch vụ gặp sự
          cố...).
        </P>
      </Section>

      <Section heading="7. Thay đổi điều khoản">
        <P>
          Chúng tôi có thể cập nhật điều khoản này khi dịch vụ hoặc quy định
          pháp luật thay đổi. Thay đổi quan trọng sẽ được thông báo trên trang
          này kèm ngày cập nhật mới.
        </P>
      </Section>

      <Section heading="8. Liên hệ & giải quyết khiếu nại">
        <P>
          Mọi thắc mắc, khiếu nại liên quan tới điều khoản sử dụng, vui lòng
          liên hệ Trung Tâm Tin Học - Đại Học Văn Hiến qua email info@vhu.edu.vn
          hoặc hotline 18001568. Chúng tôi xác nhận đã nhận khiếu nại trong vòng
          2 ngày làm việc.
        </P>
      </Section>
    </LegalPage>
  );
}
