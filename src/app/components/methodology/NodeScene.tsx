import { useEffect, useRef } from 'react';
import { nodeVertices } from './nodeGeometry.js';
import { sampleSurface } from '../../lib/gerstner.js';
import { ORANGE, INK, SMOKE, smoke } from './palette.js';

const vertices = nodeVertices();
/** Perspective wireframe view of the repository's exact node geometry. */
export function NodeScene({ waves, still = false }: { waves: boolean; still?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, visible = true;
    const observer = new IntersectionObserver(e => { visible = e[0]?.isIntersecting ?? false; });
    observer.observe(canvas);
    function draw(time: number) {
      if (!canvas || !ctx) return;
      const side = Math.min(1000, Math.max(500, canvas.clientWidth * devicePixelRatio));
      if (canvas.width !== side) canvas.width = canvas.height = side;
      ctx.setTransform(side / 500, 0, 0, side / 500, 0, 0);
      ctx.clearRect(0, 0, 500, 500);
      ctx.fillStyle = INK; ctx.fillRect(0, 0, 500, 500);
      const t = waves && !still && !media.matches ? time / 1000 : 0;
      const swell = waves ? sampleSurface(0, 0, t).height * 1.6 : 0;
      const project = (x: number, y: number, z: number) => {
        const horizontal = x * .82 - y * .57;
        const depth = x * .57 + y * .82;
        const scale = 230 / (230 + depth);
        return [250 + horizontal * 5.4 * scale, 422 - z * 5.4 * scale + depth * .55];
      };
      // Perspective water grid; mean surface is fixed and swells travel through it.
      ctx.lineWidth = .65;
      for (let y = -100; y <= 130; y += 10) {
        ctx.beginPath();
        for (let x = -110; x <= 110; x += 2) {
          const z = 62 + (waves ? sampleSurface(x, y, t).height * 1.6 : 0);
          const p = project(x, y, z);
          if (x === -110) ctx.moveTo(p[0]!, p[1]!); else ctx.lineTo(p[0]!, p[1]!);
        }
        ctx.strokeStyle = smoke(y < 0 ? .2 : .1); ctx.stroke();
      }
      for (let x = -90; x <= 90; x += 12) {
        ctx.beginPath();
        for (let y = -90; y <= 100; y += 3) {
          const p = project(x, y, 62 + (waves ? sampleSurface(x,y,t).height * 1.6 : 0));
          if (y === -90) ctx.moveTo(p[0]!,p[1]!); else ctx.lineTo(p[0]!,p[1]!);
        }
        ctx.strokeStyle = smoke(.08); ctx.stroke();
      }
      ctx.lineWidth = .8;
      for (let i = 0; i < vertices.length; i += 6) {
        const a = project(vertices[i]!, vertices[i+1]!, vertices[i+2]! + swell);
        const b = project(vertices[i+3]!, vertices[i+4]!, vertices[i+5]! + swell);
        const depth = (vertices[i+1]! + vertices[i+4]!) / 2;
        ctx.strokeStyle = depth > 0 ? smoke(.3) : smoke(.8);
        ctx.beginPath(); ctx.moveTo(a[0]!,a[1]!); ctx.lineTo(b[0]!,b[1]!); ctx.stroke();
      }
      ctx.font = `${11 * Math.max(1,500/Math.max(280,canvas.clientWidth))}px 'IBM Plex Sans', system-ui, sans-serif`; ctx.fillStyle = SMOKE;
      if (waves) {
        ctx.fillText('Diameter', 308, 163);
        ctx.strokeStyle = ORANGE; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(222,139);ctx.lineTo(278,139);ctx.moveTo(222,135);ctx.lineTo(222,143);ctx.moveTo(278,135);ctx.lineTo(278,143);ctx.stroke();
      }
    }
    const loop = (t: number) => { if (visible) draw(t); frame = requestAnimationFrame(loop); };
    const resize = new ResizeObserver(() => draw(performance.now())); resize.observe(canvas);
    draw(0); frame = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect(); };
  }, [waves, still]);
  return <canvas ref={ref} style={{ width: '100%', display: 'block' }} role="img" aria-label={waves ? 'The original node geometry, floating upright as smooth waves pass; most of its spar is underwater.' : 'The original node geometry upright, with most of its spar underwater.'} />;
}
