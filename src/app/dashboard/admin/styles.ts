import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  headerWrapper: {
    marginBottom: 12,
  },
  pageTitle: {
    margin: 0,
    ...typography.titleM,
  },
  title: {
    ...typography.body2,
    fontWeight: '500',
  },
  subTitle: {
    ...typography.body1,
  },
  // Thanh tab xuống dòng (không menu "..."): hàng cách 10, cột cách 24.
  tabStrip: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
    columnGap: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border)',
  },
  tab: {
    ...typography.body1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 0,
    paddingRight: 0,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    backgroundColor: 'transparent',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    transitionProperty: 'color, border-color',
    transitionDuration: '0.16s',
    transitionTimingFunction: 'ease',
  },
  tabActive: {
    color: 'var(--color-vhu-primary)',
    borderBottomColor: 'var(--color-vhu-primary)',
  },
});

export default styles;
