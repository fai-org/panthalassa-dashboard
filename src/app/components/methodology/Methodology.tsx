import { useEffect, useRef, useState } from 'react';
import { STEPS, type VisualState } from './storyData.js';
import { NodeScene } from './NodeScene.js';
import { SeaMap } from './SeaMap.js';
import { PowerChart } from './PowerChart.js';
import { FailureSection } from './FailureSection.js';
import { CostSection } from './CostSection.js';
import styles from './Methodology.module.css';

function Visual({ state, active = true, still = false }: {state: VisualState; active?: boolean; still?: boolean}) {
  const chart = ['resource','capacity','battery'].includes(state);
  const node = state === 'node' || state === 'waves';
  return <div className={`${styles.visual} ${chart ? styles.wideVisual : ''}`}>
    {chart ? <PowerChart key={state} state={state} active={active} still={still}/> : <>
      <div className={styles.circle}>
        <div className={styles.visualTransition} key={node ? 'node' : 'map'}>
          {node ? <NodeScene waves={state==='waves'} still={still}/> : <SeaMap state={state}/>}
        </div>
      </div>
      {!node && <div className={styles.visualCaption}>
        <span>{state === 'geography' ? 'The wave resource' : state === 'outbound' ? 'Outbound journey' : 'Return & maintenance'}</span><span>{state === 'geography' ? 'Model reference location · Natural Earth basemap' : 'Illustrative route · model reference location'}</span>
      </div>}
    </>}
  </div>;
}

export function Methodology({ preview = false }: {preview?: boolean}) {
  const host = useRef<HTMLElement>(null);
  const [active,setActive] = useState(0);
  const [compact,setCompact] = useState(false);
  const [reduced,setReduced] = useState(false);

  useEffect(() => {
    const el = host.current; if (!el) return;
    const ro = new ResizeObserver(e => setCompact(e[0]!.contentRect.width < 720)); ro.observe(el);
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches); update(); mq.addEventListener('change',update);
    return () => { ro.disconnect(); mq.removeEventListener('change',update); };
  },[]);

  useEffect(() => {
    const el = host.current; if (!el) return;
    const scroller = el.closest('[data-prototype-scroll]') as HTMLElement | null;
    const scrollTarget: HTMLElement | Window = scroller || window;
    let pending = 0;
    const update = () => {
      pending = 0;
      const bounds = scroller?.getBoundingClientRect();
      const top = bounds?.top || 0, height = scroller?.clientHeight || window.innerHeight;
      const anchor = top + height*.43;
      const nodes = Array.from(el.querySelectorAll<HTMLElement>('[data-story-step]'));
      let index = 0;
      for (let i=0; i<nodes.length; i++) if(nodes[i]!.getBoundingClientRect().top <= anchor) index=i;
      setActive(index);
    };
    const onScroll = () => { if(!pending) pending=requestAnimationFrame(update); };
    scrollTarget.addEventListener('scroll',onScroll,{passive:true}); window.addEventListener('resize',onScroll); update();
    return () => { scrollTarget.removeEventListener('scroll',onScroll); window.removeEventListener('resize',onScroll); cancelAnimationFrame(pending); };
  },[]);

  const inline = compact || reduced;
  return <section ref={host} className={styles.methodology} id="methodology" aria-labelledby="methodology-heading">
    <header className={styles.sectionHead}>
      <h2 id="methodology-heading">How the model works</h2>
    </header>
    <div className={`${styles.story} ${inline ? styles.inlineStory : ''}`}>
      {!inline && <aside className={styles.stickyVisual} aria-label="Illustration accompanying the current explanation"><Visual state={STEPS[active]!.visual}/></aside>}
      <div className={styles.copyColumn}>
        {STEPS.map((step,index)=><article key={step.id} id={step.id} data-story-step={index} className={styles.step}>
          <h3>{step.title}</h3>
          <div className={styles.paragraphs}>{step.paragraphs.map(p=><p key={p.slice(0,24)}>{p.split(/(\*\*.+?\*\*)/g).map((part,i)=>part.startsWith('**') ? <strong key={i}>{part.slice(2,-2)}</strong> : part)}</p>)}</div>
          {inline && <Visual state={step.visual} active={index === active} still={reduced}/>}
          {(step.notes ?? (step.note ? [step.note] : [])).map(note => <aside key={note.title} className={styles.note}><h4>{note.title}</h4><p>{note.body}</p></aside>)}
        </article>)}
      </div>
    </div>
    <FailureSection />
    <CostSection />
    {preview && <p className={styles.previewFoot}>Local design preview · tour and appendix are not included in this prototype.</p>}
  </section>;
}
