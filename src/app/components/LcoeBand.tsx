import type { ModelResult } from "../../model/index.js";
import { formatUsdPerUnit } from "../lib/formatters.js";
import styles from "./LcoeBand.module.css";

interface Props {
  result: ModelResult;
}

/** Panthalassa's power-system LCOE, paired in its own row with the land-based figure (TerrestrialLcoeBand). */
export function LcoeBand({ result }: Props) {
  return (
    <section className={`card ${styles.card}`}>
      <h4 className={styles.title}>Power-system LCOE</h4>
      <p className={`${styles.value} num`}>
        {formatUsdPerUnit(result.lcoe.lcoe_usd_per_mwh, 2)}
        <span className={styles.unit}>/MWh</span>
      </p>
      <p className={styles.sub}>Compute-agnostic, over the node's economic life.</p>
    </section>
  );
}
