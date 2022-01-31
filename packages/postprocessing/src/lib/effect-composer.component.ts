import { NgtGroup, NgtGroupModule } from '@angular-three/core/group';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { NgtEffectComposerStore } from './effect-composer.store';

/**
 * TODO(chau): change to ng-template and injector in v14
 */
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

  @ViewChild(NgtGroup, { static: true }) set groupDirective(v: NgtGroup) {
    this._group = v.group as THREE.Group;
  }

  private _group!: THREE.Group;

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
  imports: [NgtGroupModule],
})
export class NgtEffectComposerModule {}
