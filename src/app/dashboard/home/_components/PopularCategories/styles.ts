import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minWidth: 200,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#FDF0E7',
  },
  chip: {
    ...typography.subTitle1,
  },
  desc: {
    ...typography.caption,
    fontWeight: '300',
    color: '#8D8D8D',
  },
  icon: {
    backgroundColor: '#FAFAFC',
    width: 25,
    height: 25,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
