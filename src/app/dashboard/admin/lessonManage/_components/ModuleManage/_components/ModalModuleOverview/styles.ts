import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  header: {
    fontSize: 18,
    fontWeight: '700',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },

  subTitle: {
    fontSize: 12,
    color: '#888',
    fontWeight: '400',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
    transition: 'all 0.2s ease',
  },
});

export default styles;
