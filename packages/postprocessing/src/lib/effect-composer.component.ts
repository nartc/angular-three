import { NgtCoreModule } from '@angular-three/core';
import { NgtGroup, NgtGroupModule } from '@angular-three/core/group';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  NgModule,
  QueryList,
  ViewChild,
} from '@angular/core';
import { map, startWith } from 'rxjs';
import * as THREE from 'three';
import { NgtEffectComposerStore } from './effect-composer.store';
import {
  NgtEffectController,
  NgtEffectControllerModule,
} from './effect.controller';

@Component({
  selector: 'ngt-effect-composer',
  exportAs: 'ngtEffectComposer',
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

  @ContentChildren(NgtEffectController, { descendants: true })
  set effectControllers(v: QueryList<NgtEffectController>) {
    this.effectComposerStore.connect(
      'effects',
      v.changes.pipe(
        startWith(v),
        map((list: QueryList<NgtEffectController>) =>
          list.toArray().map((item) => item.effect)
        )
      )
    );
  }

  constructor(private effectComposerStore: NgtEffectComposerStore) {}
}

@NgModule({
  declarations: [NgtEffectComposer],
  exports: [NgtEffectComposer, NgtEffectControllerModule],
  imports: [NgtCoreModule, NgtGroupModule],
})
export class NgtEffectComposerModule {}
