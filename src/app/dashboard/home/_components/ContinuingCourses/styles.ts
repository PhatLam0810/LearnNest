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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.06)',
    cursor: 'pointer',
  },
  cardSkeleton: {
    height: 180,
    borderRadius: 12,
    backgroundColor: '#eef1f6',
  },
  thumbWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f7',
  },
  title: {
    ...typography.subTitle2,
    color: '#212121',
  },
  time: {
    ...typography.body2,
    color: '#8D8D8D',
  },
});

export default styles;
