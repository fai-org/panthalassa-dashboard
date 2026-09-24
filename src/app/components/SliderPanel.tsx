import { useId, useState } from "react";
import { SLIDER_GROUPS } from "../lib/sliderConfig.js";
import type { ModelInputs } from "../../model/index.js";
import { SliderControl } from "./SliderControl.js";
import styles from "./SliderPanel.module.css";

interface Props {
  inputs: ModelInputs;
  setInput: (key: keyof ModelInputs, value: number) => void;
  resetAll: () => void;
  collapsible?: boolean;
}

/** The one group open on load. The node itself is what Panthalassa is proposing; everything else is context. */
const OPEN_GROUP = "Node physical design";

export function SliderPanel({ inputs, setInput, resetAll, collapsible = false }: Props) {
  const [expanded, setExpanded] = useState(false);
  const controlsId = useId();
  return (
    <div className={styles.panel} data-collapsed={collapsible && !expanded}>
      <div className={`${styles.header} ${styles.headerOcean}`}>
        <h3 className={styles.headerTitle}>
          {collapsible ? <button type="button" className={styles.panelToggle} aria-expanded={expanded} aria-controls={controlsId} onClick={() => setExpanded(!expanded)}>
            Panthalassa Inputs <span aria-hidden>{expanded ? '−' : '+'}</span>
          </button> : "Panthalassa Inputs"}
        </h3>
        <button type="button" className={styles.resetBtn} onClick={resetAll}>
          Reset to defaults
        </button>
      </div>
      <div id={controlsId} hidden={collapsible && !expanded} className={`${styles.scrollArea} scroll-thin`}>
        {SLIDER_GROUPS.map((group) => (
          <details key={group.title} className={styles.group} open={group.title === OPEN_GROUP}>
            <summary className={styles.groupSummary}>
              <span className={styles.groupTitle}>{group.title}</span>
              <svg
                className={styles.chevron}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 2.5 7.5 6 4 9.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <div className={styles.groupBody}>
              {group.sliders.map((slider) => (
                <SliderControl
                  key={slider.key}
                  config={slider}
                  value={inputs[slider.key]}
                  onChange={(v) => setInput(slider.key, v)}
                />
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
