// Illustration colours, resolved to hex for SVG and canvas. They match the tokens in
// styles/global.css: FAI fills, and the sea built from Celestial Blue over Cod Gray.
export const SMOKE = '#F3F3F3';        // Smoke White: the node, its route, primary labels
export const TIMBERWOLF = '#D9D9D6';   // Timberwolf: context series
export const SKY = '#4997D0';          // Celestial Blue: the ocean and the power it supplies
export const ORANGE = '#FF4F00';       // International Orange: what a step adds (tug, battery)
export const MUTED = '#C0C5C8';        // --on-sea-2, Smoke White 76% over --sea-900
export const FAINT = '#9EA6AB';        // --on-sea-3, Smoke White 60% over --sea-900
export const SEA_800 = '#253F53';      // --sea-800, Celestial Blue 34% over Cod Gray
export const SEA_700 = '#2E5571';      // --sea-700, Celestial Blue 50% over Cod Gray
/** Smoke White at an alpha, for canvas strokes. */
export const smoke = (alpha: number) => `rgba(243,243,243,${alpha})`;
