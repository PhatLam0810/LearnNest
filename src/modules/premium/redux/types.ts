export type PremiumPlanKey = 'month' | 'year';

export interface PremiumStatus {
  isPremium: boolean;
  premiumExpiresAt: string | null;
}

export interface PremiumPlan {
  key: PremiumPlanKey;
  label: string;
  days: number;
  amount: number;
}

export interface PremiumOrder {
  _id: string;
  plan: string;
  days: number;
  amount: number;
  // 'vnpay' chỉ còn ở đơn cũ (đã gỡ VNPay).
  method: 'bank' | 'vnpay' | 'code' | 'admin';
  txnRef: string;
  status: 'pending' | 'paid' | 'failed';
  createdAt: string;
  paidAt?: string;
  premiumUntil?: string;
  payerName?: string;
  note?: string;
  // Admin: người mua (populate).
  userId?: { fullName?: string; email?: string; studentId?: string } | string;
}

// Kết quả tạo đơn chuyển khoản: đủ để vẽ QR và hướng dẫn chuyển.
export interface BankOrder {
  txnRef: string;
  plan: PremiumPlanKey;
  amount: number;
  days: number;
  transferContent: string;
  bank: { name: string; accountNo: string; accountName: string };
  qrUrl: string;
  expiresAt: string;
}

export interface ActivationCodeItem {
  _id: string;
  code: string;
  plan: PremiumPlanKey;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
}

export interface RevenueReport {
  totalRevenue: number;
  totalOrders: number;
  activePremium: number;
  byPlan: { plan: string; revenue: number; orders: number }[];
  // month dạng "yyyy-MM", 12 tháng gần nhất có doanh thu.
  byMonth: { month: string; revenue: number; orders: number }[];
}
