import { useEffect, type CSSProperties } from "react";
import { HORIZON_FRAC, NodeWaveHero, type HeroPalette } from "../components/NodeWaveHero.js";
import styles from "./WireframeHome.module.css";
import { Methodology } from "../components/methodology/Methodology.js";
import { Appendix } from "../components/appendix/Appendix.js";
import { Takeaways } from "../components/Takeaways.js";
import { OldDashboard } from "./OldDashboard.js";
import lockupUrl from "../assets/fai-lockup-black.svg";

/**
 * Home page. The opening is a poster: a flat Celestial Blue sky over a Cod Gray
 * sea, split where the WebGL horizon lands (the background and the hero share
 * HORIZON_FRAC). Two Schmalfette words pivot on that horizon: the name stands
 * upright in the sea along the left gutter, and the headline rests on the
 * horizon from its top corner. The reading voice starts below, on Smoke White.
 */

/** Cod Gray sea; wires and node in Smoke White; the far sea hazes a little toward the sky. */
const HERO_PALETTE: HeroPalette = {
  sea: [0.071, 0.071, 0.071, 1],
  haze: [0.192, 0.357, 0.478],     // Celestial Blue 55% over Cod Gray
  wire: [0.953, 0.953, 0.953, 0.36],
  node: [0.953, 0.953, 0.953, 0.9],
};

export function WireframeHome() {
  const pageStyle = { "--horizon": `${HORIZON_FRAC * 100}%`, "--horizon-frac": HORIZON_FRAC } as CSSProperties;

  // React renders the target after initial navigation, including legacy /old links.
  useEffect(() => {
    if (["#dashboard", "#appendix"].includes(window.location.hash)) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "instant" });
    }
  }, []);

  return (
    <div className={styles.page} style={pageStyle}>
      <section className={styles.hero} aria-label="Panthalassa wave power">
        <NodeWaveHero className={styles.canvas} palette={HERO_PALETTE} />

        {/* Two words, one corner at the horizon: the name rises out of the sea,
            the headline sits on the water line beside it. Nothing overlaps. */}
        <p className={styles.brandWord}>Panthalassa</p>
        <div className={styles.title}>
          <p className={styles.headline}>Wave Power</p>
        </div>
      </section>

      <section className={styles.intro} aria-labelledby="page-title">
        <div className={styles.introHead}>
          <h1 id="page-title" className={styles.pageTitle}>Can the Ocean Power AI?</h1>
          <p className={styles.heroSubtitle}>
            Modeling the cost and reliability of wave-powered data centers, and how they compare with data centers on land.
          </p>
        </div>
        <div className={styles.copy}>
          <p className={styles.lead}><strong>Yes it can and, done right, it would be cheaper than building data centers on land.</strong></p>
          <p>This work models one approach to harnessing wave energy put forward by the startup <strong>Panthalassa</strong>, which would place floating power plants far offshore in the South Pacific, and compares this to a range of land-based behind-the-meter alternatives. While Panthalassa’s approach poses significant operational challenges, <strong>my model finds that these challenges are likely surmountable.</strong></p>
          <p>You can go straight to the dashboard, where you can change my default assumptions, but since few of us have any physical intuition for ocean data centers, <strong>I strongly encourage you to first read my short explanation of how Panthalassa operates and how my model works.</strong></p>
          <a href="#dashboard" className={styles.cta}>
            Skip the explanation
            <span aria-hidden="true">&darr;</span>
          </a>
        </div>
      </section>

      <Methodology />
      <section id="dashboard" className={styles.dashboard} aria-labelledby="model-heading" tabIndex={-1}>
        <h2 id="model-heading" className={styles.dashHead}>Now, make the model yours</h2>
        <OldDashboard />
      </section>
      <Takeaways />
      <Appendix />
      <footer className={styles.footer}>
        <a className={styles.lockup} href="https://www.thefai.org" aria-label="Foundation for American Innovation">
          <img src={lockupUrl} alt="" width="217" height="48" />
        </a>
      </footer>
    </div>
  );
}
