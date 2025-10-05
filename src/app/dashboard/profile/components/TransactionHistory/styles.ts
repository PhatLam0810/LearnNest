import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  containerDesktop: {
    flex: 1,
    gap: 12,
    padding: 20,
  },

  containerTablet: {
    flex: 1,
    gap: 10,
    padding: 16,
  },

  containerMobile: {
    flex: 1,
    gap: 8,
    padding: 12,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 8,
  },

  tableContainer: {
    flex: 1,
    overflow: 'auto',
  },

  subTitle: {
    ...typography.body2,
    fontSize: 13,
  },

  status: {
    padding: 4,
    width: 80,
    borderRadius: 8,
  },
});

export default styles;
