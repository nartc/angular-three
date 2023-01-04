import { extend, NgtPush } from '@angular-three/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { Group, OrthographicCamera } from 'three';
import { NgtsCamera } from '../camera/camera';
import { NgtsCameraContent } from '../camera/camera-content';

extend({ OrthographicCamera, Group });

@Component({
  selector: 'ngts-orthographic-camera',
  standalone: true,
  template: `
    <ngt-orthographic-camera
      *ref="cameraRef"
      ngtCompound
      [left]="left$ | ngtPush : 0"
      [right]="right$ | ngtPush : 0"
      [top]="top$ | ngtPush : 0"
      [bottom]="bottom$ | ngtPush : 0"
    >
      <ng-container
        *ngIf="cameraContent && !cameraContent.ngtsCameraContent"
        [ngTemplateOutlet]="cameraContent.template"
      ></ng-container>
    </ngt-orthographic-camera>
    <ngt-group #group>
      <ng-container
        *ngIf="cameraContent && cameraContent.ngtsCameraContent"
        [ngTemplateOutlet]="cameraContent.template"
        [ngTemplateOutletContext]="{ fbo: fboRef.nativeElement, group }"
      ></ng-container>
    </ngt-group>
  `,
  imports: [NgIf, NgTemplateOutlet, NgtPush],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsOrthographicCamera extends NgtsCamera<THREE.OrthographicCamera> {
  @ContentChild(NgtsCameraContent) cameraContent?: NgtsCameraContent;

  @Input() set left(left: number) {
    this.set({ left });
  }

  @Input() set right(right: number) {
    this.set({ right });
  }

  @Input() set top(top: number) {
    this.set({ top });
  }

  @Input() set bottom(bottom: number) {
    this.set({ bottom });
  }

  readonly left$ = combineLatest([this.select('left'), this.store.select('size')]).pipe(
    map(([left, size]) => left ?? size.width / -2)
  );

  readonly right$ = combineLatest([this.select('right'), this.store.select('size')]).pipe(
    map(([right, size]) => right ?? size.width / 2)
  );

  readonly top$ = combineLatest([this.select('top'), this.store.select('size')]).pipe(
    map(([top, size]) => top ?? size.height / 2)
  );

  readonly bottom$ = combineLatest([this.select('bottom'), this.store.select('size')]).pipe(
    map(([bottom, size]) => bottom ?? size.height / -2)
  );
}
