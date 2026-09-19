import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  modalBody: {
    padding: 20,
    backgroundColor: 'var(--color-surface-subtle)',
    borderRadius: 12,
  },

  header: {
    marginBottom: 16,
  },

  title: {
    ...typography.titleS,
    marginBottom: 4,
  },

  subtitle: {
    ...typography.body2,
    color: 'var(--color-text-muted)',
  },

  layout: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
  },

  left: {
    flex: 3,
  },

  right: {
    flex: 1,
    position: 'sticky',
    top: 10,
    height: 'fit-content',
  },

  card: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 14,
    padding: 16,
    boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
    marginBottom: 16,
  },

  desc: {
    ...typography.body2,
    lineHeight: 20,
    color: 'var(--color-text-body)',
    marginBottom: 14,
  },

  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  skillText: {
    ...typography.body2,
    marginLeft: 5,
    color: 'var(--color-text-body)',
  },

  thumbnailWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'var(--color-surface-subtle)',
    marginBottom: 12,
  },

  moduleCard: {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },

  moduleHeader: {
    ...typography.subTitle2,
  },

  libraryItem: {
    padding: 10,
    borderBottom: '1px solid var(--color-border-subtle)',
  },
});

export default styles;
