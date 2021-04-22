import { AnimationStore } from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

@Component({
  selector: 'demo-fly-controls',
  template: `
    <ngt-flyControls
      (zonelessReady)="onControlsReady($event)"
    ></ngt-flyControls>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlyControlsComponent {
  constructor(private readonly animationStore: AnimationStore) {}

  onControlsReady(flyControls: FlyControls) {
    flyControls.movementSpeed = 1000;
    flyControls.rollSpeed = Math.PI / 10;

    this.animationStore.registerAnimation(({ delta }) => {
      flyControls.update(delta);
    });
  }
}
