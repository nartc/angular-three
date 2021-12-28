import {
  Controller,
  createControllerProviderFactory,
  EnhancedRxState,
  NgtEvent,
  NgtRepeatModule,
  NgtSobaExtender,
  NgtStore,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import {
  NgtAmbientLightModule,
  NgtPointLightModule,
} from '@angular-three/core/lights';
import {
  NgtMeshBasicMaterialModule,
  NgtMeshLambertMaterialModule,
} from '@angular-three/core/materials';
import { NgtSobaBoxModule } from '@angular-three/soba/shapes';
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
import { selectSlice } from '@rx-angular/state';
import { combineLatest, map, Observable, startWith } from 'rxjs';
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
  onClick?: (e: Event) => null;
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
  providers: [EnhancedRxState],
})
class GenericController extends Controller {
  get props(): string[] {
    return [
      'font',
      'opacity',
      'color',
      'hoverColor',
      'textColor',
      'strokeColor',
      'faces',
      'click',
    ];
  }

  get controller(): Controller | undefined {
    return this.genericController;
  }

  @Input() genericController?: GenericController;

  @Input() set font(font: string) {
    this.state.set({ font });
  }

  @Input() set opacity(opacity: number) {
    this.state.set({ opacity });
  }

  @Input() set color(color: string) {
    this.state.set({ color });
  }

  @Input() set hoverColor(hoverColor: string) {
    this.state.set({ hoverColor });
  }

  @Input() set textColor(textColor: string) {
    this.state.set({ textColor });
  }

  @Input() set strokeColor(strokeColor: string) {
    this.state.set({ strokeColor });
  }

  @Input() set faces(faces: string[]) {
    this.state.set({ faces });
  }

  @Output() click = new EventEmitter<NgtEvent<MouseEvent>>();

  constructor(ngZone: NgZone, private state: EnhancedRxState<GenericProps>) {
    super(ngZone);
    this.state.set({
      font: '20px Inter var, Arial, sans-serif',
      faces: defaultFaces,
      color: colors.bg,
      hoverColor: colors.hover,
      textColor: colors.text,
      strokeColor: colors.stroke,
      opacity: 1,
    });
  }

  get rxState(): EnhancedRxState<GenericProps> {
    return this.genericController?.rxState || this.state;
  }

  get clickOutput(): EventEmitter<NgtEvent<MouseEvent>> {
    return this.genericController?.click || this.click;
  }
}

const [
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
      *ngIf="gizmo$ | async as gizmo"
      [appendTo]="gizmo"
      [scale]="[60, 60, 60]"
      (ready)="object = $event"
    >
      <ngt-soba-gizmo-facecube
        [genericController]="genericController"
      ></ngt-soba-gizmo-facecube>

      <ngt-soba-gizmo-edgecube
        *ngFor="let edge of edges; index as i"
        [position]="edge"
        [dimensions]="edgeDimensions[i]"
        [genericController]="genericController"
      ></ngt-soba-gizmo-edgecube>

      <ngt-soba-gizmo-edgecube
        *ngFor="let corner of corners"
        [position]="corner"
        [dimensions]="cornerDimensions"
        [genericController]="genericController"
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
    {
      provide: NgtSobaExtender,
      useExisting: NgtSobaGizmoViewcube,
    },
  ],
})
export class NgtSobaGizmoViewcube extends NgtSobaExtender<THREE.Group> {
  corners = corners;
  edges = edges;
  cornerDimensions = cornerDimensions;
  edgeDimensions = edgeDimensions;

  readonly gizmo$ = this.gizmoHelperStore.select('gizmo');

  constructor(
    @Inject(NGT_VIEWCUBE_GENERIC_WATCHED_CONTROLLER)
    public genericController: GenericController,
    private gizmoHelperStore: NgtSobaGizmoHelperStore
  ) {
    super();
  }
}

@Component({
  selector: 'ngt-soba-gizmo-edgecube[dimensions][position]',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <ngt-soba-box
        [args]="vm.dimensions"
        [raycast]="raycast$ | async"
        [scale]="[1.01, 1.01, 1.01]"
        [position]="vm.position"
        (pointerover)="$event.stopPropagation(); hover = true"
        (pointerout)="$event.stopPropagation(); hover = false"
        (click)="onEdgeClick($event)"
      >
        <ngt-mesh-basic-material
          [parameters]="{
            color: hover ? vm.hoverColor : 'white',
            transparent: true,
            opacity: 0.6,
            visible: hover
          }"
        ></ngt-mesh-basic-material>
      </ngt-soba-box>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_VIEWCUBE_GENERIC_CONTROLLER_PROVIDER,
    EnhancedRxState,
    {
      provide: NgtSobaExtender,
      useExisting: NgtSobaGizmoEdgecube,
    },
  ],
})
class NgtSobaGizmoEdgecube extends NgtSobaExtender<THREE.Mesh> {
  @Input() set dimensions(dimensions: XYZ) {
    this.state.set({ dimensions });
  }

