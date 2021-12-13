// GENERATED
import { NgtObjectHelper, Tail } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: '[ngtBoxHelper]',
  exportAs: 'ngtBoxHelper',
  providers: [
    {
      provide: NgtObjectHelper,
      useExisting: NgtBoxHelper,
    },
  ],
})
export class NgtBoxHelper extends NgtObjectHelper<THREE.BoxHelper> {
  static ngAcceptInputType_ngtBoxHelper:
    | Tail<ConstructorParameters<typeof THREE.BoxHelper>>
    | undefined;

  @Input() set ngtBoxHelper(
    v: Tail<ConstructorParameters<typeof THREE.BoxHelper>>
  ) {
    this.objectHelperArgs = v;
  }

  objectHelperType = THREE.BoxHelper;
}

@NgModule({
  declarations: [NgtBoxHelper],
  exports: [NgtBoxHelper],
})
export class NgtBoxHelperModule {}
