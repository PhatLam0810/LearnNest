import { StyleSheet, typography } from '@styles';

const radius = (r: number) => ({
  borderTopLeftRadius: r,
  borderTopRightRadius: r,
  borderBottomLeftRadius: r,
  borderBottomRightRadius: r,
});

const border = (c: string) =>
  ({
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: c,
    borderRightColor: c,
    borderBottomColor: c,
    borderLeftColor: c,
  }) as const;

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    gap: 32,
    paddingTop: 24,
    paddingBottom: 64,
    paddingLeft: 16,
    paddingRight: 16,
    width: '100%',
  },
  pageDesktop: { paddingLeft: 48, paddingRight: 48 },

  // ---- Hero ----
  hero: {
    gap: 16,
    padding: 24,
    backgroundImage:
      'linear-gradient(135deg, var(--color-vhu-primary) 0%, var(--color-vhu-primary-hover) 100%)',
    ...radius(12),
  },
  heroDesktop: { padding: 48 },
  eyebrow: {
    ...typography.caption,
    fontWeight: '600',
    lineHeight: 16,
    alignSelf: 'flex-start',
    color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-vhu-secondary)',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    ...radius(999),
  },
  heroTitle: {
    ...typography.titleM,
    fontSize: 32,
    lineHeight: 40,
    color: 'var(--color-text-on-primary)',
  },
  heroTitleMobile: { fontSize: 24, lineHeight: 32 },
  heroText: {
    ...typography.body1,
    lineHeight: 24,
    maxWidth: 560,
    color: 'var(--color-text-on-primary)',
  },
  heroActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  banner: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
    ...radius(12),
  },
  bannerInfo: { backgroundColor: 'var(--color-info-bg)' },
  bannerSuccess: { backgroundColor: 'var(--color-success-bg)' },
  bannerError: { backgroundColor: 'var(--color-error-bg)' },
  bannerText: {
    ...typography.body2,
    lineHeight: 20,
    color: 'var(--color-text-primary)',
  },

  // ---- Section ----
  section: { flexDirection: 'column', gap: 20 },
  sectionTitle: {
    ...typography.titleM,
    lineHeight: 30,
    color: 'var(--color-text-primary)',
  },
  sectionSub: {
    ...typography.body2,
    lineHeight: 20,
    color: 'var(--color-text-muted)',
  },

  // ---- Benefits ----
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  benefit: {
    flexGrow: 1,
    flexBasis: 280,
    gap: 12,
    padding: 24,
    backgroundColor: 'var(--color-surface)',
    ...radius(12),
    ...border('var(--color-border)'),
  },
  benefitIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-info-bg)',
    color: 'var(--color-vhu-primary)',
    ...radius(999),
  },
  benefitTitle: {
    ...typography.subTitle1,
    lineHeight: 22,
    color: 'var(--color-text-primary)',
  },
  benefitDesc: {
    ...typography.body2,
    lineHeight: 20,
    color: 'var(--color-text-body)',
  },

  // ---- Plans (kiểu thẻ gói của Gemini) ----
  plans: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  plan: {
    flexGrow: 1,
    flexBasis: 320,
    gap: 16,
    padding: 24,
    backgroundColor: 'var(--color-surface)',
    ...radius(12),
    ...border('var(--color-border)'),
  },
  planFeatured: border('var(--color-vhu-primary)'),
  planHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  planName: {
    ...typography.titleS,
    lineHeight: 26,
    color: 'var(--color-text-primary)',
  },
  tag: {
    ...typography.caption,
    fontWeight: '600',
    lineHeight: 16,
    color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-vhu-secondary)',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    ...radius(6),
  },
  planTagline: {
    ...typography.body2,
    lineHeight: 20,
    color: 'var(--color-text-body)',
  },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  price: {
    ...typography.titleM,
    fontSize: 32,
    lineHeight: 40,
    color: 'var(--color-text-primary)',
  },
  priceUnit: {
    ...typography.body2,
    lineHeight: 20,
    paddingBottom: 4,
    color: 'var(--color-text-muted)',
  },
  muted: {
    ...typography.body2,
    lineHeight: 20,
    color: 'var(--color-text-muted)',
  },
  planDivider: {
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border)',
  },
  planListTitle: {
    ...typography.subTitle2,
    lineHeight: 20,
    color: 'var(--color-text-primary)',
  },
  planList: { gap: 12 },
  planItem: {
    ...typography.body2,
    lineHeight: 20,
    color: 'var(--color-text-body)',
  },
  successBox: { alignItems: 'center', gap: 16, padding: 8 },
  successIcon: {
    ...typography.titleM,
    width: 56,
    height: 56,
    textAlign: 'center',
    lineHeight: 56,
    color: 'var(--color-success)',
    backgroundColor: 'var(--color-success-bg)',
    ...radius(999),
  },
  noAutoRenew: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: 'var(--color-info-bg)',
    ...radius(8),
  },

  // ---- Compare ----
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-subtle)',
  },
  rowFeature: {
    ...typography.body2,
    lineHeight: 20,
    color: 'var(--color-text-primary)',
    flex: 2,
  },
  rowCell: {
    ...typography.body2,
    lineHeight: 20,
    color: 'var(--color-text-body)',
    flex: 1,
  },
  rowHead: {
    ...typography.subTitle2,
    lineHeight: 20,
    color: 'var(--color-text-primary)',
  },

  // ---- Redeem / FAQ ----
  redeem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 12,
  },
  redeemInput: { flexGrow: 1, flexBasis: 240, flexDirection: 'column', gap: 8 },
  label: {
    ...typography.subTitle2,
    lineHeight: 20,
    color: 'var(--color-text-primary)',
  },
  fieldError: {
    ...typography.caption,
    lineHeight: 16,
    color: 'var(--color-error)',
  },
  faq: { gap: 8 },
  faqQ: {
    ...typography.subTitle2,
    lineHeight: 20,
    color: 'var(--color-text-primary)',
  },
  faqA: {
    ...typography.body2,
    lineHeight: 20,
    color: 'var(--color-text-body)',
  },
});

export default styles;
