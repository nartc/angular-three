import {
    debounceSync,
    NgtCanvasStore,
    NgtStore,
    NgtVector3,
} from '@angular-three/core';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
    NgZone,
    OnInit,
} from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { Sky } from 'three-stdlib';

export function calcPosFromAngles(
    inclination: number,
    azimuth: number,
    vector: THREE.Vector3 = new THREE.Vector3()
) {
    const theta = Math.PI * (inclination - 0.5);
    const phi = 2 * Math.PI * (azimuth - 0.5);

    vector.x = Math.cos(phi);
    vector.y = Math.sin(theta);
    vector.z = Math.sin(phi);

    return vector;
}

export interface NgtSobaSkyState {
    distance: number;
    sunPosition: NgtVector3;
    inclination: number;
    azimuth: number;
    mieCoefficient: number;
    mieDirectionalG: number;
    rayleigh: number;
    turbidity: number;
    scale: THREE.Vector3;
    sky: Sky;
}

@Component({
    selector: 'ngt-soba-sky',
    template: ` <ngt-primitive [object]="sky"></ngt-primitive> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaSky extends NgtStore<NgtSobaSkyState> implements OnInit {
    @Input() set distance(distance: number) {
        this.set({ distance });
    }

    @Input() set sunPosition(sunPosition: NgtVector3) {
        this.set({ sunPosition });
    }

    @Input() set inclination(inclination: number) {
        this.set({ inclination });
    }

    @Input() set azimuth(azimuth: number) {
        this.set({ azimuth });
    }

    @Input() set mieCoefficient(mieCoefficient: number) {
        this.set({ mieCoefficient });
    }

    @Input() set mieDirectionalG(mieDirectionalG: number) {
        this.set({ mieDirectionalG });
    }

    @Input() set rayleigh(rayleigh: number) {
        this.set({ rayleigh });
    }

    @Input() set turbidity(turbidity: number) {
        this.set({ turbidity });
    }

    constructor(private canvasStore: NgtCanvasStore, private zone: NgZone) {
        super();
        const inclination = 0.6;
        const azimuth = 0.1;
        const distance = 1000;
        this.set({
            inclination,
            azimuth,
            distance,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.8,
            rayleigh: 0.5,
            turbidity: 10,
            sunPosition: calcPosFromAngles(inclination, azimuth),
            scale: new THREE.Vector3().setScalar(distance),
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.set({ sky: new Sky() });
                this.setScale(this.select((s) => s.distance));
                this.updateSky(this.select().pipe(debounceSync()));
            });
        });
    }

    get sky() {
        return this.get((s) => s.sky);
    }

    private readonly updateSky = this.effect<NgtSobaSkyState>(
        tap(
            ({
                mieCoefficient,
                scale,
                mieDirectionalG,
                rayleigh,
                sunPosition,
                turbidity,
            }) => {
                this.sky.scale.copy(scale);
                const skyMaterial = this.sky.material as THREE.ShaderMaterial;
                skyMaterial.uniforms['mieCoefficient'].value = mieCoefficient;
                skyMaterial.uniforms['mieDirectionalG'].value = mieDirectionalG;
                skyMaterial.uniforms['rayleigh'].value = rayleigh;
                skyMaterial.uniforms['sunPosition'].value = sunPosition;
                skyMaterial.uniforms['turbidity'].value = turbidity;
            }
        )
    );

    private readonly setScale = this.effect<number>(
        tap((distance) => {
            this.set({ scale: new THREE.Vector3().setScalar(distance) });
        })
    );
}

@NgModule({
    declarations: [NgtSobaSky],
    exports: [NgtSobaSky],
    imports: [NgtPrimitiveModule],
})
export class NgtSobaSkyModule {}
