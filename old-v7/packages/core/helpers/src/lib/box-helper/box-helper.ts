// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonObjectHelper,
  provideNgtCommonObjectHelper,
  provideCommonObjectHelperRef,
  NgtTail,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: '[ngtBoxHelper]',
  standalone: true,
  exportAs: 'ngtBoxHelper',
  providers: [provideNgtCommonObjectHelper(NgtBoxHelper), provideCommonObjectHelperRef(NgtBoxHelper)],
})
export class NgtBoxHelper extends NgtCommonObjectHelper<THREE.BoxHelper> {
  static ngAcceptInputType_ngtBoxHelper: NgtTail<ConstructorParameters<typeof THREE.BoxHelper>> | '' | undefined;

  @Input() set ngtBoxHelper(v: NgtTail<ConstructorParameters<typeof THREE.BoxHelper>> | '') {
    if (v) {
      this.instanceArgs = v;
    }
  }

  override get objectHelperType(): NgtAnyConstructor<THREE.BoxHelper> {
    return THREE.BoxHelper;
  }
}
