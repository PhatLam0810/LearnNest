import { useAppDispatch } from '@redux';
import { premiumAction } from './redux/slice';
import { useGetPremiumStatusQuery } from './redux/RTKQuery';
import { getPremiumInfo } from './premiumInfo';

// Chỉ để HIỂN THỊ (khoá/mở UI). Quyền thật do BE kiểm tra và trả
// PREMIUM_REQUIRED — xem baseQuery.
export const usePremium = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetPremiumStatusQuery();
  const expiresAt = data?.premiumExpiresAt ?? null;
  return {
    isPremium: !!data?.isPremium,
    expiresAt,
    // Ngày còn lại/sắp hết hạn; admin có quyền Premium nhưng không có ngày.
    info: getPremiumInfo(expiresAt),
    isLoading,
    openUpgrade: (message?: string) =>
      dispatch(premiumAction.openUpgradeModal(message)),
  };
};
