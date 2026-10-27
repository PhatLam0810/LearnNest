export const EXPIRING_SOON_DAYS = 7;
const DAY_MS = 24 * 3600 * 1000;

export type PremiumInfo = {
  // Còn hạn Premium (theo ngày hết hạn).
  active: boolean;
  // Có ngày hết hạn trong quá khứ (từng mua nhưng đã hết).
  expired: boolean;
  // Số ngày còn lại, làm tròn lên (hết hạn trong ngày vẫn tính là 1).
  daysLeft: number;
  // Còn ≤ EXPIRING_SOON_DAYS ngày: nhắc gia hạn.
  expiringSoon: boolean;
};

// Chỉ để hiển thị. Quyền thật do BE quyết (xem PremiumService.getStatus).
export const getPremiumInfo = (
  expiresAt: string | null | undefined,
  now: number = Date.now(),
): PremiumInfo => {
  const t = expiresAt ? new Date(expiresAt).getTime() : NaN;
  if (Number.isNaN(t)) {
    return { active: false, expired: false, daysLeft: 0, expiringSoon: false };
  }
  if (t <= now) {
    return { active: false, expired: true, daysLeft: 0, expiringSoon: false };
  }
  const daysLeft = Math.ceil((t - now) / DAY_MS);
  return {
    active: true,
    expired: false,
    daysLeft,
    expiringSoon: daysLeft <= EXPIRING_SOON_DAYS,
  };
};

// Giá quy ra mỗi tháng để so sánh gói (làm tròn nghìn đồng gần nhất).
export const perMonth = (amount: number, days: number): number =>
  Math.round(((amount / days) * 30) / 1000) * 1000;
