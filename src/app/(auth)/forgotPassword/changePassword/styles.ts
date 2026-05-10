import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '35%',
    alignSelf: 'center',
    padding: 20,
    margin: 20,
  },
  subContainer: {
    paddingTop: 12,
    paddingBottom: 16,
    alignItems: 'center',
    gap: 8,
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  labelText: {
    marginTop: 16,
    ...typography.button,
  },
  email: {
    color: '#58a6ff',
    fontWeight: 'bold',
  },
  subTitle: {
    ...typography.titleM,
    color: '#000000',
  },
  subDescription: {
    ...typography.body2,
    color: '#21212199',
  },
  driverContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driver: { width: '100%', height: 1, opacity: 0.32, backgroundColor: 'black' },
  driverText: {
    ...typography.body1,
  },

  // Responsive
  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },

  containerDesktop: {
    width: '35%',
    minWidth: 320,
    padding: 20,
    margin: 20,
  },
  containerTablet: {
    width: '65%',
    minWidth: 320,
    padding: 16,
    margin: 16,
  },
  containerMobile: {
    width: '95%',
    minWidth: 280,
    padding: 12,
    margin: 12,
  },
});

export default styles;
