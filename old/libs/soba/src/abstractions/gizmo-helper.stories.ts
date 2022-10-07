import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import {
  NgtSobaGizmoHelperModule,
  NgtSobaGizmoViewcubeModule,
  NgtSobaGizmoViewportModule,
} from '@angular-three/soba/abstractions';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtGLTFLoader } from '@angular-three/soba/loaders';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

@Component({
  selector: 'ngt-default-gizmo',
  template: `
    <ng-container *ngIf="node$ | async as node">
      <ngt-soba-gizmo-helper [alignment]="alignment" [margin]="margin">
        <ng-template ngt-soba-gizmo-helper-content>
          <ngt-soba-gizmo-viewcube
            *ngIf="mode === 'viewcube'; else viewport"
            [faces]="['Right', 'Left', 'Top', 'Bottom', 'Front', 'Back']"
            opacity="1"
            color="white"
            strokeColor="gray"
            textColor="black"
            hoverColor="lightgray"
          ></ngt-soba-gizmo-viewcube>

          <ng-template #viewport>
            <ngt-soba-gizmo-viewport
              [axisColors]="['red', 'green', 'blue']"
              labelColor="black"
              hideNegativeAxes="false"
            ></ngt-soba-gizmo-viewport>
          </ng-template>
        </ng-template>
      </ngt-soba-gizmo-helper>

      <ngt-primitive [object]="node.scene" [scale]="0.01"></ngt-primitive>

      <ngt-soba-orbit-controls makeDefault></ngt-soba-orbit-controls>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DefaultGizmo {
  node$ = this.gltfLoader.load('soba/assets/LittlestTokyo.glb');

  @Input() mode: 'viewport' | 'viewcube' = 'viewcube';
  @Input() alignment: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left' = 'bottom-right';
  @Input() margin: [number, number] = [80, 80];

  constructor(private gltfLoader: NgtGLTFLoader) {}
}

@NgModule({
  declarations: [DefaultGizmo],
  exports: [DefaultGizmo],
  imports: [
    CommonModule,
    NgtPrimitiveModule,
    NgtSobaOrbitControlsModule,
    NgtSobaGizmoHelperModule,
    NgtSobaGizmoViewcubeModule,
    NgtSobaGizmoViewportModule,
  ],
})
class DefaultGizmoModule {}

export default {
  title: 'Abstractions/Gizmo Helper',
  decorators: [
    componentWrapperDecorator(setupCanvas({ cameraPosition: [0, 0, 10], controls: false })),
    moduleMetadata({
      imports: [...setupCanvasModules, DefaultGizmoModule],
    }),
  ],
  argTypes: {
    alignment: {
      options: ['top-left', 'top-right', 'bottom-right', 'bottom-left'],
      control: { type: 'select' },
    },
    mode: {
      options: ['viewcube', 'viewport'],
      control: { type: 'select' },
    },
  },
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  template: `
        <ngt-default-gizmo [mode]="mode" [alignment]="alignment" [margin]="margin"></ngt-default-gizmo>
    `,
});

Default.args = {
  mode: 'viewport',
  alignment: 'bottom-right',
  margin: [80, 80],
};
