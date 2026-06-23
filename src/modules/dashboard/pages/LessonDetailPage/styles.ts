import { lexend, inter, StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  pageWrapper: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 22.78,
  },
  chip: {
    ...typography.titleS,
  },
  categoryItem: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  categoryItemName: {
    ...typography.subTitle2,
    color: '#212121',
  },
  title: {
    ...typography.titleM,
    fontWeight: '600',
    letterSpacing: 0.01,
    color: '#000',
  },
  description: {
    ...typography.body1,
    color: '#8D8D8D',
    paddingBottom: 12,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  mainColumn: {
    flex: 3,
    minWidth: 0,
  },
  sideColumn: {
    flex: 1.2,
    minWidth: 340,
    maxWidth: 420,
  },
  thumbnailCard: {
    flex: 1,
    minHeight: 260,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'gray',
    position: 'relative',
  },
  whatLearnTitle: {
    ...typography.titleS,
    fontWeight: '600',
    color: '#000',
  },
  learnedSkillText: {
    ...typography.subTitle1,
    margin: 0,
    fontWeight: '400',
    color: '#000',
  },
  moduleContentHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillLearnedItem: {
    ...typography.body2,
    color: '#21212199',
  },
  premium: {
    position: 'absolute',
    top: 8,
    zIndex: 2,
    left: 8,
    height: 34,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    ...typography.body2,
    backgroundColor: '#f05123',
    borderRadius: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2,
    borderWidth: 1,
    borderColor: '#f05123',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  totalLibrary: {
    ...typography.subTitle2,
    marginTop: 16,
    textAlign: 'center',
  },
  lessonContent: {
    gap: 12,
  },
  lessonContentTitle: {
    ...typography.titleM,
    fontSize: 32,
    fontWeight: '600',
    color: '#000',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonModule: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Shadow
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  moduleItemContainer: {
    width: '100%',
  },
  moduleItemTitle: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '400',
    fontSize: 16,
    letterSpacing: 0.01,
    color: '#212121',
  },
  moduleItemTime: {
    ...typography.body2,
    color: '#8D8D8D',
  },
  // Inline style consolidations
  marginTop12: {
    marginTop: 12,
  },
  sideColumnGap: {
    gap: 16,
  },
  contentGap8Margin8: {
    gap: 8,
    marginTop: 8,
  },
  rowGap10: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  paddingBottom10: {
    paddingBottom: 10,
  },
  premiumIcon: {
    color: '#FFF',
    // fontSize: isMobile ? 20 : 24, // Handled dynamically
  },
});

export default styles;
