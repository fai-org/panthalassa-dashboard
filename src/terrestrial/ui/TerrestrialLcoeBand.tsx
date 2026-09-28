import type { TerrestrialModelResult } from "../model/types.js";
import { formatUsdPerUnit } from "../../app/lib/formatters.js";
import styles from "../../app/components/LcoeBand.module.css";

interface Props {
  result: TerrestrialModelResult;
}

/** The land-based power-system LCOE, set like LcoeBand so the pair reads identically. */
export function TerrestrialLcoeBand({ result }: Props) {
  return (
    <section className={`card ${styles.card}`}>
      <h4 className={styles.title}>Power-system LCOE</h4>
      <p className={`${styles.value} num`}>
        {formatUsdPerUnit(result.lcoe.lcoe_usd_per_mwh, 2)}
        <span className={styles.unit}>/MWh</span>
      </p>
      <p className={styles.sub}>Generation-only, over the power system's economic life.</p>
    </section>
  );
}
