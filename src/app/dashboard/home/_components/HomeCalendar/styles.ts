import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  calendarContainer: {
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#F9F9F9',
    padding: 10,
  },
  monthCell: {
    ...typography.buttonSmall,
    fontWeight: 'bold',
    fontSize: 11,
  },
  dayCell: {
    ...typography.buttonSmall,
    fontWeight: 'bold',
  },
  dayWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  today: {
    color: '#FFF',
    backgroundColor: '#FD2159',
    borderRadius: 8,
  },
});

export default styles;
