import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'sandbox-home',
    standalone: true,
    template: `
        <ul>
            <li >
                <a routerLink="/lod">LOD</a>
            </li>
        </ul>
    `,
    imports: [RouterLink],
})
export default class SandboxHome {}

