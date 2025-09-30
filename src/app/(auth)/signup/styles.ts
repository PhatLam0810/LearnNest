import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
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
  driver: { flex: 1, height: 1, opacity: 0.32, backgroundColor: 'black' },
  driverText: {
    ...typography.body1,
  },

  // Responsive container
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
