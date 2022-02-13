import {
    Controller,
    createControllerProviderFactory,
    createExtenderProvider,
    NgtCanvasStore,
    NgtEvent,
    NgtExtender,
    NgtRepeatModule,
    NgtStore,
} from '@angular-three/core';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import {
    NgtAmbientLightModule,
    NgtPointLightModule,
} from '@angular-three/core/lights';
import {
    NgtMeshBasicMaterialModule,
    NgtMeshLambertMaterialModule,
} from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Directive,
    EventEmitter,
    Inject,
    Input,
    NgModule,
    NgZone,
    Output,
} from '@angular/core';
import { map, startWith } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaGizmoHelperStore } from './gizmo-helper.store';

type XYZ = [number, number, number];
type GenericProps = {
    font: string;
    opacity: number;
    color: string;
    hoverColor: string;
    textColor: string;
    strokeColor: string;
    faces: string[];
};

const colors = { bg: '#f0f0f0', hover: '#999', text: 'black', stroke: 'black' };
const defaultFaces = ['Right', 'Left', 'Top', 'Bottom', 'Front', 'Back'];
const makePositionVector = (xyz: number[]) =>
    new THREE.Vector3(...xyz).multiplyScalar(0.38);

const corners: THREE.Vector3[] = [
    [1, 1, 1],
    [1, 1, -1],
    [1, -1, 1],
    [1, -1, -1],
    [-1, 1, 1],
    [-1, 1, -1],
    [-1, -1, 1],
    [-1, -1, -1],
].map(makePositionVector);

const cornerDimensions: XYZ = [0.25, 0.25, 0.25];

const edges: THREE.Vector3[] = [
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, -1],
    [1, -1, 0],
    [0, 1, 1],
    [0, 1, -1],
    [0, -1, 1],
    [0, -1, -1],
    [-1, 1, 0],
    [-1, 0, 1],
    [-1, 0, -1],
    [-1, -1, 0],
].map(makePositionVector);

const edgeDimensions = edges.map(
    (edge) =>
        edge
            .toArray()
            .map((axis: number): number => (axis == 0 ? 0.5 : 0.25)) as XYZ
);

@Directive({
    selector: `
        ngt-soba-gizmo-viewcube,
        ngt-soba-gizmo-edgecube,
        ngt-soba-gizmo-facecube,
        ngt-soba-gizmo-face-material
  `,
    providers: [NgtStore],
})
export class GenericController extends Controller {
    @Input() set font(font: string) {
        this.store.set({ font });
    }

    get font() {
        return this.store.get((s) => s.font);
    }

    @Input() set opacity(opacity: number) {
        this.store.set({ opacity });
    }

    get opacity() {
        return this.store.get((s) => s.opacity);
    }

    @Input() set color(color: string) {
        this.store.set({ color });
    }

    get color() {
        return this.store.get((s) => s.color);
    }

    @Input() set hoverColor(hoverColor: string) {
        this.store.set({ hoverColor });
    }

    get hoverColor() {
        return this.store.get((s) => s.hoverColor);
    }

    @Input() set textColor(textColor: string) {
        this.store.set({ textColor });
    }

    get textColor() {
        return this.store.get((s) => s.textColor);
    }

    @Input() set strokeColor(strokeColor: string) {
        this.store.set({ strokeColor });
    }

    get strokeColor() {
        return this.store.get((s) => s.strokeColor);
    }

    @Input() set faces(faces: string[]) {
        this.store.set({ faces });
    }

    get faces() {
        return this.store.get((s) => s.faces);
    }

    @Output() click = new EventEmitter<NgtEvent<MouseEvent>>();

    constructor(public store: NgtStore<GenericProps>) {
        super();
        this.store.set({
            font: '20px Inter var, Arial, sans-serif',
            faces: defaultFaces,
            color: colors.bg,
            hoverColor: colors.hover,
            textColor: colors.text,
            strokeColor: colors.stroke,
            opacity: 1,
        });
    }
}

export const [
    NGT_VIEWCUBE_GENERIC_WATCHED_CONTROLLER,
    NGT_VIEWCUBE_GENERIC_CONTROLLER_PROVIDER,
] = createControllerProviderFactory({
    watchedControllerTokenName: 'Viewcube Generic Controller',
    controller: GenericController,
});

