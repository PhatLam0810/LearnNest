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

  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    position: 'relative',
  },
  primaryButton: {
    backgroundColor: 'var(--color-vhu-primary)',
    borderColor: 'var(--color-vhu-primary)',
    color: '#ffffff',
    borderRadius: 10,
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(29, 65, 138, 0.28)',
  },
  layoutDesktop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  layoutStacked: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
    alignItems: 'center',
  },
  heroDesktop: {
    flex: 6,
    minWidth: 340,
    height: '100vh',
    backgroundColor: 'var(--color-vhu-primary)',
    backgroundImage:
      'linear-gradient(150deg, var(--color-vhu-primary), #2a5bb8)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroLogo: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#fff',
    objectFit: 'contain',
    padding: 6,
  },
  heroTitle: {
    ...typography.titleM,
    color: '#ffffff',
    fontSize: 26,
  },
  heroSlogan: {
    ...typography.body1,
    textAlign: 'center',
    color: '#e6ecfa',
    maxWidth: 340,
  },

  containerDesktop: {
    flex: 4,
    width: '100%',
    maxWidth: 600,
    minWidth: 320,
    padding: 20,
    margin: 70,
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
