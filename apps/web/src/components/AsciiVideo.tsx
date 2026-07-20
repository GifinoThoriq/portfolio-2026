import { useEffect, useRef, useState } from 'react';

const COLS = 100;
const CHARSET = ' .,+⮐=cx/C';
const COLOR = '#ffffff';
const BG = '#000000';
const ASPECT = 2.0;

function useCanvasHeight() {
  const [height, setHeight] = useState(() => window.innerWidth > 834 ? '50%' : '70%');
  useEffect(() => {
    const update = () => setHeight(window.innerWidth > 834 ? '50%' : '70%');
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return height;
}

interface Props { ready?: boolean }

export default function AsciiVideo({ ready = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasHeight = useCanvasHeight();

  useEffect(() => {
    if (!ready) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    let rafId: number;

    const syncSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      rafId = requestAnimationFrame(draw);

      if (video.readyState < 2) return;

      const W = canvas.width;
      const H = canvas.height;
      if (W === 0 || H === 0) return;

      const cols = COLS;
      const cellW = W / cols;
      const cellH = cellW * ASPECT;
      const rows = Math.floor(H / cellH);
      const fontSize = Math.floor(cellH);

      offscreen.width = cols;
      offscreen.height = rows;
      offCtx.drawImage(video, 0, 0, cols, rows);
      const { data } = offCtx.getImageData(0, 0, cols, rows);

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = COLOR;
      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = 'top';

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = (row * cols + col) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          const charIdx = Math.floor((lum / 255) * (CHARSET.length - 1));
          const char = CHARSET[charIdx];
          ctx.fillText(char, col * cellW, row * cellH);
        }
      }
    };

    syncSize();
    const ro = new ResizeObserver(() => {
      syncSize();
    });
    ro.observe(canvas);

    video.play().catch(() => {});
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [ready]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        src="/hero.mp4"
        preload="auto"
        loop
        muted
        playsInline
        style={{ display: 'none' }}
      />
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          height: canvasHeight,
          aspectRatio: '16 / 9',
          maxWidth: '100%',
        }}
      />
    </div>
  );
}
