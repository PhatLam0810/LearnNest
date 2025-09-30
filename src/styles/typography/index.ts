import { DM_Sans, Prompt, Inter } from 'next/font/google';

import { StyleSheet } from '../styleSheet';

export const dmSans = DM_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const prompt = Prompt({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const typography = StyleSheet.create({
  titleM: {
    fontFamily: prompt.style.fontFamily,
    fontWeight: '500',
    fontSize: 22.78,
    letterSpacing: 0.01,
  },
  titleS: {
    fontFamily: prompt.style.fontFamily,
    fontWeight: '400',
    fontSize: 20.25,
    letterSpacing: 1 / 100,
  },
  titleSM: {
    fontFamily: prompt.style.fontFamily,
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: 1 / 100,
  },
  subTitle1: {
    fontFamily: dmSans.style.fontFamily,
    fontWeight: '500',
    fontSize: 16.4,
    letterSpacing: 0.5 / 100,
  },
  subTitle2: {
    fontFamily: dmSans.style.fontFamily,
    fontWeight: '500',
    fontSize: 14,
  },
  body1: {
    fontFamily: dmSans.style.fontFamily,
    fontWeight: '400',
    fontSize: 16,
    letterSpacing: 1 / 100,
  },
  body2: {
    fontFamily: dmSans.style.fontFamily,
    fontWeight: '400',
    fontSize: 14,
  },
  caption: {
    fontFamily: dmSans.style.fontFamily,
    fontWeight: '400',
    fontSize: 12,
    letterSpacing: 1 / 100,
  },
  button: {
    fontFamily: dmSans.style.fontFamily,
    fontWeight: '500',
    fontSize: 16,
    letterSpacing: 1 / 100,
  },
  buttonSmall: {
    fontFamily: dmSans.style.fontFamily,
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 1.2,
  },

  // Reponsive Typography
  titleMMobile: {
    fontFamily: prompt.style.fontFamily,
    fontWeight: '500',
    fontSize: 18,
    letterSpacing: 0.01,
  },
  body1Mobile: {
    fontFamily: dmSans.style.fontFamily,
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: 1 / 100,
  },
  body2Mobile: {
    fontFamily: dmSans.style.fontFamily,
    fontWeight: '400',
    fontSize: 12,
  },
  buttonMobile: {
    fontFamily: dmSans.style.fontFamily,
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 1 / 100,
  },
});

export default typography;
