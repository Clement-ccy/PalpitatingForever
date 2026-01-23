'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, RefreshCw, Maximize2, Terminal } from 'lucide-react';

export default function LabPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useState({
    particleCount: 100,
    speed: 1.5,
    connectionRadius: 100,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];
    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / (15000 / params.speed)); // Adjust density based on "speed" mainly to show reactivity
      for (let i = 0; i < params.particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * params.speed,
          vy: (Math.random() - 0.5) * params.speed,
          radius: Math.random() * 2 + 1,
          color: `rgba(${Math.random() * 200 + 55}, ${Math.random() * 255}, 255, ${Math.random() * 0.5 + 0.1})`
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(180, 126, 126, 0)'; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Mouse interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist/150})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [params]);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden text-foreground">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 block w-full h-full" />
      
      {/* UI Overlay */}
      <div className="absolute top-24 left-4 md:left-8 z-10 pointer-events-none">
         <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-1"
         >
             <div className="flex items-center gap-2 text-accent-foreground font-mono text-xs uppercase tracking-widest mb-2">
                 <Terminal size={12} />
                 <span>Experiment_001.tsx</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter mix-blend-difference">
                 Particle<br />Systems
             </h1>
         </motion.div>
      </div>

      {/* Controls Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-24 right-4 md:right-8 z-20 w-64 bg-card/50 backdrop-blur-xl border border-card-border rounded-xl p-4"
      >
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-card-border">
              <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <Sliders size={14} />
                  <span>Parameters</span>
              </div>
              <RefreshCw size={12} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
          </div>

          <div className="space-y-4">
              <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground flex justify-between">
                      <span>Count</span>
                      <span>{params.particleCount}</span>
                  </label>
                  <input 
                    type="range" 
                    min="50" 
                    max="300" 
                    value={params.particleCount}
                    onChange={(e) => setParams({...params, particleCount: parseInt(e.target.value)})}
                    className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-foreground"
                   />
              </div>

               <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground flex justify-between">
                      <span>Velocity</span>
                      <span>{params.speed}x</span>
                  </label>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="5" 
                    step="0.1"
                    value={params.speed}
                    onChange={(e) => setParams({...params, speed: parseFloat(e.target.value)})}
                    className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                   />
              </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-card-border flex justify-end">
              <button title="Full Screen" className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                  <Maximize2 size={14} />
              </button>
          </div>
      </motion.div>

      <div className="absolute bottom-8 left-4 md:left-8 right-4 md:right-8 flex justify-between items-end pointer-events-none text-muted-foreground/20 font-mono text-xs">
          <div>
              COORD: 104.22, 99.31<br />
              FPS: 60
          </div>
          <div className="text-right">
              STATUS: RUNNING<br />
              RENDERER: CANVAS_2D
          </div>
      </div>
    </div>
  );
}
