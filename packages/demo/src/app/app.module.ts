import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SimpleCubeComponentModule } from './simple-cube/simple-cube.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    SimpleCubeComponentModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
