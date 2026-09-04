import { StyleSheet } from '@styles';
import { lexend } from '@/styles/typography';

const font = lexend.style.fontFamily;

const styles = StyleSheet.create({
  inlineTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eef0f5',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 9999,
    cursor: 'pointer',
  },
  triggerIcon: {
    color: '#f0c356',
    fontSize: 14,
  },
  triggerText: {
    fontFamily: font,
    color: '#1c2536',
    fontSize: 14,
    fontWeight: '600',
  },
  popover: {
    gap: 10,
    width: 260,
  },
  popoverTitle: {
    fontFamily: font,
    fontSize: 14,
    fontWeight: '600',
    color: '#1c2536',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  starPick: {
    cursor: 'pointer',
  },
  starFilledIcon: {
    color: '#f0c356',
    fontSize: 22,
  },
  starOutlineIcon: {
    color: '#c7ccd6',
    fontSize: 22,
  },
  popoverActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});

export default styles;
