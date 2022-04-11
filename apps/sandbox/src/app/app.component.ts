import { NgtVector3 } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Group, Mesh } from 'three';

@Component({
    selector: 'sandbox-root',
    template: `
        <ngt-canvas initialLog>
            <ngt-color attach="background" color="black"></ngt-color>

            <ngt-ambient-light></ngt-ambient-light>
            <ngt-point-light [position]="10"></ngt-point-light>

            <ngt-group
                [ngtBoxHelper]="['red']"
                (beforeRender)="onGroupBeforeRender($event.object)"
            >
                <sandbox-cube [position]="[-1.2, 0, 0]"></sandbox-cube>
                <sandbox-cube [position]="[1.2, 0, 0]"></sandbox-cube>
            </ngt-group>

            <ngt-stats></ngt-stats>
        </ngt-canvas>
    `,
    styles: [],
})
export class AppComponent {
    title = 'sandbox';

    onGroupBeforeRender(group: Group) {
        group.rotation.z += 0.01;
    }
}

@Component({
    selector: 'sandbox-cube',
    template: `
        <ngt-mesh
            ngtBoxHelper
            (pointerover)="hovered = true"
            (pointerout)="hovered = false"
            (click)="active = !active"
            (beforeRender)="onBeforeRender($event.object)"
            [scale]="active ? 1.5 : 1"
            [position]="position"
        >
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-mesh-standard-material
                [color]="hovered ? 'turquoise' : 'tomato'"
            ></ngt-mesh-standard-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CubeComponent {
    @Input() position?: NgtVector3;

    hovered = false;
    active = false;

    onBeforeRender(cube: Mesh) {
        cube.rotation.x = cube.rotation.y += 0.01;
    }
}
