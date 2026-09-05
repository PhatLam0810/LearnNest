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
    whiteSpace: 'normal',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  mainColumn: {
    flex: 4,
    minWidth: 0,
  },
  sideColumn: {
    flex: 1,
    minWidth: 260,
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
  },
  moduleContentHeader: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  moduleTitleText: {
    ...typography.subTitle1,
    margin: 0,
    fontWeight: '400',
    flex: 1,
    minWidth: 0,
  },
  moduleCountText: {
    ...typography.subTitle1,
    margin: 0,
    fontWeight: '400',
    flexShrink: 0,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  metaText: {
    ...typography.body2,
    color: '#8D8D8D',
  },
  metaDot: {
    ...typography.body2,
    color: '#8D8D8D',
  },
  metaStarIcon: {
    color: '#f0c356',
    fontSize: 13,
  },
  progressWrap: {
    width: '100%',
    gap: 8,
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    ...typography.body2,
    color: '#212121',
  },
  progressPercent: {
    ...typography.subTitle1,
    color: 'var(--color-vhu-primary)',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#FFA726',
  },
  lessonContent: {
    gap: 12,
    width: '100%',
  },
  lessonContentTitle: {
    ...typography.titleM,
    fontSize: 32,
    fontWeight: '600',
    color: '#000',
  },
  contentListCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.06)',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonModule: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#eef0f5',
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskIconBadgeWord: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eaf2ff',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  taskIconBadgeExcel: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eafaf0',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  taskTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },

  moduleItemContainer: {
    width: '100%',
    flex: 1,
  },
  moduleItemTitle: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '500',
    fontSize: 16,
    letterSpacing: 0.01,
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
  // "table1" = thẻ ảnh + tiêu đề + đánh giá + mô tả khóa học, gộp chung 1
  // card theo design - trước đây ảnh nằm riêng ở sidebar, tiêu đề/mô tả
  // đứng ngoài row 2 cột, tách rời trông không giống design.
  table1Card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.06)',
    marginBottom: 24,
  },
  table1Thumbnail: {
    width: '100%',
    maxWidth: 720,
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'gray',
    marginBottom: 16,
    alignSelf: 'center',
  },
  // "table2" = % tiến độ + nút tiếp tục, "table3" = kỹ năng đạt được - 2
  // card riêng trong sidebar theo design (trước đây gộp chung 1 khối
  // không viền/không nền với ảnh khóa học).
  table2Card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.06)',
  },
  table3Card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.06)',
    gap: 12,
  },
  table3SkillList: {
    gap: 10,
  },
  table3SkillRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumInline: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f05123',
    borderRadius: 8,
    width: 32,
    height: 32,
    marginBottom: 12,
  },
  premiumIconInline: {
    color: '#fff',
    fontSize: 18,
  },
});

export default styles;
