import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  header: {
    ...typography.titleS,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },

  subTitle: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },

  card: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 14,
    padding: 12,
    boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
    transition: 'all 0.2s ease',
  },
});

export default styles;
