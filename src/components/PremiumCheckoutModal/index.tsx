'use client';
import React, { useEffect, useState } from 'react';
import { Input, Modal } from 'antd';
import { Text, View } from 'react-native-web';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { useAppSelector } from '@redux';
import {
  useCreateBankOrderMutation,
  useGetPremiumOrderQuery,
} from '@/modules/premium/redux/RTKQuery';
import {
  BankOrder,
  PremiumOrder,
  PremiumPlan,
} from '@/modules/premium/redux/types';
import styles from './styles';

type PremiumCheckoutModalProps = {
  plan: PremiumPlan | null;
  onClose: () => void;
  // Gọi khi tiền đã về và gói được kích hoạt.
  onPaid: (order: PremiumOrder) => void;
};

const formatVnd = (n: number) => `${n.toLocaleString('vi-VN')} ₫`;
const mmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

// Bước 1: xác nhận đơn (tên tự điền, số tiền cố định theo gói - BE tự tính).
// Bước 2: hiện mã QR VietQR + thông tin chuyển khoản, hỏi BE mỗi 3 giây tới khi
// SePay báo tiền về (real time).
const PremiumCheckoutModal: React.FC<PremiumCheckoutModalProps> = ({
  plan,
  onClose,
  onPaid,
}) => {
  const profileName = useAppSelector(
    state => state.authReducer.tokenInfo?.userProfile?.fullName,
  );
  const [createOrder, { isLoading }] = useCreateBankOrderMutation();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [order, setOrder] = useState<BankOrder | null>(null);
  const [now, setNow] = useState(Date.now());
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (plan) {
      setName(profileName || '');
      setError('');
      setOrder(null);
      setPaid(false);
    }
  }, [plan, profileName]);

  // Hỏi trạng thái đơn mỗi 3 giây khi đang hiện QR.
  // Dừng hỏi khi đã paid hoặc khi modal đóng (plan = null).
  const { data: status } = useGetPremiumOrderQuery(order?.txnRef || '', {
    skip: !order || !plan || paid,
    pollingInterval: 3000,
  });
  useEffect(() => {
    if (status?.status === 'paid' && !paid) {
      setPaid(true);
      onPaid(status);
    }
  }, [status, paid, onPaid]);

  // Đếm ngược chỉ để nhắc; tiền về muộn vẫn được ghi nhận.
  useEffect(() => {
    if (!order) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [order]);

  const start = async () => {
    if (!plan) return;
    if (!name.trim()) {
      setError('Vui lòng nhập họ tên người thanh toán');
      return;
    }
    setError('');
    try {
      setOrder(
        await createOrder({ plan: plan.key, fullName: name.trim() }).unwrap(),
      );
    } catch (e) {
      setError(
        (e as { data?: { message?: string } })?.data?.message ||
          'Không tạo được đơn, thử lại sau',
      );
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      messageApi.success('Đã sao chép');
    } catch {
      messageApi.error('Không sao chép được, hãy chép tay');
    }
  };

  const left = order ? new Date(order.expiresAt).getTime() - now : 0;

  return (
    <Modal
      open={!!plan}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={520}
      centered
      styles={{ body: { padding: 0 }, content: { padding: 0 } }}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Text role="heading" aria-level={2} style={styles.title}>
            {order ? 'Quét mã để thanh toán' : 'Xác nhận đơn Premium'}
          </Text>
        </View>

        {!order ? (
          <View style={styles.body}>
            <View style={styles.summary}>
              <View style={styles.row}>
                <Text style={styles.label}>Gói</Text>
                <Text style={styles.value}>{plan?.label}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Thời hạn</Text>
                <Text style={styles.value}>{plan?.days} ngày</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Số tiền</Text>
                <Text style={styles.amount}>
                  {plan ? formatVnd(plan.amount) : ''}
                </Text>
              </View>
            </View>
            <View style={styles.field}>
              <Text nativeID="checkout-name-label" style={styles.label}>
                Họ tên người thanh toán
              </Text>
              <Input
                aria-labelledby="checkout-name-label"
                size="large"
                value={name}
                maxLength={100}
                status={error ? 'error' : undefined}
                onChange={e => setName(e.target.value)}
                aria-invalid={!!error}
              />
              {!!error && <Text style={styles.error}>{error}</Text>}
            </View>
            <Text style={styles.note}>
              Thanh toán một lần bằng chuyển khoản QR. LearnNest không lưu thẻ
              của bạn và không tự động gia hạn. Đơn đã thanh toán là chốt, không
              hoàn tiền.
            </Text>
            <View style={styles.actions}>
              <AppButton type="primary" loading={isLoading} onClick={start}>
                Tạo mã QR thanh toán
              </AppButton>
              <AppButton disabled={isLoading} onClick={onClose}>
                Hủy
              </AppButton>
            </View>
          </View>
        ) : (
          <View style={styles.body}>
            <View style={styles.qrWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={order.qrUrl}
                alt={`Mã QR chuyển khoản ${formatVnd(order.amount)} nội dung ${order.transferContent}`}
                width={240}
                height={240}
                style={{ borderRadius: 12 }}
              />
            </View>
            <View style={styles.summary}>
              <View style={styles.row}>
                <Text style={styles.label}>Ngân hàng</Text>
                <Text style={styles.value}>{order.bank.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Số tài khoản</Text>
                <AppButton
                  size="small"
                  style={{ width: 'auto' }}
                  onClick={() => copy(order.bank.accountNo)}>
                  {order.bank.accountNo} · Chép
                </AppButton>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Chủ tài khoản</Text>
                <Text style={styles.value}>{order.bank.accountName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Số tiền</Text>
                <Text style={styles.amount}>{formatVnd(order.amount)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Nội dung (bắt buộc)</Text>
                <AppButton
                  size="small"
                  style={{ width: 'auto' }}
                  onClick={() => copy(order.transferContent)}>
                  {order.transferContent} · Chép
                </AppButton>
              </View>
            </View>
            <View
              style={styles.waiting}
              {...({ role: 'status', 'aria-live': 'polite' } as object)}>
              <Text style={styles.value}>
                Đang chờ nhận tiền... trang sẽ tự cập nhật khi chuyển khoản
                thành công.
              </Text>
              <Text style={styles.note}>
                {left > 0
                  ? `Mã có hiệu lực hiển thị ${mmss(left)}. `
                  : 'Đã quá thời gian gợi ý, nhưng tiền chuyển đúng nội dung vẫn được ghi nhận. '}
                Nhớ nhập đúng số tiền và nội dung.
              </Text>
            </View>
            <AppButton onClick={onClose}>Đóng (đơn vẫn được giữ)</AppButton>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default PremiumCheckoutModal;
