import { useEffect, useMemo, useRef, useState } from "react";
import { useModel } from "../hooks/useModel.js";
import { SliderPanel } from "../components/SliderPanel.js";
import { SharedInputsPanel } from "../components/SharedInputsPanel.js";
import { ComparisonVerdict } from "../components/ComparisonVerdict.js";
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
      <header className={styles.topbar}>
        <h2 className={styles.title}>The Interactive Model</h2>
      </header>

      <div className={styles.layout}>
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

          <ArchitectureComparison oceanResult={result} terrestrialResult={terrestrialResult} />
          <CostPerWattBreakdown oceanResult={result} terrestrialResult={terrestrialResult} />

          {/* Below the shared comparison, each architecture gets its own column under a
              side-keyed head: Celestial Blue for the ocean fleet, Cod Gray for the terrestrial
              plant. Everything in a column belongs to that side. */}
          <div className={styles.sides}>
            <section className={styles.side} aria-labelledby="ocean-side">
              <h3 id="ocean-side" className={`${styles.sideHead} ${styles.sideOcean}`}>
                Panthalassa
              </h3>
              <CostBreakdown result={result} />
              <BaselineComparison result={result} />
              <ResultsHeader result={result} isPending={isPending} />
            </section>
            <section className={styles.side} aria-labelledby="land-side">
              <h3 id="land-side" className={`${styles.sideHead} ${styles.sideLand}`}>
                Terrestrial
              </h3>
              <TerrestrialResults result={terrestrialResult} />
              <TerrestrialBaselineComparison result={terrestrialResult} />
              <TerrestrialDiagnostics result={terrestrialResult} />
            </section>
          </div>
        </main>


      </div>
    </div>
  );
}
