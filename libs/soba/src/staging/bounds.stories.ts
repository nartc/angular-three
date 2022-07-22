import {
  AnyFunction,
  NGT_OBJECT_HOST_REF,
  NGT_OBJECT_REF,
  NgtEvent,
  NgtObjectInputs,
  NgtObjectPassThroughModule,
  NgtPiPipeModule,
  NgtRadianPipeModule,
  NgtStore,
  provideObjectHostRef,
  Ref,
  UnknownRecord,
} from '@angular-three/core';
import { NgtColorAttributeModule, NgtValueAttributeModule } from '@angular-three/core/attributes';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtHemisphereLightModule, NgtSpotLightModule } from '@angular-three/core/lights';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtGLTFLoader } from '@angular-three/soba/loaders';
import { NgtSobaBoundsApi, NgtSobaBoundsModule, NgtSobaContactShadowsModule } from '@angular-three/soba/staging';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, NgZone, Optional, SkipSelf } from '@angular/core';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { pipe, switchMap, tap } from 'rxjs';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

@Component({
  selector: 'bounds-story',
  template: `
    <ngt-color attach="background" color="#f08080"></ngt-color>

    <ngt-spot-light [position]="[-100, -100, -100]" intensity="0.2" angle="0.3" penumbra="1"></ngt-spot-light>

    <ngt-hemisphere-light
      color="white"
      groundColor="#ff0f00"
      [position]="[-7, 25, 13]"
      intensity="1"
    ></ngt-hemisphere-light>

    <ngt-soba-bounds>
      <ng-template ngt-soba-bounds-content let-api="api">
        <ngt-group (click)="onGroupClick($event, api)" (pointermissed)="onPointerMissed($event, api)">
          <model name="Curly" [position]="[1, -11, -20]" [rotation]="[2, 0, -0]"></model>
          <model name="DNA" [position]="[20, 0, -17]" [rotation]="[1, 1, -2]"></model>
          <model name="Headphones" [position]="[20, 2, 4]" [rotation]="[1, 0, -1]"></model>
          <model name="Notebook" [position]="[-21, -15, -13]" [rotation]="[2, 0, 1]"></model>
          <model name="Rocket003" [position]="[18, 15, -25]" [rotation]="[1, 1, 0]"></model>
          <model name="Roundcube001" [position]="[-25, -4, 5]" [rotation]="[1, 0, 0]" [scale]="0.5"></model>
          <model name="Table" [position]="[1, -4, -28]" [rotation]="[1, 0, -1]" [scale]="0.5"></model>
          <model name="VR_Headset" [position]="[7, -15, 28]" [rotation]="[1, 0, -1]" [scale]="5"></model>
          <model name="Zeppelin" [position]="[-20, 10, 10]" [rotation]="[3, -1, 3]" [scale]="0.005"></model>
        </ngt-group>
      </ng-template>
    </ngt-soba-bounds>

    <ngt-soba-contact-shadows [position]="[0, -35, 0]" opacity="1" width="200" height="200" blur="1" far="50">
      <ngt-value [attach]="['rotation', 'x']" [value]="90 | radian"></ngt-value>
    </ngt-soba-contact-shadows>

    <ngt-soba-orbit-controls makeDefault minPolarAngle="0" [maxPolarAngle]="1.75 | pi"></ngt-soba-orbit-controls>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class BoundsStory {
  onGroupClick(event: NgtEvent<MouseEvent>, api: NgtSobaBoundsApi) {
    event.stopPropagation();
    event.delta <= 2 && api.refresh(event.object).fit();
  }

  onPointerMissed(event: NgtEvent<PointerEvent>, api: NgtSobaBoundsApi) {
    (event as unknown as UnknownRecord)['button'] === 0 && api.refresh().fit();
  }
}

@Component({
  selector: 'model',
  template: `
    <ng-container *ngIf="modelRef | async as model">
      <ngt-mesh
        [ngtObjectInputs]="this"
        [ngtObjectOutputs]="this"
        [geometry]="model.geometry"
        [material]="model.material"
        [dispose]="null"
      >
        <ngt-value [attach]="['material', 'emissive']" value="red"></ngt-value>
        <ngt-value [attach]="['material', 'roughness']" [value]="1"></ngt-value>
      </ngt-mesh>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideObjectHostRef(Model)],
})
class Model extends NgtObjectInputs<THREE.Mesh> {
  modelRef = new Ref<THREE.Mesh>();

  constructor(
    zone: NgZone,
    store: NgtStore,
    @Optional()
    @SkipSelf()
    @Inject(NGT_OBJECT_REF)
    parentObjectRef: AnyFunction<Ref<THREE.Object3D>>,
    @Optional()
    @SkipSelf()
    @Inject(NGT_OBJECT_HOST_REF)
    parentObjectHostRef: AnyFunction<Ref<THREE.Object3D>>,
    private gltfLoader: NgtGLTFLoader
  ) {
    super(zone, store, parentObjectRef, parentObjectHostRef);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadModel(this.select((s) => s.name));
  }

  private readonly loadModel = this.effect(
    pipe(
      switchMap(() => this.gltfLoader.load('soba/bounds-assets.glb')),
      tap(({ nodes }) => {
        const name = this.get((s) => s.name);
        this.modelRef.set(nodes[name] as THREE.Mesh);
      })
    )
  );
}

@NgModule({
  declarations: [BoundsStory, Model],
  exports: [BoundsStory],
  imports: [
    CommonModule,
    NgtGroupModule,
    NgtMeshModule,
    NgtObjectPassThroughModule,
    NgtSpotLightModule,
    NgtHemisphereLightModule,
    NgtSobaBoundsModule,
    NgtSobaOrbitControlsModule,
    NgtSobaContactShadowsModule,
    NgtValueAttributeModule,
    NgtRadianPipeModule,
    NgtPiPipeModule,
    NgtColorAttributeModule,
  ],
})
class BoundsStoryModule {}

export default {
  title: 'Staging/Bounds',
  decorators: [
    componentWrapperDecorator(
      setupCanvas({
        cameraFov: 50,
        cameraPosition: [0, -10, 100],
        controls: false,
        lights: false,
      })
    ),
    moduleMetadata({
      imports: [...setupCanvasModules, BoundsStoryModule],
    }),
  ],
} as Meta;

export const Default: Story = () => ({
  template: `
        <bounds-story></bounds-story>
    `,
});
