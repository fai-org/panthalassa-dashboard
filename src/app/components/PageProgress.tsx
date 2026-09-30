import { useEffect, useRef, useState } from "react";
import styles from "./PageProgress.module.css";

const chapters = [
  ["intro", "Intro"],
  ["methodology", "Explanation"],
  ["dashboard", "Dashboard"],
  ["takeaways", "Takeaways"],
  ["appendix", "Appendix"],
] as const;

type Tone = "sky" | "sea" | "paper";

export function PageProgress({ heroHorizon }: { heroHorizon: number }) {
  const nav = useRef<HTMLElement>(null);
  const [position, setPosition] = useState<{ index: number; fraction: number; tone: Tone }>({ index: 0, fraction: 0, tone: "sky" });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = chapters.map(([id]) => document.getElementById(id)?.getBoundingClientRect());
      if (bounds.some(bound => !bound)) return;
      const barHeight = nav.current?.getBoundingClientRect().height ?? 50;
      const anchor = barHeight + 15;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      let index = 0;
      bounds.forEach((bound, i) => { if (bound!.top <= anchor) index = i; });
      const atEnd = window.scrollY >= maxScroll - 2;
      if (atEnd) index = chapters.length - 1;
      const start = bounds[index]!.top;
      const end = bounds[index + 1]?.top ?? maxScroll - window.scrollY + anchor;
      const fraction = atEnd ? 1 : Math.max(0, Math.min(1, (anchor - start) / Math.max(1, end - start)));
      // Follow the surface behind the bar: clear while the poster's sky fills it, dark while
      // any of the sea is under it, Smoke White once the reading has taken over. The sea
      // canvas draws its horizon at heroHorizon of its own height.
      const hero = bounds[0]!;
      const sea = document.querySelector(`#${chapters[0][0]} canvas`)?.getBoundingClientRect() ?? hero;
      const overHero = hero.top < barHeight && hero.bottom > 0;
      const overSky = overHero && sea.top + sea.height * heroHorizon > barHeight;
      const tone: Tone = overSky ? "sky" : overHero ? "sea" : "paper";
      setPosition(previous => previous.index === index && previous.tone === tone &&
        Math.abs(previous.fraction - fraction) < 0.001 ? previous : { index, fraction, tone });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [heroHorizon]);

  return <nav ref={nav} className={`${styles.bar} ${styles[position.tone]}`} aria-label="Page sections">
    <ol className={styles.chapters}>{chapters.map(([id, label], index) => <li key={id}>
      <a href={`#${id}`} aria-current={index === position.index ? "location" : undefined}>
        <span>{label}</span>
        <span className={styles.track} aria-hidden="true"><span style={{
          transform: `scaleX(${index < position.index ? 1 : index === position.index ? position.fraction : 0})`,
        }} /></span>
      </a>
    </li>)}</ol>
  </nav>;
}
