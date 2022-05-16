import { NgtCanvasModule } from '@angular-three/core';
import { NgtGridHelperModule } from '@angular-three/core/helpers';
import { NgtAmbientLightModule, NgtPointLightModule, NgtSpotLightModule } from '@angular-three/core/lights';
import { NgtSobaGizmoHelperModule, NgtSobaGizmoViewcubeModule } from '@angular-three/soba/abstractions';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sandbox-sandbox',
  template: `
    <ngt-canvas initialLog projectContent>
      <ngt-ambient-light intensity="0.5"></ngt-ambient-light>
      <ngt-spot-light [position]="10" angle="0.15" penumbra="1"></ngt-spot-light>
      <ngt-point-light [position]="-10"></ngt-point-light>
      <ngt-grid-helper [args]="[10000, 100, '#00b0bd', '#ff0000']"></ngt-grid-helper>

      <ngt-soba-gizmo-helper name="GizmoHelper" [alignment]="'top-right'" [margin]="[80, 80]" [scale]="0.75">
        <ng-template ngt-soba-gizmo-helper-content>
          <ngt-soba-gizmo-viewcube
            [faces]="['右', '左', '上', '下', '前', '后']"
            font="4rem Inter var, Arial, sans-serif"
            opacity="1"
            color="#00c8d6"
            strokeColor="#00b0bd"
            textColor="black"
            hoverColor="#00b0bd"
          ></ngt-soba-gizmo-viewcube>
        </ng-template>
      </ngt-soba-gizmo-helper>
      <ngt-soba-orbit-controls makeDefault></ngt-soba-orbit-controls>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxComponent {}

@NgModule({
  declarations: [SandboxComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SandboxComponent,
      },
    ]),
    NgtCanvasModule,
    NgtAmbientLightModule,
    NgtSpotLightModule,
    NgtPointLightModule,
    NgtGridHelperModule,
    NgtSobaGizmoHelperModule,
    NgtSobaGizmoViewcubeModule,
    NgtSobaOrbitControlsModule,
  ],
})
export class SandboxComponentModule {}
