import { AnimationReady } from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Group } from 'three';

@Component({
  selector: 'demo-jumbo',
  template: `
    <ngt-group (animateReady)="onGroupReady($event)">
      <demo-text
        hAlign="left"
        [position]="[0, 4.2, 0]"
        text="ANGULAR"
      ></demo-text>
      <demo-text hAlign="left" [position]="[0, 0, 0]" text="THREE"></demo-text>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JumboComponent {
  onGroupReady({
    animateObject,
    renderState: { clock },
  }: AnimationReady<Group>) {
    animateObject.rotation.x =
      animateObject.rotation.y =
      animateObject.rotation.z =
        Math.sin(clock.getElapsedTime()) * 0.3;
  }
}
