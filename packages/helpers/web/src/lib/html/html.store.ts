import type {
  Size,
  ThreeCameraAlias,
  ThreeRaycaster,
} from '@angular-three/core';
import { CanvasStore } from '@angular-three/core';
import {
  ElementRef,
  Injectable,
  NgZone,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Subject } from 'rxjs';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Camera, Group, Object3D, OrthographicCamera, Scene } from 'three';
import { HtmlUtil } from './html.util';

export type CalculatePosition = typeof HtmlUtil.defaultCalculatePosition;

export interface HtmlState {
  prepend?: boolean;
  center?: boolean;
  fullscreen?: boolean;
  distanceFactor?: number;
  portal?: HTMLElement;
  occlude?: Object3D[] | boolean;
  domStyle?: Partial<CSSStyleDeclaration>;
  domClass: string;
  target?: HTMLElement;
  group?: Group;
  elementRef?: ElementRef<HTMLElement>;
  viewContainerRef?: ViewContainerRef;
  eps: number;
  sprite: boolean;
  transform: boolean;
  zIndexRange: number[];
  calculatePosition: CalculatePosition;
}

export const initialState: HtmlState = {
  domClass: '',
  eps: 0.001,
  sprite: false,
  transform: false,
  zIndexRange: [16777271, 0],
  calculatePosition: HtmlUtil.defaultCalculatePosition,
};

@Injectable()
export class HtmlStore extends ComponentStore<HtmlState> {
  readonly prepend$ = this.select((s) => s.prepend);
  readonly center$ = this.select((s) => s.center);
  readonly fullscreen$ = this.select((s) => s.fullscreen);
  readonly distanceFactor$ = this.select((s) => s.distanceFactor);
  readonly portal$ = this.select((s) => s.portal);
  readonly domStyle$ = this.select((s) => s.domStyle);
  readonly domClass$ = this.select((s) => s.domClass);
  readonly eps$ = this.select((s) => s.eps);
  readonly sprite$ = this.select((s) => s.sprite);
  readonly transform$ = this.select((s) => s.transform);
  readonly zIndexRange$ = this.select((s) => s.zIndexRange);
  readonly calculatePosition$ = this.select((s) => s.calculatePosition);
  readonly occlude$ = this.select((s) => s.occlude);

  readonly target$ = this.select((s) => s.target);
  readonly group$ = this.select((s) => s.group);
  readonly elementRef$ = this.select((s) => s.elementRef);

  readonly manipulateParentDomParams$ = this.select(
    this.portal$,
    this.transform$,
    this.target$,
    this.group$,
    this.canvasStore.scene$,
    this.canvasStore.camera$,
    this.canvasStore.canvasInternal$,
    (portal, transform, target, group, scene, camera, { size }) => ({
      portal,
      transform,
      target,
      group,
      camera,
      scene,
      size,
    }),
    { debounce: true }
  );

  readonly transformStyles$ = this.select(
    this.transform$,
    this.center$,
    this.domStyle$,
    this.fullscreen$,
    this.canvasStore.canvasInternal$,
    (transform, center = false, domStyle = {}, fullscreen = false, { size }) =>
      HtmlStore.transformStyles({
        transform,
        center,
        domStyle,
        fullscreen,
        size,
      })
  );

  $occlude = new Subject<boolean>();

  private oldZoom = 0;
  private oldPosition = [0, 0];
  private visible = true;

  constructor(
    private readonly canvasStore: CanvasStore,
    private readonly ngZone: NgZone
  ) {
    super(initialState);
    ngZone.runOutsideAngular(() => {
      this.setTarget(
        canvasStore.renderer$.pipe(
          filter((renderer) => !!renderer),
          map((renderer) => renderer!.domElement.parentNode as HTMLElement)
        )
      );

      this.manipulateParentDomEffect(this.manipulateParentDomParams$);
    });
  }

