import {
    createBeforeRenderCallback,
    defaultProjector,
    filterFalsy,
    NgtCompound,
    NgtObjectCompound,
    provideInstanceRef,
} from '@angular-three/core';
import { NgtLOD } from '@angular-three/core/objects';
import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../common';

@Component({
    selector: 'ngt-soba-detailed[distances]',
    standalone: true,
    template: `
        <ngt-lod [objectCompound]="this" [beforeRender]="onBeforeRender">
            <ng-content></ng-content>
        </ngt-lod>
    `,
    imports: [NgtLOD, NgtObjectCompound],
    providers: [provideInstanceRef(SobaDetailed, { compound: true })],
    inputs: [...NGT_INSTANCE_INPUTS, ...NGT_OBJECT3D_INPUTS, ...getInputs()],
    outputs: NGT_INSTANCE_OUTPUTS,
})
export class SobaDetailed extends NgtCompound<NgtLOD> implements OnInit {
    @Input() set distances(distances: number[]) {
        this.write({ distances });
    }

    private readonly addLevels = this.effect(
        tap(() => {
            const distances = this.read((s) => s['distances']);
            this.instanceRef.value.levels.length = 0;
            this.instanceRef.value.children.forEach((object, index) => {
                this.instanceRef.value.levels.push({ object, distance: distances[index] });
            });
        })
    );

    readonly onBeforeRender = createBeforeRenderCallback<THREE.LOD>(({ state: { camera }, object }) => {
        object.update(camera);
    });

    override get useOnHost(): (keyof NgtLOD | string)[] {
        return [...super.useOnHost, 'beforeRender'];
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.addLevels(
                this.select(
                    this.select((s) => s['distances']),
                    this.instanceRef.objectRefs$(),
                    this.instanceRef.pipe(filterFalsy()),
                    defaultProjector,
                    { debounce: true }
                )
            );
        });
    }
}

function getInputs() {
    return ['autoUpdate', 'raycast'];
}
