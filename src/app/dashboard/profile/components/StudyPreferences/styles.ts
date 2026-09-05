import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eef0f5',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
    padding: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1c2536',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 14,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c2536',
  },
  rowSubtitle: {
    fontSize: 13,
    color: '#8D8D8D',
    marginTop: 2,
  },
  logoutLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    cursor: 'pointer',
  },
});

export default styles;
