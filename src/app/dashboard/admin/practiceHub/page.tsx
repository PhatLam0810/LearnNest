'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { View } from 'react-native-web';
import { AdminGuide, ContentTab, ContentTabStrip } from '~mdAdmin/components';
import { usePracticeSubjects } from '~mdAdmin/utils/practiceSubjects';
import PracticeManage from '../practiceManage';
import { PracticeLessonManage } from '../lessonManage/_components';
import MockExamManage from '../mockExamManage/page';
import QuizListTab, {
  LESSON_LINKED,
} from '../quizManage/_components/QuizListTab';
import QuestionBankTab from '../quizManage/_components/QuestionBankTab';
import pageStyles from '../lessonManage/styles';
import '../lessonManage/styles.scss';

const MOS_TABS: ContentTab[] = [
  { key: 'mos-tasks', label: 'MOS · Bài thực hành' },
  { key: 'mos-parts', label: 'MOS · Phần thực hành' },
  { key: 'mos-exams', label: 'MOS · Đề thi thử' },
];
const BANK_TAB: ContentTab = { key: 'bank', label: 'Ngân hàng câu hỏi' };
const LESSON_TAB: ContentTab = {
  key: 'lesson-quizzes',
  label: 'Trắc nghiệm gắn bài học',
};

// Một chỗ quản lý mọi bài luyện tập đã tạo, chia theo mục giống trang Luyện
// tập của học viên: MOS (thực hành, thi thử) và mỗi mục trắc nghiệm (AI...).
const PracticeHub: React.FC<{ initialTab?: string }> = ({
  initialTab = 'mos-tasks',
}) => {
  const { options } = usePracticeSubjects();
  const params = useSearchParams();
  // Link từ Báo Cáo Ngưỡng Đạt: ?sub=mos-tasks&edit=<id> mở sẵn trình sửa.
  const sub = params.get('sub');
  const editId = params.get('edit') || undefined;
  const [activeKey, setActiveKey] = useState(sub || initialTab);
  useEffect(() => {
    if (sub) setActiveKey(sub);
  }, [sub]);

  const tabs: ContentTab[] = [
    ...MOS_TABS,
    ...options.map(o => ({
      key: `s:${o.value}`,
      label: `${o.label} · Trắc nghiệm`,
    })),
    LESSON_TAB,
    BANK_TAB,
  ];

  const tabGuide: Record<
    string,
    { title: string; steps: string[]; note?: string }
  > = {
    'mos-tasks': {
      title: 'tạo đề thực hành Word/Excel',
      steps: [
        'Bấm "Thêm đề thực hành".',
        'Chọn Môn (Word/Excel), nhập Tiêu đề, Độ khó và đề bài.',
        'Đặt tiêu chí chấm cho file học viên nộp.',
        'Bật Xuất bản khi đã sẵn sàng cho học viên, rồi Lưu.',
      ],
      note: 'Giao đề cho lớp ở mục "Giao Đề Thực Hành (MOS)".',
    },
    'mos-parts': {
      title: 'tạo phần thực hành',
      steps: [
        'Bấm "Tạo phần thực hành mới", nhập Tên và Mô tả, rồi Lưu.',
        'Thêm các phần con và chọn các bài thực hành đưa vào từng phần.',
        'Dùng Cập nhật / Xóa ở mỗi dòng để sửa hoặc xóa.',
      ],
    },
  };

  const renderBody = () => {
    if (activeKey === 'mos-tasks')
      return <PracticeManage autoEditId={editId} />;
    if (activeKey === 'lesson-quizzes') {
      return <QuizListTab subject={LESSON_LINKED} />;
    }
    if (activeKey === 'mos-parts') return <PracticeLessonManage />;
    if (activeKey === 'mos-exams') return <MockExamManage />;
    if (activeKey === 'bank') return <QuestionBankTab />;
    if (activeKey.startsWith('s:')) {
      const subject = activeKey.slice(2);
      return <QuizListTab key={subject} subject={subject} />;
    }
    return null;
  };

  return (
    <View style={pageStyles.container}>
      <AdminGuide
        title="quản lý bài luyện tập"
        steps={[
          'Mỗi thẻ ở trên là một mục của trang Luyện tập học viên: MOS (bài thực hành, phần thực hành, đề thi thử) và các mục trắc nghiệm như AI, Tiếng Anh.',
          'Bấm vào thẻ để xem các bài đã tạo ở mục đó; dùng Cập nhật / Xóa ở mỗi dòng và nút Tạo để thêm bài mới.',
          'Ở thẻ trắc nghiệm, "Tạo bài tập" sẽ tạo sẵn bài thuộc đúng mục đang xem. Muốn thêm mục mới (vd Tiếng Anh) bấm "Quản lý mục luyện tập".',
          'Giao đề MOS cho lớp: mục "Giao Đề Thực Hành (MOS)" ở thanh bên.',
        ]}
      />
      <ContentTabStrip
        tabs={tabs}
        activeKey={activeKey}
        onChange={setActiveKey}
      />
      <View style={pageStyles.tabBody}>
        {tabGuide[activeKey] ? <AdminGuide {...tabGuide[activeKey]} /> : null}
        {renderBody()}
      </View>
    </View>
  );
};

export default PracticeHub;