@Component({
    selector: 'ngt-soba-gizmo-viewcube',
    template: `
        <ngt-group
            [scale]="[60, 60, 60]"
            (ready)="object = $event"
            (animateReady)="
                animateReady.emit({ entity: object, state: $event.state })
            "
        >
            <ngt-soba-gizmo-facecube
                [font]="genericController.font"
                [opacity]="genericController.opacity"
                [color]="genericController.color"
                [hoverColor]="genericController.hoverColor"
                [textColor]="genericController.textColor"
                [strokeColor]="genericController.strokeColor"
                [faces]="genericController.faces"
            ></ngt-soba-gizmo-facecube>

            <ngt-soba-gizmo-edgecube
                *ngFor="let edge of edges; index as i"
                [position]="edge"
                [dimensions]="edgeDimensions[i]"
                [font]="genericController.font"
                [opacity]="genericController.opacity"
                [color]="genericController.color"
                [hoverColor]="genericController.hoverColor"
                [textColor]="genericController.textColor"
                [strokeColor]="genericController.strokeColor"
                [faces]="genericController.faces"
            ></ngt-soba-gizmo-edgecube>

            <ngt-soba-gizmo-edgecube
                *ngFor="let corner of corners"
                [position]="corner"
                [dimensions]="cornerDimensions"
                [font]="genericController.font"
                [opacity]="genericController.opacity"
                [color]="genericController.color"
                [hoverColor]="genericController.hoverColor"
                [textColor]="genericController.textColor"
                [strokeColor]="genericController.strokeColor"
                [faces]="genericController.faces"
            ></ngt-soba-gizmo-edgecube>

            <ngt-ambient-light [intensity]="0.5"></ngt-ambient-light>
            <ngt-point-light
                [intensity]="0.5"
                [position]="[10, 10, 10]"
            ></ngt-point-light>
        </ngt-group>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NGT_VIEWCUBE_GENERIC_CONTROLLER_PROVIDER,
        createExtenderProvider(NgtSobaGizmoViewcube),
    ],
})
export class NgtSobaGizmoViewcube extends NgtExtender<THREE.Group> {
    corners = corners;
    edges = edges;
    cornerDimensions = cornerDimensions;
    edgeDimensions = edgeDimensions;

    constructor(
        @Inject(NGT_VIEWCUBE_GENERIC_WATCHED_CONTROLLER)
        public genericController: GenericController
    ) {
        super();
    }
}

@Component({
    selector: 'ngt-soba-gizmo-edgecube[dimensions][position]',
    template: `
        <ng-container *ngIf="vm$ | async as vm">
            <ngt-mesh
                [raycast]="raycast$ | async"
                [scale]="[1.01, 1.01, 1.01]"
                [position]="vm.position"
                (pointerover)="$event.stopPropagation(); hover = true"
                (pointerout)="$event.stopPropagation(); hover = false"
                (click)="onEdgeClick($event)"
                (ready)="object = $event"
                (animateReady)="
                    animateReady.emit({
                        entity: object,
                        state: $any($event).state
                    })
                "
            >
                <ngt-box-geometry [args]="vm.dimensions"></ngt-box-geometry>
                <ngt-mesh-basic-material
                    [parameters]="{
                        color: hover ? vm.hoverColor : 'white',
                        transparent: true,
                        opacity: 0.6,
                        visible: hover
                    }"
                ></ngt-mesh-basic-material>
            </ngt-mesh>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NGT_VIEWCUBE_GENERIC_CONTROLLER_PROVIDER,
        NgtStore,
        createExtenderProvider(NgtSobaGizmoEdgecube),
    ],
})
export class NgtSobaGizmoEdgecube extends NgtExtender<THREE.Mesh> {
    @Input() set dimensions(dimensions: XYZ) {
        this.store.set({ dimensions });
    }

    @Input() set position(position: THREE.Vector3) {
        this.store.set({ position });
    }

    hover = false;
    readonly raycast$ = this.gizmoHelperStore.select((s) => s.raycast);

    readonly vm$ = this.store.select(
        this.store.select((s) => s.dimensions),
        this.store.select((s) => s.position),
        this.genericController.store
            .select((s) => s.hoverColor)
            .pipe(
                startWith(this.genericController.store.get((s) => s.hoverColor))
            ),
        (dimensions, position, hoverColor) => ({
            dimensions,
            position,
            hoverColor,
        })
    );

    constructor(
        @Inject(NGT_VIEWCUBE_GENERIC_WATCHED_CONTROLLER)
        public genericController: GenericController,
        private gizmoHelperStore: NgtSobaGizmoHelperStore,
        private store: NgtStore<{
            dimensions: XYZ;
            position: THREE.Vector3;
        }>
    ) {
        super();
    }

    onEdgeClick($event: NgtEvent<MouseEvent>) {
        if (this.genericController.click.observed) {
            this.genericController.click.emit($event);
        } else {
            $event.stopPropagation();
            this.gizmoHelperStore.tweenCamera(
                this.store.get((s) => s.position)
            );
        }
    }
}

