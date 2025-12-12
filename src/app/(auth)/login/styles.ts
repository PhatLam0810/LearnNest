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
    marginBottom: 10,
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driver: { width: '100%', height: 1, opacity: 0.32, backgroundColor: 'black' },
  driverText: {
    ...typography.body1,
  },

  // -------- Responsive container --------
  containerDesktop: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: 20,
    margin: 20,
  },
  containerTablet: {
    flex: 1,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    padding: 16,
    margin: 16,
  },
  containerMobile: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    padding: 12,
    margin: 12,
    backgroundColor: 'transparent',
    borderWidth: 0,
    boxShadow: 'none',
  },
  layoutDesktop: {
    display: 'flex',
    flexDirection: 'row',
    gap: 70,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 1280,
  },
  layoutTablet: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  layoutMobile: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  heroDesktop: {
    flex: 1.1,
    minWidth: 340,
    maxWidth: 500,
    backgroundColor: '#f7f9fb',
    borderRadius: 16,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroMobile: {
    width: '100%',
    backgroundColor: '#f7f9fb',
    borderRadius: 12,
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSlogan: {
    ...typography.body1,
    textAlign: 'center',
    color: '#0f172a',
    maxWidth: 420,
  },
  formWrapper: {
    flex: 1,
    minWidth: 320,
    display: 'flex',
    flexDirection: 'column',
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
    color: '#ffffff',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    color: '#111827',
  },
  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
});

export default styles;
