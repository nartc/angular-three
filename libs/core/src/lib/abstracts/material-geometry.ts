import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor, UnknownRecord } from '../types';
import { NgtObject, NgtObjectState } from './object';

export interface NgtMaterialGeometryState<
    TObject extends THREE.Object3D = THREE.Object3D
> extends NgtObjectState<TObject> {
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

    private _materialGeometryObjectArgs: unknown[] = [];
    set materialGeometryObjectArgs(v: unknown | unknown[]) {
        this._materialGeometryObjectArgs = Array.isArray(v) ? v : [v];
    }

    get materialGeometryObjectArgs(): unknown[] {
        return this._materialGeometryObjectArgs;
    }

    abstract get objectType(): AnyConstructor<TMaterialGeometryObject>;

    protected override objectInitFn(): TMaterialGeometryObject {
        const {
            material,
            geometry,
            morphTargetDictionary,
            morphTargetInfluences,
        } = this.get();

        const object = new this.objectType(
            geometry,
            material,
            ...this.materialGeometryObjectArgs
        );

        if (morphTargetDictionary && 'morphTargetDictionary' in object) {
            (object as unknown as UnknownRecord)['morphTargetDictionary'] =
                morphTargetDictionary;
        }

        if (morphTargetInfluences && 'morphTargetInfluences' in object) {
            (object as unknown as UnknownRecord)['morphTargetInfluences'] =
                morphTargetInfluences;
        }

        if (this.postInit) {
            this.postInit();
        }

        return object;
    }

    override ngOnInit() {
        this.init();
        super.ngOnInit();
    }

    /**
     * to run after object has been initialized
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected postInit(): void {}

    protected override get subInputs(): Record<string, boolean> {
        return {
            material: true,
            geometry: true,
            morphTargetInfluences: true,
            morphTargetDictionary: true,
        };
    }
}