@Component({
    selector: 'ngt-soba-gizmo-facecube',
    template: `
        <ngt-mesh
            [isMultipleMaterials]="true"
            [raycast]="raycast$ | async"
            (ready)="object = $event"
            (animateReady)="
                animateReady.emit({ entity: object, state: $any($event).state })
            "
            (click)="onFaceClick($event)"
            (pointermove)="onFacePointerMove($event)"
            (pointerout)="onFacePointerOut($event)"
        >
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-soba-gizmo-face-material
                *ngFor="let index; repeat: 6"
                [hover]="hover === index"
                [index]="index"
                [font]="genericController.font"
                [opacity]="genericController.opacity"
                [color]="genericController.color"
                [hoverColor]="genericController.hoverColor"
                [textColor]="genericController.textColor"
                [strokeColor]="genericController.strokeColor"
                [faces]="genericController.faces"
                (click)="genericController.click.emit($event)"
            ></ngt-soba-gizmo-face-material>
        </ngt-mesh>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NGT_VIEWCUBE_GENERIC_CONTROLLER_PROVIDER,
        createExtenderProvider(NgtSobaGizmoFacecube),
    ],
})
export class NgtSobaGizmoFacecube extends NgtExtender<THREE.Mesh> {
    hover: number | null = null;

    readonly raycast$ = this.gizmoHelperStore.select((s) => s.raycast);

    constructor(
        @Inject(NGT_VIEWCUBE_GENERIC_WATCHED_CONTROLLER)
        public genericController: GenericController,
        private gizmoHelperStore: NgtSobaGizmoHelperStore
    ) {
        super();
    }

    onFacePointerMove($event: NgtEvent<PointerEvent>) {
        $event.stopPropagation();
        this.hover = Math.floor($event.faceIndex! / 2);
    }

    onFacePointerOut($event: NgtEvent<PointerEvent>) {
        $event.stopPropagation();
        this.hover = null;
    }

    onFaceClick($event: NgtEvent<MouseEvent>) {
        if (this.genericController.click.observed) {
            this.genericController.click.emit($event);
        } else {
            $event.stopPropagation();
            this.gizmoHelperStore.tweenCamera($event.face!.normal);
        }
    }
}

@Component({
    selector: 'ngt-soba-gizmo-face-material[hover][index]',
    template: `
        <ngt-mesh-lambert-material
            *ngIf="parameters$ | async as parameter"
            [parameters]="{
                map: parameter.texture,
                color: parameter.color,
                opacity: parameter.opacity,
                transparent: true
            }"
        ></ngt-mesh-lambert-material>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NGT_VIEWCUBE_GENERIC_CONTROLLER_PROVIDER],
})
export class NgtSobaGizmoFaceMaterial extends NgtStore<{
    hover: boolean;
    index: number;
    texture: THREE.CanvasTexture;
}> {
    @Input() set hover(hover: boolean) {
        this.set({ hover });
    }

    @Input() set index(index: number) {
        this.set({ index });
    }

    readonly parameters$ = this.select(
        this.select((s) => s.hover),
        this.select((s) => s.index),
        this.select((s) => s.texture),
        this.genericController.store
            .select((s) => s.hoverColor)
            .pipe(
                startWith(this.genericController.store.get((s) => s.hoverColor))
            ),
        this.genericController.store
            .select((s) => s.opacity)
            .pipe(
                startWith(this.genericController.store.get((s) => s.opacity))
            ),
        this.canvasStore.renderer$,
        (hover, index, texture, hoverColor, opacity, renderer) => {
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy() || 1;
            return {
                texture,
                color: hover ? hoverColor : 'white',
                opacity: opacity,
            };
        }
    );

    private readonly changes$ = this.select(
        this.select((s) => s.index),
        this.genericController.store.select((s) => s.font),
        this.genericController.store.select((s) => s.color),
        this.genericController.store.select((s) => s.textColor),
        this.genericController.store.select((s) => s.strokeColor),
        (index, font, color, textColor, strokeColor) => ({
            index,
            font,
            color,
            textColor,
            strokeColor,
        })
    );

    constructor(
        @Inject(NGT_VIEWCUBE_GENERIC_WATCHED_CONTROLLER)
        public genericController: GenericController,
        private canvasStore: NgtCanvasStore,
        private zone: NgZone,
        @Inject(DOCUMENT) private document: Document
    ) {
        super();
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.set(
                    this.changes$.pipe(
                        map(
                            ({
                                font,
                                color,
                                textColor,
                                strokeColor,
                                index,
                            }) => {
                                const faces = this.genericController.store.get(
                                    (s) => s.faces
                                );
                                const canvas = document.createElement('canvas');
                                canvas.width = 128;
                                canvas.height = 128;

                                const context = canvas.getContext('2d')!;
                                context.fillStyle = color;
                                context.fillRect(
                                    0,
                                    0,
                                    canvas.width,
                                    canvas.height
                                );
                                context.strokeStyle = strokeColor;
                                context.strokeRect(
                                    0,
                                    0,
                                    canvas.width,
                                    canvas.height
                                );
                                context.font = font;
                                context.textAlign = 'center';
                                context.fillStyle = textColor;
                                context.fillText(
                                    faces[index].toUpperCase(),
                                    64,
                                    76
                                );

                                return {
                                    texture: new THREE.CanvasTexture(canvas),
                                };
                            }
                        )
                    )
                );
            });
        });
    }
}

@NgModule({
    declarations: [
        GenericController,
        NgtSobaGizmoViewcube,
        NgtSobaGizmoEdgecube,
        NgtSobaGizmoFacecube,
        NgtSobaGizmoFaceMaterial,
    ],
    exports: [NgtSobaGizmoViewcube, GenericController],
    imports: [
        NgtGroupModule,
        NgtAmbientLightModule,
        NgtPointLightModule,
        NgtMeshLambertMaterialModule,
        CommonModule,
        NgtRepeatModule,
        NgtMeshBasicMaterialModule,
        NgtMeshModule,
        NgtBoxGeometryModule,
    ],
})
export class NgtSobaGizmoViewcubeModule {}
