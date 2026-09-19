import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  },
  searchGroup: {
    flexDirection: 'row',
    flex: 1,
    maxWidth: 700,
  },
  searchInput: {
    height: 44,
    flex: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  searchButton: {
    width: 46,
    height: 44,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: 'var(--color-vhu-primary)',
    borderWidth: 0,
  },
  addButton: {
    height: 44,
    paddingLeft: 22,
    paddingRight: 22,
  },
});

export default styles;
