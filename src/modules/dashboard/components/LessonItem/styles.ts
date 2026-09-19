import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minWidth: 0,
    padding: 0,
    backgroundColor: 'var(--color-surface-subtle)',
    borderRadius: 16,
  },
  content: {
    padding: 12,
  },
  cardThumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    backgroundColor: 'gray',
    position: 'relative',
  },
  inner: {
    flex: 1,
  },
  premiumIcon: {
    color: 'var(--color-text-on-primary)',
    fontSize: 24,
  },
  inProgressBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 2,
    backgroundColor: 'var(--color-vhu-primary)',
    borderRadius: 999,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
  },
  inProgressBadgeText: {
    ...typography.caption,
    fontWeight: '600',
    color: 'var(--color-text-on-primary)',
  },
  title: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
    marginBottom: 8,
    marginTop: 12,
  },
  desc: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
    lineHeight: 20,
  },
  price: {
    ...typography.titleS,
    color: 'var(--color-premium)',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 16,
    color: 'var(--color-vhu-primary)',
  },
  ratingStarIcon: {
    color: 'var(--color-vhu-secondary)',
  },
  statValue: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
    marginBottom: 2,
  },
  statLabel: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  premium: {
    position: 'absolute',
    top: 8,
    zIndex: 2,
    left: 8,
    height: 32,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    ...typography.body2,
    backgroundColor: 'var(--color-premium)',
    borderRadius: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2,
    borderWidth: 1,
    borderColor: 'var(--color-premium)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default styles;
