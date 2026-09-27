import type { KeyboardEvent, MouseEvent } from 'react';

// Cho phần tử bấm được nhưng không phải <button>/<a> (View/div):
// nhận focus bằng Tab, đọc là nút, kích hoạt bằng Click chuột hoặc Enter/Space.
// Import thẳng từ '@/utils/asButton', không qua barrel '@utils' (xem CLAUDE.md).
// Trả object thường để spread lên View của react-native-web mà không vướng
// kiểu props của nó.
export const asButton = (
  onActivate: () => void,
  label?: string,
): Record<string, unknown> => ({
  role: 'button',
  tabIndex: 0,
  'aria-label': label,
  onClick: (e: MouseEvent) => {
    onActivate();
  },
  onKeyDown: (e: KeyboardEvent) => {
    // Bỏ qua phím nổi bọt từ nút con (vd dấu trang trong 1 hàng bấm được).
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate();
    }
  },
});
