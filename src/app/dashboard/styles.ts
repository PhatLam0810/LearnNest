import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  sider: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    padding: 12,
    backgroundColor: 'white',
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
  },
  username: {
    marginTop: 12,
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 4,
  },
  menuItemFriend: {
    marginBottom: 20,
    marginTop: 20,
    paddingRight: 0,
  },
  friendContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  friendTitle: {
    ...typography.titleSM,
  },
  friendSubTitle: {
    ...typography.subTitle2,
    fontWeight: '200',
    fontSize: 10,
  },
  role: {
    fontWeight: '300',
    fontSize: 16,
    color: '#7A7E86',
  },
});

export default styles;
