'use client';
import React, { Suspense, useCallback, useState } from 'react';
import { Input, Modal } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Text, View } from 'react-native-web';
import AppButton from '@components/AppButton';
import PremiumStatusCard from '@components/PremiumStatusCard';
import PremiumCheckoutModal from '@components/PremiumCheckoutModal';
import {
  BarChartOutlined,
  DownloadOutlined,
  RocketOutlined,
  BookOpenOutlined,
  FileTextOutlined,
  MessageOutlined,
  RobotOutlined,
  StarFilled,
  TrophyOutlined,
} from '@components/AppIcon';
import { messageApi } from '@hooks';
import { baseQuery } from '@redux/RTKQuery';
import { useAppDispatch } from '@redux';
import { useResponsive } from '@/styles/responsive';
import {
  useGetPremiumPlansQuery,
  useRedeemPremiumCodeMutation,
} from '@/modules/premium/redux/RTKQuery';
import { PremiumOrder, PremiumPlan } from '@/modules/premium/redux/types';
import { PREMIUM_BENEFITS } from '@/modules/premium/benefits';
import { perMonth } from '@/modules/premium/premiumInfo';
import { usePremium } from '@/modules/premium/usePremium';
import styles from './styles';

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  ai: RobotOutlined,
  mock: TrophyOutlined,
  practice: FileTextOutlined,
  course: BookOpenOutlined,
  grade: FileTextOutlined,
  notes: BookOpenOutlined,
  weak: BarChartOutlined,
  roadmap: RocketOutlined,
  export: DownloadOutlined,
  badge: StarFilled,
  support: MessageOutlined,
};

const FAQ = [
  {
    q: 'Thanh toán có an toàn không?',
    a: 'Bạn chuyển khoản bằng mã QR tới tài khoản ngân hàng của LearnNest. Hệ thống chỉ cần mã đơn trong nội dung chuyển khoản, không lưu thẻ hay mật khẩu ngân hàng của bạn.',
  },
  {
    q: 'Đang dùng Premium có mua thêm được không?',
    a: 'Không cần. Khi gói còn hạn xa, hệ thống không cho mua thêm để bạn không trả tiền hai lần cho cùng một khoảng thời gian. Còn 7 ngày cuối bạn có thể gia hạn, ngày mới được cộng nối tiếp vào hạn hiện tại.',
  },
  {
    q: 'Hết hạn thì dữ liệu học có mất không?',
    a: 'Không. Lịch sử học, điểm và bài đã nộp vẫn được giữ. Chỉ các quyền lợi Premium bị khóa lại cho tới khi bạn mua lại.',
  },
];

const formatVnd = (n: number) => `${n.toLocaleString('vi-VN')} ₫`;
const errMessage = (e: unknown, fallback: string) =>
  (e as { data?: { message?: string } })?.data?.message || fallback;

const scrollToPlans = () =>
  document
    .getElementById('premium-plans')
    ?.scrollIntoView({ behavior: 'smooth' });

