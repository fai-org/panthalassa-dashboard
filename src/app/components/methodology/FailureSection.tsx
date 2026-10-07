import { FailureScene } from './FailureScene.js';
import styles from './Methodology.module.css';

/** A self-contained animation beside the failure calculation explanation. */
export function FailureSection() {
  return <section id="failures" className={styles.failureSection} aria-labelledby="failure-heading">
    <FailureScene />
    <div className={styles.failureCopy}>
    <div className={styles.failureIntro}>
      <h2 id="failure-heading">Account for failures</h2>
      <p>Output lost from failures that cause unexpected downtime, maintenance, or even total node loss is then subtracted from the scheduled output calculated in the previous step.</p>
      <p>The model aggregates the 4 kinds of non-chip-related failure outcomes (mentioned in the animation) into a single overall failure rate. The failure modes are combined according to fixed probability weights. It then multiplies each outcome’s expected number of incidents by the computing contribution lost per incident, and adds those losses together.</p>
    </div>
    <aside className={styles.failureAssumptions} aria-labelledby="failure-assumptions-heading">
      <h3 id="failure-assumptions-heading">Where the failure assumptions come from</h3>
      <p>The assumed mix of outcomes is informed by maritime incident data, rather than measured Panthalassa fleet performance. Exact outcome probabilities, sources, and calculation details are provided in the appendix.</p>
    </aside>
    </div>
  </section>;
}
