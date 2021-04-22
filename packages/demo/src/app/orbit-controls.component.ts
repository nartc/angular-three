import { AnimationStore } from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'demo-orbit-controls',
  template: `
    <ngt-orbitControls
      (zonelessReady)="onControlsReady($event)"
    ></ngt-orbitControls>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrbitControlsComponent {
  constructor(private readonly animationStore: AnimationStore) {}

  onControlsReady(controls: OrbitControls) {
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 5;
    controls.maxDistance = 100;

    controls.maxPolarAngle = Math.PI / 2;

    this.animationStore.registerAnimation(() => {
      controls.update();
    });
  }
}
