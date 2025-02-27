import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    width: '50%',
    alignSelf: 'center',
    padding: 20,
    margin: 'auto',
  },
  formContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-between',
    gap: 16,
  },
  formItemLayout: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
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
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    ...typography.titleS,
    marginTop: 10,
    marginBottom: 10,
    display: 'block',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#ef405c',
    width: '100%',
  },
});
export default styles;
