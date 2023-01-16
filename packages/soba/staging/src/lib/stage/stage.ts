import { extend, NgtArgs, NgtRxStore } from '@angular-three/core';
import { NgIf } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    Directive,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
} from '@angular/core';
import { map } from 'rxjs';
import { AmbientLight, Group, PointLight, SpotLight, Vector2 } from 'three';
import { NgtsAccumulativeShadows } from '../accumulative-shadows/accumulative-shadows';
import { NgtsRandomizedLight } from '../accumulative-shadows/randomized-light';
import { injectNgtsBoundsApi, NgtsBounds } from '../bounds/bounds';
import { NgtsCenter } from '../center/center';
import { NgtsContactShadows } from '../contact-shadows/contact-shadows';
import { NgtsEnvironmentPresetsType } from '../environment/assets';
import { NgtsEnvironment } from '../environment/environment';
import { NgtsEnvironmentInputs } from '../environment/environment-inputs';

const presets = {
    rembrandt: {
        main: [1, 2, 1],
        fill: [-2, -0.5, -2],
    },
    portrait: {
        main: [-1, 2, 0.5],
        fill: [-1, 0.5, -1.5],
    },
    upfront: {
        main: [0, 2, 1],
        fill: [-1, 0.5, -1.5],
    },
    soft: {
        main: [-2, 4, 4],
        fill: [-1, 0.5, -1.5],
    },
};

type NgtsStageShadows = Partial<NgtsAccumulativeShadows> &
    Partial<NgtsRandomizedLight> &
    Partial<NgtsContactShadows> & {
        type: 'contact' | 'accumulative';
        /** Shadow plane offset, default: 0 */
        offset?: number;
        /** Shadow bias, default: -0.0001 */
        bias?: number;
        /** Shadow normal bias, default: 0 */
        normalBias?: number;
        /** Shadow map size, default: 1024 */
        size?: number;
    };

type NgtsStageProps = {
    /** Lighting setup, default: "rembrandt" */
    preset?:
        | 'rembrandt'
        | 'portrait'
        | 'upfront'
        | 'soft'
        | { main: [x: number, y: number, z: number]; fill: [x: number, y: number, z: number] };
    /** Controls the ground shadows, default: "contact" */
    shadows?: boolean | 'contact' | 'accumulative' | NgtsStageShadows;
    /** Optionally wraps and thereby centers the models using <Bounds>, can also be a margin, default: true */
    adjustCamera?: boolean | number;
    /** The default environment, default: "city" */
    environment?: NgtsEnvironmentPresetsType | Partial<NgtsEnvironmentInputs>;
    /** The lighting intensity, default: 0.5 */
    intensity?: number;
    /** To adjust centering, default: undefined */
    center?: Partial<NgtsCenter>;
};

@Directive({
    selector: 'ngts-stage-refit',
    standalone: true,
})
export class NgtsStageRefit implements OnChanges {
    readonly #boundsApi = injectNgtsBoundsApi();

    @Input() radius = 0;
    @Input() adjustCamera = true;

    ngOnChanges() {
        if (this.adjustCamera) {
            this.#boundsApi.refresh().clip().fit();
        }
    }
}

extend({ AmbientLight, SpotLight, Vector2, PointLight, Group });

