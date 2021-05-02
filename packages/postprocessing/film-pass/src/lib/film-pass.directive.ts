// GENERATED

import type { UnknownRecord } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { ShaderMaterial } from 'three';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';

@Directive({
  selector: 'ngt-film-pass',
  exportAs: 'ngtFilmPass',
  providers: [{ provide: ThreePass, useExisting: FilmPassDirective }],
})
export class FilmPassDirective extends ThreePass<FilmPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof FilmPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof FilmPass>) {
    this.extraArgs = v;
  }

  @Input() uniforms?: UnknownRecord;
  @Input() material?: ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;

  passType = FilmPass;
  extraInputs = ['uniforms', 'material', 'fsQuad'];
}
