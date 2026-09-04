import { AppInput } from 'webapp';

export const Default = () => <AppInput placeholder="Nhập họ và tên" />;
export const Filled = () => (
  <AppInput value="Nguyễn Văn A" onChange={() => {}} />
);
export const TextArea = () => (
  <AppInput
    type="TextArea"
    placeholder="Nhập bình luận..."
    autoSize={{ minRows: 3, maxRows: 6 }}
  />
);
export const Password = () => (
  <AppInput type="Password" placeholder="Mật khẩu" />
);
export const Search = () => (
  <AppInput type="Search" placeholder="Tìm kiếm khóa học" />
);
