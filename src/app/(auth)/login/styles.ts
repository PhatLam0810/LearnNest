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
  labelText: {
    margin: 0,
    ...typography.button,
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

  // -------- Responsive container --------
  containerDesktop: {
    width: '35%',
    alignSelf: 'center',
    padding: 20,
    margin: 20,
  },
  containerTablet: {
    flex: 1,
    width: '65%',
    alignSelf: 'center',
    padding: 16,
    margin: 16,
  },
  containerMobile: {
    flex: 1,
    width: '95%',
    alignSelf: 'center',
    padding: 12,
    margin: 12,
  },
  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
});

export default styles;
