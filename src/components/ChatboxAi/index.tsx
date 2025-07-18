import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '@redux';
import { useRouter } from 'next/navigation';
import { LessonThumbnail } from '~mdDashboard/components';

export default function Chatbox() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [lessonInfo, setLessonInfo] = useState<null | {
        _id: string;
        title: string;
        thumbnail?: string;
        price?: number;
        isPremium: boolean;
    }>(null);

    const { userProfile } =
        useAppSelector((state) => state.authReducer.tokenInfo) || {};
    const router = useRouter();

    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMsg = { role: 'user', content: message };
        setChat(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const res = await axios.post('http://127.0.0.1:9999/ai/ask', {
                question: message,
                userId: userProfile?._id || null,
            });

            console.log("📦 RES DATA:", res.data);

            const aiMsg = { role: 'ai', content: res.data.response };
            setChat(prev => [...prev, userMsg, aiMsg]);

            if (res.data.lessonInfo) {
                setLessonInfo(res.data.lessonInfo);
            } else {
                setLessonInfo(null);
            }
        } catch (err) {
            setChat(prev => [...prev, { role: 'ai', content: '⚠️ Lỗi kết nối. Vui lòng thử lại.' }]);
            setLessonInfo(null);
        } finally {
            setMessage('');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (lessonInfo) {
            console.log("🎯 lessonInfo trong useEffect:", lessonInfo);
        }
    }, [lessonInfo])
    useEffect(() => {
        const chatContainer = document.getElementById('chatbox-scroll');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [chat]);
    console.log("lessonInfo", lessonInfo)
    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
            {open ? (
                <div
                    style={{
                        width: '320px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #ccc',
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: '14px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#2563eb',
                            color: 'white',
                            padding: '12px',
                            borderTopLeftRadius: '12px',
                            borderTopRightRadius: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontWeight: 'bold',
                        }}
                    >
                        <span>🎓 Trợ lý khóa học</span>
                        <button
                            onClick={() => setOpen(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '16px',
                                cursor: 'pointer',
                            }}
                        >✖️</button>
                    </div>
                    <div
                        id="chatbox-scroll"
                        style={{
                            padding: '12px',
                            height: '256px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                        }}
                    >
                        {chat.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: '8px',
                                    borderRadius: '8px',
                                    backgroundColor: msg.role === 'user' ? '#dbeafe' : '#f3f4f6',
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '90%',
                                }}
                            >
                                {msg.content.split('\n').map((line, i) => (
                                    <div key={i} style={{ marginBottom: '4px' }}>{line}</div>
                                ))}
                            </div>
                        ))}
                        {lessonInfo && (
                            <div
                                style={{
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '8px',
                                    backgroundColor: '#f9fafb',
                                    marginTop: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                }}
                            >
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '6px' }}>
                                        <LessonThumbnail thumbnail={lessonInfo.thumbnail || '/fallback.jpg'} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{lessonInfo.title}</div>
                                        <div style={{ color: '#4b5563', fontSize: '13px' }}>
                                            {lessonInfo.isPremium ? `${lessonInfo.price} VNĐ` : 'Miễn phí'}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push(`/dashboard/home/lesson/${lessonInfo._id}`)}
                                    style={{
                                        marginTop: '4px',
                                        backgroundColor: '#2563eb',
                                        color: 'white',
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        alignSelf: 'flex-start',
                                    }}
                                >
                                    👉 Xem bài học
                                </button>
                            </div>
                        )}
                        {loading && (
                            <div style={{ color: '#888', fontStyle: 'italic' }}>
                                Đang phản hồi...
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', borderTop: '1px solid #ccc', padding: '8px' }}>
                        <input
                            style={{
                                flex: 1,
                                padding: '8px',
                                fontSize: '14px',
                                border: '1px solid #ccc',
                                borderTopLeftRadius: '6px',
                                borderBottomLeftRadius: '6px',
                                outline: 'none',
                            }}
                            value={message}
                            placeholder="Hỏi AI điều gì đó..."
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            style={{
                                backgroundColor: '#2563eb',
                                color: 'white',
                                padding: '8px 16px',
                                border: 'none',
                                borderTopRightRadius: '6px',
                                borderBottomRightRadius: '6px',
                                cursor: 'pointer',
                            }}
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setOpen(true)}
                    style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '12px 16px',
                        borderRadius: '9999px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                        cursor: 'pointer',
                        fontSize: '14px',
                    }}
                >
                    💬 Chat với AI
                </button>
            )}
        </div>
    );
}
