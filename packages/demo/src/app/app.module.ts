import { ThreeCoreModule } from '@angular-three/core';
import { BoxBufferGeometryModule } from '@angular-three/core/geometries';
import {
  AmbientLightModule,
  PointLightModule,
  SpotLightModule,
} from '@angular-three/core/lights';
import { MeshNormalMaterialModule, MeshStandardMaterialModule } from "@angular-three/core/materials";
import { InstancedMeshModule, MeshModule } from "@angular-three/core/meshes";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoxComponent } from './box.component';
import { SuzanneComponent } from './suzanne.component';

@NgModule({
  declarations: [AppComponent, BoxComponent, SuzanneComponent],
  imports: [
    BrowserModule,
    ThreeCoreModule,
    AmbientLightModule,
    SpotLightModule,
    PointLightModule,
    MeshModule,
    BoxBufferGeometryModule,
    MeshStandardMaterialModule,
    InstancedMeshModule,
    MeshNormalMaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
