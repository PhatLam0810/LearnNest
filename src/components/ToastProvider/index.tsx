'use client';
import React, { useSyncExternalStore } from 'react';
import { Text, View } from 'react-native-web';
import { toastStore, ToastKind, ToastOptions } from '@/hooks/toastStore';
import motion from '@/styles/motion';
import styles, { toastAccent } from './styles';

const GLYPH: Record<ToastKind, string> = {
  success: '✓',
  error: '✕',
  warn: '!',
  info: '…',
};

// Hook theo spec: useToast().show(title, { kind, message }). Cùng kho với
// `messageApi` (src/hooks) nên toast gọi từ đâu cũng hiện chung 1 chồng.
export const useToast = () => ({
  show: (title: React.ReactNode, opts?: ToastOptions) =>
    toastStore.show(title, opts),
  success: (title: React.ReactNode, message?: string) =>
    toastStore.show(title, { kind: 'success', message }),
  error: (title: React.ReactNode, message?: string) =>
    toastStore.show(title, { kind: 'error', message }),
  warn: (title: React.ReactNode, message?: string) =>
    toastStore.show(title, { kind: 'warn', message }),
});

// Chồng toast cố định góc trên phải: thẻ trắng, viền trái màu theo loại, tự
// đóng sau 3,6s, đóng tay bằng ✕. Gắn 1 lần ở RootLayoutClient.
const ToastProvider: React.FC = () => {
  const items = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  );
  if (!items.length) return null;

  return (
    <View style={styles.stack} aria-live="polite">
      {items.map(t => (
        <View
          key={t.id}
          style={{
            ...styles.toast,
            ...motion.toastEnter,
            borderLeftColor: toastAccent(t.kind),
          }}>
          <View
            style={{ ...styles.glyph, backgroundColor: toastAccent(t.kind) }}
            aria-hidden>
            <Text style={styles.glyphText}>{GLYPH[t.kind]}</Text>
          </View>
          <View style={styles.text}>
            <Text style={styles.title}>{t.title}</Text>
            {!!t.message && <Text style={styles.message}>{t.message}</Text>}
          </View>
          <button
            type="button"
            aria-label="Đóng thông báo"
            style={styles.close as React.CSSProperties}
            onClick={() => toastStore.dismiss(t.id)}>
            ✕
          </button>
        </View>
      ))}
    </View>
  );
};

export default ToastProvider;
