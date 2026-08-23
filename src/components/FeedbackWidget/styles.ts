import { StyleSheet } from '@styles';

export default StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 9999,
  },
  fab: {
    backgroundColor: 'var(--color-vhu-primary)',
    padding: 16,
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: {
    color: 'white',
    fontSize: 14,
  },
});
