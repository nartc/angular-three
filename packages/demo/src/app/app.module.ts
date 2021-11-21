import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgtCannonModule } from '@angular-three/cannon';
import { NgtPhysicBoxModule } from '@angular-three/cannon/box';
import { NgtPhysicPlaneModule } from '@angular-three/cannon/plane';
import { NgtPhysicSphereModule } from '@angular-three/cannon/sphere';
import { NgtOrbitControlsModule } from '@angular-three/controls/orbit-controls';
import {
  NgtCoreModule,
  NgtMathPipeModule,
  NgtVectorPipeModule,
} from '@angular-three/core';
import { NgtInstancedBufferAttributeModule } from '@angular-three/core/attributes';
import {
  NgtBoxGeometryModule,
  NgtCylinderGeometryModule,
  NgtPlaneGeometryModule,
  NgtSphereGeometryModule,
} from '@angular-three/core/geometries';
import {
  NgtCameraHelperModule,
  NgtSpotLightHelperModule,
} from '@angular-three/core/helpers';
import {
  NgtAmbientLightModule,
  NgtDirectionalLightModule,
  NgtHemisphereLightModule,
  NgtPointLightModule,
  NgtSpotLightModule,
} from '@angular-three/core/lights';
import {
  NgtMeshBasicMaterialModule,
  NgtMeshLambertMaterialModule,
  NgtMeshPhongMaterialModule,
  NgtShadowMaterialModule,
} from '@angular-three/core/materials';
import {
  NgtInstancedMeshModule,
  NgtMeshModule,
} from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';

import {
  AppComponent,
  BoxComponent,
  InstancedSpheresComponent,
  PlaneComponent,
} from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaneComponent,
    BoxComponent,
    InstancedSpheresComponent,
  ],
  imports: [
    BrowserModule,
    NgtCoreModule,
    NgtMeshModule,
    NgtAmbientLightModule,
    NgtDirectionalLightModule,
    NgtBoxGeometryModule,
    NgtMeshPhongMaterialModule,
    NgtCannonModule,
    NgtPhysicBoxModule,
    NgtPlaneGeometryModule,
    NgtShadowMaterialModule,
    NgtPhysicPlaneModule,
    NgtMeshBasicMaterialModule,
    NgtMathPipeModule,
    NgtMeshLambertMaterialModule,
    NgtInstancedMeshModule,
    NgtPhysicSphereModule,
    NgtSphereGeometryModule,
    NgtInstancedBufferAttributeModule,
    NgtHemisphereLightModule,
    NgtSpotLightModule,
    NgtPointLightModule,
    NgtSpotLightHelperModule,
    NgtOrbitControlsModule,
    NgtCameraHelperModule,
    NgtCylinderGeometryModule,
    NgtStatsModule,
    NgtVectorPipeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
