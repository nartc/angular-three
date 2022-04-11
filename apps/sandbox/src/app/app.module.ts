import { NgtCanvasModule } from '@angular-three/core';
import { NgtColorAttributeModule } from '@angular-three/core/attributes';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtBoxHelperModule } from '@angular-three/core/helpers';
import {
    NgtAmbientLightModule,
    NgtPointLightModule,
} from '@angular-three/core/lights';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent, CubeComponent } from './app.component';

@NgModule({
    declarations: [AppComponent, CubeComponent],
    imports: [
        BrowserModule,
        NgtCanvasModule,
        NgtMeshModule,
        NgtBoxGeometryModule,
        NgtAmbientLightModule,
        NgtPointLightModule,
        NgtMeshStandardMaterialModule,
        NgtStatsModule,
        NgtBoxHelperModule,
        NgtGroupModule,
        NgtColorAttributeModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
