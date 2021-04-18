import { ThreeOrbitControlsModule } from '@angular-three/controls';
import { ThreeInstancedBufferAttributeModule } from '@angular-three/core/attributes';
import { ThreeCanvasModule } from '@angular-three/core/canvas';
import { ThreeBoxBufferGeometryModule, ThreeTextBufferGeometryModule } from "@angular-three/core/geometries";
import { ThreeGroupModule } from "@angular-three/core/group";
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
import { ThreeSceneModule } from "@angular-three/core/scene";
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
import { TextComponent } from './gltf-fonts/text.component';
import { BirdComponent } from './gltf-fonts/bird.component';
import { BirdsComponent } from './gltf-fonts/birds.component';
import { JumboComponent } from './gltf-fonts/jumbo.component';

@NgModule({
  declarations: [
    AppComponent,
    BoxComponent,
    SuzanneComponent,
    OrbitControlsComponent,
    BoxesComponent,
    BoxesEffectsComponent,
    TextComponent,
    BirdComponent,
    BirdsComponent,
    JumboComponent,
  ],
  imports: [
    BrowserModule,
    ThreeCanvasModule,
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
    ThreeGroupModule,
    ThreeTextBufferGeometryModule,
    ThreeSceneModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
