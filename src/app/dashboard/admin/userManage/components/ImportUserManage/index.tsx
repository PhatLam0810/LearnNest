'use client';
import React from 'react';
import { View } from 'react-native-web';
import { useResponsive } from '@/styles/responsive';
import CreateUserForm from '~mdAdmin/components/CreateUserForm';
import ImportExcelCard from '~mdAdmin/components/ImportExcelCard';
import AdminGuide from '~mdAdmin/components/AdminGuide';
import styles from './styles';

const ImportUserManage: React.FC = () => {
  const { isMobile } = useResponsive();

  return (
    <View>
      <AdminGuide
        title="tạo hoặc nhập người dùng"
        steps={[
          'Tạo một tài khoản: dùng form bên trái. Chọn "Học viên" (nhập họ tên, email, MSSV, lớp, ngành, khoa) hoặc "Quản trị viên" (chỉ cần email và mật khẩu từ 8 ký tự).',
          'Nhập hàng loạt: ở khung "Tải lên file Excel" bấm "Tải file mẫu", điền các cột Họ và tên, MSSV, Email (có thể thêm Lớp, Khoa, Ngành), tối đa theo giới hạn ghi trên khung.',
          'Tải file lên → xem trước (dòng lỗi sẽ được báo) → bấm nhập để tạo tài khoản.',
          'Sau khi tạo, vào tab "Quản Trị Người Dùng" để sửa thông tin, cấp Premium hoặc cấp quyền Admin.',
        ]}
      />
      <View
        style={{
          ...styles.grid,
          // minmax(0, ...) thay vì '1.2fr 1fr' trần - nếu không, cột grid sẽ
          // giãn theo min-content của nội dung bên trong (form/bảng) thay vì
          // theo đúng tỉ lệ fr, làm tràn ngang cả trang.
          gridTemplateColumns: isMobile
            ? 'minmax(0, 1fr)'
            : 'minmax(0, 1.2fr) minmax(0, 1fr)',
        }}>
        <CreateUserForm />
        <ImportExcelCard />
      </View>
    </View>
  );
};

export default ImportUserManage;
