import { OrbitControlsModule } from '@angular-three/controls';
import { InstancedBufferAttributeModule } from '@angular-three/core/attributes';
import { ThreeCoreCanvasModule } from '@angular-three/core/canvas';
import { BoxBufferGeometryModule } from '@angular-three/core/geometries';
import {
  AmbientLightModule,
  PointLightModule,
  SpotLightModule,
} from '@angular-three/core/lights';
import {
  MeshNormalMaterialModule,
  MeshPhongMaterialModule,
  MeshStandardMaterialModule,
} from '@angular-three/core/materials';
import { InstancedMeshModule, MeshModule } from '@angular-three/core/meshes';
import { ThreeCoreStatsModule } from '@angular-three/core/stats';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoxComponent } from './box.component';
import { BoxesComponent } from './boxes.component';
import { OrbitControlsComponent } from './orbit-controls.component';
import { SuzanneComponent } from './suzanne.component';

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
    ThreeCoreCanvasModule,
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
