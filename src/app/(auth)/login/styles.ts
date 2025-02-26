import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '35%',
    alignSelf: 'center',
    padding: 20,
    margin: 20,
  },
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTitle: {
    ...typography.body1,
    textAlign: 'center',
    color: '#21212199',
    padding: 32,
  },
});

export default styles;
