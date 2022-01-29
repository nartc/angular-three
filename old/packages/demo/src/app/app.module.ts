import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CompoundBodyComponentModule } from './compound-body/compound-body.component';
import { CubeTransformComponentModule } from './cube-transform/cube-transform.component';
import { InstancesComponentModule } from './instances/instances.component';
import { KeenComponentModule } from './keen-bloom/keen-bloom.component';
import { KinematicCubeComponentModule } from './kinematic-cube/kinematic-cube.component';
import { LevelOfDetailsModule } from './level-of-details/level-of-details.component';
import { MinecraftComponentModule } from './minecraft/minecraft.component';
import { NarwhalLandingComponentModule } from './narwhal/narwhal-landing.component';
import { OrbitControlsTargetSwitcherComponentModule } from './orbit-controls-target-switcher/orbit-controls-target-switcher.component';
import { RobotExpressiveModule } from './robot-expressive/robot-expressive.component';
import { RoutingComponentModule } from './routing/routing.component';
import { SimpleCubeComponentModule } from './simple-cube.component';
import { TestingComponentModule } from './testing/testing.component';

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
    OrbitControlsTargetSwitcherComponentModule,
    RoutingComponentModule,
    MinecraftComponentModule,
    CubeTransformComponentModule,
    TestingComponentModule,
    NarwhalLandingComponentModule,
    // RoutingComponentModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
