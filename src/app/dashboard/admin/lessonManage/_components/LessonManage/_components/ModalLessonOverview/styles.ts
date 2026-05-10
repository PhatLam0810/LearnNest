import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  modalBody: {
    padding: 20,
    backgroundColor: '#f7f8fa',
    borderRadius: 12,
  },

  header: {
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    color: '#666',
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
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
    marginBottom: 16,
  },

  desc: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    marginBottom: 14,
  },

  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  skillText: {
    marginLeft: 5,
    fontSize: 13,
    color: '#333',
  },

  thumbnailWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginBottom: 12,
  },

  moduleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },

  moduleHeader: {
    fontWeight: '600',
    fontSize: 14,
  },

  libraryItem: {
    padding: 10,
    borderBottom: '1px solid #f1f1f1',
  },
});

export default styles;
