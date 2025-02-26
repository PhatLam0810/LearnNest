import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    gap: 12,
  },
  title: {
    ...typography.subTitle1,
    paddingBottom: 8,
  },
});

export default styles;
