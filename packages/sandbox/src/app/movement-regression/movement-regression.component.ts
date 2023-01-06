import { NgtCanvas } from "@angular-three/core";
import { Component } from "@angular/core";

@Component({
    selector: 'sandbox-movement-regression',
    standalone: true,
    template: `
    <ngt-canvas></ngt-canvas>
    `,
    imports: [NgtCanvas]
})
export default class SandboxMovementRegression {}
