import { StyleSheet, typography, lexend } from '@styles';

const styles = StyleSheet.create({
  // Text styles
  secondaryText12: {
    ...typography.body2,
    fontSize: 12,
    color: '#8D8D8D',
  },
  strongText14: {
    ...typography.body1,
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryText11: {
    ...typography.body2,
    fontSize: 11,
    color: '#8D8D8D',
    marginTop: 4,
  },
  marginBottom4: {
    marginBottom: 4,
  },
  text12Center: {
    fontSize: 12,
    minWidth: 80,
    textAlign: 'center',
  },
  text16Bold: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '600',
    fontSize: 16,
  },
  smallText12: {
    fontSize: 12,
    padding: 2,
    paddingTop: 8,
    paddingBottom: 8,
    margin: 0,
  },
  // Icon styles
  icon10: {
    fontSize: 10,
  },
  // Tag/Badge styles
  tagStyle: {
    backgroundColor: '#f0f0f0',
    borderColor: '#d9d9d9',
  },
  tagYouStyle: {
    fontSize: 11,
    paddingTop: 6,
    paddingBottom: 6,
    height: 20,
    lineHeight: '20px',
    margin: 0,
  },
  tagCompletedStyle: {
    fontSize: 11,
    paddingTop: 6,
    paddingBottom: 6,
    height: 20,
    lineHeight: '20px',
    margin: 0,
  },
  // Avatar styles
  avatarStyle: {
    width: 40,
    height: 40,
    fontSize: 16,
  },
  // Container styles
  container240: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: 240,
  },
  columnMargin12: {
    margin: 0,
    marginTop: 12,
    marginBottom: 12,
  },
  spaceVertical: {
    width: '100%',
  },
  spaceVerticalPadding: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 8,
  },
  // Layout styles
  watcherRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paginationRow: {
    marginTop: 20,
    paddingTop: 16,
    borderTop: '1px solid #f0f0f0',
  },
  listItemStyle: {
    paddingRight: 12,
    paddingLeft: 12,
    borderBottom: '1px solid #f0f0f0',
  },
  avatarSize32: {
    width: 32,
    height: 32,
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  statisticLabel: {
    marginBottom: 16,
  },
  emptyPadding: {
    paddingRight: 40,
    paddingLeft: 40,
  },
});

export default styles;
