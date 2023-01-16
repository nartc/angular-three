import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    standalone: true,
    selector: 'sandbox-root',
    template: `<router-outlet />`,
    imports: [RouterOutlet],
})
export class AppComponent {}
