import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  title: {
    ...typography.subTitle1,
    color: 'white',
  },
});

export default styles;
