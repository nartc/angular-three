import { extend, NgtPush, NgtRef, NgtWrapper } from '@angular-three/core-two';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Group, OrthographicCamera } from 'three';
import { NgtsCamera } from '../camera/camera';
import { NgtsCameraContent } from '../camera/camera-content';

extend({ OrthographicCamera, Group });

@NgtWrapper()
@Component({
  selector: 'ngts-orthographic-camera',
  standalone: true,
  template: `
    <ngt-orthographic-camera
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
    <ngt-group noWrap #group>
      <ng-container
        *ngIf="cameraContent && cameraContent.ngtsCameraContent"
        [ngTemplateOutlet]="cameraContent.template"
        [ngTemplateOutletContext]="{ fbo: fboRef.nativeElement, group }"
      ></ng-container>
    </ngt-group>
  `,
  imports: [NgtRef, NgIf, NgTemplateOutlet, NgtPush],
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

  readonly left$ = this.select(
    this.select((s) => s['left']),
    this.store.select((s) => s.size),
    (left, size) => left ?? size.width / -2
  );

  readonly right$ = this.select(
    this.select((s) => s['right']),
    this.store.select((s) => s.size),
    (right, size) => right ?? size.width / 2
  );

  readonly top$ = this.select(
    this.select((s) => s['top']),
    this.store.select((s) => s.size),
    (top, size) => top ?? size.height / 2
  );

  readonly bottom$ = this.select(
    this.select((s) => s['bottom']),
    this.store.select((s) => s.size),
    (bottom, size) => bottom ?? size.height / -2
  );
}
