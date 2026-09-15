import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  grid: {
    // width:100% bắt buộc - View ở đây là con của 1 flex container
    // (antd Tabs pane) không có align-items:stretch, nên nếu không set
    // width rõ ràng, View sẽ chỉ co theo đúng kích thước nội dung bên
    // trong (hug content) thay vì lấp đầy pane, khiến 2 cột "fr" tính
    // theo min-content của form/bảng con và tràn ngang trang.
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: 22,
    alignItems: 'flex-start',
  },
});

export default styles;
