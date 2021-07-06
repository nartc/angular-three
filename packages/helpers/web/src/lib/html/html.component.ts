import {
  AnimationReady,
  CanvasStore,
  Object3dControllerDirective,
  OBJECT_3D_CONTROLLER_PROVIDER,
  OBJECT_3D_WATCHED_CONTROLLER,
} from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  Camera,
  Group,
  Matrix4,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Raycaster,
  Vector3,
} from 'three';
import { HtmlElementDirective } from './html-element.directive';

/* Port from React Drei HTML component: https://github.com/pmndrs/drei/blob/master/src/web/Html.tsx */
const v1 = new Vector3();
const v2 = new Vector3();
const v3 = new Vector3();

function defaultCalculatePosition(
  el: Object3D,
  camera: Camera,
  size: { width: number; height: number }
): number[] {
  const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
  objectPos.project(camera);
  const widthHalf = size.width / 2;
  const heightHalf = size.height / 2;
  return [
    objectPos.x * widthHalf + widthHalf,
    -(objectPos.y * heightHalf) + heightHalf,
  ];
}

export type CalculatePosition = typeof defaultCalculatePosition;

function isObjectBehindCamera(el: Object3D, camera: Camera): boolean {
  const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
  const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
  const deltaCamObj = objectPos.sub(cameraPos);
  const camDir = camera.getWorldDirection(v3);
  return deltaCamObj.angleTo(camDir) > Math.PI / 2;
}

function isObjectVisible(
  el: Object3D,
  camera: Camera,
  raycaster: Raycaster,
  occlude: Object3D[]
): boolean {
  const elPos = v1.setFromMatrixPosition(el.matrixWorld);
  const screenPos = elPos.clone();
  screenPos.project(camera);
  raycaster.setFromCamera(screenPos, camera);
  const intersects = raycaster.intersectObjects(occlude, true);

  if (intersects.length) {
    const intersectionDistance = intersects[0].distance;
    const pointDistance = elPos.distanceTo(raycaster.ray.origin);
    return pointDistance < intersectionDistance;
  }

  return true;
}

function objectScale(el: Object3D, camera: Camera): number {
  if (camera instanceof OrthographicCamera) {
    return camera.zoom;
  }

  if (camera instanceof PerspectiveCamera) {
    const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
    const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
    const vFOV = (camera.fov * Math.PI) / 180;
    const dist = objectPos.distanceTo(cameraPos);
    const scaleFOV = 2 * Math.tan(vFOV / 2) * dist;
    return 1 / scaleFOV;
  }

  return 1;
}

function objectZIndex(
  el: Object3D,
  camera: Camera,
  zIndexRange: Array<number>
): number | undefined {
  if (
    camera instanceof PerspectiveCamera ||
    camera instanceof OrthographicCamera
  ) {
    const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
    const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
    const dist = objectPos.distanceTo(cameraPos);
    const A = (zIndexRange[1] - zIndexRange[0]) / (camera.far - camera.near);
    const B = zIndexRange[1] - A * camera.far;
    return Math.round(A * dist + B);
  }
  return undefined;
}

function epsilon(value: number): number {
  return Math.abs(value) < 1e-10 ? 0 : value;
}

function getCSSMatrix(
  matrix: Matrix4,
  multipliers: number[],
  prepend = ''
): string {
  let matrix3d = 'matrix3d(';
  for (let i = 0; i !== 16; i++) {
    matrix3d +=
      epsilon(multipliers[i] * matrix.elements[i]) + (i !== 15 ? ',' : ')');
  }
  return prepend + matrix3d;
}

const getCameraCSSMatrix = ((multipliers: number[]) => {
  return (matrix: Matrix4) => getCSSMatrix(matrix, multipliers);
})([1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1]);

const getObjectCSSMatrix = ((scaleMultipliers: (n: number) => number[]) => {
  return (matrix: Matrix4, factor: number) =>
    getCSSMatrix(matrix, scaleMultipliers(factor), 'translate(-50%,-50%)');
})((f: number) => [
  1 / f,
  1 / f,
  1 / f,
  1,
  -1 / f,
  -1 / f,
  -1 / f,
  -1,
  1 / f,
  1 / f,
  1 / f,
  1,
  1,
  1,
  1,
  1,
]);

