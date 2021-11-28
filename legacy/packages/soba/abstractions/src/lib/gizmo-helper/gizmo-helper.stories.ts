import {
  CanvasStore,
  NgtCoreModule,
  NgtPrimitiveModule,
} from '@angular-three/core';
import {
  NgtAmbientLightModule,
  NgtPointLightModule,
} from '@angular-three/core/lights';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { GLTFLoaderService } from '@angular-three/soba/loaders';
import { setupCanvas } from '@angular-three/storybook';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import {
  NgtSobaGizmoHelper,
  NgtSobaGizmoHelperModule,
} from './gizmo-helper.component';
import { NgtSobaGizmoViewcubeModule } from './gizmo-viewcube.component';

@Component({
  selector: 'app-default-gizmo',
  template: `
    <ng-container *ngIf="scene$ | async as scene">
      <ngt-primitive
        [object]="scene.scene"
        (ready)="$event.scale.set(0.01, 0.01, 0.01)"
      ></ngt-primitive>
    </ng-container>
    <ngt-soba-gizmo-viewcube></ngt-soba-gizmo-viewcube>
    <!--    <ngt-soba-gizmo-helper-->
    <!--      #gizmo="ngtSobaGizmoHelper"-->
    <!--      [alignment]="alignment"-->
    <!--      [margin]="margin"-->
    <!--    >-->
    <!--      <ngt-soba-gizmo-viewcube-->
    <!--        [appendTo]="gizmo.gizmo"-->
    <!--      ></ngt-soba-gizmo-viewcube>-->
    <!--    </ngt-soba-gizmo-helper>-->
    <ngt-soba-orbit-controls [makeDefault]="true"></ngt-soba-orbit-controls>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DefaultGizmoComponent {
  scene$ = this.gltfLoaderService.load('/LittlestTokyo.glb');

  @Input() alignment?:
    | 'top-left'
    | 'top-right'
    | 'bottom-right'
    | 'bottom-left' = 'bottom-right';
  @Input() margin?: [number, number];

  constructor(
    private gltfLoaderService: GLTFLoaderService,
    private canvasStore: CanvasStore
  ) {}

  ngOnInit() {
    this.canvasStore.selectors.scene$.subscribe(console.log);
  }
}

export default {
  title: 'Abstractions/GizmoHelper',
  component: NgtSobaGizmoHelper,
  decorators: [
    componentWrapperDecorator(
      setupCanvas({ controls: false, cameraPosition: [0, 0, 10], black: true })
    ),
    moduleMetadata({
      declarations: [DefaultGizmoComponent],
      imports: [
        CommonModule,
        NgtCoreModule,
        NgtStatsModule,
        NgtSobaGizmoHelperModule,
        NgtSobaGizmoViewcubeModule,
        NgtPrimitiveModule,
        NgtSobaOrbitControlsModule,
        NgtAmbientLightModule,
        NgtPointLightModule,
      ],
    }),
  ],
} as Meta;

export const Default: Story<NgtSobaGizmoHelper> = (args) => ({
  props: args,
  template: `
    <app-default-gizmo [alignment]='alignment' [margin]='margin'></app-default-gizmo>
  `,
});

Default.args = {
  alignment: 'bottom-right',
  margin: [80, 80],
};
