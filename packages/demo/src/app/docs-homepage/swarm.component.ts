import type { AnimationReady, ThreeVector3 } from '@angular-three/core';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { InstancedMesh, Object3D } from 'three';

@Component({
  selector: 'demo-swarm',
  template: `
    <ngt-instanced-mesh
      [args]="[count]"
      [castShadow]="true"
      [receiveShadow]="true"
      [position]="position"
      (animateReady)="onMeshAnimateReady($event)"
    >
      <ngt-sphere-buffer-geometry
        [args]="[1, 32, 32]"
      ></ngt-sphere-buffer-geometry>
      <ngt-mesh-standard-material
        [parameters]="{ color: '#f0f0f0', roughness: 0 }"
      ></ngt-mesh-standard-material>
    </ngt-instanced-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwarmComponent implements OnChanges {
  @Input() count = 0;
  @Input() position?: ThreeVector3;

  private dummy = new Object3D();
  private particles: Array<{
    t: number;
    factor: number;
    speed: number;
    xFactor: number;
    yFactor: number;
    zFactor: number;
    mx: number;
    my: number;
  }> = [];

  ngOnChanges() {
    for (let i = 0; i < this.count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -40 + Math.random() * 80;
      const yFactor = -20 + Math.random() * 40;
      const zFactor = -20 + Math.random() * 40;
      this.particles.push({
        t,
        factor,
        speed,
        xFactor,
        yFactor,
        zFactor,
        mx: 0,
        my: 0,
      });
    }
  }

  onMeshAnimateReady({
    animateObject,
    renderState: { mouse, size },
  }: AnimationReady<InstancedMesh>) {
    this.particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.max(1.5, Math.cos(t) * 5);
      particle.mx += (mouse.x * size.width - particle.mx) * 0.02;
      particle.my += (mouse.y * size.height - particle.my) * 0.02;
      this.dummy.position.set(
        (particle.mx / 10) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t) * factor) / 10,
        (particle.my / 10) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 3) * factor) / 10
      );
      this.dummy.scale.set(s, s, s);
      this.dummy.updateMatrix();
      animateObject.setMatrixAt(i, this.dummy.matrix);
    });
    animateObject.instanceMatrix.needsUpdate = true;
  }
}
