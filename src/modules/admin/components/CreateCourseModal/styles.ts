import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: 28,
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  formItem: {
    marginBottom: 0,
  },
  control: {
    height: 44,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 32,
  },
  statItem: {
    gap: 4,
  },
  statLabel: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  statValue: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
  },
  skillsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skillInputWrap: {
    flex: 1,
    marginBottom: 0,
  },
  skillDeleteIcon: {
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
  },
  coverUpload: {
    width: '100%',
    height: 260,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'var(--color-border-strong)',
    borderRadius: 8,
    backgroundColor: 'var(--color-surface-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sectionsTitle: {
    ...typography.subTitle1,
    color: 'var(--color-text-primary)',
    marginTop: 24,
    marginBottom: 12,
  },
  addSectionButton: {
    height: 44,
  },
  sectionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: 12,
  },
  sectionRow: {
    height: 44,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
  },
  sectionRowTitle: {
    ...typography.body2,
    color: 'var(--color-text-primary)',
    flex: 1,
  },
  sectionRowMeta: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
  sectionDeleteButton: {
    width: 42,
    height: 32,
    backgroundColor: 'var(--color-vhu-primary)',
    borderWidth: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  submitButton: {
    height: 48,
    marginTop: 24,
  },
});

export default styles;