  readonly renderEffect = this.effect<{
    domTemplate: TemplateRef<unknown>;
    transformDomTemplate: TemplateRef<unknown>;
  }>((template$) =>
    template$.pipe(
      switchMap(({ domTemplate, transformDomTemplate }) =>
        this.state$.pipe(
          tap(({ elementRef, viewContainerRef, transform }) => {
            if (elementRef && viewContainerRef) {
              HtmlStore.render({
                elementRef,
                viewContainerRef,
                domTemplate,
                transformDomTemplate,
                transform,
              });
            }
          })
        )
      )
    )
  );

  readonly manipulateParentDomEffect = this.effect<{
    portal?: HTMLElement;
    transform: boolean;
    target?: HTMLElement;
    group?: Group;
    camera?: Camera;
    scene?: Scene;
    size: Size;
  }>((params$) =>
    params$.pipe(
      tap((params) => {
        if (params.portal) {
          this.setTarget(params.portal);
        }
      }),
      withLatestFrom(this.prepend$, this.calculatePosition$, this.elementRef$),
      tap(
        ([
          { transform, target, group, camera, scene, size },
          prepend = false,
          calculatePosition,
          elementRef,
        ]) => {
          if (target && elementRef && group && camera && scene) {
            HtmlStore.manipulateParentDom({
              target,
              elementRef,
              group,
              camera,
              scene,
              size,
              transform,
              calculatePosition,
              prepend,
            });
          }
        }
      )
    )
  );

  readonly animateEffect = this.effect<{
    occludeObserved: boolean;
    outerRef?: ElementRef;
    innerRef?: ElementRef;
  }>((params$) =>
    params$.pipe(
      withLatestFrom(
        this.calculatePosition$,
        this.distanceFactor$,
        this.eps$,
        this.elementRef$,
        this.group$,
        this.occlude$,
        this.sprite$,
        this.transform$,
        this.zIndexRange$,
        this.canvasStore.camera$,
        this.canvasStore.scene$,
        this.canvasStore.raycaster$,
        this.canvasStore.canvasInternal$
      ),
      tap(
        ([
          { occludeObserved, innerRef, outerRef },
          calculatePosition,
          distanceFactor,
          eps,
          elementRef,
          group,
          occlude,
          sprite,
          transform,
          zIndexRange,
          camera,
          scene,
          raycaster,
          { size },
        ]) => {
          if (elementRef && group && camera && scene && raycaster) {
            this.animate({
              calculatePosition,
              distanceFactor,
              eps,
              elementRef,
              group,
              occlude,
              sprite,
              transform,
              zIndexRange,
              camera,
              scene,
              raycaster,
              size,
              observedOcclude: occludeObserved,
              transformOuterRef: outerRef,
              transformInnerRef: innerRef,
            });
          }
        }
      )
    )
  );

