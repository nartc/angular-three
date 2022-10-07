// GENERATED
import { AnyConstructor, NgtCommonSprite, provideNgtCommonSprite, provideCommonSpriteRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-sprite',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonSprite(NgtSprite), provideCommonSpriteRef(NgtSprite)],
})
export class NgtSprite extends NgtCommonSprite<THREE.Sprite> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Sprite> | undefined;

  override get spriteType(): AnyConstructor<THREE.Sprite> {
    return THREE.Sprite;
  }
}

@NgModule({
  imports: [NgtSprite],
  exports: [NgtSprite],
})
export class NgtSpriteModule {}
