import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
});

export default styles;
