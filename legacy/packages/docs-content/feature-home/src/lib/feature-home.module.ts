import { NgtOrbitControlsModule } from '@angular-three/controls/orbit-controls';
import { NgtCoreModule, NgtFogPipeModule } from '@angular-three/core';
import { NgtPerspectiveCameraModule } from '@angular-three/core/cameras';
import {
  NgtAmbientLightModule,
  NgtDirectionalLightModule,
} from '@angular-three/core/lights';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: HomePage }]),
    NgtCoreModule,
    NgtAmbientLightModule,
    NgtDirectionalLightModule,
    NgtFogPipeModule,
    NgtOrbitControlsModule,
    NgtPerspectiveCameraModule,
  ],
  declarations: [HomePage],
})
export class FeatureHomeModule {}
