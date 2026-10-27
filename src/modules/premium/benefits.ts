export type PremiumBenefit = {
  key: string;
  title: string;
  desc: string;
  free: string;
  premium: string;
};

// Nguồn duy nhất cho danh sách quyền lợi: trang Premium, modal nâng cấp và
// bảng so sánh đều đọc từ đây. Chỉ ghi những gì BE đang thật sự áp dụng.
export const PREMIUM_BENEFITS: PremiumBenefit[] = [
  {
    key: 'ai',
    title: 'AI không giới hạn',
    desc: 'Hỏi Chatbox AI và AI Tư Vấn thoải mái, không bị giới hạn lượt mỗi ngày.',
    free: '5 lượt/ngày',
    premium: 'Không giới hạn',
  },
  {
    key: 'mock',
    title: 'Thi thử MOS đầy đủ',
    desc: 'Làm mọi đề thi thử có tính giờ, mô phỏng đề MOS thật.',
    free: '1 đề',
    premium: 'Tất cả đề',
  },
  {
    key: 'practice',
    title: 'Luyện tập Word/Excel đầy đủ',
    desc: 'Mở toàn bộ bài luyện tập của mọi khóa.',
    free: '5 bài đầu mỗi khóa',
    premium: 'Đầy đủ',
  },
  {
    key: 'grade',
    title: 'Chấm bài không giới hạn',
    desc: 'Nộp bài và được chấm tự động bao nhiêu lần tùy ý, không bị chặn theo ngày.',
    free: '10 lượt/ngày',
    premium: 'Không giới hạn',
  },
  {
    key: 'course',
    title: 'Khóa học Premium',
    desc: 'Vào học các khóa dành riêng cho thành viên Premium.',
    free: 'Không',
    premium: 'Có',
  },
  {
    key: 'notes',
    title: 'Ghi chú và dấu trang không giới hạn',
    desc: 'Lưu thoải mái ghi chú theo video và các mục yêu thích.',
    free: '20 ghi chú, 20 mục lưu',
    premium: 'Không giới hạn',
  },
  {
    key: 'weak',
    title: 'Phân tích kỹ năng yếu đầy đủ',
    desc: 'Xem tỉ lệ làm đúng của mọi nhóm kỹ năng để biết nên luyện lại phần nào.',
    free: '3 kỹ năng yếu nhất',
    premium: 'Đầy đủ',
  },
  {
    key: 'roadmap',
    title: 'Lộ trình AI làm mới theo ý',
    desc: 'Bấm làm mới lộ trình học bất cứ lúc nào khi tiến độ thay đổi.',
    free: '1 lần/tuần',
    premium: 'Bất cứ lúc nào',
  },
  {
    key: 'export',
    title: 'Xuất báo cáo tiến độ Excel',
    desc: 'Tải toàn bộ lịch sử điểm trắc nghiệm, thực hành và thi thử về file Excel.',
    free: 'Không',
    premium: 'Có',
  },
  {
    key: 'badge',
    title: 'Huy hiệu Premium',
    desc: 'Huy hiệu hiển thị cạnh ảnh đại diện trên thanh đầu trang.',
    free: 'Không',
    premium: 'Có',
  },
  {
    key: 'support',
    title: 'Ưu tiên hỗ trợ',
    desc: 'Câu hỏi của bạn được đánh dấu và xếp lên đầu hộp thư hỏi đáp của giảng viên.',
    free: 'Thường',
    premium: 'Ưu tiên',
  },
];
