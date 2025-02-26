import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: '#FD2159',
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 60,
    height: 60,
    // transform: 'translateY(-42px)',
  },
  icon: {
    color: 'white',
    fontSize: 60,
  },
  desc: {
    ...typography.body1,
    color: 'white',
  },
  getPro: {
    color: '#FD2159',
  },
});

export default styles;
