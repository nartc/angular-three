import { AnimationStore } from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Group } from 'three';

@Component({
  selector: 'demo-jumbo',
  template: `
    <ngt-group (ready)="onGroupReady($event)">
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
  constructor(private readonly animationStore: AnimationStore) {}

  onGroupReady(group: Group) {
    this.animationStore.registerAnimation(({ clock }) => {
      group.rotation.x = group.rotation.y = group.rotation.z =
        Math.sin(clock.getElapsedTime()) * 0.3;
    });
  }
}
