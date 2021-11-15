// GENERATED

import {
  NgtHelper,
  NgtObject3d,
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper';

@Directive({
  selector: 'ngt-positional-audio-helper',
  exportAs: 'ngtPositionalAudioHelper',
  providers: [
    {
      provide: NgtObject3d,
      useExisting: NgtPositionalAudioHelper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtPositionalAudioHelper extends NgtHelper<PositionalAudioHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof PositionalAudioHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof PositionalAudioHelper>) {
    this.extraArgs = v;
  }

  helperType = PositionalAudioHelper;
}
