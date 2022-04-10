// GENERATED
import {
    AnyConstructor,
    NgtCommonSprite,
    provideCommonSpriteFactory,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    NgModule,
    Input,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-sprite',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonSpriteFactory<THREE.Sprite>(NgtSprite)],
})
export class NgtSprite extends NgtCommonSprite<THREE.Sprite> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Sprite>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.Sprite>) {
        this.instanceArgs = v;
    }

    override get spriteType(): AnyConstructor<THREE.Sprite> {
        return THREE.Sprite;
    }
}

@NgModule({
    declarations: [NgtSprite],
    exports: [NgtSprite],
})
export class NgtSpriteModule {}
