import {
    NgtCoreModule,
    NgtEuler,
    NgtRadianPipeModule,
    NgtVector3,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtAmbientLightModule } from '@angular-three/core/lights';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtGLTFLoader } from '@angular-three/soba/loaders';
import { NgtSobaHtmlModule } from '@angular-three/soba/misc';
import { NgtSobaStageModule } from '@angular-three/soba/staging';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
    NgZone,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'demo-earth-marker',
    template: `
        <ngt-canvas [initialLog]="true" [dpr]="[1, 2]" [camera]="{ fov: 50 }">
            <ngt-soba-stage [controls]="ngtSobaOrbitControls.controls">
                <demo-earth></demo-earth>
            </ngt-soba-stage>

            <ngt-soba-orbit-controls
                #ngtSobaOrbitControls="ngtSobaOrbitControls"
                (ready)="$event.autoRotate = true"
            ></ngt-soba-orbit-controls>
        </ngt-canvas>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EarthMarkerComponent {}

@Component({
    selector: 'demo-earth',
    template: `
        <ng-container *ngIf="earth$ | async as earth">
            <ngt-group [dispose]="null">
                <ngt-group
                    [rotation]="[-90 | radian, 0, 0.05]"
                    [scale]="[100, 100, 100]"
                >
                    <ngt-mesh
                        [geometry]="
                            $any(earth.nodes['URF-Height_Lampd_Ice_0']).geometry
                        "
                        [material]="earth.materials['Lampd_Ice']"
                    ></ngt-mesh>
                    <ngt-mesh
                        (pointerover)="$event.stopPropagation()"
                        [geometry]="
                            $any(earth.nodes['URF-Height_watr_0']).geometry
                        "
                        [material]="earth.materials['watr']"
                        (ready)="$any($event.material).roughness = 0"
                    ></ngt-mesh>
                    <ngt-mesh
                        [geometry]="
                            $any(earth.nodes['URF-Height_Lampd_0']).geometry
                        "
                        [material]="earth.materials['Lampd']"
                    >
                        <demo-marker
                            [rotation]="[0, 90 | radian, 0]"
                            [position]="[0, 1.3, 0]"
                            color="orange"
                        ></demo-marker>

                        <demo-marker
                            [rotation]="[0, 90 | radian, 90 | radian]"
                            [position]="[0, 0, 1.3]"
                            color="indianred"
                        ></demo-marker>
                    </ngt-mesh>
                </ngt-group>
            </ngt-group>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EarthComponent {
    earth$ = this.gltfLoader.load('assets/earth.gltf');

    constructor(private gltfLoader: NgtGLTFLoader) {}
}

@Component({
    selector: 'demo-marker',
    template: `
        <ngt-soba-html
            [transform]="true"
            [rotation]="rotation"
            [position]="position"
            [occlude]="true"
            (occludeChange)="onOccludeChange($event)"
            [parentStyle]="{
                transition: 'all 0.2s',
                opacity: hidden ? '0' : '1'
            }"
        >
            <fa-icon [icon]="faMarker" [styles]="{ color: color }"></fa-icon>
        </ngt-soba-html>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkerComponent {
    @Input() rotation?: NgtEuler;
    @Input() position?: NgtVector3;

    @Input() color = '';

    hidden = false;

    faMarker = faLocationDot;

    constructor(private zone: NgZone) {}

    get parentStyle(): Partial<CSSStyleDeclaration> {
        return {
            transition: 'all 0.2s',
            opacity: this.hidden ? '0' : '1',
            transform: `scale(${this.hidden ? 0.25 : 1})`,
        };
    }

    onOccludeChange(occluded: boolean) {
        this.zone.run(() => {
            this.hidden = occluded;
        });
    }
}

@NgModule({
    declarations: [EarthMarkerComponent, EarthComponent, MarkerComponent],
    exports: [EarthMarkerComponent],
    imports: [
        FontAwesomeModule,
        NgtCoreModule,
        NgtSobaStageModule,
        NgtSobaOrbitControlsModule,
        CommonModule,
        NgtSobaHtmlModule,
        NgtGroupModule,
        NgtMeshModule,
        NgtRadianPipeModule,
        NgtPrimitiveModule,
        NgtAmbientLightModule,
    ],
})
export class EarthMarkerComponentModule {}