const PremiumContent: React.FC = () => {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { info } = usePremium();
  const { data: plans } = useGetPremiumPlansQuery();
  const [redeem, { isLoading: redeeming }] = useRedeemPremiumCodeMutation();
  const [checkoutPlan, setCheckoutPlan] = useState<PremiumPlan | null>(null);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [paidOrder, setPaidOrder] = useState<PremiumOrder | null>(null);

  // Tiền đã về (SePay báo, modal QR hỏi BE mỗi 3 giây): làm mới trạng thái gói
  // rồi hiện modal kích hoạt thành công.
  const handlePaid = useCallback(
    (order: PremiumOrder) => {
      dispatch(baseQuery.util.invalidateTags(['Premium']));
      setPaidOrder(order);
      setCheckoutPlan(null);
      setSuccessOpen(true);
    },
    [dispatch],
  );

  const closeSuccess = () => setSuccessOpen(false);

  const submitCode = async () => {
    if (!code.trim()) {
      setCodeError('Vui lòng nhập mã kích hoạt');
      return;
    }
    try {
      await redeem({ code: code.trim() }).unwrap();
      setCode('');
      setCodeError('');
      messageApi.success('Kích hoạt Premium thành công');
    } catch (e) {
      setCodeError(errMessage(e, 'Không kích hoạt được mã, thử lại sau'));
    }
  };

  const monthly = plans?.find(p => p.key === 'month');
  const yearly = plans?.find(p => p.key === 'year');
  const saving =
    monthly && yearly
      ? Math.round((1 - yearly.amount / (monthly.amount * 12)) * 100)
      : 0;
  // Còn hạn xa thì khóa mua (BE cũng chặn); còn <= 7 ngày thì cho gia hạn.
  const buyLabel = info.expired
    ? 'Mua lại'
    : info.active
      ? 'Gia hạn'
      : 'Bắt đầu';
  const locked = info.active && !info.expiringSoon;

  return (
    <View style={[styles.page, !isMobile && styles.pageDesktop]}>
      <View style={[styles.hero, !isMobile && styles.heroDesktop]}>
        <Text style={styles.eyebrow}>LEARNNEST PREMIUM</Text>
        <Text
          role="heading"
          aria-level={1}
          style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
          Học MOS không giới hạn
        </Text>
        <Text style={styles.heroText}>
          Hỏi AI thoải mái, thi thử đủ mọi đề và luyện tập toàn bộ bài Word,
          Excel. Một gói, mở khóa tất cả.
        </Text>
        <View style={styles.heroActions}>
          <AppButton style={{ width: 'auto' }} onClick={scrollToPlans}>
            Xem các gói
          </AppButton>
        </View>
      </View>

      <PremiumStatusCard onAction={scrollToPlans} />

      <PremiumCheckoutModal
        plan={checkoutPlan}
        onClose={() => setCheckoutPlan(null)}
        onPaid={handlePaid}
      />
      <Modal
        open={successOpen}
        footer={null}
        closable={false}
        centered
        width={520}
        onCancel={closeSuccess}>
        <View style={styles.successBox}>
          <Text style={styles.successIcon}>✓</Text>
          <Text role="heading" aria-level={2} style={styles.sectionTitle}>
            Kích hoạt Premium thành công
          </Text>
          <Text style={styles.faqA}>
            Gói Premium của bạn có hiệu lực đến ngày{' '}
            {paidOrder?.premiumUntil
              ? dayjs(paidOrder.premiumUntil).format('DD/MM/YYYY')
              : ''}
            . Mã đơn: {paidOrder?.txnRef}
          </Text>
          <View style={styles.heroActions}>
            <AppButton
              type="primary"
              style={{ width: 'auto' }}
              onClick={() => router.push('/dashboard/home')}>
              Bắt đầu học
            </AppButton>
            <AppButton
              style={{ width: 'auto' }}
              onClick={() => router.push('/dashboard/profile')}>
              Xem lịch sử đơn
            </AppButton>
          </View>
        </View>
      </Modal>

      <View style={styles.section}>
        <Text role="heading" aria-level={2} style={styles.sectionTitle}>
          Quyền lợi thành viên Premium
        </Text>
        <View style={styles.grid}>
          {PREMIUM_BENEFITS.map(b => {
            const Icon = ICONS[b.key] || StarFilled;
            return (
              <View key={b.key} style={styles.benefit}>
                <View style={styles.benefitIcon}>
                  <Icon size={20} />
                </View>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitDesc}>{b.desc}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View nativeID="premium-plans" style={styles.section}>
        <Text role="heading" aria-level={2} style={styles.sectionTitle}>
          Chọn gói phù hợp
        </Text>
        <View style={styles.noAutoRenew}>
          <Text style={styles.bannerText}>
            Thanh toán một lần bằng chuyển khoản QR. LearnNest không lưu thẻ của
            bạn và không tự động gia hạn, hết hạn là dừng.
          </Text>
        </View>
        <View style={styles.plans}>
          {plans?.map(plan => {
            const featured = plan.key === 'year';
            return (
              <View
                key={plan.key}
                style={[styles.plan, featured && styles.planFeatured]}>
                <View style={styles.planHead}>
                  <Text style={styles.planName}>{plan.label}</Text>
                  {featured && saving > 0 && (
                    <Text style={styles.tag}>Tiết kiệm {saving}%</Text>
                  )}
                </View>
                <Text style={styles.planTagline}>
                  {featured
                    ? 'Dùng trọn năm học với giá tốt nhất.'
                    : 'Linh hoạt cho một đợt ôn thi ngắn.'}
                </Text>
                <View>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>{formatVnd(plan.amount)}</Text>
                    <Text style={styles.priceUnit}>
                      /{featured ? 'năm' : 'tháng'}
                    </Text>
                  </View>
                  <Text style={styles.muted}>
                    {formatVnd(perMonth(plan.amount, plan.days))}/tháng · dùng{' '}
                    {plan.days} ngày
                  </Text>
                </View>
                <AppButton
                  type="primary"
                  disabled={locked}
                  onClick={() => setCheckoutPlan(plan)}>
                  {locked ? 'Đang sử dụng' : buyLabel}
                </AppButton>
                <View style={styles.planDivider} />
                <Text style={styles.planListTitle}>Mọi quyền lợi gồm:</Text>
                <View style={styles.planList}>
                  {PREMIUM_BENEFITS.map(b => (
                    <Text key={b.key} style={styles.planItem}>
                      ✓ {b.title}
                      {b.premium !== 'Có'
                        ? ` (${b.premium.toLowerCase()})`
                        : ''}
                    </Text>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text role="heading" aria-level={2} style={styles.sectionTitle}>
          So sánh gói
        </Text>
        <View>
          <View style={styles.row}>
            <Text style={[styles.rowFeature, styles.rowHead]}>Tính năng</Text>
            <Text style={[styles.rowCell, styles.rowHead]}>Miễn phí</Text>
            <Text style={[styles.rowCell, styles.rowHead]}>Premium</Text>
          </View>
          {PREMIUM_BENEFITS.map(b => (
            <View key={b.key} style={styles.row}>
              <Text style={styles.rowFeature}>{b.title}</Text>
              <Text style={styles.rowCell}>{b.free}</Text>
              <Text style={styles.rowCell}>{b.premium}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text role="heading" aria-level={2} style={styles.sectionTitle}>
          Có mã kích hoạt?
        </Text>
        <View style={styles.redeem}>
          <View style={styles.redeemInput}>
            <Text nativeID="premium-code-label" style={styles.label}>
              Mã kích hoạt
            </Text>
            <Input
              aria-labelledby="premium-code-label"
              size="large"
              value={code}
              status={codeError ? 'error' : undefined}
              onChange={e => setCode(e.target.value)}
              onPressEnter={submitCode}
              disabled={locked}
              aria-invalid={!!codeError}
            />
            {!!codeError && <Text style={styles.fieldError}>{codeError}</Text>}
          </View>
          <AppButton
            type="primary"
            loading={redeeming}
            disabled={locked}
            onClick={submitCode}
            style={{ marginTop: 28, width: 'auto' }}>
            Kích hoạt
          </AppButton>
        </View>
      </View>

      <View style={styles.section}>
        <Text role="heading" aria-level={2} style={styles.sectionTitle}>
          Câu hỏi thường gặp
        </Text>
        {FAQ.map(f => (
          <View key={f.q} style={styles.faq}>
            <Text style={styles.faqQ}>{f.q}</Text>
            <Text style={styles.faqA}>{f.a}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const Page: React.FC = () => (
  <Suspense fallback={null}>
    <PremiumContent />
  </Suspense>
);

export default Page;
