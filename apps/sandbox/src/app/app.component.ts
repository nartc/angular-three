import { Component } from '@angular/core';

@Component({
    selector: 'sandbox-root',
    template: `
        <!-- <sandbox-cubes></sandbox-cubes> -->
        <!-- <sandbox-physic-cubes></sandbox-physic-cubes> -->
        <!--        <sandbox-monday-morning></sandbox-monday-morning>-->
        <sandbox-kinematic-cube></sandbox-kinematic-cube>
    `,
    styles: [],
})
export class AppComponent {
    title = 'sandbox';
}
