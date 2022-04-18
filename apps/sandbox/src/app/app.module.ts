import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SandboxCubesModule } from './cubes/cubes.component';
import { KinematicCubeComponentModule } from './kinematic-cube/kinematic-cube.component';
import { SandboxMondayMorningModule } from './monday-morning/monday-morning.component';
import { SandboxPhysicCubesModule } from './physic-cubes/physic-cubes.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        SandboxCubesModule,
        SandboxPhysicCubesModule,
        SandboxMondayMorningModule,
        KinematicCubeComponentModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
