import * as THREE from 'three';
import type { NgtRenderState, NgtState } from '../types';

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
        const object =
            typeof subscriber.obj === 'function'
                ? subscriber.obj()
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

        // Run effects
        // if (globalEffects.length) run(globalEffects, timestamp)

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

        // Run after-effects
        // if (globalAfterEffects.length) run(globalAfterEffects, timestamp);

        // Stop the loop if nothing invalidates it
        if (repeat === 0) {
            // Tail call effects, they are called when rendering stops
            // if (globalTailEffects.length) run(globalTailEffects, timestamp);

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

    /** runGlobalEffects: boolean = true */
    function advance(
        timestamp: number,
        state?: () => NgtState,
        frame?: THREE.XRFrame
    ): void {
        // if (runGlobalEffects) run(globalEffects, timestamp);
        const stateToAdvance = state?.();
        if (!stateToAdvance) {
            rootStateMap.forEach((rootState) => render(timestamp, rootState));
        } else {
            render(timestamp, () => stateToAdvance, frame);
        }
        // if (runGlobalEffects) run(globalAfterEffects, timestamp);
    }

    return { loop, advance, invalidate };
}
