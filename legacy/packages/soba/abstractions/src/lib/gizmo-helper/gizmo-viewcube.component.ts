import {
  CanvasStore,
  EnhancedComponentStore,
  NgtCoreModule,
  NgtEvent,
  NgtRepeatModule,
  NgtVector3,
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
import { NgtSobaExtender } from '@angular-three/soba';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  NgZone,
  Output,
} from '@angular/core';
import { filter, Observable, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
// import { SobaGizmoHelperContext } from './gizmo-helper.context';

type XYZ = [number, number, number];

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

console.log(edges);

const edgeDimensions = edges.map(
  (edge) =>
    edge
      .toArray()
      .map((axis: number): number => (axis == 0 ? 0.5 : 0.25)) as XYZ
);

interface ViewcubeProps {
  font?: string;
  color?: string;
  opacity?: number;
  hoverColor?: string;
  textColor?: string;
  strokeColor?: string;
  faces?: string[];
}

@Component({
  selector: 'ngt-soba-gizmo-viewcube',
  exportAs: 'ngtSobaGizmoViewcube',
  template: `
    <ngt-group
      (ready)="ready.emit($event)"
      (animateReady)="animateReady.emit($event)"
      [scale]="[60, 60, 60]"
      [appendTo]="appendTo"
    >
      <ngt-soba-face-cube
        [font]="font"
        [textColor]="textColor"
        [strokeColor]="strokeColor"
        [opacity]="opacity"
        [faces]="faces"
        [hoverColor]="hoverColor"
        [color]="color"
        [click]="click"
      ></ngt-soba-face-cube>
      <ngt-soba-edge-cube
        *ngFor="let edge of edges; index as i"
        [position]="edge.toArray()"
        [dimensions]="edgeDimensions[i]"
        [hoverColor]="hoverColor"
        [faces]="faces"
        [opacity]="opacity"
        [strokeColor]="strokeColor"
        [textColor]="textColor"
        [click]="click"
      ></ngt-soba-edge-cube>
      <ngt-soba-edge-cube
        *ngFor="let corner of corners"
        [position]="corner.toArray()"
        [dimensions]="cornerDimensions"
        [hoverColor]="hoverColor"
        [faces]="faces"
        [opacity]="opacity"
        [strokeColor]="strokeColor"
        [textColor]="textColor"
        [click]="click"
      ></ngt-soba-edge-cube>

      <ngt-ambient-light [intensity]="0.5"></ngt-ambient-light>
      <ngt-point-light
        [intensity]="0.5"
        [position]="[10, 10, 10]"
      ></ngt-point-light>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaGizmoViewcube extends NgtSobaExtender<THREE.Group> {
  @Input() appendTo?: THREE.Object3D;

  @Input() font?: string;
  @Input() opacity?: number;
  @Input() color?: string;
  @Input() hoverColor?: string;
  @Input() textColor?: string;
  @Input() strokeColor?: string;
  @Input() faces?: string[];

  @Output() click = new EventEmitter<THREE.Event>();

  edges = edges;
  edgeDimensions = edgeDimensions;
  corners = corners;
  cornerDimensions = cornerDimensions;
}

@Component({
  selector: 'ngt-soba-edge-cube[dimensions][position]',
  exportAs: 'ngtSobaEdgeCube',
  template: `
    <ngt-mesh
      (ready)="ready.emit($event); onCubeReady($event)"
      (animateReady)="animateReady.emit($event)"
      (click)="onClick($event)"
      (pointerover)="onPointerOver($event)"
      (pointerout)="onPointerOut($event)"
      [scale]="[1.01, 1, 1]"
      [position]="position"
    >
      <ngt-box-geometry [args]="dimensions"></ngt-box-geometry>
      <ngt-mesh-basic-material
        [parameters]="{
          color: hover ? hoverColor : 'white',
          transparent: true,
          opacity: 0.6,
          visible: hover
        }"
      ></ngt-mesh-basic-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaEdgeCube extends NgtSobaExtender<THREE.Mesh> {
  @Input() dimensions!: XYZ;
  @Input() position!: NgtVector3;
  @Input() opacity?: number;
  @Input() hoverColor?: string;
  @Input() textColor?: string;
  @Input() strokeColor?: string;
  @Input() faces?: string[];
  @Input() click?: EventEmitter<THREE.Event>;

  hover = false;

  // constructor(private sobaGizmoHelperContext: SobaGizmoHelperContext) {
  //   super();
  // }

  onCubeReady(cube: THREE.Mesh) {
    // cube.raycast = this.sobaGizmoHelperContext.raycast;
  }

  onClick($event: NgtEvent<MouseEvent>) {
    if (this.click?.observed) {
      this.click.emit($event);
    } else {
      $event.stopPropagation();
      // this.sobaGizmoHelperContext.tweenCamera(
      //   new THREE.Vector3(...(this.position as number[]))
      // );
    }
  }

  onPointerOver($event: NgtEvent<PointerEvent>) {
    $event.stopPropagation();
    this.hover = true;
  }

  onPointerOut($event: NgtEvent<PointerEvent>) {
    $event.stopPropagation();
    this.hover = false;
  }
}

@Component({
  selector: 'ngt-soba-face-cube',
  exportAs: 'ngtSobaFaceCube',
  template: `
    <ngt-mesh
      (ready)="ready.emit($event); onCubeReady($event)"
      (animateReady)="animateReady.emit($event)"
      (click)="onClick($event)"
      (pointermove)="onPointerMove($event)"
      (pointerout)="onPointerOut($event)"
    >
      <ngt-soba-face-material
        *repeat="let index of 6"
        [hover]="hover === index"
        [index]="index"
        [color]="color!"
        [font]="font!"
        [faces]="faces!"
        [hoverColor]="hoverColor!"
        [opacity]="opacity!"
        [strokeColor]="strokeColor!"
        [textColor]="textColor!"
      ></ngt-soba-face-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaFaceCube extends NgtSobaExtender<THREE.Mesh> {
  @Input() font?: string;
  @Input() opacity?: number;
  @Input() color?: string;
  @Input() hoverColor?: string;
  @Input() textColor?: string;
  @Input() strokeColor?: string;
  @Input() faces?: string[];
  @Input() click?: EventEmitter<THREE.Event>;

  hover: number | null = null;

  // constructor(private sobaGizmoHelperContext: SobaGizmoHelperContext) {
  //   super();
  // }

  onCubeReady(cube: THREE.Mesh) {
    // cube.raycast = this.sobaGizmoHelperContext.raycast;
  }

  onClick($event: NgtEvent<MouseEvent>) {
    if (this.click?.observed) {
      this.click.emit($event);
    } else {
      $event.stopPropagation();
      // this.sobaGizmoHelperContext.tweenCamera($event.face!.normal);
    }
  }

  onPointerMove($event: NgtEvent<PointerEvent>) {
    $event.stopPropagation();
    this.hover = Math.floor($event.faceIndex! / 2);
  }

  onPointerOut($event: NgtEvent<PointerEvent>) {
    $event.stopPropagation();
    this.hover = null;
  }
}

@Component({
  selector: 'ngt-soba-face-material[hover][index]',
  exportAs: 'ngtSobaFaceMaterial',
  template: `
    <ngt-mesh-lambert-material
      *ngIf="parameters$ | async as parameters"
      [parameters]="{
        map: parameters.texture,
        color: parameters.color,
        opacity: parameters.opacity,
        transparent: true
      }"
    ></ngt-mesh-lambert-material>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaFaceMaterial extends EnhancedComponentStore<
  ViewcubeProps & {
    hover: boolean;
    index: number;
    texture: THREE.CanvasTexture | null;
  }
> {
  @Input() set hover(v: boolean) {
    this.updaters.setHover(v);
  }

  @Input() set index(v: number) {
    this.updaters.setIndex(v);
  }

  @Input() set font(v: string) {
    this.updaters.setFont(v || '20px Inter var, Arial, sans-serif');
  }

  @Input() set opacity(v: number) {
    this.updaters.setOpacity(v || 1);
  }

  @Input() set color(v: string) {
    this.updaters.setColor(v || colors.bg);
  }

  @Input() set hoverColor(v: string) {
    this.updaters.setHoverColor(v || colors.hover);
  }

  @Input() set textColor(v: string) {
    this.updaters.setTextColor(v || colors.text);
  }

  @Input() set strokeColor(v: string) {
    this.updaters.setStrokeColor(v || colors.stroke);
  }

  @Input() set faces(v: string[]) {
    this.updaters.setFaces(v || defaultFaces);
  }

  readonly parameters$: Observable<{
    texture: THREE.CanvasTexture;
    color: THREE.ColorRepresentation;
    opacity: number;
  }> = this.select(
    this.selectors.texture$.pipe(
      filter((texture): texture is THREE.CanvasTexture => !!texture)
    ),
    this.selectors.hover$,
    this.selectors.hoverColor$,
    this.selectors.opacity$,
    this.canvasStore.selectors.renderer$,
    (texture, hover, hoverColor, opacity, renderer) => {
      texture!.anisotropy = renderer!.capabilities.getMaxAnisotropy() || 1;
      return {
        texture,
        color: hover ? hoverColor! : 'white',
        opacity: opacity!,
      };
    },
    { debounce: true }
  );

  private readonly changes$ = this.select(
    this.selectors.index$,
    this.selectors.font$,
    this.selectors.color$,
    this.selectors.textColor$,
    this.selectors.strokeColor$,
    (index, font, color, textColor, strokeColor) => ({
      index,
      font,
      color,
      textColor,
      strokeColor,
    }),
    { debounce: true }
  );

  constructor(private canvasStore: CanvasStore, private ngZone: NgZone) {
    super({
      hover: false,
      index: -1,
      font: '20px Inter var, Arial, sans-serif',
      faces: defaultFaces,
      color: colors.bg,
      hoverColor: colors.hover,
      textColor: colors.text,
      strokeColor: colors.stroke,
      opacity: 1,
      texture: null,
    });
  }

  ngOnInit() {
    this.textureEffect(
      this.changes$ as Observable<{
        index: number;
        font: string;
        color: string;
        textColor: string;
        strokeColor: string;
      }>
    );
  }

  readonly textureEffect = this.effect<{
    index: number;
    font: string;
    color: string;
    textColor: string;
    strokeColor: string;
  }>((changes$) =>
    changes$.pipe(
      withLatestFrom(this.selectors.faces$),
      tap(([{ index, font, color, textColor, strokeColor }, faces]) => {
        this.ngZone.runOutsideAngular(() => {
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
          context.fillText(faces![index].toUpperCase(), 64, 76);

          this.patchState({ texture: new THREE.CanvasTexture(canvas) });
        });
      })
    )
  );
}

@NgModule({
  declarations: [
    NgtSobaGizmoViewcube,
    NgtSobaFaceMaterial,
    NgtSobaFaceCube,
    NgtSobaEdgeCube,
  ],
  exports: [NgtSobaGizmoViewcube],
  imports: [
    CommonModule,
    NgtCoreModule,
    NgtRepeatModule,
    NgtGroupModule,
    NgtMeshModule,
    NgtMeshLambertMaterialModule,
    NgtMeshBasicMaterialModule,
    NgtBoxGeometryModule,
    NgtAmbientLightModule,
    NgtPointLightModule,
  ],
})
export class NgtSobaGizmoViewcubeModule {}