@Component({
  selector: 'ngt-html',
  exportAs: 'ngtHtml',
  template: `
    <ngt-group
      o3d
      [name]="object3dController.name"
      [position]="object3dController.position"
      [rotation]="object3dController.rotation"
      [quaternion]="object3dController.quaternion"
      [scale]="object3dController.scale"
      [color]="object3dController.color"
      [userData]="object3dController.userData"
      [castShadow]="object3dController.castShadow"
      [receiveShadow]="object3dController.receiveShadow"
      [visible]="object3dController.visible"
      [matrixAutoUpdate]="object3dController.matrixAutoUpdate"
      [appendMode]="object3dController.appendMode"
      [appendTo]="object3dController.appendTo"
      (click)="object3dController.click.emit($event)"
      (contextmenu)="object3dController.contextmenu.emit($event)"
      (dblclick)="object3dController.dblclick.emit($event)"
      (pointerup)="object3dController.pointerup.emit($event)"
      (pointerdown)="object3dController.pointerdown.emit($event)"
      (pointerover)="object3dController.pointerover.emit($event)"
      (pointerout)="object3dController.pointerout.emit($event)"
      (pointerenter)="object3dController.pointerenter.emit($event)"
      (pointerleave)="object3dController.pointerleave.emit($event)"
      (pointermove)="object3dController.pointermove.emit($event)"
      (pointermissed)="object3dController.pointermissed.emit($event)"
      (pointercancel)="object3dController.pointercancel.emit($event)"
      (wheel)="object3dController.wheel.emit($event)"
      (ready)="onHtmlReady($event)"
      (animateReady)="onHtmlAnimateReady($event)"
    ></ngt-group>
    <ng-template #transformDomTemplate>
      <div #transformOuterRef [style]="styles">
        <div
          #transformInnerRef
          [style]="{ position: 'absolute', pointerEvents: 'auto' }"
        >
          <div #renderedRef [class]="domStyle" [style]="domStyle">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </ng-template>

    <ng-template #domTemplate>
      <div #renderedRef [class]="domStyle" [style]="domStyle">
        <ng-content></ng-content>
      </div>
    </ng-template>

    <div ngtHtmlElement id="ngtHtmlElement"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OBJECT_3D_CONTROLLER_PROVIDER],
})
export class HtmlComponent implements OnChanges {
  @Input() prepend?: boolean;
  @Input() center?: boolean;
  @Input() fullscreen?: boolean;
  @Input() distanceFactor?: number;
  @Input() portal?: HTMLElement;
  @Input() occlude?: Object3D[] | boolean;
  @Input() domStyle?: Partial<CSSStyleDeclaration>;
  @Input() domClass = '';
  @Input() eps = 0.001;
  @Input() sprite = false;
  @Input() transform = false;
  @Input() zIndexRange: number[] = [16777271, 0];
  @Input() calculatePosition: CalculatePosition = defaultCalculatePosition;

  @Input() htmlElement?: HtmlElementDirective;

  @Output() occludeChange = new EventEmitter<boolean>();

  @ViewChild('transformDomTemplate', { static: true })
  transformDomTemplate!: TemplateRef<unknown>;

  @ViewChild('domTemplate', { static: true })
  domTemplate!: TemplateRef<unknown>;

  @ViewChild(HtmlElementDirective, { static: true })
  defaultHtmlElement!: HtmlElementDirective;

  @ViewChild('transformOuterRef')
  transformOuterRef?: ElementRef<HTMLDivElement>;
  @ViewChild('transformInnerRef')
  transformInnerRef?: ElementRef<HTMLDivElement>;
  @ViewChild('renderedRef') renderedDomRef!: ElementRef<HTMLDivElement>;

  private element!: HtmlElementDirective;
  private oldZoom = 0;
  private oldPosition = [0, 0];
  private target =
    this.canvasStore.getImperativeState().renderer?.domElement.parentNode;

  private visible = true;
  styles?: Partial<CSSStyleDeclaration>;
  group?: Group;

  constructor(
    @Inject(OBJECT_3D_WATCHED_CONTROLLER)
    public readonly object3dController: Object3dControllerDirective,
    private readonly canvasStore: CanvasStore,
    private readonly ngZone: NgZone,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.ngZone.runOutsideAngular(() => {
      this.renderEffect();
      if ('portal' in changes || 'transform' in changes) {
        if (changes.portal) {
          this.target = changes.portal.currentValue;
        }

        this.manipulateDomEffect();
      }

      if (
        'style' in changes ||
        'center' in changes ||
        'fullscreen' in changes ||
        'transform' in changes
      ) {
        this.setupStylesEffect();
      }
    });
  }

  onHtmlAnimateReady({
    animateObject,
    renderState: { camera, size, scene },
  }: AnimationReady<Group>) {
    this.group = animateObject;
    const { raycaster } = this.canvasStore.getImperativeState();
    camera.updateMatrixWorld();
    const vec = this.transform
      ? this.oldPosition
      : this.calculatePosition(this.group, camera, size);

    if (
      this.transform ||
      Math.abs(this.oldZoom - camera.zoom) > this.eps ||
      Math.abs(this.oldPosition[0] - vec[0]) > this.eps ||
      Math.abs(this.oldPosition[1] - vec[1]) > this.eps
    ) {
      const isBehindCamera = isObjectBehindCamera(this.group, camera);
      let raytraceTarget: null | undefined | boolean | Object3D[] = false;

      if (typeof this.occlude === 'boolean') {
        if (this.occlude) {
          raytraceTarget = [scene];
        }
      } else if (Array.isArray(this.occlude)) {
        raytraceTarget = this.occlude as Object3D[];
      }

      const previouslyVisible = this.visible;
      if (raytraceTarget && raycaster) {
        const isVisible = isObjectVisible(
          this.group,
          camera,
          raycaster,
          raytraceTarget
        );
        this.visible = isVisible && !isBehindCamera;
      } else {
        this.visible = !isBehindCamera;
      }

      if (previouslyVisible !== this.visible) {
        if (this.occludeChange.observed) this.occludeChange.next(!this.visible);
        else
          this.element.elRef.nativeElement.style.display = this.visible
            ? 'block'
            : 'none';
      }

      this.element.elRef.nativeElement.style.zIndex = `${objectZIndex(
        this.group,
        camera,
        this.zIndexRange
      )}`;

      if (this.transform) {
        const [widthHalf, heightHalf] = [size.width / 2, size.height / 2];
        const fov = camera.projectionMatrix.elements[5] * heightHalf;
        const { isOrthographicCamera, top, left, bottom, right } =
          camera as OrthographicCamera;
        const cameraMatrix = getCameraCSSMatrix(camera.matrixWorldInverse);
        const cameraTransform = isOrthographicCamera
          ? `scale(${fov})translate(${epsilon(-(right + left) / 2)}px,${epsilon(
              (top + bottom) / 2
            )}px)`
          : `translateZ(${fov}px)`;
        let matrix = this.group.matrixWorld;
        if (this.sprite) {
          matrix = camera.matrixWorldInverse
            .clone()
            .transpose()
            .copyPosition(matrix)
            .scale(this.group.scale);
          matrix.elements[3] = matrix.elements[7] = matrix.elements[11] = 0;
          matrix.elements[15] = 1;
        }
        this.element.elRef.nativeElement.style.width = size.width + 'px';
        this.element.elRef.nativeElement.style.height = size.height + 'px';
        this.element.elRef.nativeElement.style.perspective =
          isOrthographicCamera ? '' : `${fov}px`;
        if (this.transformOuterRef && this.transformInnerRef) {
          this.transformOuterRef.nativeElement.style.transform = `${cameraTransform}${cameraMatrix}translate(${widthHalf}px,${heightHalf}px)`;
          this.transformInnerRef.nativeElement.style.transform =
            getObjectCSSMatrix(matrix, 1 / ((this.distanceFactor || 10) / 400));
        }
      } else {
        const scale =
          this.distanceFactor === undefined
            ? 1
            : objectScale(this.group, camera) * this.distanceFactor;
        this.element.elRef.nativeElement.style.transform = `translate3d(${vec[0]}px,${vec[1]}px,0) scale(${scale})`;
      }
      this.oldPosition = vec;
      this.oldZoom = camera.zoom;
    }
  }

  private renderEffect() {
    this.element.viewContainerRef.clear();
    if (this.transform) {
      this.element.viewContainerRef.createEmbeddedView(
        this.transformDomTemplate
      );
    } else {
      this.element.viewContainerRef.createEmbeddedView(this.domTemplate);
    }

    const inserted = this.element.elRef.nativeElement.nextElementSibling;
    if (inserted) {
      this.element.elRef.nativeElement.appendChild(inserted);
    }
  }

  private manipulateDomEffect() {
    const cleanUp = () => {
      let hasChild = false;

      if (this.target) {
        this.target.childNodes.forEach((child) => {
          hasChild = child === this.element.elRef.nativeElement;
        });

        if (hasChild) {
          this.target.removeChild(this.element.elRef.nativeElement);
        }
      }
    };

    cleanUp();

    const {
      scene,
      camera,
      internal: { size },
    } = this.canvasStore.getImperativeState();

    if (scene && camera && this.group) {
      scene.updateMatrixWorld();
      if (this.transform) {
        this.element.elRef.nativeElement.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;`;
      } else {
        const vec = this.calculatePosition(this.group, camera, size);
        this.element.elRef.nativeElement.style.cssText = `position:absolute;top:0;left:0;transform:translate3d(${vec[0]}px,${vec[1]}px,0);transform-origin:0 0;`;
      }
      if (this.target) {
        if (this.prepend) this.target.prepend(this.element.elRef.nativeElement);
        else this.target.appendChild(this.element.elRef.nativeElement);
      }
    }
  }

  private setupStylesEffect() {
    const {
      internal: { size },
    } = this.canvasStore.getImperativeState();
    if (this.transform) {
      this.styles = {
        position: 'absolute',
        top: '0',
        left: '0',
        width: `${size.width.toString()}px`,
        height: `${size.height.toString()}px`,
        transformStyle: 'preserve-3d',
        pointerEvents: 'none',
      };
    } else {
      this.styles = {
        position: 'absolute',
        transform: this.center ? 'translate3d(-50%,-50%,0)' : 'none',
        ...(this.fullscreen && {
          top: `${-size.height / 2}px`,
          left: `${-size.width / 2}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }),
        ...(this.domStyle || {}),
      };
    }
  }

  onHtmlReady(group: Group) {
    this.ngZone.runOutsideAngular(() => {
      this.group = group;
      this.target =
        this.portal ||
        this.canvasStore.getImperativeState().renderer?.domElement.parentNode;
      this.element = this.htmlElement ?? this.defaultHtmlElement;

      this.renderEffect();
      this.manipulateDomEffect();
      this.setupStylesEffect();
    });
  }
}
