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
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1c2536',
    marginTop: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#8D8D8D',
    marginTop: 4,
    textAlign: 'center',
  },
  changeAvatarBtn: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d7dbe4',
    cursor: 'pointer',
  },
  changeAvatarText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212121',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 20,
    marginBottom: 16,
  },
  joinedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  joinedLabel: {
    fontSize: 13,
    color: '#8D8D8D',
  },
  joinedValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1c2536',
  },
});

export default styles;
