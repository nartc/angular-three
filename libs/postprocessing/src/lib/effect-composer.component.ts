import { createParentObjectProvider } from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
    OnInit,
} from '@angular/core';
import * as THREE from 'three';
import { NgtEffectComposerStore } from './effect-composer.store';

@Component({
    selector: 'ngt-effect-composer',
    template: `
        <ngt-group (ready)="group = $event">
            <ng-container
                *ngIf="group"
                [ngTemplateOutlet]="contentTemplate"
            ></ng-container>
        </ngt-group>
        <ng-template #contentTemplate>
            <ng-content></ng-content>
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NgtEffectComposerStore,
        createParentObjectProvider(
            NgtEffectComposer,
            (composer) => composer.group
        ),
    ],
})
export class NgtEffectComposer implements OnInit {
    @Input() set depthBuffer(depthBuffer: boolean) {
        this.effectComposerStore.set({ depthBuffer });
    }

    @Input() set disableNormalPass(disableNormalPass: boolean) {
        this.effectComposerStore.set({ disableNormalPass });
    }

    @Input() set stencilBuffer(stencilBuffer: boolean) {
        this.effectComposerStore.set({ stencilBuffer });
    }

    @Input() set autoClear(autoClear: boolean) {
        this.effectComposerStore.set({ autoClear });
    }

    @Input() set multisampling(multisampling: number) {
        this.effectComposerStore.set({ multisampling });
    }

    @Input() set renderPriority(renderPriority: number) {
        this.effectComposerStore.set({ renderPriority });
    }

    @Input() set frameBufferType(frameBufferType: THREE.TextureDataType) {
        this.effectComposerStore.set({ frameBufferType });
    }

    @Input() set camera(camera: THREE.Camera) {
        this.effectComposerStore.set({ camera });
    }

    @Input() set scene(scene: THREE.Scene) {
        this.effectComposerStore.set({ scene });
    }

    private _group!: THREE.Group;

    set group(v: THREE.Group) {
        this._group = v;
    }

    get group() {
        return this._group;
    }

    constructor(private effectComposerStore: NgtEffectComposerStore) {}

    ngOnInit() {
        this.effectComposerStore.init();
    }
}

@NgModule({
    declarations: [NgtEffectComposer],
    exports: [NgtEffectComposer],
    imports: [NgtGroupModule, CommonModule],
})
export class NgtEffectComposerModule {}
