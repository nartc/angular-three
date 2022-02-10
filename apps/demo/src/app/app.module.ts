import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SimpleCubeComponentModule } from './simple-cube/simple-cube.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SimpleCubeComponentModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