  @Input() set position(position: THREE.Vector3) {
    this.state.set({ position });
  }

  hover = false;
  readonly raycast$ = this.gizmoHelperStore.select('raycast');

  readonly vm$: Observable<{
    dimensions: XYZ;
    position: THREE.Vector3;
    hoverColor: string;
  }> = combineLatest([
    this.state.select(selectSlice(['dimensions', 'position'])),
    this.genericController.rxState
      .select('hoverColor')
      .pipe(startWith(this.genericController.rxState.get('hoverColor'))),
  ]).pipe(
    map(([{ dimensions, position }, hoverColor]) => ({
      dimensions,
      position,
      hoverColor,
    }))
  );

  constructor(
    @Inject(NGT_VIEWCUBE_GENERIC_WATCHED_CONTROLLER)
    public genericController: GenericController,
    private gizmoHelperStore: NgtSobaGizmoHelperStore,
    private state: EnhancedRxState<{ dimensions: XYZ; position: THREE.Vector3 }>
  ) {
    super();
  }

  onEdgeClick($event: NgtEvent<MouseEvent>) {
    if (this.genericController.clickOutput.observed) {
      this.genericController.clickOutput.emit($event);
    } else {
      $event.stopPropagation();
      this.gizmoHelperStore.tweenCamera(this.state.get('position'));
    }
  }
}

@Component({
  selector: 'ngt-soba-gizmo-facecube',
  template: `
    <ngt-soba-box
      [isMaterialArray]="true"
      [raycast]="raycast$ | async"
      (ready)="object = $event"
      (click)="onFaceClick($event)"
      (pointermove)="onFacePointerMove($event)"
      (pointerout)="onFacePointerOut($event)"
    >
      <ngt-soba-gizmo-face-material
        *repeat="let index of 6"
        [hover]="hover === index"
        [index]="index"
        [genericController]="genericController"
      ></ngt-soba-gizmo-face-material>
    </ngt-soba-box>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_VIEWCUBE_GENERIC_CONTROLLER_PROVIDER,
    {
      provide: NgtSobaExtender,
      useExisting: NgtSobaGizmoFacecube,
    },
  ],
})
class NgtSobaGizmoFacecube extends NgtSobaExtender<THREE.Mesh> {
  hover: number | null = null;

  readonly raycast$ = this.gizmoHelperStore.select('raycast');

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
    if (this.genericController.clickOutput.observed) {
      this.genericController.clickOutput.emit($event);
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
      *ngIf="parameter$ | async as parameter"
      [parameters]="{
        map: parameter.texture,
        color: parameter.color,
        opacity: parameter.opacity,
        transparent: true
      }"
    ></ngt-mesh-lambert-material>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_VIEWCUBE_GENERIC_CONTROLLER_PROVIDER, EnhancedRxState],
})
class NgtSobaGizmoFaceMaterial {
  @Input() set hover(hover: boolean) {
    this.state.set({ hover });
  }

  @Input() set index(index: number) {
    this.state.set({ index });
  }

  readonly parameter$ = combineLatest([
    this.state.select(selectSlice(['hover', 'index', 'texture'])),
    this.genericController.rxState.select(
      selectSlice(['hoverColor', 'opacity']),
      startWith({
        hoverColor: this.genericController.rxState.get('hoverColor'),
        opacity: this.genericController.rxState.get('opacity'),
      })
    ),
    this.store.select('renderer'),
  ]).pipe(
    map(([{ texture, hover }, { hoverColor, opacity }, renderer]) => {
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy() || 1;
      return {
        texture,
        color: hover ? hoverColor : 'white',
        opacity: opacity,
      };
    })
  );

  readonly #change$ = combineLatest([
    this.state.select('index'),
    this.genericController.rxState.select(
      selectSlice(['font', 'color', 'textColor', 'strokeColor'])
    ),
  ]).pipe(
    map(([index, { font, color, textColor, strokeColor }]) => ({
      index,
      font,
      color,
      textColor,
      strokeColor,
    }))
  );

  constructor(
    @Inject(NGT_VIEWCUBE_GENERIC_WATCHED_CONTROLLER)
    public genericController: GenericController,
    private state: EnhancedRxState<{
      hover: boolean;
      index: number;
      texture: THREE.CanvasTexture;
    }>,
    private store: NgtStore,
    @Inject(DOCUMENT) document: Document
  ) {
    this.state.connect(
      'texture',
      this.#change$,
      (_, { index, font, color, textColor, strokeColor }) => {
        const faces = this.genericController.rxState.get('faces');
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;

        const context = canvas.getContext('2d')!;
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = strokeColor;
        context.strokeRect(0, 0, canvas.width, canvas.height);
        context.font = font;
        context.textAlign = 'center';
        context.fillStyle = textColor;
        context.fillText(faces[index].toUpperCase(), 64, 76);

        return new THREE.CanvasTexture(canvas);
      }
    );
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
    NgtSobaBoxModule,
  ],
})
export class NgtSobaGizmoViewcubeModule {}
