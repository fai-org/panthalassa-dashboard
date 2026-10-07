import { useEffect, useRef, useState } from 'react';
import { nodeVertices } from './nodeGeometry.js';
import { FAILURES } from './storyData.js';
import type { FailureSceneController } from './failureSceneRenderer.js';
import styles from './Methodology.module.css';

export function FailureScene() {
  const mount = useRef<HTMLDivElement>(null);
  const controller = useRef<FailureSceneController | null>(null);
  const [mode, setMode] = useState(0);
  const [paused, setPaused] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const pausedRef = useRef(paused);
  const modeRef = useRef(mode);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const target = mount.current;
    if (!target) return;
    let cancelled = false;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      void import('./failureSceneRenderer.js').then(({ createFailureScene }) => {
        if (cancelled) return;
        const selected = modeRef.current;
        controller.current = createFailureScene(target, nodeVertices(), value => {
          modeRef.current = value;
          setMode(value);
        }, pausedRef.current);
        controller.current.select(selected);
      }).catch(() => { if (!cancelled) setUnavailable(true); });
    }, { rootMargin: '300px' });
    observer.observe(target);
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => {
      pausedRef.current = mq.matches;
      setPaused(mq.matches);
      controller.current?.setPaused(mq.matches);
    };
    mq.addEventListener('change', onMotionChange);
    return () => {
      cancelled = true;
      observer.disconnect();
      mq.removeEventListener('change', onMotionChange);
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);

  function pause(value: boolean) {
    pausedRef.current = value;
    setPaused(value);
    controller.current?.setPaused(value);
  }
  function select(offset: number) {
    pause(true);
    const value = (mode + offset + FAILURES.length) % FAILURES.length;
    modeRef.current = value;
    setMode(value);
    controller.current?.select(value);
  }
  const [title, body] = FAILURES[mode]!;
  return <figure className={styles.failureFigure}>
    <div ref={mount} className={styles.failureCircle} role="img" aria-label={`Illustrative ocean scene: ${title}. A node communicates via satellite; return journeys and losses are shown schematically, not to scale.`}>
      {unavailable && <span className={styles.failureFallback}>3D animation unavailable. Use the controls below to read each failure mode.</span>}
    </div>
    <figcaption className={styles.failureCaption} aria-live={paused ? 'polite' : 'off'} aria-atomic="true">
      <h3>{title}</h3>
      <p>{body}</p>
    </figcaption>
    <div className={styles.failureControls}>
      <button type="button" onClick={() => select(-1)} aria-label="Previous failure mode">Previous</button>
      <span>{mode + 1} / {FAILURES.length}</span>
      <button type="button" onClick={() => select(1)} aria-label="Next failure mode">Next</button>
      {!unavailable && <button type="button" onClick={() => pause(!paused)}>{paused ? 'Play animation' : 'Pause animation'}</button>}
    </div>
  </figure>;
}
