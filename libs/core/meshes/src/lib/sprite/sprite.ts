import {
  AnyConstructor,
  NgtMaterialGeometry,
  NgtRef,
  provideMaterialGeometryRef,
  provideNgtMaterialGeometry,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-sprite',
  standalone: true,
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtMaterialGeometry(NgtSprite),
    provideMaterialGeometryRef(NgtSprite),
  ],
})
export class NgtSprite extends NgtMaterialGeometry<
  THREE.Sprite,
  THREE.SpriteMaterial
> {
  override get objectType(): AnyConstructor<THREE.Sprite> {
    return THREE.Sprite;
  }

  @Input() override set material(
    material: THREE.SpriteMaterial | NgtRef<THREE.SpriteMaterial>
  ) {
    this.set({ material });
  }
}
