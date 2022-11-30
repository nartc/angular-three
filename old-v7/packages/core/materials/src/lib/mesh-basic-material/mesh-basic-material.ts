// GENERATED - AngularThree v7.0.0
import {
  coerceBoolean,
  coerceNumber,
  NgtAnyConstructor,
  NgtBooleanInput,
  NgtCommonMaterial,
  NgtNumberInput,
  NgtObservableInput,
  provideCommonMaterialRef,
  provideNgtCommonMaterial,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-mesh-basic-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMaterial(NgtMeshBasicMaterial), provideCommonMaterialRef(NgtMeshBasicMaterial)],
})
export class NgtMeshBasicMaterial extends NgtCommonMaterial<THREE.MeshBasicMaterial> {
  @Input() set color(color: NgtObservableInput<THREE.ColorRepresentation>) {
    this.set({ color });
  }

  @Input() override set opacity(opacity: NgtObservableInput<NgtNumberInput>) {
    this.set({ opacity: isObservable(opacity) ? opacity.pipe(map(coerceNumber)) : coerceNumber(opacity) });
  }

  @Input() set map(map: NgtObservableInput<THREE.Texture | null>) {
    this.set({ map });
  }

  @Input() set lightMap(lightMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ lightMap });
  }

  @Input() set lightMapIntensity(lightMapIntensity: NgtObservableInput<NgtNumberInput>) {
    this.set({
      lightMapIntensity: isObservable(lightMapIntensity)
        ? lightMapIntensity.pipe(map(coerceNumber))
        : coerceNumber(lightMapIntensity),
    });
  }

  @Input() set aoMap(aoMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ aoMap });
  }

  @Input() set aoMapIntensity(aoMapIntensity: NgtObservableInput<NgtNumberInput>) {
    this.set({
      aoMapIntensity: isObservable(aoMapIntensity)
        ? aoMapIntensity.pipe(map(coerceNumber))
        : coerceNumber(aoMapIntensity),
    });
  }

  @Input() set specularMap(specularMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ specularMap });
  }

  @Input() set alphaMap(alphaMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ alphaMap });
  }

  @Input() set fog(fog: NgtObservableInput<NgtBooleanInput>) {
    this.set({ fog: isObservable(fog) ? fog.pipe(map(coerceBoolean)) : coerceBoolean(fog) });
  }

  @Input() set envMap(envMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ envMap });
  }

  @Input() set combine(combine: NgtObservableInput<THREE.Combine>) {
    this.set({ combine });
  }

  @Input() set reflectivity(reflectivity: NgtObservableInput<NgtNumberInput>) {
    this.set({
      reflectivity: isObservable(reflectivity) ? reflectivity.pipe(map(coerceNumber)) : coerceNumber(reflectivity),
    });
  }

  @Input() set refractionRatio(refractionRatio: NgtObservableInput<NgtNumberInput>) {
    this.set({
      refractionRatio: isObservable(refractionRatio)
        ? refractionRatio.pipe(map(coerceNumber))
        : coerceNumber(refractionRatio),
    });
  }

  @Input() set wireframe(wireframe: NgtObservableInput<NgtBooleanInput>) {
    this.set({ wireframe: isObservable(wireframe) ? wireframe.pipe(map(coerceBoolean)) : coerceBoolean(wireframe) });
  }

  @Input() set wireframeLinewidth(wireframeLinewidth: NgtObservableInput<NgtNumberInput>) {
    this.set({
      wireframeLinewidth: isObservable(wireframeLinewidth)
        ? wireframeLinewidth.pipe(map(coerceNumber))
        : coerceNumber(wireframeLinewidth),
    });
  }

  @Input() set wireframeLinecap(wireframeLinecap: NgtObservableInput<string>) {
    this.set({ wireframeLinecap });
  }

  @Input() set wireframeLinejoin(wireframeLinejoin: NgtObservableInput<string>) {
    this.set({ wireframeLinejoin });
  }

  override get materialType(): NgtAnyConstructor<THREE.MeshBasicMaterial> {
    return THREE.MeshBasicMaterial;
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'color',
      'opacity',
      'map',
      'lightMap',
      'lightMapIntensity',
      'aoMap',
      'aoMapIntensity',
      'specularMap',
      'alphaMap',
      'fog',
      'envMap',
      'combine',
      'reflectivity',
      'refractionRatio',
      'wireframe',
      'wireframeLinewidth',
      'wireframeLinecap',
      'wireframeLinejoin',
    ];
  }
}
