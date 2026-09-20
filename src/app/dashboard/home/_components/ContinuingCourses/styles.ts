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
    animationName: 'fadeInUp',
    animationDuration: '0.32s',
    animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    animationFillMode: 'both',
    boxShadow: '0 1px 3px rgba(17, 24, 39, 0.06)',
    transitionProperty: 'background-color, border-color, transform, box-shadow',
    transitionDuration: '0.16s, 0.16s, 0.16s, 0.18s',
    transitionTimingFunction: 'ease',
    backgroundColor: 'var(--color-surface)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    cursor: 'pointer',
  },
  cardSkeleton: {
    backgroundImage:
      'linear-gradient(90deg, var(--color-border-subtle) 0%, var(--color-surface) 50%, var(--color-border-subtle) 100%)',
    backgroundSize: '600px 100%',
    backgroundRepeat: 'no-repeat',
    animationName: 'shimmer',
    animationDuration: '1.4s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
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
