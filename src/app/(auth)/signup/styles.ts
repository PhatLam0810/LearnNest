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
  layoutDesktop: {
    display: 'flex',
    flexDirection: 'row',
    gap: 70,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 1280,
  },
  layoutStacked: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  heroDesktop: {
    flex: 1.1,
    minWidth: 340,
    maxWidth: 500,
    minHeight: 460,
    backgroundColor: 'var(--color-vhu-primary)',
    backgroundImage:
      'linear-gradient(150deg, var(--color-vhu-primary), #2a5bb8)',
    borderRadius: 24,
    padding: 40,
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
  backLink: {
    position: 'absolute',
    top: 24,
    left: 24,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    color: 'var(--color-vhu-primary)',
    cursor: 'pointer',
    ...typography.body2,
  },
  primaryButton: {
    backgroundColor: 'var(--color-vhu-primary)',
    borderColor: 'var(--color-vhu-primary)',
    color: '#ffffff',
  },

  containerDesktop: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
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
