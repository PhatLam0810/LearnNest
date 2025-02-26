import { dmSans, StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {},
  formItemTitle: {
    ...typography.titleM,
  },

  btn: {
    backgroundColor: '#ef405c',
  },
  btnContainerUpload: {
    display: 'flex',
    border: 0,
    background: 'none',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default styles;
