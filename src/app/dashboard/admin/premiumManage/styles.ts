import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: { flex: 1, gap: 20 },
  pageTitle: { ...typography.titleM, color: 'var(--color-text-primary)' },
  subtitle: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
    maxWidth: 720,
  },
  section: { gap: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  sectionTitle: { ...typography.subTitle1, color: 'var(--color-text-primary)' },
  form: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: 16,
  },
  field: { gap: 8 },
  label: { ...typography.subTitle2, color: 'var(--color-text-primary)' },
  newCodes: {
    gap: 8,
    padding: 16,
    backgroundColor: 'var(--color-success-bg)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  codeText: { ...typography.body2, color: 'var(--color-text-primary)' },
  empty: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 44,
    paddingBottom: 44,
    paddingLeft: 20,
    paddingRight: 20,
  },
  emptyText: { ...typography.body2, color: 'var(--color-text-muted)' },
});

export default styles;
