import { Component } from '@angular/core';

@Component({
    selector: 'sandbox-root',
    template: `
        <!--        <sandbox-cubes></sandbox-cubes>-->
        <sandbox-physic-cubes></sandbox-physic-cubes>
    `,
    styles: [],
})
export class AppComponent {
    title = 'sandbox';
}
