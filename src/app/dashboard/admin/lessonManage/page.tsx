'use client';
import React, { useState } from 'react';
import { View } from 'react-native-web';
import styles from './styles';
import {
  ModuleManage,
  LessonManage,
  LibraryManage,
  PracticeLessonManage,
} from './_components';
import PracticeManage from '../practiceManage';
import { AdminGuide, ContentTabStrip, ContentTab } from '~mdAdmin/components';
// Vẫn cần cho các tab CHƯA chuyển sang ThemedTable (giữ header bảng xanh
// brand + nút search trắng-trên-xanh qua CSS toàn cục theo route này) - bỏ
// import này khi mọi tab đã dùng ThemedTable/ContentToolbar.
import './styles.scss';

const tabs: ContentTab[] = [
  { key: '1', label: 'Khóa học' },
  { key: '2', label: 'Phần học' },
  { key: '4', label: 'Bài học' },
  { key: '5', label: 'Bài thực hành' },
  { key: '6', label: 'Phần thực hành' },
];

const tabContent: Record<string, React.ReactNode> = {
  '1': <LessonManage />,
  '2': <ModuleManage />,
  '4': <LibraryManage />,
  '5': <PracticeManage />,
  '6': <PracticeLessonManage />,
};

const guides: Record<
  string,
  { title: string; steps: string[]; note?: string }
> = {
  '1': {
    title: 'tạo khóa học',
    steps: [
      'Bấm "Thêm khóa học".',
      'Nhập Tên khóa học, Giảng viên, Mô tả, các Kỹ năng đạt được và chọn Hình nền.',
      '"Ai được học khóa này": Công khai (mọi người) hoặc Chỉ lớp được phân.',
      'Gắn các Phần học vào khóa (chọn từ danh sách, thứ tự chọn là thứ tự học).',
      'Bấm Lưu. Dùng nút Cập nhật / Xóa ở mỗi dòng để sửa hoặc xóa khóa học.',
    ],
    note: 'Phần học và bài học cần được tạo trước ở các tab "Phần học", "Bài học".',
  },
  '2': {
    title: 'tạo phần học',
    steps: [
      'Bấm "Thêm phần học" và nhập Tên phần học.',
      'Chọn các Bài học (video/tài liệu) và Bài thực hành đưa vào phần, sắp xếp thứ tự.',
      'Bấm Lưu. Sau đó vào tab "Khóa học" để gắn phần học này vào khóa.',
    ],
  },
  '4': {
    title: 'tạo bài học và gắn bài tập vào video',
    steps: [
      'Bấm "Thêm bài học", nhập Tên, Mô tả, Ghi chú và chọn Thể loại (video, tài liệu...).',
      'Tải file hoặc dán link video, rồi Lưu.',
      'Muốn gắn bài tập trắc nghiệm: bấm "Gắn bài tập" ở dòng bài học đó.',
      'Trong cửa sổ mở ra: nhập tên bài tập, thêm câu hỏi (chọn 1 / chọn nhiều / kéo thả) hoặc tạo từ ảnh/PDF bằng AI, đặt thời gian và điểm đạt, rồi Lưu.',
      'Học viên sẽ thấy bài tập ở cuối trang bài học đó.',
    ],
    note: 'Sửa hoặc xóa bài tập đã gắn: vào "Luyện tập → Trắc Nghiệm ABCD & Ngân Hàng Câu Hỏi".',
  },
  '5': {
    title: 'tạo đề thực hành Word/Excel',
    steps: [
      'Bấm "Thêm đề thực hành".',
      'Chọn Môn (Word/Excel), nhập Tiêu đề, Độ khó và đề bài.',
      'Đặt tiêu chí chấm cho file học viên nộp.',
      'Bật Xuất bản khi đã sẵn sàng cho học viên, rồi Lưu.',
    ],
    note: 'Giao đề cho lớp ở "Luyện tập → Giao Đề Thực Hành (MOS)".',
  },
  '6': {
    title: 'tạo phần thực hành',
    steps: [
      'Bấm "Tạo phần thực hành mới", nhập Tên và Mô tả, rồi Lưu.',
      'Thêm các phần con và chọn các bài thực hành đưa vào từng phần.',
      'Dùng Cập nhật / Xóa ở mỗi dòng để sửa hoặc xóa.',
    ],
  },
};

const LessonAdmin: React.FC = () => {
  const [activeKey, setActiveKey] = useState('1');

  return (
    <View style={styles.container}>
      <ContentTabStrip
        tabs={tabs}
        activeKey={activeKey}
        onChange={setActiveKey}
      />
      <View style={styles.tabBody}>
        {guides[activeKey] ? <AdminGuide {...guides[activeKey]} /> : null}
        {tabContent[activeKey]}
      </View>
    </View>
  );
};

export default LessonAdmin;
