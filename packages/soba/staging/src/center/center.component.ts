import {
  EnhancedRxState,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtObject3dInputsController,
  NgtObject3dInputsControllerModule,
  NgtSobaExtender,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Inject,
  Input,
  NgModule,
  QueryList,
} from '@angular/core';
import { setTimeout } from '@rx-angular/cdk/zone-less';
import { startWith } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-center',
  template: `
    <ngt-group
      (ready)="object = $event"
      [object3dInputsController]="objectInputsController"
    >
      <ngt-group name="outer-soba-center-group">
        <ngt-group name="inner-soba-center-group">
          <ng-content></ng-content>
        </ngt-group>
      </ngt-group>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    { provide: NgtSobaExtender, useExisting: NgtSobaCenter },
    EnhancedRxState,
  ],
})
export class NgtSobaCenter extends NgtSobaExtender<THREE.Group> {
  @Input() set alignTop(alignTop: boolean) {
    this.state.set({ alignTop });
  }

  @ContentChildren(NgtObject3dInputsController) set children(
    v: QueryList<NgtObject3dInputsController>
  ) {
    this.state.hold(
      v.changes.pipe(startWith(v)),
      (queryList: QueryList<NgtObject3dInputsController>) => {
        setTimeout(() => {
          queryList.forEach((controller) => {
            controller.appendTo = () => this.innerGroup;
          });
          this.outerGroup.position.set(0, 0, 0);
          this.outerGroup.updateWorldMatrix(true, true);
          const box3 = new THREE.Box3().setFromObject(this.innerGroup);
          const center = new THREE.Vector3();
          const sphere = new THREE.Sphere();
          const height = box3.max.y - box3.min.y;
          box3.getCenter(center);
          box3.getBoundingSphere(sphere);
          this.outerGroup.position.set(
            -center.x,
            -center.y + (this.state.get('alignTop') ? height / 2 : 0),
            -center.z
          );
        });
      }
    );
  }

  get outerGroup() {
    return this.object.children[0] as THREE.Group;
  }

  get innerGroup() {
    return this.outerGroup.children[0] as THREE.Group;
  }

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController,
    private state: EnhancedRxState<{ alignTop: boolean }>
  ) {
    super();
    state.set({ alignTop: false });
  }
}

@NgModule({
  declarations: [NgtSobaCenter],
  exports: [NgtSobaCenter, NgtObject3dInputsControllerModule],
  imports: [NgtGroupModule],
})
export class NgtSobaCenterModule {}
