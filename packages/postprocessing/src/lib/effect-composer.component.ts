import { NgtGroup, NgtGroupModule } from '@angular-three/core/group';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { NgtEffectComposerStore } from './effect-composer.store';
import { NgtEffectControllerModule } from './effect.controller';

@Component({
  selector: 'ngt-effect-composer',
  template: `
    <ngt-group>
      <ng-content></ng-content>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtEffectComposerStore],
})
export class NgtEffectComposer {
  @Input() set depthBuffer(v: boolean) {
    this.effectComposerStore.set({ depthBuffer: v });
  }

  @Input() set disableNormalPass(v: boolean) {
    this.effectComposerStore.set({ disableNormalPass: v });
  }

  @Input() set stencilBuffer(v: boolean) {
    this.effectComposerStore.set({ stencilBuffer: v });
  }

  @Input() set autoClear(v: boolean) {
    this.effectComposerStore.set({ autoClear: v });
  }

  @Input() set multisampling(v: number) {
    this.effectComposerStore.set({ multisampling: v });
  }

  @Input() set renderPriority(v: number) {
    this.effectComposerStore.set({ renderPriority: v });
  }

  @Input() set frameBufferType(v: THREE.TextureDataType) {
    this.effectComposerStore.set({ frameBufferType: v });
  }

  @Input() set camera(v: THREE.Camera) {
    this.effectComposerStore.set({ camera: v });
  }

  @Input() set scene(v: THREE.Scene) {
    this.effectComposerStore.set({ scene: v });
  }

  @ViewChild(NgtGroup) set groupDirective(v: NgtGroup) {
    this.#group = v.group as THREE.Group;
  }

  #group!: THREE.Group;

  get group() {
    return this.#group;
  }

  constructor(private effectComposerStore: NgtEffectComposerStore) {}
}

@NgModule({
  declarations: [NgtEffectComposer],
  exports: [NgtEffectComposer, NgtEffectControllerModule],
  imports: [NgtGroupModule],
})
export class NgtEffectComposerModule {}
