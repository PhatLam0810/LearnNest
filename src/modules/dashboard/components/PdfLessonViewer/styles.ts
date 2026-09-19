import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-surface-page)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: 'var(--color-surface)',
    borderBottomWidth: 1,
    borderBottomColor: 'var(--color-border-strong)',
    flexWrap: 'wrap',
  },
  spacer: { flex: 1 },
  pageInfo: {
    fontSize: 13,
    color: 'var(--color-text-body)',
    minWidth: 90,
    textAlign: 'center',
  },
  scrollArea: {
    flex: 1,
    width: '100%',
    overflow: 'auto',
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'var(--color-surface-page)',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  muted: { color: 'var(--color-text-muted)', fontSize: 14 },
  doneTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    color: 'var(--color-success)',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default styles;
