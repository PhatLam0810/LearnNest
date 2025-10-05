import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  // 🖥 Desktop layout
  containerDesktop: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    minHeight: '80vh',
  },

  // 💻 Tablet layout
  containerTablet: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    minHeight: '75vh',
  },

  // 📱 Mobile layout
  containerMobile: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    minHeight: '70vh',
  },

  title: {
    ...typography.body2,
    fontWeight: '500',
  },
});

export default styles;
