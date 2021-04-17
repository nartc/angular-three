import { OrbitControlsModule } from '@angular-three/controls/orbit-controls';
import { ThreeCoreModule } from '@angular-three/core';
import { InstancedBufferAttributeModule } from "@angular-three/core/attributes";
import { BoxBufferGeometryModule } from '@angular-three/core/geometries';
import {
  AmbientLightModule,
  PointLightModule,
  SpotLightModule,
} from '@angular-three/core/lights';
import {
  MeshNormalMaterialModule, MeshPhongMaterialModule,
  MeshStandardMaterialModule
} from "@angular-three/core/materials";
import { InstancedMeshModule, MeshModule } from '@angular-three/core/meshes';
import { ThreeCoreStatsModule } from '@angular-three/core/stats';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoxComponent } from './box.component';
import { OrbitControlsComponent } from './orbit-controls.component';
import { SuzanneComponent } from './suzanne.component';
import { BoxesComponent } from './boxes.component';

@NgModule({
  declarations: [
    AppComponent,
    BoxComponent,
    SuzanneComponent,
    OrbitControlsComponent,
    BoxesComponent,
  ],
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
    ThreeCoreStatsModule,
    OrbitControlsModule,
    InstancedBufferAttributeModule,
    MeshPhongMaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
