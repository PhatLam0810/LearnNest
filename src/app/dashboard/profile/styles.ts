import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  forceBanner: {
    marginTop: 16,
    gap: 4,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 18,
    paddingRight: 18,
    borderRadius: 12,
    backgroundColor: 'var(--color-warning-bg)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-warning)',
  },
  forceBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: 'var(--color-warning)',
  },
  forceBannerText: {
    fontSize: 13,
    lineHeight: 20,
    color: 'var(--color-text-primary)',
  },
  title: {
    ...typography.titleM,
    fontSize: 28,
    fontWeight: '700',
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
