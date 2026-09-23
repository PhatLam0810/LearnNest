'use client';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const VHU_CONFETTI_COLORS = [
  '#1d418a', // VHU Primary Blue
  '#f0c356', // VHU Gold
  '#88c1e9', // VHU Light Accent
  '#16a34a', // Success Green
  '#f97316', // Orange Flame
  '#8b5cf6', // Violet
];

/**
 * Hiệu ứng bắn pháo hoa Confetti 60FPS thuần Canvas
 * Tự động tạo canvas toàn màn hình, render các mảnh vụn bay và dọn dẹp sau 2.5s
 */
export function fireConfetti(originX = 0.5, originY = 0.6): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const particleCount = 90;
  const particles: Particle[] = [];
  const startX = width * originX;
  const startY = height * originY;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5);
    const speed = 6 + Math.random() * 9;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4, // Bắn hơi chếch lên trên
      size: 6 + Math.random() * 6,
      color:
        VHU_CONFETTI_COLORS[
          Math.floor(Math.random() * VHU_CONFETTI_COLORS.length)
        ],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
    });
  }

  const startTime = performance.now();
  const duration = 2500; // 2.5 giây

  const render = (now: number) => {
    const elapsed = now - startTime;
    const progress = elapsed / duration;

    if (progress >= 1) {
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // Trọng lực
      p.vx *= 0.98; // Lực cản không khí
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - progress);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      ctx.restore();
    });

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}
