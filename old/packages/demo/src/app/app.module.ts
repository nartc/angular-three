import { NgtCoreModule } from '@angular-three/core';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent, CubeComponent } from './app.component';
import { KeenComponentModule } from './keen-bloom/keen-bloom.component';
import { KinematicCubeComponentModule } from './kinematic-cube/kinematic-cube.component';
import { SimpleCubeComponentModule } from './simple-cube/simple-cube.component';
import { TestCenterComponentModule } from './test-center/test-center.component';

@NgModule({
  declarations: [AppComponent, CubeComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    SimpleCubeComponentModule,
    KeenComponentModule,
    KinematicCubeComponentModule,
    TestCenterComponentModule,
    NgtMeshBasicMaterialModule,
    NgtBoxGeometryModule,
    NgtMeshModule,
    NgtCoreModule,
    NgtGroupModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
