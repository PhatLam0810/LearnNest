import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isTaskAccessible,
  type TaskAccessibilitySeqItem,
} from './isTaskAccessible.ts';

const video = (id: string): TaskAccessibilitySeqItem => ({
  kind: 'library',
  data: { _id: id, type: 'Video' },
});
const quiz = (id: string): TaskAccessibilitySeqItem => ({
  kind: 'library',
  data: { _id: id, type: 'Text' },
});
const task = (hasPassed: boolean): TaskAccessibilitySeqItem => ({
  kind: 'task',
  data: { hasPassed },
});

test('admin luôn được vào, bất kể tiến độ học thật của chính họ', () => {
  // Đây là bug thật đã xảy ra: thiếu bypass này khiến admin bị khoá y hệt
  // học viên thật ngay khi video/quiz phía trước CHƯA hoàn thành với chính
  // tài khoản admin đó.
  const seq = [video('v1'), task(false)];
  const accessible = isTaskAccessible(seq, 1, {
    isAdmin: true,
    videoCompletedBySubLesson: {}, // rỗng — video CHƯA xem xong
  });
  assert.equal(accessible, true);
});

test('học viên thường bị khoá nếu video đứng trước chưa xem xong', () => {
  const seq = [video('v1'), task(false)];
  const accessible = isTaskAccessible(seq, 1, {
    isAdmin: false,
    videoCompletedBySubLesson: {},
  });
  assert.equal(accessible, false);
});

test('học viên thường được mở khoá khi video đứng trước đã xem xong', () => {
  const seq = [video('v1'), task(false)];
  const accessible = isTaskAccessible(seq, 1, {
    isAdmin: false,
    videoCompletedBySubLesson: { v1: true },
  });
  assert.equal(accessible, true);
});

test('mục trước là quiz — khoá nếu chưa đạt (isPass)', () => {
  const seq = [quiz('q1'), task(false)];
  assert.equal(
    isTaskAccessible(seq, 1, { isAdmin: false, quizPassedByLibrary: {} }),
    false,
  );
  assert.equal(
    isTaskAccessible(seq, 1, {
      isAdmin: false,
      quizPassedByLibrary: { q1: true },
    }),
    true,
  );
});

test('mục trước là bài thực hành — dựa vào hasPassed', () => {
  assert.equal(
    isTaskAccessible([task(false), task(false)], 1, { isAdmin: false }),
    false,
  );
  assert.equal(
    isTaskAccessible([task(true), task(false)], 1, { isAdmin: false }),
    true,
  );
});

test('mục đầu tiên trong danh sách luôn truy cập được', () => {
  assert.equal(isTaskAccessible([task(false)], 0, { isAdmin: false }), true);
});
