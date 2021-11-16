import { BoxProps } from '@angular-three/cannon';
import { NgtVector3 } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-root',
  template: `
    <ngt-canvas
      [shadows]="true"
      [alpha]="false"
      [camera]="{ position: [-1, 5, 5], fov: 45 }"
      (created)="$event.gl.setClearColor('lightblue')"
    >
      <ngt-ambient-light></ngt-ambient-light>
      <ngt-directional-light
        [position]="[10, 10, 10]"
        [castShadow]="true"
      ></ngt-directional-light>

      <ngt-physics>
        <app-plane></app-plane>
        <app-box [position]="[0.1, 5, 0]"></app-box>
        <app-box [position]="[0, 10, -1]"></app-box>
        <app-box [position]="[0, 20, -2]"></app-box>
      </ngt-physics>
    </ngt-canvas>
  `,
})
export class AppComponent {}

@Component({
  selector: 'app-plane',
  template: `
    <ngt-mesh
      ngtPhysicPlane
      [rotation]="[-(1 | mathConst: 'PI') / 2, 0, 0]"
      [position]="[0, -2.5, 0]"
      [receiveShadow]="true"
    >
      <ngt-plane-geometry [args]="[1000, 1000]"></ngt-plane-geometry>
      <ngt-shadow-material
        [parameters]="{ color: '#171717', transparent: true, opacity: 0.4 }"
      ></ngt-shadow-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaneComponent {}

@Component({
  selector: 'app-box',
  template: `
    <ngt-mesh
      ngtPhysicBox
      [getPhysicProps]="getBoxProps"
      [castShadow]="true"
      [receiveShadow]="true"
      [rotation]="[0.4, 0.2, 0.5]"
      [position]="position"
    >
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-phong-material
        [parameters]="{ color: 'hotpink' }"
      ></ngt-mesh-phong-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxComponent {
  @Input() position?: NgtVector3;

  getBoxProps(): BoxProps {
    return { mass: 1 };
  }
}
