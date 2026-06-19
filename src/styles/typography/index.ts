import { DM_Sans, Inter, Lexend } from 'next/font/google';

import { StyleSheet } from '../styleSheet';

export const lexend = Lexend({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-lexend', // Quan trọng để dùng trong CSS
});

export const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const typography = StyleSheet.create({
  titleM: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '500',
    fontSize: 22.78,
    letterSpacing: 0.01,
  },
  titleS: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '400',
    fontSize: 20.25,
    letterSpacing: 1 / 100,
  },
  titleSM: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: 1 / 100,
  },
  subTitle1: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '500',
    fontSize: 16.4,
    letterSpacing: 0.5 / 100,
  },
  subTitle2: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '500',
    fontSize: 14,
  },
  body1: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '400',
    fontSize: 16,
    letterSpacing: 1 / 100,
  },
  body2: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '400',
    fontSize: 14,
  },
  caption: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '400',
    fontSize: 12,
    letterSpacing: 1 / 100,
  },
  button: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '500',
    fontSize: 16,
    letterSpacing: 1 / 100,
  },
  buttonSmall: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 1.2,
  },

  // Reponsive Typography
  titleMMobile: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '500',
    fontSize: 18,
    letterSpacing: 0.01,
  },
  body1Mobile: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: 1 / 100,
  },
  body2Mobile: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '400',
    fontSize: 12,
  },
  buttonMobile: {
    fontFamily: lexend.style.fontFamily,
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 1 / 100,
  },
});

export default typography;
