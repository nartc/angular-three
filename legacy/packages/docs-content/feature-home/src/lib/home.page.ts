import { NgtCamera } from '@angular-three/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, NgZone } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import {
  Color,
  DirectionalLight,
  MeshPhongMaterial,
  PointLight,
  Scene,
} from 'three';
import ThreeGlobe from 'three-globe';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'docs-home',
  template: `
    <ng-container *ngIf="data$ | async as data">
      <ngt-canvas
        [camera]="{ position: [0, 0, 400] }"
        [scene]="{
          fog: ['#545ef3', 400, 2000] | fog
        }"
        (created)="onCanvasCreated($event, data)"
      >
        <ngt-perspective-camera></ngt-perspective-camera>

        <ngt-ambient-light
          [intensity]="0.3"
          [color]="'#bbbbbb'"
        ></ngt-ambient-light>
        <ngt-directional-light
          [intensity]="0.8"
          [position]="[-800, 2000, 400]"
        ></ngt-directional-light>

        <ngt-orbit-controls
          (ready)="onOrbitControlsReady($event)"
          (animateReady)="onOrbitControlsAnimateReady($event.animateObject)"
        ></ngt-orbit-controls>
      </ngt-canvas>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        width: 100vw;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  globe!: ThreeGlobe;
  data$ = forkJoin([
    this.httpClient.get('assets/globe-data-min.json'),
    this.httpClient.get('assets/my-flights.json'),
    this.httpClient.get('assets/my-airports.json'),
  ]).pipe(
    map(([countries, travels, airports]) => ({ countries, travels, airports }))
  );

  constructor(private ngZone: NgZone, private httpClient: HttpClient) {}

  onCanvasCreated(
    { camera, scene }: { camera: NgtCamera; scene: Scene },
    data: Record<string, any>
  ) {
    this.ngZone.runOutsideAngular(() => {
      scene.background = new Color(0x040d21);

      const dLight = new DirectionalLight(0xffffff, 0.8);
      dLight.position.set(-800, 2000, 400);
      camera.add(dLight);

      const dLight1 = new DirectionalLight(0x7982f6, 1);
      dLight1.position.set(-200, 500, 200);
      camera.add(dLight1);

      const pLight = new PointLight(0x8566cc, 0.5);
      pLight.position.set(-200, 500, 200);
      camera.add(pLight);

      this.initGlobe(data);
      scene.add(this.globe);
    });
  }

  onOrbitControlsReady(controls: OrbitControls) {
    this.ngZone.runOutsideAngular(() => {
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.enablePan = false;
      controls.minDistance = 200;
      controls.maxDistance = 500;
      controls.rotateSpeed = 0.8;
      controls.zoomSpeed = 1;
      controls.autoRotate = true;
      controls.minPolarAngle = Math.PI / 3.35;
      controls.maxPolarAngle = Math.PI - Math.PI / 3;
    });
  }

  onOrbitControlsAnimateReady(controls: OrbitControls) {
    controls.update();
  }

  private initGlobe({ countries, travels, airports }: Record<string, any>) {
    this.globe = new ThreeGlobe()
      .arcsData(travels.flights)
      .arcColor((e: any) => (e.status ? '#9cff00' : '#ff4000'))
      .arcAltitude((e: any) => e.arcAlt)
      .arcStroke((e: any) => (e.status ? 0.5 : 0.3))
      .arcDashLength(0.9)
      .arcDashGap(4)
      .arcDashAnimateTime(1000)
      .arcsTransitionDuration(1000)
      .arcDashInitialGap((e: any) => e.order * 1)
      .labelsData(airports.airports)
      .labelColor(() => '#ffcb21')
      .labelDotOrientation((e: any) => (e.text === 'ALA' ? 'top' : 'right'))
      .labelDotRadius(0.3)
      .labelSize((e: any) => e.size)
      .labelText('city')
      .labelResolution(6)
      .labelAltitude(0.01)
      .pointsData(airports.airports)
      .pointColor(() => '#ffffff')
      .pointsMerge(true)
      .pointAltitude(0.07)
      .pointRadius(0.05)
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(false)
      .hexPolygonColor((e: any) =>
        ['KGZ', 'KOR', 'THA', 'RUS', 'UZB', 'IDN', 'KAZ', 'MYS'].includes(
          e.properties.ISO_A3
        )
          ? 'rgba(255, 255, 255, 1)'
          : 'rgba(255, 255, 255, 0.7)'
      );

    this.globe.rotateY(-Math.PI * (5 / 9));
    this.globe.rotateY(-Math.PI * 6);

    const globeMaterial = this.globe.globeMaterial() as MeshPhongMaterial;
    globeMaterial.color = new Color(0x3a228a);
    globeMaterial.emissive = new Color(0x220038);
    globeMaterial.emissiveIntensity = 0.1;
    globeMaterial.shininess = 0.7;
  }
}
