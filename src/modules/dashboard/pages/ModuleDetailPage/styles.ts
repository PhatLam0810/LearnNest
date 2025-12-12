import { dmSans, inter, StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
    alignItems: 'flex-start',
  },
  title: {
    ...typography.titleM,
  },
  subTitle: {
    ...typography.body1,
    color: '#8D8D8D',
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
  description: {
    ...typography.body1,
    color: '#8D8D8D',
    paddingBottom: 12,
  },
  whatLearnTitle: {
    ...typography.subTitle1,
    color: '#FFA726',
  },
  learnedSkillText: {
    ...typography.subTitle1,
    margin: 0,
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
  lessonContent: {
    flex: 1,
  },
  lessonContentTitle: {
    ...typography.titleS,
  },
  button: {
    backgroundColor: '#FD2159',
    alignSelf: 'flex-start',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
  },
  buttonModule: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: 'white',
    gap: 16,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Shadow
  },
  moduleItemTitle: {
    fontFamily: dmSans.style.fontFamily,
    fontWeight: '400',
    fontSize: 16,
    letterSpacing: 0.01,
    color: '#212121',
  },
  moduleItemTime: {
    ...typography.body2,
    color: '#8D8D8D',
  },
  layoutRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  mainColumn: {
    flex: 1,
    minWidth: 0,
  },
  videoSticky: {
    position: 'sticky' as any,
    top: 0,
    zIndex: 3,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  sideColumn: {
    width: '34%',
    minWidth: 340,
    maxWidth: 440,
    gap: 16,
    alignSelf: 'flex-start',
    position: 'sticky' as any,
    top: 16,
  },
  faceWrapper: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 0,
    overflow: 'hidden',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
  },
  lessonScroll: {
    width: '100%',
    maxHeight: 'calc(100vh - 420px)', // fit with camera + spacing to avoid page scroll
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
    overflowY: 'auto',
  },
  lessonScrollContent: {
    paddingBottom: 16,
    gap: 12,
  },
  lessonContentHeader: {
    position: 'sticky' as any,
    top: 0,
    zIndex: 4,
    paddingTop: 4,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  layoutTitleContainer: {
    width: '100%',
    display: 'flex',
    gap: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  layoutTitle: {
    ...typography.titleM,
    fontSize: 28,
  },
});

export default styles;
