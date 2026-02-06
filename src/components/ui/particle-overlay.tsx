'use client';

import { useEffect, useRef } from 'react';

type DriftParticle = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  baseAngle: number;
  speed: number;
  wobble: number;
  wobbleSpeed: number;
  wobbleStrength: number;
  color: string;
};

type ParticleLayers = {
  normal: DriftParticle[];
  soft: DriftParticle[];
};

const RIGHT_UP = -Math.PI / 4;
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const normalColors = [
  'rgba(120, 200, 255, 0.85)',
  'rgba(160, 140, 255, 0.85)',
  'rgba(120, 255, 210, 0.85)',
  'rgba(255, 200, 140, 0.8)',
];

const createDriftParticles = (
  count: number,
  width: number,
  height: number,
  options: {
    speedRange: [number, number];
    radiusRange: [number, number];
    opacityRange: [number, number];
    wobbleStrength: number;
    wobbleSpeedRange: [number, number];
    colors: string[];
  },
): DriftParticle[] =>
  Array.from({ length: count }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: rand(options.radiusRange[0], options.radiusRange[1]),
    opacity: rand(options.opacityRange[0], options.opacityRange[1]),
    baseAngle: RIGHT_UP + rand(-0.5, 0.3),
    speed: rand(options.speedRange[0], options.speedRange[1]),
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: rand(options.wobbleSpeedRange[0], options.wobbleSpeedRange[1]),
    wobbleStrength: options.wobbleStrength,
    color: options.colors[Math.floor(Math.random() * options.colors.length)],
  }));

export default function ParticleOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const layersRef = useRef<ParticleLayers>({ normal: [], soft: [] });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const setup = () => {
      const { innerWidth, innerHeight, devicePixelRatio } = window;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = innerWidth * innerHeight;
      const baseCount = Math.min(130, Math.max(80, Math.floor(area / 12000)));
      const normalCount = Math.floor(baseCount * 0.65);
      const softCount = Math.floor(baseCount * 0.35);

      layersRef.current = {
        normal: createDriftParticles(normalCount, innerWidth, innerHeight, {
          speedRange: [0.45, 0.9],
          radiusRange: [0.9, 1.6],
          opacityRange: [0.25, 0.6],
          wobbleStrength: 0.5,
          wobbleSpeedRange: [0.01, 0.03],
          colors: normalColors,
        }),
        soft: createDriftParticles(softCount, innerWidth, innerHeight, {
          speedRange: [0.2, 0.45],
          radiusRange: [1.5, 2.6],
          opacityRange: [0.08, 0.22],
          wobbleStrength: 0.25,
          wobbleSpeedRange: [0.005, 0.02],
          colors: ['rgba(255,255,255,0.5)'],
        }),
      };
    };

    const draw = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, width, height);

      // Layer 1: normal glow particles
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      layersRef.current.normal.forEach((p) => {
        p.wobble += p.wobbleSpeed;
        const angle = p.baseAngle + Math.sin(p.wobble) * p.wobbleStrength;
        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;

        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
      });
      ctx.restore();

      // Layer 2: soft large particles
      layersRef.current.soft.forEach((p) => {
        p.wobble += p.wobbleSpeed;
        const angle = p.baseAngle + Math.sin(p.wobble) * p.wobbleStrength;
        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;

        if (p.x > width + 30) p.x = -30;
        if (p.x < -30) p.x = width + 30;
        if (p.y < -30) p.y = height + 30;
        if (p.y > height + 30) p.y = -30;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(draw);
    };

    setup();
    frameRef.current = requestAnimationFrame(draw);
    const handleResize = () => setup();
    window.addEventListener('resize', handleResize);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-40 pointer-events-none"
    />
  );
}
