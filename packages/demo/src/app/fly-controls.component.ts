import { AnimationStore } from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Clock } from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

@Component({
  selector: 'demo-fly-controls',
  template: `
    <ngt-flyControls (ready)="onControlsReady($event)"></ngt-flyControls>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlyControlsComponent {
  clock = new Clock();

  constructor(private readonly animationStore: AnimationStore) {}

  onControlsReady(flyControls: FlyControls) {
    flyControls.movementSpeed = 1000;
    flyControls.rollSpeed = Math.PI / 10;

    this.animationStore.registerAnimation(({ delta }) => {
      flyControls.update(delta);
    });
  }
}
