import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  sider: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: 'white',
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
    padding: 12,
    height: '100%',
  },
  btnOpenDrawerContainer: {
    background: 'white',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    zIndex: 1,
    padding: 8,
  },
  btnOpenDrawer: {
    position: 'relative',
    top: 0,
    left: 0,
    fontSize: 24,
    color: '#ef405c',
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
