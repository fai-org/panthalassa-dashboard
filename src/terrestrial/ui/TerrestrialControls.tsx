import { useId, useState, type CSSProperties } from "react";
import {
  TERRESTRIAL_ALWAYS_VISIBLE_SLIDER_GROUPS,
  TERRESTRIAL_POWER_SOURCE_OPTIONS,
  POWER_SOURCE_SLIDER_GROUPS,
} from "../integration/sliderConfig.js";
import type { TerrestrialArchitectureInputs, TerrestrialPowerSource } from "../model/types.js";
import { SliderControl } from "../../app/components/SliderControl.js";
import { SideMark } from "../../app/components/SideMark.js";
import panelStyles from "../../app/components/SliderPanel.module.css";
import styles from "./TerrestrialPanel.module.css";

interface Props {
  inputs: TerrestrialArchitectureInputs;
  onChange: (key: keyof TerrestrialArchitectureInputs, value: number) => void;
  onSelectPowerSource: (source: TerrestrialPowerSource) => void;
  onReset: () => void;
  collapsible?: boolean;
}

/** Mirrors SliderPanel.tsx's markup/styling exactly (same CSS module) so the two sidebars read as a matched pair. */
export function TerrestrialControls({ inputs, onChange, onSelectPowerSource, onReset, collapsible = false }: Props) {
  const [expanded, setExpanded] = useState(false);
  const controlsId = useId();
  const activeGroup = POWER_SOURCE_SLIDER_GROUPS[inputs.power_source];
  const groups = [...TERRESTRIAL_ALWAYS_VISIBLE_SLIDER_GROUPS, activeGroup];

  return (
    <div className={panelStyles.panel} data-collapsed={collapsible && !expanded}>
      <div className={panelStyles.header}>
        <h3 className={panelStyles.headerTitle}>
          <SideMark side="land" />
          {collapsible ? <button type="button" className={panelStyles.panelToggle} aria-expanded={expanded} aria-controls={controlsId} onClick={() => setExpanded(!expanded)}>
            Land-based Inputs <span aria-hidden>{expanded ? '−' : '+'}</span>
          </button> : "Land-based Inputs"}
        </h3>
        <button type="button" className={panelStyles.resetBtn} onClick={onReset}>
          Reset to defaults
        </button>
      </div>
      <div id={controlsId} hidden={collapsible && !expanded} className={`${panelStyles.scrollArea} scroll-thin`}>
        <div className={styles.powerSourceRow}>
          <span className={styles.powerSourceLabel}>Power source</span>
          <div className={styles.powerSourceButtons}>
            {TERRESTRIAL_POWER_SOURCE_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={styles.powerSourceButton}
                data-active={inputs.power_source === option.key}
                style={{ "--power-source-color": option.color } as CSSProperties}
                onClick={() => onSelectPowerSource(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Only the chosen power source's own sliders start open; the rest is context. */}
        {groups.map((group) => (
          <details key={group.title} className={panelStyles.group} open={group === activeGroup}>
            <summary className={panelStyles.groupSummary}>
              <span className={panelStyles.groupTitle}>{group.title}</span>
              <svg
                className={panelStyles.chevron}
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
            <div className={panelStyles.groupBody}>
              {group.sliders.map((slider) => (
                <SliderControl
                  key={slider.key}
                  config={slider}
                  value={inputs[slider.key] as number}
                  onChange={(v) => onChange(slider.key, v)}
                />
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
