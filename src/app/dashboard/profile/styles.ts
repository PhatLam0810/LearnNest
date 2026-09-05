import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    ...typography.titleM,
    fontSize: 28,
    fontWeight: '700',
    color: '#1c2536',
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
