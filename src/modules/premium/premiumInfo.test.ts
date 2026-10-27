import test from 'node:test';
import assert from 'node:assert/strict';
import { EXPIRING_SOON_DAYS, getPremiumInfo, perMonth } from './premiumInfo.ts';

const NOW = Date.parse('2026-10-26T00:00:00Z');
const inDays = (d: number) =>
  new Date(NOW + d * 24 * 3600 * 1000).toISOString();

test('không có ngày hết hạn: miễn phí, chưa từng mua', () => {
  for (const v of [null, undefined, '', 'không phải ngày']) {
    assert.deepEqual(getPremiumInfo(v, NOW), {
      active: false,
      expired: false,
      daysLeft: 0,
      expiringSoon: false,
    });
  }
});

test('còn 30 ngày: đang dùng, chưa cần nhắc', () => {
  const r = getPremiumInfo(inDays(30), NOW);
  assert.equal(r.active, true);
  assert.equal(r.daysLeft, 30);
  assert.equal(r.expiringSoon, false);
});

test('đúng ngưỡng nhắc: còn 7 ngày thì nhắc, còn 8 ngày thì chưa', () => {
  assert.equal(
    getPremiumInfo(inDays(EXPIRING_SOON_DAYS), NOW).expiringSoon,
    true,
  );
  assert.equal(
    getPremiumInfo(inDays(EXPIRING_SOON_DAYS + 1), NOW).expiringSoon,
    false,
  );
});

test('còn chưa tới 1 ngày vẫn tính là 1 ngày và đang nhắc', () => {
  const r = getPremiumInfo(new Date(NOW + 3600 * 1000).toISOString(), NOW);
  assert.equal(r.daysLeft, 1);
  assert.equal(r.active, true);
  assert.equal(r.expiringSoon, true);
});

test('đã quá hạn (kể cả đúng lúc hết hạn): expired, không active', () => {
  for (const d of [-1, 0]) {
    const r = getPremiumInfo(inDays(d), NOW);
    assert.equal(r.active, false);
    assert.equal(r.expired, true);
    assert.equal(r.daysLeft, 0);
  }
});

test('giá mỗi tháng của gói năm và gói tháng', () => {
  assert.equal(perMonth(49000, 30), 49000);
  assert.equal(perMonth(399000, 365), 33000);
});
