import { ThreeFlyControlsModule } from '@angular-three/controls/fly-controls';
import { ThreeOrbitControlsModule } from '@angular-three/controls/orbit-controls';
import { ThreeCoreModule } from '@angular-three/core';
import { ThreeInstancedBufferAttributeModule } from '@angular-three/core/attributes';
import {
  ThreeBoxBufferGeometryModule,
  ThreeIcosahedronBufferGeometryModule,
  ThreeSphereBufferGeometryModule,
  ThreeTextBufferGeometryModule,
} from '@angular-three/core/geometries';
import { ThreeGroupModule } from '@angular-three/core/group';
import {
  ThreeGridHelperModule,
  ThreePointLightHelperModule,
  ThreeSpotLightHelperModule,
} from '@angular-three/core/helpers';
import {
  ThreeAmbientLightModule,
  ThreeDirectionalLightModule,
  ThreePointLightModule,
  ThreeSpotLightModule,
} from '@angular-three/core/lights';
import { ThreeLodModule } from '@angular-three/core/lod';
import {
  ThreeMeshBasicMaterialModule,
  ThreeMeshLambertMaterialModule,
  ThreeMeshNormalMaterialModule,
  ThreeMeshPhongMaterialModule,
  ThreeMeshStandardMaterialModule,
} from '@angular-three/core/materials';
import {
  ThreeInstancedMeshModule,
  ThreeMeshModule,
} from '@angular-three/core/meshes';
import { ThreeSceneModule } from '@angular-three/core/scene';
import { ThreeStatsModule } from '@angular-three/core/stats';
import { ContactShadowsModule } from '@angular-three/helpers';
import { ThreePopmotionModule } from '@angular-three/popmotion';
import { ThreePostprocessingModule } from '@angular-three/postprocessing';
import { ThreeRenderPassModule } from '@angular-three/postprocessing/render-pass';
import { ThreeShaderPassModule } from '@angular-three/postprocessing/shader-pass';
import { ThreeSSAOPassModule } from '@angular-three/postprocessing/ssaopass';
import { ThreeUnrealBloomPassModule } from '@angular-three/postprocessing/unreal-bloom-pass';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoxComponent } from './box.component';
import { BoxesEffectsComponent } from './boxes-effects.component';
import { BoxesComponent } from './boxes.component';
import { SwarmComponent } from './docs-homepage/swarm.component';
import { FlyControlsComponent } from './fly-controls.component';
import { BirdComponent } from './gltf-fonts/bird.component';
import { BirdsComponent } from './gltf-fonts/birds.component';
import { JumboComponent } from './gltf-fonts/jumbo.component';
import { TextComponent } from './gltf-fonts/text.component';
import { LodComponent } from './lods.component';
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
    TextComponent,
    BirdComponent,
    BirdsComponent,
    JumboComponent,
    FlyControlsComponent,
    LodComponent,
    SwarmComponent,
  ],
  imports: [
    BrowserModule,
    ThreeCoreModule,
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
    ThreeUnrealBloomPassModule,
    ThreeShaderPassModule,
    ThreeGroupModule,
    ThreeTextBufferGeometryModule,
    ThreeSceneModule,
    ThreeDirectionalLightModule,
    ThreeIcosahedronBufferGeometryModule,
    ThreeMeshLambertMaterialModule,
    ThreeLodModule,
    ThreeFlyControlsModule,
    ThreeMeshBasicMaterialModule,
    ThreeGridHelperModule,
    ThreeSpotLightHelperModule,
    ThreePointLightHelperModule,
    ThreePopmotionModule,
    ThreeSphereBufferGeometryModule,
    ContactShadowsModule,
    ThreeSSAOPassModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
