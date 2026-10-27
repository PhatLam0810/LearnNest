import { baseQuery } from '@redux/RTKQuery';
import {
  ActivationCodeItem,
  BankOrder,
  PremiumOrder,
  PremiumPlan,
  PremiumPlanKey,
  PremiumStatus,
  RevenueReport,
} from './types';

type Wrapped<T> = { data: T };
const unwrap = <T>(res: Wrapped<T>) => res.data;

export const premiumQuery = baseQuery.injectEndpoints({
  endpoints: builder => ({
    getPremiumStatus: builder.query<PremiumStatus, void>({
      query: () => '/premium/status',
      transformResponse: unwrap<PremiumStatus>,
      providesTags: ['Premium'],
    }),
    getPremiumPlans: builder.query<PremiumPlan[], void>({
      query: () => '/premium/plans',
      transformResponse: unwrap<PremiumPlan[]>,
    }),
    getMyPremiumOrders: builder.query<PremiumOrder[], void>({
      query: () => '/premium/orders/mine',
      transformResponse: unwrap<PremiumOrder[]>,
      providesTags: ['Premium'],
    }),
    createBankOrder: builder.mutation<
      BankOrder,
      { plan: PremiumPlanKey; fullName?: string }
    >({
      query: body => ({ url: '/premium/orders', method: 'POST', body }),
      transformResponse: unwrap<BankOrder>,
    }),
    // Trang thanh toán hỏi mỗi 3 giây tới khi đơn không còn 'pending'.
    getPremiumOrder: builder.query<PremiumOrder, string>({
      query: ref => `/premium/orders/ref/${encodeURIComponent(ref)}`,
      transformResponse: unwrap<PremiumOrder>,
    }),
    redeemPremiumCode: builder.mutation<
      { premiumExpiresAt: string },
      { code: string }
    >({
      query: body => ({ url: '/premium/redeem', method: 'POST', body }),
      transformResponse: unwrap<{ premiumExpiresAt: string }>,
      invalidatesTags: ['Premium'],
    }),
    // Báo cáo tiến độ Excel (Premium). Lỗi trả về là Blob nên nơi gọi tự
    // kiểm usePremium trước, BE vẫn là lớp chặn thật.
    exportMyProgress: builder.mutation<Blob, { userId: string }>({
      query: ({ userId }) => ({
        url: `/lesson/user/${userId}/export`,
        responseHandler: response => response.blob(),
      }),
    }),
    regenerateRoadmap: builder.mutation<
      { skipped?: boolean; reason?: string },
      void
    >({
      query: () => ({ url: '/ai-coach/regenerate', method: 'POST' }),
    }),
    // ---- Admin ----
    getPendingOrders: builder.query<PremiumOrder[], void>({
      query: () => '/premium/admin/orders/pending',
      transformResponse: unwrap<PremiumOrder[]>,
      providesTags: ['AdminOrders'],
    }),
    confirmOrder: builder.mutation<void, { txnRef: string }>({
      query: ({ txnRef }) => ({
        url: `/premium/admin/orders/${encodeURIComponent(txnRef)}/confirm`,
        method: 'POST',
      }),
      invalidatesTags: ['AdminOrders'],
    }),
    grantPremium: builder.mutation<
      { premiumExpiresAt: string },
      { userId: string; days: number }
    >({
      query: body => ({ url: '/premium/admin/grant', method: 'POST', body }),
      transformResponse: unwrap<{ premiumExpiresAt: string }>,
    }),
    revokePremium: builder.mutation<void, { userId: string }>({
      query: ({ userId }) => ({
        url: `/premium/admin/revoke/${userId}`,
        method: 'POST',
      }),
    }),
    createActivationCodes: builder.mutation<
      string[],
      { plan: PremiumPlanKey; count: number }
    >({
      query: body => ({ url: '/premium/admin/codes', method: 'POST', body }),
      transformResponse: unwrap<string[]>,
      invalidatesTags: ['ActivationCode'],
    }),
    getActivationCodes: builder.query<ActivationCodeItem[], void>({
      query: () => '/premium/admin/codes',
      transformResponse: unwrap<ActivationCodeItem[]>,
      providesTags: ['ActivationCode'],
    }),
    getRevenueReport: builder.query<RevenueReport, void>({
      query: () => '/premium/admin/revenue',
      transformResponse: unwrap<RevenueReport>,
    }),
  }),
});

export const {
  useGetPremiumStatusQuery,
  useGetPremiumPlansQuery,
  useGetMyPremiumOrdersQuery,
  useCreateBankOrderMutation,
  useGetPendingOrdersQuery,
  useConfirmOrderMutation,
  useGetPremiumOrderQuery,
  useRedeemPremiumCodeMutation,
  useExportMyProgressMutation,
  useRegenerateRoadmapMutation,
  useGrantPremiumMutation,
  useRevokePremiumMutation,
  useCreateActivationCodesMutation,
  useGetActivationCodesQuery,
  useGetRevenueReportQuery,
} = premiumQuery;
