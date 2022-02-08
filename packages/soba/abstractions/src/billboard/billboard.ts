import {
  createExtenderProvider,
  createParentObjectProvider,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtExtender,
  NgtObjectInputsController,
  NgtObjectInputsControllerModule,
  NgtRender,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Inject,
  Input,
  NgModule,
  NgZone,
  TemplateRef,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ng-template[sobaBillboardContent]',
  exportAs: 'ngtSobaBillboardContent',
})
export class NgtSobaBillboardContent {
  constructor(public templateRef: TemplateRef<{ group: THREE.Group }>) {}
}

@Component({
  selector: 'ngt-soba-billboard',
  template: `
    <ngt-group
      (ready)="onGroupReady($event)"
      (animateReady)="onGroupAnimate($event.object, $event.state)"
      [objectInputsController]="objectInputsController"
    >
      <ng-container
        *ngIf="object"
        [ngTemplateOutlet]="content.templateRef"
        [ngTemplateOutletContext]="{ group: object }"
      ></ng-container>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    createExtenderProvider(NgtSobaBillboard),
    createParentObjectProvider(
      NgtSobaBillboard,
      (billboard) => billboard.object
    ),
  ],
})
export class NgtSobaBillboard extends NgtExtender<THREE.Group> {
  @Input() follow = true;
  @Input() lockX = false;
  @Input() lockY = false;
  @Input() lockZ = false;

  @ContentChild(NgtSobaBillboardContent, { static: true })
  content!: NgtSobaBillboardContent;

  @ContentChild(NgtObjectInputsController)
  childInputsController?: NgtObjectInputsController;

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObjectInputsController,
    private zone: NgZone
  ) {
    super();
  }

  onGroupAnimate(group: THREE.Object3D, $event: NgtRender) {
    if (!this.follow) return;

    this.animateReady.emit({ entity: group as THREE.Group, state: $event });

    // save previous rotation in case we're locking an axis
    const prevRotation = group.rotation.clone();

    // always face the camera
    group.quaternion.copy($event.camera.quaternion);

    // readjust any axis that is locked
    if (this.lockX) group.rotation.x = prevRotation.x;
    if (this.lockY) group.rotation.y = prevRotation.y;
    if (this.lockZ) group.rotation.z = prevRotation.z;
  }

  onGroupReady(group: THREE.Group) {
    this.zone.run(() => {
      this.object = group;
    });
  }
}

@NgModule({
  declarations: [NgtSobaBillboard, NgtSobaBillboardContent],
  exports: [
    NgtSobaBillboard,
    NgtSobaBillboardContent,
    NgtObjectInputsControllerModule,
  ],
  imports: [NgtGroupModule, CommonModule],
})
export class NgtSobaBillboardModule {}
