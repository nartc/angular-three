import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BananasComponentModule } from './bananas.component';
import { KinematicCubeComponentModule } from './kinematic-cube.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    KinematicCubeComponentModule,
    BananasComponentModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
