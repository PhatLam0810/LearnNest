import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    paddingRight: 24,
  },
  forceBanner: {
    marginTop: 16,
    gap: 4,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 18,
    paddingRight: 18,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: 'var(--color-warning-bg)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderRightStyle: 'solid',
    borderTopColor: 'var(--color-warning)',
    borderBottomColor: 'var(--color-warning)',
    borderLeftColor: 'var(--color-warning)',
    borderRightColor: 'var(--color-warning)',
  },
  forceBannerTitle: {
    ...typography.subTitle1,
    fontWeight: '700',
    color: 'var(--color-warning)',
  },
  forceBannerText: {
    ...typography.body2,
    color: 'var(--color-text-primary)',
  },
  title: {
    ...typography.titleL,
    color: 'var(--color-text-primary)',
    marginBottom: 20,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
    flexWrap: 'wrap',
  },
  sideCol: {
    width: 260,
    minWidth: 240,
  },
  mainCol: {
    flex: 1,
    minWidth: 320,
    gap: 20,
  },
});

export default styles;
