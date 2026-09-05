import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    columnGap: 16,
    rowGap: 16,
    width: '100%',
  },
  cardSkeleton: {
    height: 260,
    borderRadius: 16,
    backgroundColor: '#eef1f6',
  },
});

export default styles;
