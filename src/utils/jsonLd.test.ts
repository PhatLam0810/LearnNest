import test from 'node:test';
import assert from 'node:assert/strict';
import { safeJsonLd } from './jsonLd.ts';

test('không còn ký tự < để thoát khỏi thẻ script', () => {
  const out = safeJsonLd({ name: 'Khóa </script><script>alert(1)</script>' });
  assert.ok(!out.includes('<'));
  assert.ok(!out.toLowerCase().includes('</script'));
});

test('vẫn là JSON hợp lệ và giữ nguyên dữ liệu gốc', () => {
  const data = { name: 'a</b>', n: 5, s: 'x y' };
  assert.deepEqual(JSON.parse(safeJsonLd(data)), data);
});
