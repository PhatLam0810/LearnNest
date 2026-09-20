import type { ReactNode } from 'react';

// Kho toast dùng chung (không phụ thuộc React) để `messageApi` gọi được từ bất
// kỳ đâu (kể cả ngoài component) và <ToastProvider> chỉ việc render danh sách.
export type ToastKind = 'success' | 'error' | 'warn' | 'info';

export interface ToastItem {
  id: number;
  key?: string;
  title: ReactNode;
  message?: string;
  kind: ToastKind;
}

export interface ToastOptions {
  kind?: ToastKind;
  message?: string;
  key?: string;
  // Giây; 0 = không tự đóng. Mặc định 3.6s (riêng 'info' = không tự đóng).
  duration?: number;
}

const DEFAULT_DURATION_MS = 3600;

let items: ToastItem[] = [];
let seq = 0;
const listeners = new Set<() => void>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();

const emit = () => listeners.forEach(l => l());

export const toastStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => items,
  getServerSnapshot: (): ToastItem[] => [],
  dismiss(id: number) {
    const t = timers.get(id);
    if (t) clearTimeout(t);
    timers.delete(id);
    items = items.filter(i => i.id !== id);
    emit();
  },
  dismissKey(key: string) {
    items.filter(i => i.key === key).forEach(i => toastStore.dismiss(i.id));
  },
  clear() {
    [...items].forEach(i => toastStore.dismiss(i.id));
  },
  show(title: ReactNode, opts: ToastOptions = {}) {
    // Cùng key = cập nhật toast cũ (vd "đang tải lên" -> "xong") thay vì chồng.
    if (opts.key) toastStore.dismissKey(opts.key);
    seq += 1;
    const id = seq;
    items = [
      ...items,
      {
        id,
        key: opts.key,
        title,
        message: opts.message,
        kind: opts.kind ?? 'success',
      },
    ];
    const ms =
      opts.duration === undefined
        ? opts.kind === 'info'
          ? 0
          : DEFAULT_DURATION_MS
        : opts.duration * 1000;
    if (ms > 0)
      timers.set(
        id,
        setTimeout(() => toastStore.dismiss(id), ms),
      );
    emit();
    return id;
  },
};

type ConfigArg = {
  content: ReactNode;
  key?: string;
  duration?: number;
  message?: string;
};
type ContentArg = ReactNode | ConfigArg;

const isConfig = (arg: ContentArg): arg is ConfigArg =>
  typeof arg === 'object' && arg !== null && 'content' in (arg as object);

const call = (kind: ToastKind) => (arg: ContentArg, duration?: number) => {
  const cfg = isConfig(arg)
    ? {
        title: arg.content,
        key: arg.key,
        duration: arg.duration,
        message: arg.message,
      }
    : {
        title: arg as ReactNode,
        key: undefined,
        duration,
        message: undefined,
      };
  const id = toastStore.show(cfg.title, {
    kind,
    key: cfg.key,
    duration: cfg.duration,
    message: cfg.message,
  });
  // antd trả về hàm đóng có then(); giữ tương thích với chỗ gọi cũ.
  return Object.assign(() => toastStore.dismiss(id), {
    then: (resolve?: () => unknown) => Promise.resolve().then(resolve),
  });
};

// Thay cho MessageInstance của antd: cùng chữ ký success/error/warning/info/
// loading/open/destroy nên ~270 chỗ gọi `messageApi.*` không phải đổi.
export const toastMessageApi = {
  success: call('success'),
  error: call('error'),
  warning: call('warn'),
  info: call('success'),
  loading: call('info'),
  open: (cfg: {
    type?: 'success' | 'error' | 'warning' | 'info' | 'loading';
    content: ReactNode;
    key?: string;
    duration?: number;
  }) => {
    const kind: ToastKind =
      cfg.type === 'error'
        ? 'error'
        : cfg.type === 'warning'
          ? 'warn'
          : cfg.type === 'loading'
            ? 'info'
            : 'success';
    return call(kind)({
      content: cfg.content,
      key: cfg.key,
      duration: cfg.duration,
    });
  },
  destroy: (key?: string) =>
    key ? toastStore.dismissKey(key) : toastStore.clear(),
};

export type ToastMessageApi = typeof toastMessageApi;
