import {
  getInstanceLocalState,
  NgtObjectPassThrough,
  NgtRenderState,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
} from '@angular-three/core';
import { NgtLOD } from '@angular-three/core/objects';
import { Component, Input } from '@angular/core';
import { filter, switchMap, tap } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-detailed[distances]',
  standalone: true,
  template: `
    <ngt-lod
      shouldPassThroughRef
      [ngtObjectPassThrough]="this"
      (beforeRender)="onBeforeRender($event.state.camera, $event.object)"
    >
      <ng-content></ng-content>
    </ngt-lod>
  `,
  imports: [NgtLOD, NgtObjectPassThrough],
  providers: [
    provideNgtObject(NgtSobaDetailed),
    provideObjectRef(NgtSobaDetailed),
    provideObjectHostRef(NgtSobaDetailed),
  ],
})
export class NgtSobaDetailed extends NgtLOD {
  override isWrapper = true;

  @Input() set distances(distances: number[]) {
    this.set({ distances });
  }

  private readonly addLevels = this.effect(
    tap(() => {
      const distances = this.getState((s) => s['distances']);
      this.instanceValue.levels.length = 0;
      this.instanceValue.children.forEach((object, index) => {
        this.instanceValue.levels.push({ object, distance: distances[index] });
      });
    })
  );

  override postInit() {
    super.postInit();
    this.addLevels(
      this.select(
        this.select((s) => s['distances']),
        this.instanceRef,
        this.instanceRef.pipe(
          switchMap((lod) => getInstanceLocalState(lod)!.objectsRefs),
          filter((refs) => refs.length > 0)
        ),
        this.defaultProjector,
        { debounce: true }
      )
    );
  }

  onBeforeRender(camera: NgtRenderState['camera'], object: THREE.LOD) {
    object.update(camera);
  }
}
