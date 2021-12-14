import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CompoundBodyComponentModule } from './compound-body/compound-body.component';
import { InstancesComponentModule } from './instances/instances.component';
import { KeenComponentModule } from './keen-bloom/keen-bloom.component';
import { KinematicCubeComponentModule } from './kinematic-cube/kinematic-cube.component';
import { LevelOfDetailsModule } from './level-of-details/level-of-details.component';
import { RobotExpressiveModule } from './robot-expressive/robot-expressive.component';
import { SimpleCubeComponentModule } from './simple-cube.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SimpleCubeComponentModule,
    KinematicCubeComponentModule,
    CompoundBodyComponentModule,
    KeenComponentModule,
    InstancesComponentModule,
    LevelOfDetailsModule,
    RobotExpressiveModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
