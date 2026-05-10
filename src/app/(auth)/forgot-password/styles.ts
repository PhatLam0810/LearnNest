import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },

  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: 20,
    margin: 20,
  },

  formWrapper: {
    flex: 1,
    minWidth: 320,
    display: 'flex',
    flexDirection: 'column',
  },

  subContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 24,
  },

  subTitle: {
    ...typography.titleM,
    color: '#000000',
  },

  subDescription: {
    ...typography.body2,
    color: '#21212199',
    textAlign: 'center',
    marginTop: 6,
  },

  labelText: {
    margin: 0,
    ...typography.button,
  },

  primaryButton: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
    color: '#ffffff',
    marginTop: 8,
  },

  footer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backToLogin: {
    color: '#4f46e5',
    cursor: 'pointer',
    ...typography.button,
  },
});

export default styles;
