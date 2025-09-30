import { useWindowDimensions } from 'react-native-web';

export function useResponsive() {
  const { width } = useWindowDimensions();

  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 1024;
  const isDesktop = width >= 1024;

  return { isMobile, isTablet, isDesktop };
}
