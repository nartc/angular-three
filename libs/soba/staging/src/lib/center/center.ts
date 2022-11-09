import {
  BooleanInput,
  coerceBooleanProperty,
  getInstanceInternal,
  NgtObjectPassThrough,
  NgtRef,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
} from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/objects';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { asyncScheduler, filter, observeOn, switchMap, tap } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-center',
  standalone: true,
  template: `
    <ngt-group [ngtObjectPassThrough]="this" [skipWrapper]="true" name="center">
      <ngt-group name="center-outer-group" [ref]="outerGroup">
        <ngt-group name="center-inner-group" [ref]="innerGroup">
          <ng-content></ng-content>
        </ngt-group>
      </ngt-group>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtGroup, NgtObjectPassThrough],
  providers: [
    provideNgtObject(NgtSobaCenter),
    provideObjectRef(NgtSobaCenter, (center) => center.innerGroup),
    provideObjectHostRef(NgtSobaCenter),
  ],
})
export class NgtSobaCenter extends NgtGroup {
  override isWrapper = true;
  override shouldPassThroughRef = true;

  @Input() set alignTop(alignTop: BooleanInput) {
    this.set({ alignTop: coerceBooleanProperty(alignTop) });
  }

  readonly #setPosition = this.effect(
    tap(() => {
      const alignTop = this.get((s) => s['alignTop']);
      this.outerGroup.value.matrixWorld.identity();
      this.outerGroup.value.position.set(0, 0, 0);
      this.outerGroup.value.updateWorldMatrix(true, true);
      const box3 = new THREE.Box3().setFromObject(this.innerGroup.value);
      const center = new THREE.Vector3();
      const sphere = new THREE.Sphere();
      const height = box3.max.y - box3.min.y;
      box3.getCenter(center);
      box3.getBoundingSphere(sphere);

      this.outerGroup.value.position.set(
        -center.x,
        -center.y + (alignTop ? height / 2 : 0),
        -center.z
      );
    })
  );

  get innerGroup(): NgtRef<THREE.Group> {
    return this.get((s) => s['innerGroup']);
  }

  get outerGroup(): NgtRef<THREE.Group> {
    return this.get((s) => s['outerGroup']);
  }

  override preInit(): void {
    super.preInit();
    this.set((s) => ({
      innerGroup: new NgtRef(),
      outerGroup: new NgtRef(),
      alignTop: s['alignTop'] ?? false,
    }));
  }

  override postInit(): void {
    super.postInit();
    const innerGroup$ = this.innerGroup.pipe(
      filter((innerGroup) => innerGroup != null)
    );

    this.#setPosition(
      this.select(
        innerGroup$,
        innerGroup$.pipe(
          switchMap((innerGroup) => {
            const innerGroupInternalNode = getInstanceInternal(innerGroup);
            if (innerGroupInternalNode) return innerGroupInternalNode.objects;
            return new NgtRef<NgtRef[]>([]);
          }),
          filter((objects) => objects.length === 0),
          observeOn(asyncScheduler)
        ),
        this.outerGroup.pipe(filter((outerGroup) => outerGroup != null)),
        this.select((s) => s['alignTop'])
      )
    );
  }
}
