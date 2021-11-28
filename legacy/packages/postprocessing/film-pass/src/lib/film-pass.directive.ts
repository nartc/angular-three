// GENERATED
import type {
  UnknownRecord,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';

@Directive({
  selector: 'ngt-film-pass',
  exportAs: 'ngtFilmPass',
  providers: [{ provide: NgtPass, useExisting: NgtFilmPass }],
})
export class NgtFilmPass extends NgtPass<FilmPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof FilmPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof FilmPass>) {
    this.extraArgs = v;
  }
  
  @Input() uniforms?: UnknownRecord;
  @Input() material?: THREE.ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;

  passType = FilmPass;
  extraInputs = [
    'uniforms',
    'material',
    'fsQuad',
  ];
}
