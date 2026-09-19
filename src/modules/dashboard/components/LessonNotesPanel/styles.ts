import type { CSSProperties } from 'react';

import { typography } from '@styles';

const styles: Record<string, CSSProperties> = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  composer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  composerFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  savedAt: {
    ...typography.caption,
    lineHeight: 1.5,
    color: 'var(--color-text-muted)',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
  empty: {
    color: 'var(--color-text-disabled)',
    fontSize: 13,
    paddingTop: 12,
    paddingBottom: 12,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  item: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border-subtle)',
    borderRadius: 10,
    padding: 12,
    background: 'var(--color-surface)',
  },
  itemHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  tsChip: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-vhu-accent)',
    background: 'var(--color-info-bg)',
    color: 'var(--color-info)',
    borderRadius: 999,
    ...typography.caption,
    fontWeight: 600,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    cursor: 'pointer',
  },
  // Nút icon sửa/xóa: <button> thật, vùng bấm 32x32, giữ viền focus mặc định.
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    padding: 0,
    borderWidth: 0,
    borderRadius: 6,
    background: 'none',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    fontSize: 14,
  },
  actionBtnDanger: {
    color: 'var(--color-error)',
  },
  content: {
    ...typography.body2,
    whiteSpace: 'pre-wrap',
    lineHeight: 1.5,
    color: 'var(--color-text-primary)',
  },
  editRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  editActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
  },
};

export default styles;