@Component({
    selector: 'ngts-stage',
    standalone: true,
    template: `
        <ngt-ambient-light [intensity]="get('intensity')! / 3" />
        <ngt-spot-light
            penumbra="1"
            [position]="get('spotLightPosition')"
            [intensity]="get('intensity')! * 2"
            [castShadow]="!!get('shadows')"
        >
            <ngt-value [rawValue]="get('shadowsInfo').shadowBias" attach="shadow.bias" />
            <ngt-value [rawValue]="get('shadowsInfo').normalBias" attach="shadow.normalBias" />
            <ngt-vector2
                *args="[get('shadowsInfo').shadowSize, get('shadowsInfo').shadowSize]"
                attach="shadow.mapSize"
            />
        </ngt-spot-light>
        <ngt-point-light [position]="get('pointLightPosition')" [intensity]="get('intensity')" />

        <ngts-bounds
            [fit]="!!get('adjustCamera')"
            [clip]="!!get('adjustCamera')"
            [margin]="Number(get('adjustCamera'))"
            [observe]="true"
        >
            <ngts-stage-refit [radius]="get('radius')" [adjustCamera]="!!get('adjustCamera')" />
            <ngts-center
                [position]="[0, get('shadowsInfo').shadowOffset / 2, 0]"
                [top]="!!get('center')?.top"
                [right]="!!get('center')?.right"
                [bottom]="!!get('center')?.bottom"
                [left]="!!get('center')?.left"
                [front]="!!get('center')?.front"
                [back]="!!get('center')?.back"
                [disableX]="!!get('center')?.disableX"
                [disableY]="!!get('center')?.disableY"
                [disableZ]="!!get('center')?.disableZ"
                [precise]="!!get('center')?.precise"
                (centered)="onCentered($event)"
            >
                <ng-content />
            </ngts-center>
        </ngts-bounds>
        <ngt-group [position]="[0, -get('height') / 2 - get('shadowsInfo').shadowOffset / 2, 0]">
            <ngts-contact-shadows
                *ngIf="get('shadowsInfo').contactShadow"
                [scale]="get('radius') * 4"
                [far]="get('radius')"
                [blur]="2"
                [opacity]="get('shadowsInfo').opacity"
                [width]="get('shadowsInfo').width"
                [height]="get('shadowsInfo').height"
                [smooth]="get('shadowsInfo').smooth"
                [resolution]="get('shadowsInfo').resolution"
                [frames]="get('shadowsInfo').frames"
                [scale]="get('shadowsInfo').scale"
                [color]="get('shadowsInfo').color"
                [depthWrite]="get('shadowsInfo').depthWrite"
                [renderOrder]="get('shadowsInfo').renderOrder"
            />
            <ngts-accumulative-shadows
                *ngIf="get('shadowsInfo').accumulativeShadow"
                [temporal]="true"
                [frames]="100"
                [alphaTest]="0.9"
                [toneMapped]="true"
                [scale]="get('radius') * 4"
                [opacity]="get('shadowsInfo').opacity"
                [alphaTest]="get('shadowsInfo').alphaTest"
                [color]="get('shadowsInfo').color"
                [colorBlend]="get('shadowsInfo').colorBlend"
                [resolution]="get('shadowsInfo').resolution"
            >
                <ngts-randomized-light
                    [amount]="get('shadowsInfo').amount ?? 8"
                    [radius]="get('shadowsInfo').radius ?? get('radius')"
                    [ambient]="get('shadowsInfo').ambient ?? 0.5"
                    [intensity]="get('shadowsInfo').intensity ?? 1"
                    [position]="get('spotLightPosition')"
                    [size]="get('radius') * 4"
                    [bias]="-get('shadowsInfo').shadowBias"
                    [mapSize]="get('shadowsInfo').shadowSize"
                />
            </ngts-accumulative-shadows>
        </ngt-group>
        <ngts-environment
            *ngIf="get('environmentInfo')"
            [frames]="get('environmentInfo').frames"
            [near]="get('environmentInfo').near"
            [far]="get('environmentInfo').far"
            [resolution]="get('environmentInfo').resolution"
            [background]="get('environmentInfo').background"
            [blur]="get('environmentInfo').blur"
            [map]="get('environmentInfo').map"
            [files]="get('environmentInfo').files"
            [path]="get('environmentInfo').path"
            [preset]="get('environmentInfo').preset"
            [scene]="get('environmentInfo').scene"
            [extensions]="get('environmentInfo').extensions"
            [ground]="get('environmentInfo').ground"
            [encoding]="get('environmentInfo').encoding"
        />
    `,
    imports: [
        NgtArgs,
        NgtsBounds,
        NgtsStageRefit,
        NgtsCenter,
        NgIf,
        NgtsContactShadows,
        NgtsAccumulativeShadows,
        NgtsRandomizedLight,
        NgtsEnvironment,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsStage extends NgtRxStore<NgtsStageProps> {
    readonly #cdr = inject(ChangeDetectorRef);
    readonly Number = Number;

    @Input() set preset(preset: NgtsStageProps['preset']) {
        this.set({ preset });
    }

    @Input() set shadows(shadows: NgtsStageProps['shadows']) {
        this.set({ shadows });
    }

    @Input() set adjustCamera(adjustCamera: NgtsStageProps['adjustCamera']) {
        this.set({ adjustCamera });
    }

    @Input() set environment(environment: NgtsStageProps['environment']) {
        this.set({ environment });
    }

    @Input() set intensity(intensity: NgtsStageProps['intensity']) {
        this.set({ intensity });
    }

    @Input() set center(center: NgtsStageProps['center']) {
        this.set({ center });
    }

    @Output() centered = new EventEmitter() as NgtsCenter['centered'];

    override initialize() {
        super.initialize();
        this.set({
            adjustCamera: true,
            intensity: 0.5,
            shadows: 'contact',
            environment: 'city',
            preset: 'rembrandt',

            radius: 0,
            width: 0,
            height: 0,
            depth: 0,
        });

        this.connect(
            'config',
            this.select('preset').pipe(map((preset) => (typeof preset === 'string' ? presets[preset] : preset)))
        );

        this.connect(
            'shadowsInfo',
            this.select('shadows').pipe(
                map((shadows) => {
                    return {
                        contactShadow: shadows === 'contact' || (shadows as NgtsStageShadows)?.type === 'contact',
                        accumulativeShadow:
                            shadows === 'accumulative' || (shadows as NgtsStageShadows)?.type === 'accumulative',
                        shadowBias: (shadows as NgtsStageShadows)?.bias ?? -0.0001,
                        normalBias: (shadows as NgtsStageShadows)?.normalBias ?? 0,
                        shadowSize: (shadows as NgtsStageShadows)?.size ?? 1024,
                        shadowOffset: (shadows as NgtsStageShadows)?.offset ?? 0,
                        ...(typeof shadows === 'string' ? {} : (shadows as NgtsStageShadows) || {}),
                    };
                })
            )
        );

        this.connect(
            'spotLightPosition',
            this.select(['config', 'radius'], ({ config, radius }) => [
                config.main[0] * radius,
                config.main[1] * radius,
                config.main[2] * radius,
            ])
        );

        this.connect(
            'pointLightPosition',
            this.select(['config', 'radius'], ({ config, radius }) => [
                config.fill[0] * radius,
                config.fill[1] * radius,
                config.fill[2] * radius,
            ])
        );

        this.connect(
            'environmentInfo',
            this.select('environment').pipe(
                map((environment) => {
                    if (!environment) return null;
                    if (typeof environment === 'string') return { preset: environment };
                    return environment;
                })
            )
        );
    }

    onCentered(props: {
        /** The next parent above <Center> */
        parent: THREE.Object3D;
        /** The outmost container group of the <Center> component */
        container: THREE.Object3D;
        width: number;
        height: number;
        depth: number;
        boundingBox: THREE.Box3;
        boundingSphere: THREE.Sphere;
        center: THREE.Vector3;
        verticalAlignment: number;
        horizontalAlignment: number;
        depthAlignment: number;
    }) {
        const { boundingSphere, width, height, depth } = props;
        this.set({ radius: boundingSphere.radius, width, height, depth });
        this.#cdr.detectChanges();
        if (this.centered.observed) this.centered.emit(props);
    }
}
