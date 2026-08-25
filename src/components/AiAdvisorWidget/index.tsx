'use client';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { View, Text, TouchableOpacity } from 'react-native-web';
import { useAppSelector } from '@redux';
import { dashboardQuery } from '~mdDashboard/redux';
import { CloseOutlined, RobotOutlined, SendOutlined } from '@ant-design/icons';
import styles from './styles';

// Chỉ hiện ở các trang học tập (home, khóa học, thư viện, lớp học của tôi,
// lộ trình) — tắt hẳn ở khu vực quản trị và trang cài đặt tài khoản.
const EXCLUDED_PREFIXES = ['/dashboard/admin', '/dashboard/profile'];

type CourseKey = 'word' | 'excel';

type RoadmapStep = {
  lessonName: string;
  action: string;
  suggestedDeadline?: string;
};

type CourseOverview = {
  title: string;
  totalModules: number;
  totalLessons: number;
  totalDurationMinutes: number;
  modules: { title: string; lessonCount: number }[];
};

type ChatMessage =
  | { role: 'user'; text: string }
  | { role: 'assistant-typing' }
  | { role: 'assistant-text'; text: string }
  | {
      role: 'assistant-course';
      summary: string;
      hasStarted?: boolean;
      roadmap?: RoadmapStep[];
      courseOverview?: CourseOverview;
      lessonId?: string;
    };

const COURSE_LABEL: Record<CourseKey, string> = {
  word: '📘 Tư vấn học Word',
  excel: '📊 Tư vấn học Excel',
};

