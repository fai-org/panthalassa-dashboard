export interface FailureSceneController {
  setPaused(value: boolean): void;
  select(mode: number): void;
  dispose(): void;
}
export function createFailureScene(mount: HTMLElement, vertices: Float32Array, onModeChange: (mode: number) => void, initiallyPaused: boolean): FailureSceneController;
