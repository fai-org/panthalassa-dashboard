// Illustration colours, resolved to hex for SVG and canvas. They match the tokens in
// styles/global.css: FAI fills only, with greys as Cod Gray over Smoke White.
export const INK = '#121212';          // Cod Gray: text, axes, the node scenes' disc
export const INK_2 = '#484848';        // --text-secondary, Cod Gray 76% over Smoke White
export const INK_3 = '#636363';        // --text-tertiary, Cod Gray 64% over Smoke White
export const SMOKE = '#F3F3F3';        // Smoke White: the node, wires and labels on the dark discs; land on the globe
export const TIMBERWOLF = '#D9D9D6';   // Timberwolf: context series
export const SKY = '#4997D0';          // Celestial Blue: the ocean and the power it supplies
export const ORANGE = '#FF4F00';       // International Orange: what a step adds (tug, battery, hull diameter)
/** Smoke White at an alpha, for strokes on the dark discs. */
export const smoke = (alpha: number) => `rgba(243,243,243,${alpha})`;
