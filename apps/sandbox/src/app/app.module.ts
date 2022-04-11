import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SandboxCubesModule } from './cubes/cubes.component';
import { SandboxPhysicCubesModule } from './physic-cubes/physic-cubes.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, SandboxCubesModule, SandboxPhysicCubesModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