const AiAdvisorWidget: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [adviseCourse, { isLoading: isAdvising }] =
    dashboardQuery.useAdviseCourseMutation();
  const [chatWithAdvisor, { isLoading: isChatting }] =
    dashboardQuery.useChatWithAdvisorMutation();
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, open]);

  const isInsideApp = pathname?.startsWith('/dashboard');
  const isExcludedPage = EXCLUDED_PREFIXES.some(prefix =>
    pathname?.startsWith(prefix),
  );
  if (!userProfile || !isInsideApp || isExcludedPage) return null;

  const isBusy =
    isAdvising ||
    isChatting ||
    messages.some(m => m.role === 'assistant-typing');

  const handleAskCourse = async (course: CourseKey) => {
    if (isBusy) return;
    setMessages(prev => [
      ...prev,
      { role: 'user', text: COURSE_LABEL[course] },
      { role: 'assistant-typing' },
    ]);
    try {
      const res = await adviseCourse(course).unwrap();
      setMessages(prev => [
        ...prev.filter(m => m.role !== 'assistant-typing'),
        (res as any).limited
          ? { role: 'assistant-text', text: res.summary }
          : {
              role: 'assistant-course',
              summary: res.summary,
              hasStarted: res.hasStarted,
              roadmap: res.roadmap,
              courseOverview: res.courseOverview,
              lessonId: res.lessonId,
            },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev.filter(m => m.role !== 'assistant-typing'),
        {
          role: 'assistant-text',
          text: 'Xin lỗi, có lỗi xảy ra khi lấy tư vấn. Bạn thử lại giúp mình nhé.',
        },
      ]);
    }
  };

  const handleSendChat = async () => {
    const text = inputValue.trim();
    if (!text || isBusy) return;
    setInputValue('');
    setMessages(prev => [
      ...prev,
      { role: 'user', text },
      { role: 'assistant-typing' },
    ]);
    try {
      const res = await chatWithAdvisor(text).unwrap();
      setMessages(prev => [
        ...prev.filter(m => m.role !== 'assistant-typing'),
        { role: 'assistant-text', text: res.reply },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev.filter(m => m.role !== 'assistant-typing'),
        {
          role: 'assistant-text',
          text: 'Xin lỗi, có lỗi xảy ra. Bạn thử hỏi lại giúp mình nhé.',
        },
      ]);
    }
  };

  const goToCourse = (lessonId: string) => {
    setOpen(false);
    router.push(`/dashboard/home/lesson/${lessonId}`);
  };

  return (
    <div style={styles.wrapper}>
      <style>{`
        @keyframes ai-advisor-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        .ai-advisor-dot { animation: ai-advisor-bounce 1.1s infinite ease-in-out; }
        .ai-advisor-input::placeholder { color: #9aa8c7; }
      `}</style>
      {open && (
        <div style={styles.panel}>
          <div style={styles.header}>
            <div style={styles.headerAvatar}>
              <RobotOutlined />
            </div>
            <div style={styles.headerTextWrap}>
              <p style={styles.headerTitle}>AI Tư Vấn Học Tập</p>
              <p style={styles.headerSubtitle}>
                Hỏi mình về việc học Word/Excel/MOS nhé
              </p>
            </div>
            <button
              type="button"
              style={styles.headerCloseBtn}
              onClick={() => setOpen(false)}>
              <CloseOutlined />
            </button>
          </div>

          <div ref={bodyRef} style={styles.body}>
            {messages.length === 0 && (
              <div style={styles.bubbleRowAssistant}>
                <div style={styles.bubbleAvatar}>
                  <RobotOutlined />
                </div>
                <div style={styles.bubbleAssistant}>
                  <div>
                    Chào bạn! Mình là trợ lý học tập của LearnNest — hỏi mình
                    bất cứ điều gì về việc học Word, Excel, luyện thi MOS, hoặc
                    chọn nhanh bên dưới nhé:
                  </div>
                  <div style={styles.quickReplyRow}>
                    <button
                      type="button"
                      style={styles.quickReplyChip}
                      disabled={isBusy}
                      onClick={() => handleAskCourse('word')}>
                      {COURSE_LABEL.word}
                    </button>
                    <button
                      type="button"
                      style={styles.quickReplyChip}
                      disabled={isBusy}
                      onClick={() => handleAskCourse('excel')}>
                      {COURSE_LABEL.excel}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {messages.map((m, idx) => {
              if (m.role === 'user') {
                return (
                  <div key={idx} style={styles.bubbleRowUser}>
                    <div style={styles.bubbleUser}>{m.text}</div>
                  </div>
                );
              }
              if (m.role === 'assistant-typing') {
                return (
                  <div key={idx} style={styles.bubbleRowAssistant}>
                    <div style={styles.bubbleAvatar}>
                      <RobotOutlined />
                    </div>
                    <div style={styles.bubbleAssistant}>
                      <div style={styles.typingDots}>
                        <span
                          className="ai-advisor-dot"
                          style={{ ...styles.typingDot, animationDelay: '0s' }}
                        />
                        <span
                          className="ai-advisor-dot"
                          style={{
                            ...styles.typingDot,
                            animationDelay: '0.15s',
                          }}
                        />
                        <span
                          className="ai-advisor-dot"
                          style={{
                            ...styles.typingDot,
                            animationDelay: '0.3s',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              }
              if (m.role === 'assistant-text') {
                return (
                  <div key={idx} style={styles.bubbleRowAssistant}>
                    <div style={styles.bubbleAvatar}>
                      <RobotOutlined />
                    </div>
                    <div style={styles.bubbleAssistant}>{m.text}</div>
                  </div>
                );
              }
              return (
                <div key={idx} style={styles.bubbleRowAssistant}>
                  <div style={styles.bubbleAvatar}>
                    <RobotOutlined />
                  </div>
                  <div style={styles.bubbleAssistant}>
                    <div>{m.summary}</div>

                    {/* Đã học rồi -> hiện lộ trình gợi ý tiếp theo */}
                    {m.hasStarted && m.roadmap && m.roadmap.length > 0 && (
                      <div style={styles.roadmapList}>
                        {m.roadmap.map((step, sIdx) => (
                          <div key={sIdx} style={styles.roadmapStep}>
                            <div style={styles.roadmapStepIndex}>
                              {sIdx + 1}
                            </div>
                            <div style={styles.roadmapStepText}>
                              <strong>{step.lessonName}</strong>: {step.action}
                              {step.suggestedDeadline && (
                                <span style={styles.roadmapDeadline}>
                                  {' '}
                                  (gợi ý: {step.suggestedDeadline})
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Chưa học -> hiện tổng quan cấu trúc khóa học */}
                    {!m.hasStarted && m.courseOverview && (
                      <div style={styles.roadmapList}>
                        {m.courseOverview.modules.map((mod, mIdx) => (
                          <div key={mIdx} style={styles.roadmapStep}>
                            <div style={styles.roadmapStepIndex}>
                              {mIdx + 1}
                            </div>
                            <div style={styles.roadmapStepText}>
                              <strong>{mod.title}</strong> — {mod.lessonCount}{' '}
                              bài học
                            </div>
                          </div>
                        ))}
                        <div style={styles.courseOverviewTotal}>
                          Tổng: {m.courseOverview.totalLessons} bài học ·{' '}
                          {m.courseOverview.totalDurationMinutes} phút
                        </div>
                      </div>
                    )}

                    {m.lessonId && (
                      <button
                        type="button"
                        style={styles.ctaButton}
                        onClick={() => goToCourse(m.lessonId as string)}>
                        {m.hasStarted ? 'Tiếp tục học' : 'Học ngay'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.footer}>
            <div style={styles.inputRow}>
              <input
                ref={inputRef}
                className="ai-advisor-input"
                style={styles.input}
                placeholder="Hỏi về Word, Excel, luyện thi MOS..."
                value={inputValue}
                disabled={isBusy}
                maxLength={500}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
              />
              <button
                type="button"
                style={{
                  ...styles.sendButton,
                  ...(isBusy || !inputValue.trim()
                    ? styles.askButtonDisabled
                    : {}),
                }}
                disabled={isBusy || !inputValue.trim()}
                onClick={handleSendChat}>
                <SendOutlined />
              </button>
            </div>
          </div>
        </div>
      )}

      <TouchableOpacity style={styles.fab}>
        <View onClick={() => setOpen(o => !o)} style={styles.fabInner}>
          {open ? <CloseOutlined /> : <RobotOutlined />}
          <Text style={styles.fabText}>AI Tư Vấn</Text>
        </View>
      </TouchableOpacity>
    </div>
  );
};

export default AiAdvisorWidget;
