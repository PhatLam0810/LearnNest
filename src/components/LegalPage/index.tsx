'use client';
import React from 'react';
import Link from 'next/link';
import { Text, View } from 'react-native-web';
import styles from './styles';

type LegalPageProps = {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
};

const LegalPage: React.FC<LegalPageProps> = ({
  title,
  updatedAt,
  children,
}) => (
  <View style={styles.page}>
    <View style={styles.header}>
      <Link href="/" style={styles.logoLink}>
        <Text style={styles.logoText}>LearnNest</Text>
      </Link>
      <Link href="/" style={styles.homeLink}>
        <Text style={styles.homeLinkText}>Về trang chủ</Text>
      </Link>
    </View>

    <View style={styles.body}>
      <View style={styles.container}>
        <Text role="heading" aria-level={1} style={styles.h1}>
          {title}
        </Text>
        <Text style={styles.updatedAt}>Cập nhật lần cuối: {updatedAt}</Text>
        <View style={styles.content}>{children}</View>
      </View>
    </View>

    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Trung Tâm Tin Học - Đại Học Văn Hiến · info@vhu.edu.vn · Hotline
        18001568
      </Text>
    </View>
  </View>
);

export default LegalPage;

export const Section: React.FC<{
  heading: string;
  children: React.ReactNode;
}> = ({ heading, children }) => (
  <View style={styles.section}>
    <Text role="heading" aria-level={2} style={styles.h2}>
      {heading}
    </Text>
    {children}
  </View>
);

export const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.p}>{children}</Text>
);

export const Li: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.liRow}>
    <Text style={styles.liBullet}>•</Text>
    <Text style={styles.liText}>{children}</Text>
  </View>
);
