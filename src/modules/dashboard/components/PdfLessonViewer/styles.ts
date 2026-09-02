import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    overflow: 'hidden',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexWrap: 'wrap',
  },
  spacer: { flex: 1 },
  pageInfo: {
    fontSize: 13,
    color: '#374151',
    minWidth: 90,
    textAlign: 'center',
  },
  scrollArea: {
    flex: 1,
    width: '100%',
    overflow: 'auto',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  muted: { color: '#6b7280', fontSize: 14 },
  doneTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    color: '#16a34a',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default styles;
