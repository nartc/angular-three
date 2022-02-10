import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SimpleCubeComponentModule } from './simple-cube/simple-cube.component';
import { TransformControlsDemoComponentModule } from './transform-controls-demo/transform-controls-demo.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        SimpleCubeComponentModule,
        TransformControlsDemoComponentModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
