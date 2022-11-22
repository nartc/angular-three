import { Component } from '@angular/core';
import { Cubes } from './cubes.component';

@Component({
    selector: 'angular-three-root',
    standalone: true,
    template: `
        <angular-three-cubes></angular-three-cubes>
    `,
    imports: [Cubes],
})
export class AppComponent {}
