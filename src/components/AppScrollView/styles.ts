import { StyleSheet } from '@styles';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  hideScrollIndicator: {
    scrollbarWidth: 'none',
  },
  scrollHorizontal: {
    flexDirection: 'row',
    overflowX: 'scroll',
  },
  scrollVertical: {
    flexDirection: 'column',
    overflowY: 'scroll',
  },
});

export default styles;
