import type { NgtRenderState, NgtState } from '../types';
import { is } from './is';

type GlobalRenderCallback = (timeStamp: number) => void;

interface SubItem {
  callback: GlobalRenderCallback;
}

const globalEffects: Set<SubItem> = new Set();
const globalAfterEffects: Set<SubItem> = new Set();
const globalTailEffects: Set<SubItem> = new Set();

function createSub(callback: GlobalRenderCallback, subs: Set<SubItem>): () => void {
  const sub = { callback };
  subs.add(sub);
  return () => void subs.delete(sub);
}

function run(effects: Set<SubItem>, timestamp: number) {
  effects.forEach(({ callback }) => callback(timestamp));
}

/**
 * Adds a global render callback which is called each frame.
 */
export function addCallback(callback: GlobalRenderCallback) {
  return createSub(callback, globalEffects);
}

/**
 * Adds a global after-render callback which is called each frame.
 */
export function addAfterCallback(callback: GlobalRenderCallback) {
  return createSub(callback, globalAfterEffects);
}

/**
 * Adds a global callback which is called when rendering stops.
 */
export function addTail(callback: GlobalRenderCallback) {
  return createSub(callback, globalTailEffects);
}

export function render(timestamp: number, state: () => NgtState, frame?: XRFrame): number {
  const rootState = state();

  let delta = rootState.clock.getDelta();

  // in frameloop='never' mode, clock times are updated using provided timestamp
  if (rootState.frameloop === 'never' && typeof timestamp === 'number') {
    delta = timestamp - rootState.clock.elapsedTime;
    rootState.clock.oldTime = rootState.clock.elapsedTime;
    rootState.clock.elapsedTime = timestamp;
  }

  // call animation subscribers
  for (const subscriber of rootState.internal.subscribers) {
    const object = is.ref(subscriber.obj) ? subscriber.obj.value : subscriber.obj;
    subscriber.callback({ ...rootState, delta, frame } as NgtRenderState, object);
  }

  // Render content
  if (!rootState.internal.priority && rootState.gl.render) {
    rootState.gl.render(rootState.scene, rootState.camera);
  }

  // Decrease frame count
  rootState.internal.frames = Math.max(0, rootState.internal.frames - 1);
  return rootState.frameloop === 'always' ? 1 : rootState.internal.frames;
}

export function createLoop(rootStateMap: Map<Element, () => NgtState>) {
  let running = false;
  let repeat: number;
  let frame: number;
  let state: NgtState;

  function loop(timestamp: number): void {
    frame = requestAnimationFrame(loop);
    running = true;
    repeat = 0;

    // Run effects
    if (globalEffects.size) run(globalEffects, timestamp);

    // Render all rootStateMap
    rootStateMap.forEach((rootState) => {
      state = rootState();
      // If the frameloop is invalidated, do not run another frame
      if (
        state.internal.active &&
        (state.frameloop === 'always' || state.internal.frames > 0) &&
        !state.gl.xr?.isPresenting
      ) {
        repeat += render(timestamp, rootState);
      }
    });

    // Run after-effects
    if (globalAfterEffects.size) run(globalAfterEffects, timestamp);

    // Stop the loop if nothing invalidates it
    if (repeat === 0) {
      // Tail call effects, they are called when rendering stops
      if (globalTailEffects.size) run(globalTailEffects, timestamp);

      // Flag end of operation
      running = false;
      return cancelAnimationFrame(frame);
    }
  }

  function invalidate(state?: () => NgtState, frames = 1): void {
    const stateToInvalidate = state?.();
    if (!stateToInvalidate) return rootStateMap.forEach((rootState) => invalidate(rootState, frames));
    if (
      stateToInvalidate.gl.xr?.isPresenting ||
      !stateToInvalidate.internal.active ||
      stateToInvalidate.frameloop === 'never'
    )
      return;
    // Increase frames, do not go higher than 60
    stateToInvalidate.internal.frames = Math.min(60, stateToInvalidate.internal.frames + frames);
    // If the render-loop isn't active, start it
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  }

  function advance(timestamp: number, runGlobalEffects = true, state?: () => NgtState, frame?: XRFrame): void {
    if (runGlobalEffects) run(globalEffects, timestamp);
    if (!state) rootStateMap.forEach((rootState) => render(timestamp, rootState));
    else render(timestamp, state, frame);
    if (runGlobalEffects) run(globalAfterEffects, timestamp);
  }

  return {
    loop,
    /**
     * Invalidates the view, requesting a frame to be rendered. Will globally invalidate unless passed a root's state.
     */
    invalidate,
    /**
     * Advances the frameloop and runs render effects, useful for when manually rendering via `frameloop="never"`.
     */
    advance,
  };
}
