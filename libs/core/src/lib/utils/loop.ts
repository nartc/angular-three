import * as THREE from 'three';
import type { AnyFunction, NgtRenderState, NgtState } from '../types';
import { is } from './is';

type GlobalRenderCallback = (timeStamp: number) => void;

const globalCallbacks: GlobalRenderCallback[] = [];
const globalAfterCallbacks: GlobalRenderCallback[] = [];
const globalTailCallbacks: GlobalRenderCallback[] = [];

function createCallback(
    callback: GlobalRenderCallback,
    callbacks: GlobalRenderCallback[]
): () => void {
    const index = callbacks.length;
    callbacks.push(callback);
    return () => void callbacks.splice(index, 1);
}

function runCallbacks(effects: GlobalRenderCallback[], timestamp: number) {
    for (let i = 0, length = effects.length; i < length; i++) {
        effects[i](timestamp);
    }
}

/**
 * Adds a global render callback which is called before each frame.
 */
export function addCallback(callback: GlobalRenderCallback): AnyFunction<void> {
    return createCallback(callback, globalCallbacks);
}

/**
 * Adds a global render callback which is called after each frame has been rendered.
 */
export function addAfterCallback(
    callback: GlobalRenderCallback
): AnyFunction<void> {
    return createCallback(callback, globalAfterCallbacks);
}

/**
 * Adds a global callback which is called when rendering stops.
 */
export function addTailCallback(
    callback: GlobalRenderCallback
): AnyFunction<void> {
    return createCallback(callback, globalTailCallbacks);
}

export function render(
    timestamp: number,
    state: () => NgtState,
    frame?: THREE.XRFrame
): number {
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
        const object = is.ref(subscriber.obj)
            ? subscriber.obj.value
            : subscriber.obj;
        subscriber.callback(
            { ...rootState, delta, frame } as NgtRenderState,
            object
        );
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

        // Run callbacks
        if (globalCallbacks.length) {
            runCallbacks(globalCallbacks, timestamp);
        }

        // Render all roots
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

        // Run after-callbacks
        if (globalAfterCallbacks.length) {
            runCallbacks(globalAfterCallbacks, timestamp);
        }

        // Stop the loop if nothing invalidates it
        if (repeat === 0) {
            // Tail call effects, they are called when rendering stops
            if (globalTailCallbacks.length) {
                runCallbacks(globalTailCallbacks, timestamp);
            }

            // Flag end of operation
            running = false;
            return cancelAnimationFrame(frame);
        }
    }

    function invalidate(state?: () => NgtState): void {
        const stateToInvalidate = state?.();
        if (!stateToInvalidate)
            return rootStateMap.forEach((rootState) => invalidate(rootState));
        if (
            stateToInvalidate.gl.xr?.isPresenting ||
            !stateToInvalidate.internal.active ||
            stateToInvalidate.frameloop === 'never'
        )
            return;
        // Increase frames, do not go higher than 60
        stateToInvalidate.internal.frames = Math.min(
            60,
            stateToInvalidate.internal.frames + 1
        );
        // If the render-loop isn't active, start it
        if (!running) {
            running = true;
            requestAnimationFrame(loop);
        }
    }

    function advance(
        timestamp: number,
        runGlobalCallbacks = true,
        state?: () => NgtState,
        frame?: THREE.XRFrame
    ): void {
        if (runGlobalCallbacks) runCallbacks(globalCallbacks, timestamp);
        const stateToAdvance = state?.();
        if (!stateToAdvance) {
            rootStateMap.forEach((rootState) => render(timestamp, rootState));
        } else {
            render(timestamp, () => stateToAdvance, frame);
        }
        if (runGlobalCallbacks) runCallbacks(globalAfterCallbacks, timestamp);
    }

    return { loop, advance, invalidate };
}
