import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor, UnknownRecord } from '../types';
import { NgtObject, NgtObjectInputsState } from './object';

export interface NgtMaterialGeometryState<
    TObject extends THREE.Object3D = THREE.Object3D
> extends NgtObjectInputsState<TObject> {
    material: THREE.Material | THREE.Material[];
    geometry: THREE.BufferGeometry;
    morphTargetInfluences?: number[];
    morphTargetDictionary?: Record<string, number>;
}

@Directive()
export abstract class NgtMaterialGeometry<
    TMaterialGeometryObject extends THREE.Object3D = THREE.Object3D
> extends NgtObject<
    TMaterialGeometryObject,
    NgtMaterialGeometryState<TMaterialGeometryObject>
> {
    @Input() set material(material: THREE.Material | THREE.Material[]) {
        this.set({ material });
    }

    @Input() set geometry(geometry: THREE.BufferGeometry) {
        this.set({ geometry });
    }

    @Input() set morphTargetInfluences(morphTargetInfluences: number[]) {
        this.set({ morphTargetInfluences });
    }

    @Input() set morphTargetDictionary(
        morphTargetDictionary: Record<string, number>
    ) {
        this.set({ morphTargetDictionary });
    }

    abstract get objectType(): AnyConstructor<TMaterialGeometryObject>;

    protected override objectInitFn(): TMaterialGeometryObject {
        const state = this.get();

        // this is the additional arguments to pass into the object constructor
        // eg: InstancedMesh has "count" -> objectArgs = [count]
        const objectArgs = this.argsKeys.reduce((args, argKey) => {
            args.push(state[argKey]);
            return args;
        }, [] as unknown[]);

        const object = new this.objectType(
            state.geometry,
            state.material,
            ...objectArgs
        );

        if (state.morphTargetDictionary && 'morphTargetDictionary' in object) {
            (object as unknown as UnknownRecord)['morphTargetDictionary'] =
                state.morphTargetDictionary;
        }

        if (state.morphTargetInfluences && 'morphTargetInfluences' in object) {
            (object as unknown as UnknownRecord)['morphTargetInfluences'] =
                state.morphTargetInfluences;
        }

        return object;
    }

    protected get argsKeys(): string[] {
        return [];
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            material: true,
            geometry: true,
            morphTargetInfluences: true,
            morphTargetDictionary: true,
        };
    }
}
