import type { CSSProperties } from 'react';

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
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 0',
  },
  empty: {
    color: '#9aa5b8',
    fontSize: 13,
    padding: '12px 0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  item: {
    border: '1px solid #eef0f5',
    borderRadius: 10,
    padding: 12,
    background: '#fff',
  },
  itemHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  tsChip: {
    border: '1px solid #d6e4ff',
    background: '#f0f5ff',
    color: '#1d418a',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    padding: '2px 10px',
    cursor: 'pointer',
  },
  actionIcon: {
    color: '#8a94a6',
    cursor: 'pointer',
    fontSize: 14,
    marginLeft: 8,
  },
  content: {
    whiteSpace: 'pre-wrap',
    fontSize: 14,
    lineHeight: 1.5,
    color: '#1c2536',
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
