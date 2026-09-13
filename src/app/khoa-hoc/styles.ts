import type { CSSProperties } from 'react';

// Style inline, không phụ thuộc theme/redux của dashboard: các trang này phải
// render được hoàn toàn phía server cho Google đọc, không kèm client provider.
const styles: Record<string, CSSProperties> = {
  page: {
    maxWidth: 960,
    margin: '0 auto',
    padding: '32px 20px 64px',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    color: '#1f2430',
    lineHeight: 1.6,
  },
  breadcrumb: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  h1: { fontSize: 32, lineHeight: 1.25, margin: '0 0 12px' },
  lead: { fontSize: 16, color: '#4b5563', margin: '0 0 28px' },
  empty: { color: '#6b7280' },
  grid: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: 20,
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  },
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: 20,
    background: '#fff',
  },
  cardTitle: { fontSize: 19, margin: '0 0 8px' },
  cardLink: { color: '#1d4ed8', textDecoration: 'none' },
  cardDesc: { fontSize: 14, color: '#4b5563', margin: '0 0 10px' },
  meta: { fontSize: 13, color: '#6b7280', margin: '0 0 8px' },
  skills: { fontSize: 13, color: '#4b5563', margin: '0 0 14px' },
  cta: {
    display: 'inline-block',
    fontSize: 14,
    fontWeight: 600,
    color: '#1d4ed8',
    textDecoration: 'none',
  },
  // --- trang chi tiết ---
  hero: { margin: '0 0 24px' },
  section: { margin: '28px 0' },
  h2: { fontSize: 22, margin: '0 0 12px' },
  list: { margin: 0, paddingLeft: 20, color: '#374151' },
  ctaBox: {
    marginTop: 32,
    padding: 20,
    border: '1px solid #dbeafe',
    background: '#eff6ff',
    borderRadius: 10,
  },
  ctaBtn: {
    display: 'inline-block',
    marginTop: 10,
    padding: '10px 22px',
    background: '#1d4ed8',
    color: '#fff',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 600,
  },
};

export default styles;
