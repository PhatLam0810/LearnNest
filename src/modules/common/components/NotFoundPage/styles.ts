import { StyleSheet, typography } from '@styles';

const styles = StyleSheet.create({
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f7fb',
  },

  // Header
  header: {
    height: 72,
    backgroundColor: '#fff',
    borderBottom: '1px solid #f0f0f0',
    padding: '0 24px',
    display: 'flex',
    // Mặc định của react-native-web là 'column' (theo React Native), khác
    // mặc định 'row' của CSS thường - phải khai báo tường minh, thiếu dòng
    // này làm logo và nút "Về trang chủ" rớt xuống 2 hàng thay vì cùng 1
    // hàng dàn 2 đầu.
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerMobile: {
    padding: '0 16px',
  },
  logoLink: {
    textDecoration: 'none',
  },
  logoGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
  },
  logoImageWrap: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImageWrapMobile: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoText: {
    ...typography.titleM,
    fontFamily: 'Lexend, sans-serif',
    fontSize: 28,
    fontWeight: '700',
    color: 'var(--color-vhu-primary)',
    whiteSpace: 'nowrap',
  },
  logoTextMobile: {
    fontSize: 20,
  },
  headerHomeLink: {
    textDecoration: 'none',
  },
  headerHomeButton: {
    height: 40,
    padding: '0 22px',
    // borderWidth/borderStyle/borderColor tách riêng thay vì shorthand
    // "border: '1px solid ...'" - khi đổi màu lúc hover (chỉ override
    // borderColor), trộn shorthand với 1 property riêng lẻ qua mảng style
    // làm react-native-web quên áp lại màu viền lúc rời hover (border-color
    // rơi về mặc định đen của trình duyệt). Tách riêng để hover chỉ override
    // đúng 1 property cùng loại, không bị lệch class.
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e9f0',
    borderRadius: 8,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerHomeButtonHover: {
    borderColor: '#88c1e9',
  },
  headerHomeButtonMobile: {
    height: 36,
    padding: '0 14px',
  },
  headerHomeButtonText: {
    ...typography.body2,
    fontFamily: 'Lexend, sans-serif',
    fontSize: 14,
    color: '#374151',
  },

  // Body
  body: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 24px 80px',
  },
  grid: {
    width: '100%',
    maxWidth: 900,
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    gap: 64,
    alignItems: 'center',
  },
  // Dưới 600px: 1 cột, vòng tròn xuống dưới - lưới 2 cột gốc vỡ layout ở
  // mobile thật (H1 xuống 6 dòng, vòng tròn đè lên mô tả).
  gridMobile: {
    gridTemplateColumns: '1fr',
    gap: 32,
  },

  // Left column
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  eyebrow: {
    ...typography.caption,
    fontFamily: 'Lexend, sans-serif',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--color-vhu-primary)',
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  h1: {
    ...typography.titleM,
    fontFamily: 'Lexend, sans-serif',
    fontSize: 38,
    fontWeight: '600',
    // react-native-web coi lineHeight là số px tuyệt đối (giống React
    // Native), KHÔNG phải hệ số nhân theo fontSize như CSS thường - viết
    // 1.25 sẽ ra "line-height: 1.25px" làm chữ đè lên nhau. Quy đổi thủ
    // công: 38 * 1.25 = 47.5 -> làm tròn 48.
    lineHeight: 48,
    color: '#111827',
    textWrap: 'pretty',
  },
  h1Mobile: {
    fontSize: 26,
    lineHeight: 33, // 26 * 1.25
  },
  description: {
    ...typography.body1,
    fontFamily: 'Lexend, sans-serif',
    fontSize: 16,
    // 16 * 1.75 = 28 (xem giải thích ở style "h1" bên trên).
    lineHeight: 28,
    color: '#6b7280',
    maxWidth: 440,
    textWrap: 'pretty',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    paddingTop: 2,
  },
  primaryLink: {
    textDecoration: 'none',
  },
  primaryButton: {
    height: 46,
    padding: '0 28px',
    borderRadius: 8,
    backgroundColor: 'var(--color-vhu-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonHover: {
    backgroundColor: '#15316b',
  },
  primaryButtonText: {
    ...typography.button,
    fontFamily: 'Lexend, sans-serif',
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
  },
  secondaryLink: {
    textDecoration: 'none',
  },
  secondaryButton: {
    height: 46,
    padding: '0 28px',
    borderRadius: 8,
    // Tách borderWidth/borderStyle/borderColor - xem giải thích ở style
    // "headerHomeButton" bên trên.
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e9f0',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonHover: {
    borderColor: '#88c1e9',
  },
  secondaryButtonText: {
    ...typography.button,
    fontFamily: 'Lexend, sans-serif',
    fontSize: 15,
    fontWeight: '400',
    color: '#374151',
  },

  // Suggested links
  linksBlock: {
    paddingTop: 20,
    borderTop: '1px solid #e9edf4',
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  linksLabel: {
    ...typography.subTitle2,
    fontFamily: 'Lexend, sans-serif',
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  linksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  suggestedLink: {
    textDecoration: 'none',
  },
  linkItem: {
    ...typography.body2,
    fontFamily: 'Lexend, sans-serif',
    fontSize: 14,
    // 14 * 1.6 = 22.4 -> 22 (xem giải thích ở style "h1").
    lineHeight: 22,
    color: 'var(--color-vhu-primary)',
    textDecoration: 'none',
  },
  linkItemHover: {
    color: '#16336c',
  },

  // Right column
  rightCol: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(136,193,233,0.22)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleMobile: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  bigNumber: {
    ...typography.titleM,
    fontFamily: 'Lexend, sans-serif',
    fontSize: 132,
    fontWeight: '600',
    letterSpacing: '-0.03em',
    // 132 * 1 = 132 (xem giải thích ở style "h1").
    lineHeight: 132,
    color: 'var(--color-vhu-primary)',
  },
  bigNumberMobile: {
    fontSize: 72,
    lineHeight: 72,
  },

  // Footer
  footer: {
    padding: '20px 24px',
    borderTop: '1px solid #e9edf4',
    textAlign: 'center',
  },
  footerText: {
    ...typography.caption,
    fontFamily: 'Lexend, sans-serif',
    fontSize: 13,
    color: '#9ca3af',
  },
});

export default styles;
