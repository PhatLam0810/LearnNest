import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 26,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border)',
  },
  tab: {
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    cursor: 'pointer',
  },
  tabActive: {
    borderBottomColor: 'var(--color-vhu-primary)',
  },
  tabLabel: {
    ...typography.subTitle2,
    color: 'var(--color-text-muted)',
  },
  tabLabelActive: {
    color: 'var(--color-vhu-primary)',
  },
});

export default styles;
