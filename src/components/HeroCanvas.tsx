'use client';

import React, { useEffect, useRef } from 'react';

export const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const stages = [
      { name: 'IDEA', angle: -Math.PI * 0.75, radiusRatio: 0.36, desc: 'Uncertainty & Assumptions' },
      { name: 'PROTOTYPE', angle: -Math.PI * 0.35, radiusRatio: 0.38, desc: 'Interactive Artifact' },
      { name: 'USERS', angle: 0.05, radiusRatio: 0.40, desc: 'Real Interaction' },
      { name: 'EVIDENCE', angle: Math.PI * 0.42, radiusRatio: 0.38, desc: 'Behavior & Feedback' },
      { name: 'DECISION', angle: Math.PI * 0.85, radiusRatio: 0.35, desc: 'Direction & Proof' },
    ];

    interface Particle {
      progress: number;
      speed: number;
      stageIndex: number;
      size: number;
      alpha: number;
    }

    const particles: Particle[] = Array.from({ length: 48 }, () => ({
      progress: Math.random(),
      speed: 0.0006 + Math.random() * 0.0008,
      stageIndex: Math.floor(Math.random() * 4),
      size: 1 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.5,
    }));

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    handleResize();

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.min(width, height) * 0.46;

      // 1. Concentric Radial Measurement Rings
      const ringSteps = [0.25, 0.5, 0.75, 1.0];
      ringSteps.forEach((step, idx) => {
        const r = maxRadius * step;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === ringSteps.length - 1 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        if (idx % 2 === 1) {
          ctx.setLineDash([4, 6]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Measurement ticks along outer ring
        if (idx === ringSteps.length - 1) {
          for (let deg = 0; deg < 360; deg += 15) {
            const rad = (deg * Math.PI) / 180;
            const x1 = cx + Math.cos(rad) * (r - (deg % 30 === 0 ? 8 : 4));
            const y1 = cy + Math.sin(rad) * (r - (deg % 30 === 0 ? 8 : 4));
            const x2 = cx + Math.cos(rad) * r;
            const y2 = cy + Math.sin(rad) * r;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.stroke();
          }
        }
      });

      // 2. Crosshair Axes
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius * 1.05, cy);
      ctx.lineTo(cx + maxRadius * 1.05, cy);
      ctx.moveTo(cx, cy - maxRadius * 1.05);
      ctx.lineTo(cx, cy + maxRadius * 1.05);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.stroke();

      // 3. Central Core Coordinate Indicator
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Pulsing central beacon
      const pulse = (Math.sin(time * 1.5) + 1) * 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 14 + pulse * 6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + pulse * 0.1})`;
      ctx.stroke();

      // 4. Milestone Nodes & Primary Evidence Arc
      const nodePositions = stages.map((stage, i) => {
        // Slight subtle breathing motion
        const wobble = Math.sin(time + i * 1.2) * 4;
        const r = maxRadius * stage.radiusRatio + wobble;
        return {
          x: cx + Math.cos(stage.angle) * r,
          y: cy + Math.sin(stage.angle) * r,
          ...stage,
        };
      });

      // Connecting Evidence Path
      ctx.beginPath();
      nodePositions.forEach((pos, i) => {
        if (i === 0) ctx.moveTo(pos.x, pos.y);
        else ctx.lineTo(pos.x, pos.y);
      });
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 5. Data Flow Particles along the Evidence Path
      particles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          p.stageIndex = (p.stageIndex + 1) % (nodePositions.length - 1);
        }

        const startNode = nodePositions[p.stageIndex];
        const endNode = nodePositions[p.stageIndex + 1];
        if (!startNode || !endNode) return;

        const px = startNode.x + (endNode.x - startNode.x) * p.progress;
        const py = startNode.y + (endNode.y - startNode.y) * p.progress;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      });

      // 6. Draw Milestone Nodes & Technical Labels
      nodePositions.forEach((node, i) => {
        const distToMouse = Math.hypot(mouseX - node.x, mouseY - node.y);
        const isHovered = distToMouse < 45;

        // Outer glow on hover
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 22, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.fill();
        }

        // Concentric node border
        ctx.beginPath();
        ctx.arc(node.x, node.y, isHovered ? 8 : 5, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#ffffff' : '#050505';
        ctx.fill();
        ctx.strokeStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Node Stage Label
        ctx.font = '600 11px var(--font-mono)';
        ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.75)';
        ctx.letterSpacing = '1.5px';
        ctx.textAlign = 'center';
        
        const labelY = node.y + (node.y > cy ? 22 : -16);
        ctx.fillText(`0${i + 1} // ${node.name}`, node.x, labelY);

        // Technical Sub-coordinate telemetry on hover or active
        if (isHovered) {
          ctx.font = '400 9px var(--font-mono)';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.fillText(node.desc, node.x, labelY + (node.y > cy ? 14 : -12));
        }
      });

      // Subtle architectural watermark at bottom corner of canvas
      ctx.font = '400 9px var(--font-mono)';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.textAlign = 'right';
      ctx.fillText('COORD_SYS: RADIAL_EVIDENCE_MAP // V1.0', width - 20, height - 16);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '520px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
};
