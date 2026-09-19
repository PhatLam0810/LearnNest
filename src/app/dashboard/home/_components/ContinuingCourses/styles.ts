import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    columnGap: 16,
    rowGap: 16,
    width: '100%',
  },
  card: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.06)',
    cursor: 'pointer',
  },
  cardSkeleton: {
    height: 180,
    borderRadius: 12,
    backgroundColor: 'var(--color-border-subtle)',
  },
  thumbWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'var(--color-surface-page)',
  },
  title: {
    ...typography.subTitle2,
    color: 'var(--color-text-primary)',
  },
  time: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },
});

export default styles;
