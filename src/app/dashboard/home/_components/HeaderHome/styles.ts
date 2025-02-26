import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerItemLayout: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  welcomeText: {
    ...typography.titleM,
    color: '#212121F0',
  },
  searchInput: {
    width: '30vw',
    borderRadius: 16,
    backgroundColor: '#F4F7FC',
  },
  icon: {
    fontSize: 20,
    marginLeft: 10,
    color: '#555',
    cursor: 'pointer',
  },
});

export default styles;
