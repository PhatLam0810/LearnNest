import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  containerDesktop: {
    flex: 1,
    padding: 24,
    margin: 24,
    backgroundColor: 'white',
    borderRadius: 10,
  },

  containerTablet: {
    flex: 1,
    padding: 16,
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 10,
  },

  containerMobile: {
    flex: 1,
    padding: 12,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },

  formContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },

  formItemLayout: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },

  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },

  cameraWrap: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F9F9F9',
    borderRadius: 100,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  labelText: {
    ...typography.button,
    fontSize: 14,
  },

  buttonGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  buttonDelete: {
    width: '100%',
    backgroundColor: '#ef405c',
    color: '#FFF',
    border: 'none',
    height: 42,
    borderRadius: 6,
  },

  saveButton: {
    width: '100%',
    backgroundColor: '#1677ff',
    color: '#FFF',
    height: 42,
    borderRadius: 6,
  },
});

export default styles;