  private animate({
    calculatePosition,
    camera,
    distanceFactor,
    elementRef,
    eps,
    group,
    occlude,
    raycaster,
    scene,
    size,
    sprite,
    transform,
    transformInnerRef,
    transformOuterRef,
    zIndexRange,
    observedOcclude,
  }: {
    group: Group;
    raycaster: ThreeRaycaster;
    camera: ThreeCameraAlias;
    transform: boolean;
    calculatePosition: CalculatePosition;
    size: Size;
    eps: number;
    scene: Scene;
    elementRef: ElementRef<HTMLElement>;
    zIndexRange: number[];
    sprite: boolean;
    observedOcclude: boolean;
    occlude?: Object3D[] | boolean;
    distanceFactor?: number;
    transformOuterRef?: ElementRef<HTMLDivElement>;
    transformInnerRef?: ElementRef<HTMLDivElement>;
  }) {
    camera.updateMatrixWorld();
    const vec = transform
      ? this.oldPosition
      : calculatePosition(group, camera, size);

    if (
      transform ||
      Math.abs(this.oldZoom - camera.zoom) > eps ||
      Math.abs(this.oldPosition[0] - vec[0]) > eps ||
      Math.abs(this.oldPosition[1] - vec[1]) > eps
    ) {
      const isBehindCamera = HtmlUtil.isObjectBehindCamera(group, camera);
      let raytraceTarget: null | undefined | boolean | Object3D[] = false;

      if (typeof occlude === 'boolean') {
        if (occlude) {
          raytraceTarget = [scene];
        }
      } else if (Array.isArray(occlude)) {
        raytraceTarget = occlude as Object3D[];
      }

      const previouslyVisible = this.visible;
      if (raytraceTarget && raycaster) {
        const isVisible = HtmlUtil.isObjectVisible(
          group,
          camera,
          raycaster,
          raytraceTarget
        );
        this.visible = isVisible && !isBehindCamera;
      } else {
        this.visible = !isBehindCamera;
      }

      if (previouslyVisible !== this.visible) {
        if (observedOcclude) this.$occlude.next(!this.visible);
        else
          elementRef.nativeElement.style.display = this.visible
            ? 'block'
            : 'none';
      }

      elementRef.nativeElement.style.zIndex = `${HtmlUtil.objectZIndex(
        group,
        camera,
        zIndexRange
      )}`;

      if (transform) {
        const [widthHalf, heightHalf] = [size.width / 2, size.height / 2];
        const fov = camera.projectionMatrix.elements[5] * heightHalf;
        const { isOrthographicCamera, top, left, bottom, right } =
          camera as OrthographicCamera;
        const cameraMatrix = HtmlUtil.getCameraCSSMatrix(
          camera.matrixWorldInverse
        );
        const cameraTransform = isOrthographicCamera
          ? `scale(${fov})translate(${HtmlUtil.epsilon(
              -(right + left) / 2
            )}px,${HtmlUtil.epsilon((top + bottom) / 2)}px)`
          : `translateZ(${fov}px)`;
        let matrix = group.matrixWorld;
        if (sprite) {
          matrix = camera.matrixWorldInverse
            .clone()
            .transpose()
            .copyPosition(matrix)
            .scale(group.scale);
          matrix.elements[3] = matrix.elements[7] = matrix.elements[11] = 0;
          matrix.elements[15] = 1;
        }
        elementRef.nativeElement.style.width = size.width + 'px';
        elementRef.nativeElement.style.height = size.height + 'px';
        elementRef.nativeElement.style.perspective = isOrthographicCamera
          ? ''
          : `${fov}px`;
        if (transformOuterRef && transformInnerRef) {
          transformOuterRef.nativeElement.style.transform = `${cameraTransform}${cameraMatrix}translate(${widthHalf}px,${heightHalf}px)`;
          transformInnerRef.nativeElement.style.transform =
            HtmlUtil.getObjectCSSMatrix(
              matrix,
              1 / ((distanceFactor || 10) / 400)
            );
        }
      } else {
        const scale =
          distanceFactor === undefined
            ? 1
            : HtmlUtil.objectScale(group, camera) * distanceFactor;
        elementRef.nativeElement.style.transform = `translate3d(${vec[0]}px,${vec[1]}px,0) scale(${scale})`;
      }
      this.oldPosition = vec;
      this.oldZoom = camera.zoom;
    }
  }

  private static render({
    elementRef,
    viewContainerRef,
    domTemplate,
    transformDomTemplate,
    transform,
  }: {
    viewContainerRef: ViewContainerRef;
    elementRef: ElementRef<HTMLElement>;
    transform: boolean;
    transformDomTemplate: TemplateRef<unknown>;
    domTemplate: TemplateRef<unknown>;
  }) {
    viewContainerRef.clear();
    if (transform) {
      viewContainerRef.createEmbeddedView(transformDomTemplate);
    } else {
      viewContainerRef.createEmbeddedView(domTemplate);
    }

    const inserted = elementRef.nativeElement.nextElementSibling;
    if (inserted) {
      elementRef.nativeElement.appendChild(inserted);
    }
  }

