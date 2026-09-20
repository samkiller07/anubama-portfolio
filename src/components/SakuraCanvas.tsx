import React, { useEffect, useRef } from 'react';

interface SakuraCanvasProps {
  intensity?: 'gentle' | 'normal' | 'vibrant';
  enabled?: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  flipSpeed: number;
  flipAngle: number;
  opacity: number;
  colorType: number;
  swayAmplitude: number;
  swayFrequency: number;
  swayOffset: number;
}

export const SakuraCanvas: React.FC<SakuraCanvasProps> = ({
  intensity = 'normal',
  enabled = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!enabled || prefersReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Color palettes for Sakura petals
    const petalColors = [
      { fill: 'rgba(255, 183, 197, 0.75)', stroke: 'rgba(251, 113, 133, 0.4)' }, // Sakura Classic Pink
      { fill: 'rgba(255, 192, 203, 0.65)', stroke: 'rgba(244, 114, 182, 0.35)' }, // Soft Cherry Pink
      { fill: 'rgba(255, 228, 235, 0.8)',  stroke: 'rgba(253, 164, 175, 0.4)' }, // Blossom White-Pink
      { fill: 'rgba(251, 113, 133, 0.55)', stroke: 'rgba(225, 29, 72, 0.3)' },  // Deep Rose Tint
      { fill: 'rgba(254, 205, 211, 0.7)',  stroke: 'rgba(244, 63, 94, 0.3)' }   // Warm Blush
    ];

    // Determine particle count based on screen width & intensity
    const isMobile = width < 768;
    const baseCount = isMobile ? 18 : 36;
    const particleCount = intensity === 'vibrant' ? baseCount * 1.5 : intensity === 'gentle' ? baseCount * 0.6 : baseCount;

    const petals: Petal[] = [];

    const createPetal = (initialY?: number): Petal => {
      return {
        x: Math.random() * (width + 200) - 100,
        y: initialY !== undefined ? initialY : Math.random() * -100,
        size: Math.random() * 8 + 9, // 9px to 17px
        speedX: Math.random() * 1.2 + 0.6,
        speedY: Math.random() * 1.1 + 0.9,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        flipSpeed: Math.random() * 0.03 + 0.015,
        flipAngle: Math.random() * Math.PI,
        opacity: Math.random() * 0.4 + 0.5,
        colorType: Math.floor(Math.random() * petalColors.length),
        swayAmplitude: Math.random() * 20 + 15,
        swayFrequency: Math.random() * 0.015 + 0.008,
        swayOffset: Math.random() * Math.PI * 2
      };
    };

    // Initialize initial petals distributed across viewport
    for (let i = 0; i < particleCount; i++) {
      petals.push(createPetal(Math.random() * height));
    }

    let time = 0;

    const drawSakuraPetal = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      flipAngle: number,
      color: { fill: string; stroke: string },
      opacity: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate((rotation * Math.PI) / 180);
      context.scale(Math.cos(flipAngle), 1); // 3D tumbling effect
      context.globalAlpha = opacity;

      // Realistic Sakura Petal Path with subtle notch
      context.beginPath();
      context.moveTo(0, 0);
      context.bezierCurveTo(-size * 0.6, -size * 0.4, -size * 0.8, -size * 1.1, -size * 0.2, -size * 1.4);
      // Petal top notch
      context.quadraticCurveTo(0, -size * 1.25, size * 0.2, -size * 1.4);
      context.bezierCurveTo(size * 0.8, -size * 1.1, size * 0.6, -size * 0.4, 0, 0);
      context.closePath();

      // Soft blossom gradient fill
      const grad = context.createLinearGradient(0, -size * 1.4, 0, 0);
      grad.addColorStop(0, color.fill);
      grad.addColorStop(1, 'rgba(255, 241, 242, 0.4)');

      context.fillStyle = grad;
      context.fill();

      context.lineWidth = 0.5;
      context.strokeStyle = color.stroke;
      context.stroke();

      context.restore();
    };

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Horizontal sway calculation
        const sway = Math.sin(time * p.swayFrequency + p.swayOffset) * p.swayAmplitude * 0.05;
        p.x += p.speedX + sway;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.flipAngle += p.flipSpeed;

        // Interaction with mouse: gentle breeze repulsion
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 3;
            p.y += (dy / dist) * force * 1.5;
          }
        }

        // Draw the petal
        drawSakuraPetal(
          ctx,
          p.x,
          p.y,
          p.size,
          p.rotation,
          p.flipAngle,
          petalColors[p.colorType],
          p.opacity
        );

        // Reset petal when it drifts off screen
        if (p.y > height + 50 || p.x > width + 100) {
          petals[i] = createPetal(-30);
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [enabled, intensity]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-80"
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    />
  );
};
