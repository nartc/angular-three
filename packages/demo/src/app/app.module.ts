import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CompoundBodyComponentModule } from './compound-body.component';
import { KeenComponentModule } from './keen-bloom.component';
import { KinematicCubeComponentModule } from './kinematic-cube.component';
import { SimpleCubeComponentModule } from './simple-cube.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SimpleCubeComponentModule,
    KinematicCubeComponentModule,
    CompoundBodyComponentModule,
    KeenComponentModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