  private static manipulateParentDom({
    target,
    elementRef,
    group,
    transform,
    scene,
    camera,
    size,
    prepend,
    calculatePosition,
  }: {
    target: HTMLElement;
    elementRef: ElementRef<HTMLElement>;
    group: Group;
    transform: boolean;
    scene: Scene;
    camera: Camera;
    size: Size;
    prepend: boolean;
    calculatePosition: CalculatePosition;
  }) {
    const cleanUp = () => {
      let hasChild = false;

      if (target) {
        target.childNodes.forEach((child) => {
          hasChild = child === elementRef.nativeElement;
        });

        if (hasChild) {
          target.removeChild(elementRef.nativeElement);
        }
      }
    };

    cleanUp();

    if (scene && camera && group) {
      scene.updateMatrixWorld();
      if (transform) {
        elementRef.nativeElement.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;`;
      } else {
        const vec = calculatePosition(group, camera, size);
        elementRef.nativeElement.style.cssText = `position:absolute;top:0;left:0;transform:translate3d(${vec[0]}px,${vec[1]}px,0);transform-origin:0 0;`;
      }
      if (target) {
        if (prepend) target.prepend(elementRef.nativeElement);
        else target.appendChild(elementRef.nativeElement);
      }
    }
  }

  private static transformStyles({
    fullscreen = false,
    transform,
    size,
    center = false,
    domStyle = {},
  }: {
    transform: boolean;
    size: Size;
    center: boolean;
    fullscreen: boolean;
    domStyle: Partial<CSSStyleDeclaration>;
  }) {
    if (transform) {
      return {
        position: 'absolute',
        top: '0',
        left: '0',
        width: `${size.width.toString()}px`,
        height: `${size.height.toString()}px`,
        transformStyle: 'preserve-3d',
        pointerEvents: 'none',
      };
    }
    return {
      position: 'absolute',
      transform: center ? 'translate3d(-50%,-50%,0)' : 'none',
      ...(fullscreen && {
        top: `${-size.height / 2}px`,
        left: `${-size.width / 2}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }),
      ...domStyle,
    };
  }

  readonly elementChangedEffect = this.effect<{
    elementRef: ElementRef;
    viewContainerRef: ViewContainerRef;
  }>((params$) =>
    params$.pipe(
      tap(({ elementRef, viewContainerRef }) => {
        this.patchState({ elementRef, viewContainerRef });
      })
    )
  );

  readonly setTarget = this.updater<HTMLElement>((state, target) => ({
    ...state,
    target,
  }));

  readonly setGroup = this.updater<Group>((state, group) => ({
    ...state,
    group,
  }));

  readonly setPrepend = this.updater<boolean>((state, prepend) => ({
    ...state,
    prepend,
  }));
  readonly setCenter = this.updater<boolean>((state, center) => ({
    ...state,
    center,
  }));
  readonly setFullscreen = this.updater<boolean>((state, fullscreen) => ({
    ...state,
    fullscreen,
  }));
  readonly setDistanceFactor = this.updater<number>(
    (state, distanceFactor) => ({
      ...state,
      distanceFactor,
    })
  );
  readonly setPortal = this.updater<HTMLElement>((state, portal) => ({
    ...state,
    portal,
  }));
  readonly setOcclude = this.updater<Object3D[] | boolean>(
    (state, occlude) => ({
      ...state,
      occlude,
    })
  );
  readonly setDomStyle = this.updater<Partial<CSSStyleDeclaration>>(
    (state, domStyle) => ({
      ...state,
      domStyle,
    })
  );
  readonly setDomClass = this.updater<string>((state, domClass) => ({
    ...state,
    domClass,
  }));
  readonly setEps = this.updater<number>((state, eps) => ({ ...state, eps }));
  readonly setSprite = this.updater<boolean>((state, sprite) => ({
    ...state,
    sprite,
  }));
  readonly setTransform = this.updater<boolean>((state, transform) => ({
    ...state,
    transform,
  }));
  readonly setZIndexRange = this.updater<number[]>((state, zIndexRange) => ({
    ...state,
    zIndexRange,
  }));
  readonly setCalculatePosition = this.updater<CalculatePosition>(
    (state, calculatePosition) => ({
      ...state,
      calculatePosition,
    })
  );
}
