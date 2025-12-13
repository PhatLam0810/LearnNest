import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  pageLayout: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    padding: 16,
    gap: 16,
  },
  header: {
    padding: 0,
    backgroundColor: 'transparent',
  },
  mainLayout: {
    backgroundColor: '#fff',
    gap: 16,
  },
  sider: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 12,
    height: '100%',
    minHeight: '100%',
    backgroundColor: '#ffffff',
  },
  logo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ff6b35',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  logoMarkText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  logoText: {
    color: '#1a1a1a',
    fontWeight: '700',
    fontSize: 16,
  },
  topbar: {
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    borderBottom: '1px solid #f0f0f0',
    minHeight: 64,
  },
  topbarRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    width: '100%',
  },
  searchWrap: {
    flex: 1,
    maxWidth: 540,
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 999,
    border: '1px solid #e5e7eb',
    height: 40,
    paddingHorizontal: 12,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  iconBtn: {
    color: '#1a1a1a',
    fontSize: 20,
  },
  avatar: {
    cursor: 'pointer',
    backgroundColor: '#ff6b35',
    width: 40,
    height: 40,
  },
  menu: {
    backgroundColor: 'transparent',
    borderInlineEnd: 0,
  },
  content: {
    backgroundColor: '#fff',
    minHeight: 'calc(100vh - 64px)',
    padding: 24,
    height: 'calc(100vh - 64px)',
    overflowY: 'auto',
  },
  btnOpenDrawer: {
    color: '#1a1a1a',
    fontSize: 20,
  },
  antSider: {
    position: 'sticky',
    top: 64,
    height: 'calc(100vh - 64px)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    overflow: 'hidden',
  },
});

export default styles;
