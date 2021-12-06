import { NgtCoreModule } from '@angular-three/core';
import { NgtGroup, NgtGroupModule } from '@angular-three/core/group';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  NgModule,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
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
export class NgtEffectComposer implements OnInit {
  @Input() set depthBuffer(v: boolean) {
    this.effectComposerStore.updaters.setDepthBuffer(v);
  }

  @Input() set disableNormalPass(v: boolean) {
    this.effectComposerStore.updaters.setDisableNormalPass(v);
  }

  @Input() set stencilBuffer(v: boolean) {
    this.effectComposerStore.updaters.setStencilBuffer(v);
  }

  @Input() set autoClear(v: boolean) {
    this.effectComposerStore.updaters.setAutoClear(v);
  }

  @Input() set multisampling(v: number) {
    this.effectComposerStore.updaters.setMultisampling(v);
  }

  @Input() set renderPriority(v: number) {
    this.effectComposerStore.updaters.setRenderPriority(v);
  }

  @Input() set frameBufferType(v: THREE.TextureDataType) {
    this.effectComposerStore.updaters.setFrameBufferType(v);
  }

  @Input() set camera(v: THREE.Camera) {
    this.effectComposerStore.updaters.setCamera(v);
  }

  @Input() set scene(v: THREE.Scene) {
    this.effectComposerStore.updaters.setScene(v);
  }

  @ViewChild(NgtGroup, { static: true }) set groupDirective(v: NgtGroup) {
    this.#group = v.group as THREE.Group;
  }

  #group!: THREE.Group;

  get group() {
    return this.#group;
  }

  @ContentChildren(NgtEffectController, {
    emitDistinctChangesOnly: true,
    descendants: true,
  })
  set effectControllers(v: QueryList<NgtEffectController>) {
    this.effectComposerStore.updaters.setEffects(
      v.toArray().map((item) => item.effect)
    );
  }

  constructor(private effectComposerStore: NgtEffectComposerStore) {}

  ngOnInit() {
    this.effectComposerStore.initEffect();
  }
}

@NgModule({
  declarations: [NgtEffectComposer],
  exports: [NgtEffectComposer, NgtEffectControllerModule],
  imports: [NgtCoreModule, NgtGroupModule],
})
export class NgtEffectComposerModule {}
