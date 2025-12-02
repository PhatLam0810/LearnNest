// src/components/ViewersListModal/index.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Table, Avatar, Statistic, Row, Col, Typography, Spin, Tag, Card } from 'antd';
import { EyeOutlined, UserOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import videoProgressService from '~mdDashboard/services/api/video-progress.service';

const { Text, Title } = Typography;

interface Viewer {
    userId: string;
    userName: string;
    userEmail: string;
    userAvatar: string;
    currentTime: number;
    duration: number;
    watchedPercentage: number;
    isCompleted: boolean;
    lastWatchedAt: string;
    watchedTimeFormatted: string;
    totalTimeFormatted: string;
}

interface Stats {
    totalUniqueViewers: number;
    totalViews: number;
    avgPercentage: number;
    completedCount: number;
    completionRate: number;
}

interface ViewersListModalProps {
    lessonId: string;
    visible: boolean;
    onClose: () => void;
    videoTitle?: string;
}

const ViewersListModal: React.FC<ViewersListModalProps> = ({
    lessonId,
    visible,
    onClose,
    videoTitle
}) => {
    const [loading, setLoading] = useState(false);
    const [viewers, setViewers] = useState<Viewer[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);

    const loadData = async () => {
        if (!lessonId) return;

        setLoading(true);
        try {
            const [viewersRes, statsRes] = await Promise.all([
                videoProgressService.getLessonViewers(lessonId),
                videoProgressService.getLessonStats(lessonId)
            ]);

            setViewers(viewersRes.data?.viewers || []);
            setStats(statsRes.data || null);
        } catch (error) {
            console.error('Error loading viewers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible && lessonId) {
            loadData();
        }
    }, [visible, lessonId]);

    const columns = [
        {
            title: 'Người dùng',
            key: 'user',
            render: (record: Viewer) => (
                <Row align="middle" gutter={8}>
                    <Col>
                        <Avatar
                            src={record.userAvatar}
                            icon={!record.userAvatar && <UserOutlined />}
                            size="small"
                        />
                    </Col>
                    <Col>
                        <div>
                            <Text strong style={{ display: 'block' }}>
                                {record.userName || 'Khách'}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {record.userEmail || 'Không có email'}
                            </Text>
                        </div>
                    </Col>
                </Row>
            ),
        },
        {
            title: 'Tiến độ',
            key: 'progress',
            render: (record: Viewer) => (
                <div>
                    <Text strong style={{ display: 'block' }}>
                        {record.watchedPercentage.toFixed(1)}%
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.watchedTimeFormatted} / {record.totalTimeFormatted}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (record: Viewer) => (
                <Tag
                    icon={record.isCompleted ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                    color={record.isCompleted ? 'success' : 'processing'}
                >
                    {record.isCompleted ? 'Hoàn thành' : 'Đang xem'}
                </Tag>
            ),
        },
        {
            title: 'Lần xem cuối',
            key: 'lastWatched',
            render: (record: Viewer) => (
                <Text type="secondary">
                    {new Date(record.lastWatchedAt).toLocaleDateString('vi-VN')}
                    <br />
                    {new Date(record.lastWatchedAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>
            ),
        },
    ];

    return (
        <Modal
            title={
                <Row align="middle" gutter={8}>
                    <Col>
                        <EyeOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                    </Col>
                    <Col>
                        <Title level={4} style={{ margin: 0 }}>
                            {videoTitle || 'Danh sách người xem'}
                        </Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Lesson ID: {lessonId}
                        </Text>
                    </Col>
                </Row>
            }
            open={visible}
            onCancel={onClose}
            onOk={onClose}
            width={1000}
            footer={[
                <Text key="footer" type="secondary">
                    Tổng số người xem: {viewers.length}
                </Text>
            ]}
        >
            {/* Statistics Cards */}
            {stats && (
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic
                                title="Tổng người xem"
                                value={stats.totalUniqueViewers}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic
                                title="Tổng lượt xem"
                                value={stats.totalViews}
                                prefix={<EyeOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic
                                title="Tỉ lệ hoàn thành"
                                value={stats.completionRate}
                                suffix="%"
                                precision={1}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic
                                title="Trung bình % xem"
                                value={stats.avgPercentage}
                                suffix="%"
                                precision={1}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Viewers Table */}
            <Spin spinning={loading}>
                <Table
                    dataSource={viewers}
                    columns={columns}
                    rowKey="userId"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} người dùng`,
                    }}
                    size="middle"
                    locale={{
                        emptyText: 'Chưa có người xem video này'
                    }}
                />
            </Spin>
        </Modal>
    );
};

export default ViewersListModal;