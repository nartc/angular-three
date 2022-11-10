import type { NgtRenderState, NgtState, NgtStateGetter } from '../types';
import { is } from './is';

type GlobalRenderCallback = (timeStamp: number) => void;
export type GlobalEffectType = 'before' | 'after' | 'tail';

interface SubItem {
  callback: GlobalRenderCallback;
}

function createSub(callback: GlobalRenderCallback, subs: Set<SubItem>): () => void {
  const sub = { callback };
  subs.add(sub);
  return () => void subs.delete(sub);
}

const globalEffects: Set<SubItem> = new Set();
const globalAfterEffects: Set<SubItem> = new Set();
const globalTailEffects: Set<SubItem> = new Set();

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

function run(effects: Set<SubItem>, timestamp: number) {
  if (!effects.size) return;
  for (const { callback } of effects.values()) {
    callback(timestamp);
  }
}

export function flushGlobalEffects(type: GlobalEffectType, timestamp: number): void {
  switch (type) {
    case 'before':
      return run(globalEffects, timestamp);
    case 'after':
      return run(globalAfterEffects, timestamp);
    case 'tail':
      return run(globalTailEffects, timestamp);
  }
}

function render(timestamp: number, stateGetter: NgtStateGetter, frame?: XRFrame) {
  const state = stateGetter();
  // Run local effects
  let delta = state.clock.getDelta();
  // In frameloop='never' mode, clock times are updated using the provided timestamp
  if (state.frameloop === 'never' && typeof timestamp === 'number') {
    delta = timestamp - state.clock.elapsedTime;
    state.clock.oldTime = state.clock.elapsedTime;
    state.clock.elapsedTime = timestamp;
  }

  // call animation subscribers
  for (const subscriber of state.internal.subscribers) {
    const object = is.ref(subscriber.obj) ? subscriber.obj.value : subscriber.obj;
    subscriber.callback({ ...state, delta, frame } as NgtRenderState, object);
  }

  // Render content
  if (!state.internal.priority && state.gl.render) {
    state.gl.render(state.scene, state.camera);
  }
  // Decrease frame count
  state.internal.frames = Math.max(0, state.internal.frames - 1);
  return state.frameloop === 'always' ? 1 : state.internal.frames;
}

export function createLoop(roots: Map<Element, NgtStateGetter>) {
  let running = false;
  let repeat: number;
  let frame: number;
  let state: NgtState;

  function loop(timestamp: number): void {
    frame = requestAnimationFrame(loop);
    running = true;
    repeat = 0;

    // Run effects
    flushGlobalEffects('before', timestamp);

    // Render all roots
    for (const root of roots.values()) {
      state = root();
      // If the frameloop is invalidated, do not run another frame
      if (
        state.internal.active &&
        (state.frameloop === 'always' || state.internal.frames > 0) &&
        !state.gl.xr?.isPresenting
      ) {
        repeat += render(timestamp, root);
      }
    }

    // Run after-effects
    flushGlobalEffects('after', timestamp);

    // Stop the loop if nothing invalidates it
    if (repeat === 0) {
      // Tail call effects, they are called when rendering stops
      flushGlobalEffects('tail', timestamp);

      // Flag end of operation
      running = false;
      return cancelAnimationFrame(frame);
    }
  }

  function invalidate(stateGetter?: NgtStateGetter, frames = 1): void {
    const stateToInvalidate = stateGetter?.();
    if (!stateToInvalidate) return roots.forEach((root) => invalidate(root, frames));
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

  function advance(
    timestamp: number,
    runGlobalEffects: boolean = true,
    stateGetter?: NgtStateGetter,
    frame?: XRFrame
  ): void {
    if (runGlobalEffects) flushGlobalEffects('before', timestamp);
    if (!stateGetter) for (const root of roots.values()) render(timestamp, root);
    else render(timestamp, stateGetter, frame);
    if (runGlobalEffects) flushGlobalEffects('after', timestamp);
  }

  return {
    loop,
    /**
     * Invalidates the view, requesting a frame to be rendered. Will globally invalidate unless passed a root's state.
     * @see https://docs.pmnd.rs/react-three-fiber/api/additional-exports#invalidate
     */
    invalidate,
    /**
     * Advances the frameloop and runs render effects, useful for when manually rendering via `frameloop="never"`.
     * @see https://docs.pmnd.rs/react-three-fiber/api/additional-exports#advance
     */
    advance,
  };
}
