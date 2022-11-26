import type { NgtBeforeRenderCallback, NgtRenderState } from '../types';

export function createBeforeRenderCallback<TObject extends THREE.Object3D = THREE.Object3D>(
    cb: (beforeRenderState: { state: NgtRenderState; object: TObject }) => void
): NgtBeforeRenderCallback {
    return (state: NgtRenderState, object: TObject) => {
        cb({ state, object });
    };
}

// export function createOnHook<TValue = any>(
//     cb: (onState: { newValue: TValue; ngtInstance: NgtInstance; stateFactory: NgtStateFactory }) => void
// ): (newValue: TValue, ngtInstance: NgtInstance, stateFactory: NgtStateFactory) => void {
//     return (newValue: TValue, ngtInstance: NgtInstance, stateFactory: NgtStateFactory) => {
//         cb({ newValue, ngtInstance, stateFactory });
//     };
// }
