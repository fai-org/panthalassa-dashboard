import { useEffect, useMemo, useRef, useState } from "react";
import { useModel } from "../hooks/useModel.js";
import { SliderPanel } from "../components/SliderPanel.js";
import { SharedInputsPanel } from "../components/SharedInputsPanel.js";
import { ComparisonVerdict } from "../components/ComparisonVerdict.js";
import { LcoeBand } from "../components/LcoeBand.js";
import { ResultsHeader } from "../components/ResultsHeader.js";
import { CostBreakdown } from "../components/CostBreakdown.js";
import { BaselineComparison } from "../components/BaselineComparison.js";
import { ArchitectureComparison } from "../components/ArchitectureComparison.js";
import { CostPerWattBreakdown } from "../components/CostPerWattBreakdown.js";
import {
  DEFAULT_TERRESTRIAL_ARCHITECTURE_INPUTS,
  TERRESTRIAL_POWER_SOURCE_SPECS,
  TerrestrialBaselineComparison,
  TerrestrialControls,
  TerrestrialDiagnostics,
  TerrestrialLcoeBand,
  TerrestrialResults,
  buildTerrestrialInputs,
  runTerrestrialModel,
  type TerrestrialArchitectureInputs,
  type TerrestrialPowerSource,
} from "../../terrestrial/index.js";
import styles from "./OldDashboard.module.css";

export function OldDashboard() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [compactControls, setCompactControls] = useState(false);
  useEffect(() => {
    if (!shellRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setCompactControls(entry.contentRect.width <= 680);
    });
    observer.observe(shellRef.current);
    return () => observer.disconnect();
  }, []);
  const { inputs, setInput, resetAll, result, isPending } = useModel();

  const [terrestrialInputs, setTerrestrialInputs] = useState<TerrestrialArchitectureInputs>(
    DEFAULT_TERRESTRIAL_ARCHITECTURE_INPUTS,
  );
  const setTerrestrialInput = (key: keyof TerrestrialArchitectureInputs, value: number) =>
    setTerrestrialInputs((previous) => ({ ...previous, [key]: value }));
  const resetTerrestrial = () => setTerrestrialInputs(DEFAULT_TERRESTRIAL_ARCHITECTURE_INPUTS);
  // Switching power source resets only that technology's own sliders to its
  // defaults (see TERRESTRIAL_POWER_SOURCE_SPECS) -- power-source-independent
  // sliders (discount rate, PUE, facility capex, chip failure rate) carry over.
  const setPowerSource = (source: TerrestrialPowerSource) =>
    setTerrestrialInputs((previous) => ({
      ...previous,
      power_source: source,
      ...TERRESTRIAL_POWER_SOURCE_SPECS[source].defaults,
    }));

  const terrestrialResult = useMemo(
    () => runTerrestrialModel(buildTerrestrialInputs(inputs, terrestrialInputs)),
    [inputs, terrestrialInputs],
  );

  return (
    <div className={styles.shell} ref={shellRef}>
      {/* Three columns: the Panthalassa inputs on a Celestial Blue field, the results on
          Smoke White, the land-based inputs on Timberwolf. The heading heads the results. */}
      <div className={styles.layout}>
        <h2 id="model-heading" className={styles.title}>Now, make the model yours</h2>
        <aside className={styles.sidebar}>
          <SliderPanel inputs={inputs} setInput={setInput} resetAll={resetAll} collapsible={compactControls} />
        </aside>

        <aside className={styles.terrestrialSidebar}>
          <TerrestrialControls
            inputs={terrestrialInputs}
            onChange={setTerrestrialInput}
            onSelectPowerSource={setPowerSource}
            onReset={resetTerrestrial}
            collapsible={compactControls}
          />
        </aside>

        <main className={styles.main}>
          <SharedInputsPanel inputs={inputs} setInput={setInput} />

          <ComparisonVerdict oceanResult={result} terrestrialResult={terrestrialResult} />

          {/* Each architecture gets its own column under a side-keyed head: Celestial Blue for
              the ocean fleet, Cod Gray for the land-based plant. Paired cards share a row, so
              the two breakdowns and the two LCOEs sit level. The columns break for the shared
              tables and pick up again below them. */}
          <div className={styles.sides}>
            <section className={styles.side} aria-labelledby="ocean-costs">
              <h3 id="ocean-costs" className={`${styles.sideHead} ${styles.sideOcean}`}>Panthalassa</h3>
              <CostBreakdown result={result} />
              <LcoeBand result={result} />
            </section>
            <section className={styles.side} aria-labelledby="land-costs">
              <h3 id="land-costs" className={`${styles.sideHead} ${styles.sideLand}`}>Land-based</h3>
              <TerrestrialResults result={terrestrialResult} />
              <TerrestrialLcoeBand result={terrestrialResult} />
            </section>
          </div>

          <ArchitectureComparison oceanResult={result} terrestrialResult={terrestrialResult} />
          <CostPerWattBreakdown oceanResult={result} terrestrialResult={terrestrialResult} />

          <div className={styles.sides}>
            <section className={styles.side} aria-labelledby="ocean-fleet">
              <h3 id="ocean-fleet" className={`${styles.sideHead} ${styles.sideOcean}`}>Panthalassa</h3>
              <BaselineComparison result={result} />
              <ResultsHeader result={result} isPending={isPending} />
            </section>
            <section className={styles.side} aria-labelledby="land-plant">
              <h3 id="land-plant" className={`${styles.sideHead} ${styles.sideLand}`}>Land-based</h3>
              <TerrestrialBaselineComparison result={terrestrialResult} />
              <TerrestrialDiagnostics result={terrestrialResult} />
            </section>
          </div>
        </main>


      </div>
    </div>
  );
}
