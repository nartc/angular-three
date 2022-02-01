import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { KeenComponentModule } from './keen-bloom/keen-bloom.component';
import { SimpleCubeComponentModule } from './simple-cube/simple-cube.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    SimpleCubeComponentModule,
    KeenComponentModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
