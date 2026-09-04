import { AppButton } from 'webapp';

export const Primary = () => <AppButton type="primary">Lưu thay đổi</AppButton>;
export const Default = () => <AppButton>Hủy</AppButton>;
export const Dashed = () => <AppButton type="dashed">Thêm mục mới</AppButton>;
export const Danger = () => (
  <AppButton danger type="primary">
    Xóa khóa học
  </AppButton>
);
export const Loading = () => (
  <AppButton type="primary" loading>
    Đang xử lý...
  </AppButton>
);
