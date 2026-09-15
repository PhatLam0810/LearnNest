'use client';
import React from 'react';
import { View } from 'react-native-web';
import { useResponsive } from '@/styles/responsive';
import CreateUserForm from '~mdAdmin/components/CreateUserForm';
import ImportExcelCard from '~mdAdmin/components/ImportExcelCard';
import styles from './styles';

const ImportUserManage: React.FC = () => {
  const { isMobile } = useResponsive();

  return (
    <View
      style={{
        ...styles.grid,
        // minmax(0, ...) thay vì '1.2fr 1fr' trần - nếu không, cột grid sẽ
        // giãn theo min-content của nội dung bên trong (form/bảng) thay vì
        // theo đúng tỉ lệ fr, làm tràn ngang cả trang.
        gridTemplateColumns: isMobile
          ? '1fr'
          : 'minmax(0, 1.2fr) minmax(0, 1fr)',
      }}>
      <CreateUserForm />
      <ImportExcelCard />
    </View>
  );
};

export default ImportUserManage;
