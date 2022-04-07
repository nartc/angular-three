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
    [propKey: string]: any;
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
        const props = this.get();

        // this is the additional arguments to pass into the object constructor
        // eg: InstancedMesh has "count" -> objectArgs = [count]
        const objectArgs = this.argsKeys.reduce((args, argKey) => {
            args.push(props[argKey]);
            return args;
        }, [] as unknown[]);

        const object = new this.objectType(
            props.geometry,
            props.material,
            ...objectArgs
        );

        if (props.morphTargetDictionary && 'morphTargetDictionary' in object) {
            (object as unknown as UnknownRecord)['morphTargetDictionary'] =
                props.morphTargetDictionary;
        }

        if (props.morphTargetInfluences && 'morphTargetInfluences' in object) {
            (object as unknown as UnknownRecord)['morphTargetInfluences'] =
                props.morphTargetInfluences;
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

    protected get argsKeys(): string[] {
        return [];
    }

    protected override get subInputs(): Record<string, boolean> {
        return {
            material: true,
            geometry: true,
            morphTargetInfluences: true,
            morphTargetDictionary: true,
        };
    }
}
