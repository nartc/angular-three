import {
    defaultProjector,
    injectInstance,
    NgtAnyRecord,
    NgtEuler,
    NgtInstance,
    NgtLayers,
    NgtMatrix4,
    NgtObservableInput,
    NgtQuaternion,
    NgtVector3,
    provideInstanceRef,
    proxify,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
// @ts-ignore
import { preloadFont, Text } from 'troika-three-text';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../common';

@Component({
    selector: 'ngt-soba-text',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(SobaText)],
    inputs: [...getInputs(), ...NGT_OBJECT3D_INPUTS],
})
export class SobaText extends Text {
    private readonly instance = injectInstance({ self: true });

    @Input() set characters(characters: NgtObservableInput<string>) {
        this.instance.write({ characters });
    }

    @Input() onSync?: (text: Text) => void;

    constructor() {
        super();
        return proxify(this, {
            created: (instance) => {
                (instance as NgtAnyRecord)['anchorX'] = 'center';
                (instance as NgtAnyRecord)['anchorY'] = 'middle';
                (instance as NgtAnyRecord)['text'] = '';
                this.preloadFont_(
                    this.instance.select(
                        this.instance.select((s) => s['font']),
                        this.instance.select((s) => s['characters']),
                        defaultProjector
                    )
                );
            },
            updated: (instance, stateFactory) => {
                const { invalidate } = stateFactory();
                (instance as NgtAnyRecord)['sync'](() => {
                    invalidate();
                    if (this.onSync) this.onSync(instance);
                });
            },
        });
    }

    private readonly preloadFont_ = this.instance.effect(
        tap(() => {
            const { font, characters } = this.instance.read();
            if (font && characters) {
                preloadFont({ font, characters });
            }
        })
    );

    static ngAcceptInputType_text: NgtObservableInput<string> | undefined;
    static ngAcceptInputType_onSync: (text: Text) => void;
    static ngAcceptInputType_characters: NgtObservableInput<string> | undefined;
    static ngAcceptInputType_color: NgtObservableInput<THREE.ColorRepresentation> | undefined;
    static ngAcceptInputType_fontSize: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_maxWidth: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_lineHeight: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_letterSpacing: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_textAlign: NgtObservableInput<'left' | 'right' | 'center' | 'justify'> | undefined;
    static ngAcceptInputType_font: NgtObservableInput<string> | undefined;
    static ngAcceptInputType_anchorX: NgtObservableInput<number | 'left' | 'center' | 'right'> | undefined;
    static ngAcceptInputType_anchorY:
        | NgtObservableInput<number | 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom'>
        | undefined;
    static ngAcceptInputType_clipRect: NgtObservableInput<[number, number, number, number]> | undefined;
    static ngAcceptInputType_depthOffset: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_direction: NgtObservableInput<'auto' | 'ltr' | 'rtl'> | undefined;
    static ngAcceptInputType_overflowWrap: NgtObservableInput<'normal' | 'break-word'> | undefined;
    static ngAcceptInputType_whiteSpace: NgtObservableInput<'normal' | 'overflowWrap' | 'overflowWrap'> | undefined;
    static ngAcceptInputType_outlineWidth: NgtObservableInput<number | string> | undefined;
    static ngAcceptInputType_outlineOffsetX: NgtObservableInput<number | string> | undefined;
    static ngAcceptInputType_outlineOffsetY: NgtObservableInput<number | string> | undefined;
    static ngAcceptInputType_outlineBlur: NgtObservableInput<number | string> | undefined;
    static ngAcceptInputType_outlineColor: NgtObservableInput<THREE.ColorRepresentation> | undefined;
    static ngAcceptInputType_outlineOpacity: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_strokeWidth: NgtObservableInput<number | string> | undefined;
    static ngAcceptInputType_strokeColor: NgtObservableInput<THREE.ColorRepresentation> | undefined;
    static ngAcceptInputType_strokeOpacity: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_fillOpacity: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_debugSDF: NgtObservableInput<boolean> | undefined;
    static ngAcceptInputType_name: NgtObservableInput<string>;
    static ngAcceptInputType_position: NgtObservableInput<NgtVector3>;
    static ngAcceptInputType_rotation: NgtObservableInput<NgtEuler>;
    static ngAcceptInputType_quaternion: NgtObservableInput<NgtQuaternion>;
    static ngAcceptInputType_scale: NgtObservableInput<NgtVector3>;
    static ngAcceptInputType_modelViewMatrix: NgtObservableInput<NgtMatrix4>;
    static ngAcceptInputType_normalMatrix: NgtObservableInput<THREE.Matrix3>;
    static ngAcceptInputType_matrix: NgtObservableInput<NgtMatrix4>;
    static ngAcceptInputType_matrixWorld: NgtObservableInput<NgtMatrix4>;
    static ngAcceptInputType_matrixAutoUpdate: NgtObservableInput<boolean>;
    static ngAcceptInputType_matrixWorldAutoUpdate: NgtObservableInput<boolean>;
    static ngAcceptInputType_matrixWorldNeedsUpdate: NgtObservableInput<boolean>;
    static ngAcceptInputType_layers: NgtObservableInput<NgtLayers>;
    static ngAcceptInputType_visible: NgtObservableInput<boolean>;
    static ngAcceptInputType_castShadow: NgtObservableInput<boolean>;
    static ngAcceptInputType_receiveShadow: NgtObservableInput<boolean>;
    static ngAcceptInputType_frustumCulled: NgtObservableInput<boolean>;
    static ngAcceptInputType_renderOrder: NgtObservableInput<number>;
    static ngAcceptInputType_animations: NgtObservableInput<THREE.AnimationClip[]>;
    static ngAcceptInputType_userData: NgtObservableInput<{ [key: string]: any }>;
    static ngAcceptInputType_customDepthMaterial: NgtObservableInput<THREE.Material>;
    static ngAcceptInputType_customDistanceMaterial: NgtObservableInput<THREE.Material>;
    static ngAcceptInputType_onBeforeRender: NgtObservableInput<
        (
            renderer: THREE.WebGLRenderer,
            scene: THREE.Scene,
            camera: THREE.Camera,
            geometry: THREE.BufferGeometry,
            material: THREE.Material,
            group: THREE.Group
        ) => void
    >;
    static ngAcceptInputType_onAfterRender: NgtObservableInput<
        (
            renderer: THREE.WebGLRenderer,
            scene: THREE.Scene,
            camera: THREE.Camera,
            geometry: THREE.BufferGeometry,
            material: THREE.Material,
            group: THREE.Group
        ) => void
    >;
}

function getInputs() {
    return [
        'text',
        'characters',
        'color',
        'fontSize',
        'maxWidth',
        'lineHeight',
        'letterSpacing',
        'textAlign',
        'font',
        'anchorX',
        'anchorY',
        'clipRect',
        'depthOffset',
        'direction',
        'overflowWrap',
        'whiteSpace',
        'outlineWidth',
        'outlineOffsetX',
        'outlineOffsetY',
        'outlineBlur',
        'outlineColor',
        'outlineOpacity',
        'strokeWidth',
        'strokeColor',
        'strokeOpacity',
        'fillOpacity',
        'debugSDF',
    ];
}
