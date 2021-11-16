import { NgtCannonModule } from '@angular-three/cannon';
import { NgtPhysicBoxModule } from '@angular-three/cannon/box';
import { NgtPhysicPlaneModule } from '@angular-three/cannon/plane';
import { NgtCoreModule, NgtMathPipeModule } from '@angular-three/core';
import {
  NgtBoxGeometryModule,
  NgtPlaneGeometryModule,
} from '@angular-three/core/geometries';
import {
  NgtAmbientLightModule,
  NgtDirectionalLightModule,
} from '@angular-three/core/lights';
import {
  NgtMeshBasicMaterialModule,
  NgtMeshPhongMaterialModule,
  NgtShadowMaterialModule,
} from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent, BoxComponent, PlaneComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, PlaneComponent, BoxComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
