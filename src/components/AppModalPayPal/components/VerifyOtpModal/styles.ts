import { inter, StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    borderRadius: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  email: {
    color: '#58a6ff',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
  },
  timer: {
    color: '#888',
    fontSize: 12,
  },
  expireTime: {
    color: '#58a6ff',
  },
  input: {
    height: 48,
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    width: '48%',
  },
  verifyButton: {
    width: '48%',
    backgroundColor: '#ef405c',
    color: '#FFF',
  },
});

export default styles;
