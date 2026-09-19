import { Library } from '~mdDashboard/types';

export interface CreateLibraryModalProps {
  isVisible: boolean;
  onClose: () => void;
  // Có initialValues -> chế độ cập nhật bài học đã có, ngược lại là tạo mới.
  initialValues?: Library | null;
  onCreated?: (library: Library) => void;
  onUpdated?: () => void;
}
