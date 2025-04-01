import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
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
    width: '100%',
    height: 48,
    ...typography.button,
    backgroundColor: '#ef405c',
    color: '#FFF',
  },
  buttonDeleteContainer: {
    position: 'absolute',
    right: 0,
  },
  buttonDelete: {
    width: '100%',
    ...typography.button,
    backgroundColor: '#ef405c',
    color: '#FFF',
  },
  labelText: {
    ...typography.button,
  },
});
export default styles;
