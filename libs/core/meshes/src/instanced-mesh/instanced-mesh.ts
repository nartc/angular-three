import {
    AnyConstructor,
    coerceNumberProperty,
    NgtCommonMesh,
    NumberInput,
    provideCommonMeshFactory,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-instanced-mesh[count]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMeshFactory<THREE.InstancedMesh>(NgtInstancedMesh),
    ],
})
export class NgtInstancedMesh extends NgtCommonMesh<THREE.InstancedMesh> {
    @Input() set count(count: NumberInput) {
        this.set({ count: coerceNumberProperty(count) });
    }

    override get meshType(): AnyConstructor<THREE.InstancedMesh> {
        return THREE.InstancedMesh;
    }

    protected override postInit() {
        this.object3d.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    }

    protected override get subInputs(): Record<string, boolean> {
        return { ...super.subInputs, count: false };
    }
}

@NgModule({
    declarations: [NgtInstancedMesh],
    exports: [NgtInstancedMesh],
})
export class NgtInstancedMeshModule {}
