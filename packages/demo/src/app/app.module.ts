import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { KeenComponentModule } from './keen-bloom/keen-bloom.component';
import { KinematicCubeComponentModule } from './kinematic-cube/kinematic-cube.component';
import { SimpleCubeComponentModule } from './simple-cube/simple-cube.component';
import { TestCenterComponentModule } from './test-center/test-center.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    SimpleCubeComponentModule,
    KeenComponentModule,
    KinematicCubeComponentModule,
    TestCenterComponentModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
