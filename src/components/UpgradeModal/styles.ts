import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  shell: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 28,
    paddingRight: 28,
    backgroundColor: 'var(--color-vhu-primary)',
  },
  title: {
    ...typography.titleS,
    lineHeight: 26,
    color: 'var(--color-text-on-primary)',
  },
  body: {
    flexDirection: 'column',
    gap: 20,
    paddingTop: 24,
    paddingBottom: 28,
    paddingLeft: 28,
    paddingRight: 28,
  },
  message: {
    ...typography.body1,
    lineHeight: 24,
    color: 'var(--color-text-body)',
  },
  list: { flexDirection: 'column', gap: 12 },
  item: {
    ...typography.body2,
    lineHeight: 20,
    color: 'var(--color-text-body)',
  },
  actions: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
});

export default styles;
