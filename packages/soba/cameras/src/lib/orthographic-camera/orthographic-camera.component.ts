import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NgtCoreModule,
} from '@angular-three/core';
import { NgtOrthographicCameraModule } from '@angular-three/core/cameras';
import { NgtSobaExtender } from '@angular-three/soba';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnInit,
} from '@angular/core';
import * as THREE from 'three';
import { SobaOrthographicCameraStore } from './orthographic-camera.store';

@Component({
  selector: 'ngt-soba-orthographic-camera',
  exportAs: 'ngtSobaOrthographicCamera',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <ngt-orthographic-camera
        [args]="[vm.left, vm.right, vm.top, vm.bottom, vm.near, vm.far]"
        [object3dController]="vm.object3dController"
        (ready)="ready.emit($event)"
        (animateReady)="animateReady.emit($event)"
      >
        <ng-content></ng-content>
      </ngt-orthographic-camera>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_OBJECT_3D_CONTROLLER_PROVIDER, SobaOrthographicCameraStore],
})
export class NgtSobaOrthographicCamera
  extends NgtSobaExtender<THREE.OrthographicCamera>
  implements OnInit
{
  @Input() set makeDefault(v: boolean) {
    this.sobaOrthographicCameraStore.updaters.setMakeDefault(v);
  }

  @Input() set manual(v: boolean) {
    this.sobaOrthographicCameraStore.updaters.setManual(v);
  }

  @Input() set near(v: number) {
    this.sobaOrthographicCameraStore.updaters.setNear(v);
  }

  @Input() set far(v: number) {
    this.sobaOrthographicCameraStore.updaters.setFar(v);
  }

  readonly vm$ = this.sobaOrthographicCameraStore.vm$;

  constructor(
    private sobaOrthographicCameraStore: SobaOrthographicCameraStore
  ) {
    super();
  }

  ngOnInit() {
    this.sobaOrthographicCameraStore.initEffect();
  }
}

@NgModule({
  declarations: [NgtSobaOrthographicCamera],
  exports: [NgtSobaOrthographicCamera],
  imports: [NgtOrthographicCameraModule, NgtCoreModule, CommonModule],
})
export class NgtSobaOrthographicCameraModule {}
