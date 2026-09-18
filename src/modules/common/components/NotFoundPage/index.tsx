'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Image, Text, View } from 'react-native-web';
import styles from './styles';

interface SuggestedLink {
  label: string;
  href: string;
}

const suggestedLinks: SuggestedLink[] = [
  { label: 'Khóa học của tôi', href: '/dashboard/my-courses' },
  { label: 'Thực hành MOS', href: '/dashboard/practice' },
  { label: 'Thư viện tài liệu', href: '/dashboard/library' },
];

const NotFoundPage: React.FC = () => {
  const [isHeaderHomeHover, setIsHeaderHomeHover] = useState(false);
  const [isPrimaryHover, setIsPrimaryHover] = useState(false);
  const [isSecondaryHover, setIsSecondaryHover] = useState(false);
  const [hoveredLinkHref, setHoveredLinkHref] = useState<string | null>(null);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Link href="/" style={styles.logoLink}>
          <View style={styles.logoGroup}>
            <View style={styles.logoImageWrap}>
              <Image
                source={{ uri: '/images/LogoVhu.png' }}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.logoText}>LearnNest</Text>
          </View>
        </Link>

        <Link
          href="/"
          style={styles.headerHomeLink}
          onMouseEnter={() => setIsHeaderHomeHover(true)}
          onMouseLeave={() => setIsHeaderHomeHover(false)}>
          <View
            style={[
              styles.headerHomeButton,
              isHeaderHomeHover && styles.headerHomeButtonHover,
            ]}>
            <Text style={styles.headerHomeButtonText}>Về trang chủ</Text>
          </View>
        </Link>
      </View>

      <View style={styles.body}>
        <View style={styles.grid}>
          <View style={styles.leftCol}>
            <Text style={styles.eyebrow}>Lỗi 404</Text>

            <View style={styles.titleGroup}>
              <Text style={styles.h1}>Không tìm thấy trang bạn đang tìm</Text>
              <Text style={styles.description}>
                Đường dẫn có thể đã thay đổi, hoặc bài học này không còn nằm
                trong khóa học của bạn. Thử quay lại trang chủ hoặc tìm bằng tên
                khóa học.
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <Link
                href="/"
                style={styles.primaryLink}
                onMouseEnter={() => setIsPrimaryHover(true)}
                onMouseLeave={() => setIsPrimaryHover(false)}>
                <View
                  style={[
                    styles.primaryButton,
                    isPrimaryHover && styles.primaryButtonHover,
                  ]}>
                  <Text style={styles.primaryButtonText}>Về trang chủ</Text>
                </View>
              </Link>

              <Link
                href="/dashboard/lesson"
                style={styles.secondaryLink}
                onMouseEnter={() => setIsSecondaryHover(true)}
                onMouseLeave={() => setIsSecondaryHover(false)}>
                <View
                  style={[
                    styles.secondaryButton,
                    isSecondaryHover && styles.secondaryButtonHover,
                  ]}>
                  <Text style={styles.secondaryButtonText}>Xem khóa học</Text>
                </View>
              </Link>
            </View>

            <View style={styles.linksBlock}>
              <Text style={styles.linksLabel}>Có thể bạn đang tìm</Text>
              <View style={styles.linksList}>
                {suggestedLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={styles.suggestedLink}
                    onMouseEnter={() => setHoveredLinkHref(link.href)}
                    onMouseLeave={() => setHoveredLinkHref(null)}>
                    <Text
                      style={[
                        styles.linkItem,
                        hoveredLinkHref === link.href && styles.linkItemHover,
                      ]}>
                      {link.label}
                    </Text>
                  </Link>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.rightCol}>
            <View style={styles.circle}>
              <Text style={styles.bigNumber}>404</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Cần hỗ trợ? Liên hệ info@vhu.edu.vn · Hotline 18001568
        </Text>
      </View>
    </View>
  );
};

export default NotFoundPage;
