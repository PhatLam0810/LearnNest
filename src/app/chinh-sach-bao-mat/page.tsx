import LegalPage, { Li, P, Section } from '@components/LegalPage';

export const metadata = {
  title: 'Chính sách bảo vệ dữ liệu cá nhân',
  description:
    'Chính sách bảo vệ dữ liệu cá nhân của LearnNest: dữ liệu thu thập, mục đích, bên thứ ba nhận dữ liệu, quyền của bạn và cách liên hệ.',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Chính sách bảo vệ dữ liệu cá nhân" updatedAt="03/11/2026">
      <Section heading="1. Dữ liệu chúng tôi thu thập">
        <P>
          Khi bạn tạo tài khoản và sử dụng LearnNest, chúng tôi thu thập: họ
          tên, email, mã số sinh viên (MSSV), mật khẩu (được mã hóa, chúng tôi
          không bao giờ lưu mật khẩu dạng chữ thường), ảnh đại diện (nếu bạn tải
          lên).
        </P>
        <P>
          Trong quá trình học: lịch sử xem bài học, điểm trắc nghiệm, bài thực
          hành đã nộp, ghi chú và dấu trang bạn tạo, tin nhắn bạn gửi cho AI Tư
          Vấn / Chatbox AI.
        </P>
        <P>
          Khi mua gói Premium: họ tên người thanh toán, số tiền, mã đơn, thời
          điểm giao dịch. Chúng tôi <strong>không</strong> thu thập hay lưu số
          thẻ, mật khẩu ngân hàng hay bất kỳ thông tin đăng nhập ngân hàng nào
          của bạn - việc chuyển khoản diễn ra trực tiếp trên ứng dụng ngân hàng
          của bạn, LearnNest chỉ nhận lại kết quả giao dịch (đã xảy ra hay chưa,
          đúng số tiền hay không) qua đối tác trung gian SePay.
        </P>
      </Section>

      <Section heading="2. Mục đích sử dụng">
        <Li>Tạo và duy trì tài khoản, xác thực đăng nhập.</Li>
        <Li>
          Vận hành chức năng học tập: theo dõi tiến độ, chấm bài, gợi ý lộ trình
          học bằng AI.
        </Li>
        <Li>Xử lý đơn mua gói Premium và xác nhận thanh toán.</Li>
        <Li>
          Gửi email giao dịch (xác nhận mua hàng, nhắc hạn gói, OTP xác minh) và
          thông báo trong ứng dụng.
        </Li>
        <Li>Hỗ trợ kỹ thuật khi bạn liên hệ hoặc gửi phản hồi.</Li>
        <Li>
          Thống kê, cải thiện chất lượng dịch vụ (dữ liệu được tổng hợp, không
          định danh cá nhân khi báo cáo).
        </Li>
      </Section>

      <Section heading="3. Dữ liệu nhạy cảm">
        <P>
          Nội dung bạn gõ vào AI Tư Vấn / Chatbox AI có thể chứa thông tin cá
          nhân do chính bạn chủ động chia sẻ trong lúc trò chuyện. Chúng tôi xếp
          loại đây là dữ liệu cần xử lý cẩn trọng: chỉ dùng để trả lời câu hỏi
          của bạn, không dùng cho mục đích quảng cáo, không bán hay chia sẻ cho
          bên thứ ba ngoài việc gửi tới đối tác cung cấp mô hình AI (Mục 4) để
          sinh câu trả lời.
        </P>
      </Section>

      <Section heading="4. Bên thứ ba nhận dữ liệu (bao gồm chuyển dữ liệu ra nước ngoài)">
        <P>
          Chúng tôi chia sẻ dữ liệu với một số đối tác để vận hành dịch vụ, giới
          hạn trong phạm vi cần thiết cho từng mục đích:
        </P>
        <Li>
          <strong>Google (Gemini AI)</strong> - nhận nội dung tin nhắn khi bạn
          dùng AI Tư Vấn / Chatbox AI để sinh câu trả lời. Máy chủ của Google
          đặt ngoài lãnh thổ Việt Nam.
        </Li>
        <Li>
          <strong>SePay</strong> - đối tác đối soát giao dịch ngân hàng, xác
          nhận bạn đã chuyển khoản đúng số tiền/nội dung cho đơn Premium.
        </Li>
        <Li>
          <strong>Brevo</strong> - nền tảng gửi email giao dịch (xác nhận mua
          hàng, OTP, nhắc hạn gói).
        </Li>
        <Li>
          <strong>Nhà cung cấp hạ tầng máy chủ và lưu trữ</strong> vận hành
          website và cơ sở dữ liệu của chúng tôi.
        </Li>
        <P>
          Chúng tôi không bán dữ liệu cá nhân của bạn cho bất kỳ ai, dưới bất kỳ
          hình thức nào.
        </P>
      </Section>

      <Section heading="5. Thời gian lưu trữ">
        <P>
          Dữ liệu tài khoản và lịch sử học được lưu trong suốt thời gian bạn còn
          sử dụng dịch vụ. Nếu bạn yêu cầu xóa tài khoản, chúng tôi xóa hoặc ẩn
          danh dữ liệu cá nhân trong thời hạn nêu ở Mục 7, trừ dữ liệu pháp luật
          yêu cầu phải lưu lâu hơn (ví dụ hồ sơ giao dịch thanh toán).
        </P>
      </Section>

      <Section heading="6. Sự đồng ý của bạn">
        <P>
          Bằng việc tạo tài khoản, bạn đồng ý để LearnNest thu thập và xử lý dữ
          liệu theo chính sách này nhằm cung cấp dịch vụ bạn yêu cầu. Việc đồng
          ý sử dụng AI Tư Vấn / Chatbox AI là riêng biệt - bạn có thể dùng đầy
          đủ các tính năng học tập khác của LearnNest mà không cần dùng tới AI.
        </P>
        <P>
          Bạn có thể rút lại sự đồng ý bất cứ lúc nào bằng cách liên hệ theo Mục
          9; việc rút đồng ý không ảnh hưởng tới tính hợp pháp của việc xử lý đã
          thực hiện trước đó.
        </P>
      </Section>

      <Section heading="7. Quyền của bạn">
        <P>
          Theo Luật Bảo vệ dữ liệu cá nhân, bạn có quyền được biết, xem, chỉnh
          sửa, xóa, hạn chế hoặc phản đối việc xử lý dữ liệu cá nhân của mình,
          và quyền khiếu nại. Liên hệ chúng tôi theo Mục 9 để thực hiện các
          quyền này; chúng tôi cam kết:
        </P>
        <Li>Xác nhận đã nhận yêu cầu của bạn: trong 2 ngày làm việc.</Li>
        <Li>Xem / chỉnh sửa / cung cấp lại dữ liệu cho bạn: trong 10 ngày.</Li>
        <Li>Rút đồng ý, hạn chế hoặc phản đối xử lý: trong 15 ngày.</Li>
        <Li>Xóa dữ liệu: trong 20 ngày.</Li>
      </Section>

      <Section heading="8. Bảo mật">
        <P>
          Mật khẩu được mã hóa một chiều, không ai ở LearnNest (kể cả quản trị
          viên) xem được mật khẩu gốc của bạn. Kết nối giữa trình duyệt và máy
          chủ được mã hóa (HTTPS). Chúng tôi giới hạn quyền truy cập dữ liệu nội
          bộ theo vai trò, chỉ nhân sự cần thiết mới truy cập được thông tin
          người dùng để xử lý công việc.
        </P>
      </Section>

      <Section heading="9. Liên hệ">
        <P>
          Mọi câu hỏi hoặc yêu cầu liên quan tới dữ liệu cá nhân của bạn, vui
          lòng liên hệ Trung Tâm Tin Học - Đại Học Văn Hiến qua email{' '}
          <strong>info@vhu.edu.vn</strong> hoặc hotline{' '}
          <strong>18001568</strong>.
        </P>
      </Section>
    </LegalPage>
  );
}
