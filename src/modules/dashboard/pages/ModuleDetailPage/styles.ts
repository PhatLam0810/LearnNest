import { lexend, inter, StyleSheet, typography } from '@styles';

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
    backgroundColor: 'var(--color-vhu-primary)',
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
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
    overflowY: 'auto',
  },
  lessonScrollContent: {
    paddingBottom: 16,
    gap: 12,
  },
  lessonContentHeader: {
    backgroundColor: '#fff',
    width: '100%',
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 16,
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
    marginTop: 16,
    marginBottom: 16,
  },
  // Inline style consolidations
  contentGap8Margin8: {
    gap: 8,
    marginTop: 8,
  },
  libraryItemPadding: {
    paddingRight: 7,
    paddingLeft: 7,
    flex: 1,
  },
  errorText: {
    color: 'red',
  },
  centeredFlex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthFlex: {
    width: '100%',
    flex: 1,
  },
  libraryGap: {
    gap: 12,
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  resultCard: {
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: '#fafafa',
    width: '90%',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  // Style cho trạng thái thành công
  statusBoxSuccess: {
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontWeight: 500,
    backgroundColor: '#f6ffed',
    color: '#389e0d',
    width: '90%',
  },
  // Style cho trạng thái thất bại
  statusBoxFail: {
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontWeight: 500,
    backgroundColor: '#fff1f0',
    color: '#cf1322',
    width: '90%',
  },
  scoreSuccess: {
    color: '#0958d9',
    fontWeight: 'bold',
  },
  scoreFail: {
    color: '#cf1322',
    fontWeight: 'bold',
  },
});

export default styles;
