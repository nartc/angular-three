// GENERATED
import {
    AnyConstructor,
    NgtCommonAttribute,
    provideCommonAttributeFactory,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-instanced-buffer-attribute',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonAttributeFactory<THREE.InstancedBufferAttribute>(
            NgtInstancedBufferAttribute
        ),
    ],
})
export class NgtInstancedBufferAttribute extends NgtCommonAttribute<THREE.InstancedBufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.InstancedBufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.InstancedBufferAttribute>
    ) {
        this.attributeArgs = v;
    }

    override get attributeType(): AnyConstructor<THREE.InstancedBufferAttribute> {
        return THREE.InstancedBufferAttribute;
    }
}

@NgModule({
    declarations: [NgtInstancedBufferAttribute],
    exports: [NgtInstancedBufferAttribute],
})
export class NgtInstancedBufferAttributeModule {}
