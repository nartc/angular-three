import { ThreeOrbitControlsModule } from '@angular-three/controls';
import { ThreeInstancedBufferAttributeModule } from '@angular-three/core/attributes';
import { ThreeCoreCanvasModule } from '@angular-three/core/canvas';
import { ThreeBoxBufferGeometryModule } from '@angular-three/core/geometries';
import {
  ThreeAmbientLightModule,
  ThreePointLightModule,
  ThreeSpotLightModule,
} from '@angular-three/core/lights';
import {
  ThreeMeshNormalMaterialModule,
  ThreeMeshPhongMaterialModule,
  ThreeMeshStandardMaterialModule,
} from '@angular-three/core/materials';
import { ThreeInstancedMeshModule, ThreeMeshModule } from '@angular-three/core/meshes';
import { ThreeStatsModule } from '@angular-three/core/stats';
import { ThreePostprocessingModule } from '@angular-three/postprocessing';
import { ThreeRenderPassModule } from '@angular-three/postprocessing/render-pass';
import { ThreeShaderPassModule } from '@angular-three/postprocessing/shader-pass';
import { ThreeSsaoPassModule } from '@angular-three/postprocessing/ssao-pass';
import { ThreeUnrealBloomPassModule } from '@angular-three/postprocessing/unreal-bloom-pass';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoxComponent } from './box.component';
import { BoxesEffectsComponent } from './boxes-effects.component';
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
    BoxesEffectsComponent,
  ],
  imports: [
    BrowserModule,
    ThreeCoreCanvasModule,
    ThreeAmbientLightModule,
    ThreeSpotLightModule,
    ThreePointLightModule,
    ThreeMeshModule,
    ThreeBoxBufferGeometryModule,
    ThreeMeshStandardMaterialModule,
    ThreeInstancedMeshModule,
    ThreeMeshNormalMaterialModule,
    ThreeStatsModule,
    ThreeOrbitControlsModule,
    ThreeInstancedBufferAttributeModule,
    ThreeMeshPhongMaterialModule,
    ThreePostprocessingModule,
    ThreeRenderPassModule,
    ThreeSsaoPassModule,
    ThreeUnrealBloomPassModule,
    ThreeShaderPassModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
