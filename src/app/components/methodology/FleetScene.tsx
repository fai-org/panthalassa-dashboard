import { useEffect, useRef } from 'react';
import { nodeVertices } from './nodeGeometry.js';
import styles from './Methodology.module.css';
import { SEA_800, smoke } from './palette.js';

const vertices = nodeVertices();
/** Approved fleet scene: one zoom, with continuing ripples and manual replay. */
export function FleetScene() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const canvas = root.querySelector('canvas')!;
    const label = root.querySelector('span')!;
    const replay = root.querySelector('button')!;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;
  const project=(x: number,y: number,z=62): [number,number]=>[x*.8-y*.6,(x*.6+y*.8)*.966-(z-62)*.259];
  const above=new Path2D(),below=new Path2D();
  for(let i=0;i<vertices.length;i+=6){
    const a=project(vertices[i]!,vertices[i+1]!,vertices[i+2]!);
    const b=project(vertices[i+3]!,vertices[i+4]!,vertices[i+5]!);
    const path=(vertices[i+2]!+vertices[i+5]!)/2>=61?above:below;
    path.moveTo(...a);path.lineTo(...b);
  }
  const nodes: { x: number; y: number; phase: number; center: boolean }[]=[];
  for(let row=-4;row<=4;row++)for(let col=-4;col<=4;col++){
    const center=row===0&&col===0;
    nodes.push({x:center?0:col*140+Math.sin(row*7+col*3)*17,y:center?0:row*140+Math.cos(row*4-col*8)*17,phase:row*1.3+col*.8,center});
  }
  function draw(progress: number,time=0){
    const side=Math.min(1100,Math.max(500,(canvas.clientWidth||440)*(typeof devicePixelRatio==='number'?devicePixelRatio:1)));
    if(canvas.width!==side)canvas.width=canvas.height=side;
    ctx.setTransform(side/500,0,0,side/500,0,0);
    ctx.fillStyle=SEA_800;ctx.fillRect(0,0,500,500);
    const span=44*Math.pow(780/44,progress),scale=500/span;
    // The scene is fixed in world space: only the camera magnification changes.
    const cy=229+progress*21;
    const phase=time/2000*Math.PI*2;
    ctx.save();ctx.translate(250,cy);ctx.scale(scale,scale);
    const bound=span*.9;
    // Travelling curved crests and soft shaded shoulders make the surface readable.
    for(let y=Math.floor(-bound/10)*10;y<bound;y+=10){
      ctx.beginPath();
      for(let j=0;j<=90;j++){
        const x=-bound+j*2*bound/90;
        const ripple=2.3*Math.sin(x*.095-phase+y*.08)+.8*Math.sin(x*.19+phase*2+y*.14);
        const point=project(x,y+ripple,62+.75*Math.sin(x*.095-phase+y*.08));
        if(j===0)ctx.moveTo(...point);else ctx.lineTo(...point);
      }
      ctx.strokeStyle=smoke(.05);ctx.lineWidth=5/scale;ctx.stroke();
      ctx.strokeStyle=smoke(.22);ctx.lineWidth=.9/scale;ctx.stroke();
    }
    for(const n of nodes){
      const [x,y]=project(n.x,n.y);
      if(Math.abs(x*scale)>300||Math.abs(y*scale)>330)continue;
      const bob=Math.sin(phase+n.phase)*.75;
      ctx.save();ctx.translate(x,y-bob);
      // Submerged geometry remains faint; the float catches the light.
      ctx.strokeStyle=smoke(.18);ctx.lineWidth=.65/scale;ctx.stroke(below);
      ctx.fillStyle=smoke(.06);ctx.beginPath();ctx.ellipse(0,-.6,5.5,5.5*.966,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=n.center?smoke(.9):smoke(.72);ctx.lineWidth=.72/scale;ctx.stroke(above);
      ctx.restore();
    }
    ctx.restore();
    label.textContent=progress<.42?'One node':'A fleet of nodes';
  }
  const mq=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,elapsed=0,last=0,visible=false;
  const smooth=(x: number)=>x*x*(3-2*x);
  function tick(now: number){
    frame=0;
    if(!visible||document.hidden||mq.matches)return;
    if(last)elapsed+=Math.min(now-last,100);
    last=now;
    const p=smooth(Math.max(0,Math.min(1,(elapsed-1400)/4700)));
    draw(p,elapsed);
    frame=requestAnimationFrame(tick);
  }
  function start(){if(!frame&&visible&&!document.hidden&&!mq.matches){last=0;frame=requestAnimationFrame(tick);}}
  function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
  function reset(){stop();elapsed=0;draw(mq.matches?1:0);start();}
  replay.addEventListener('click',reset);
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting ?? false;if(visible)start();else stop();},{threshold:.35});observer.observe(canvas);
  const resize=new ResizeObserver(()=>draw(mq.matches?1:smooth(Math.max(0,Math.min(1,(elapsed-1400)/4700))),elapsed));resize.observe(canvas);
  const visibilityChange=()=>{if(document.hidden)stop();else start();};
  document.addEventListener('visibilitychange',visibilityChange);
  const motionChange=()=>{replay.hidden=mq.matches;reset();};
  mq.addEventListener('change',motionChange);
  replay.hidden=mq.matches;draw(mq.matches?1:0);
    return () => {
      stop(); observer.disconnect(); resize.disconnect();
      replay.removeEventListener('click',reset);
      document.removeEventListener('visibilitychange',visibilityChange);
      mq.removeEventListener('change',motionChange);
    };
  }, []);
  return <figure ref={ref} className={styles.fleetFigure}>
    <div className={styles.fleetCircle}>
      <canvas width="900" height="900" role="img" aria-label="Bird’s-eye view of the existing node geometry. The camera pulls back from one node to reveal widely spaced nodes across open water. The layout is illustrative, not a modeled deployment arrangement." />
      <span className={styles.fleetSceneLabel}>One node</span>
    </div>
    <figcaption>Illustrative spacing · not a deployment layout</figcaption>
    <button type="button" className={styles.fleetReplay}>Replay zoom</button>
  </figure>;
}
