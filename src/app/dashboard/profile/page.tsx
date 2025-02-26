'use client';
import { Layout, Avatar, Card, Row, Col, Typography, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@redux';
import { ScrollView, Text } from 'react-native-web';

const ProfilePage = () => {
  const router = useRouter();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};

  return (
    <ScrollView>
      <Card
        style={{
          maxWidth: 900,
          margin: '0 auto',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
        bordered={false}>
        <div
          style={{
            height: '300px',
            backgroundImage: `''`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '12px 12px 0 0',
            position: 'relative',
          }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            }}
          />
        </div>

        {/* Profile Content */}
        <div style={{ textAlign: 'center', marginTop: '-80px' }}>
          <Avatar
            size={120}
            src={''}
            style={{
              border: '4px solid white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          />
          <Text style={{ marginTop: 16 }}>
            {userProfile?.firstName} {userProfile?.lastName}
          </Text>
          <Text>{userProfile?.email}</Text>
        </div>

        {/* Bio Section */}
        <div style={{ marginTop: 20, padding: '0 20px' }}>
          <Text>Giới thiệu</Text>
          <Text>{userProfile?.bio}</Text>
        </div>
      </Card>
    </ScrollView>
  );
};

export default ProfilePage;
