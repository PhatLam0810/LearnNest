import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 16,
    rowGap: 10,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: 'var(--color-info-bg)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
  },
  count: {
    ...typography.subTitle2,
    color: 'var(--color-vhu-primary)',
  },
  actions: {
    // View của react-native-web không tự co: không giới hạn thì hàng nút tràn ngang ở 375px.
    maxWidth: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  resultBox: {
    gap: 12,
    marginTop: 8,
  },
  resultText: {
    ...typography.body2,
    color: 'var(--color-text-primary)',
  },
  resultTitle: {
    ...typography.subTitle2,
    color: 'var(--color-error)',
  },
  issueList: {
    gap: 4,
    maxHeight: 220,
    overflow: 'auto',
  },
  issueRow: {
    ...typography.caption,
    color: 'var(--color-text-muted)',
  },
});

export default styles;
