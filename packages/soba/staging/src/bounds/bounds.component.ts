import {
  EnhancedRxState,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtAnimationFrameStore,
  NgtLoopService,
  NgtObject3dInputsController,
  NgtObject3dInputsControllerModule,
  NgtSobaExtender,
  NgtStore,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Inject,
  Injectable,
  Input,
  NgModule,
  QueryList,
} from '@angular/core';
import { requestAnimationFrame } from '@rx-angular/cdk/zone-less';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, Observable, startWith } from 'rxjs';
import * as THREE from 'three';

type ControlsProto = {
  update(): void;
  target: THREE.Vector3;
  maxDistance: number;
  addEventListener: (event: string, callback: (event: unknown) => void) => void;
  removeEventListener: (
    event: string,
    callback: (event: unknown) => void
  ) => void;
};

export type SizeProps = {
  box: THREE.Box3;
  size: THREE.Vector3;
  center: THREE.Vector3;
  distance: number;
};

export interface NgtSobaBoundsState {
  group: THREE.Group;
  damping: number;
  margin: number;
  eps: number;
  fit: boolean;
  clip: boolean;
}

@Injectable()
export class NgtSobaBoundsStore extends EnhancedRxState<
  NgtSobaBoundsState,
  { init: void }
> {
  #currentAnimating = false;
  #currentFocus = new THREE.Vector3();
  #currentCamera = new THREE.Vector3();
  #currentZoom = 1;

  #goalFocus = new THREE.Vector3();
  #goalCamera = new THREE.Vector3();
  #goalZoom = 1;

  #box = new THREE.Box3();

  actions = this.create();

  constructor(
    private store: NgtStore,
    private loopService: NgtLoopService,
    animationFrameStore: NgtAnimationFrameStore
  ) {
    super();
    this.set({
      damping: 6,
      margin: 1.2,
      eps: 0.01,
      fit: false,
      clip: false,
    });

    this.holdEffect(
      combineLatest([
        this.actions.init$,
        this.store.select('controls') as unknown as Observable<ControlsProto>,
        this.select(selectSlice(['clip', 'fit'])),
      ]),
      ([, controls, { clip, fit }]) => {
        this.refresh();
        if (fit) this.fit();
        if (clip) this.clip();

        if (controls) {
          // Try to prevent drag hijacking
          const callback = () => (this.#currentAnimating = false);
          controls.addEventListener('start', callback);
          return () => controls.removeEventListener('start', callback);
        }
        return;
      }
    );

    this.holdEffect(this.actions.init$, () => {
      const animationUuid = animationFrameStore.register({
        callback: ({ delta }) => {
          if (this.#currentAnimating) {
            const { damping, eps } = this.get();
            const camera = this.store.get('camera');
            const controls = this.store.get(
              'controls'
            ) as unknown as ControlsProto;

            this.#damp(this.#currentFocus, this.#goalFocus, damping, delta);
            this.#damp(this.#currentCamera, this.#goalCamera, damping, delta);
            this.#currentZoom = THREE.MathUtils.damp(
              this.#currentZoom,
              this.#goalZoom,
              damping,
              delta
            );
            camera.position.copy(this.#currentCamera);

            if (this.#isOrthographic(camera)) {
              camera.zoom = this.#currentZoom;
              camera.updateProjectionMatrix();
            }

            if (!controls) {
              camera.lookAt(this.#currentFocus);
            } else {
              controls.target.copy(this.#currentFocus);
              controls.update();
            }

            this.loopService.invalidate();
            if (
              this.#isOrthographic(camera) &&
              !(Math.abs(this.#currentZoom - this.#goalZoom) < eps)
            )
              return;
            if (
              !this.#isOrthographic(camera) &&
              !this.#equals(this.#currentCamera, this.#goalCamera)
            )
              return;
            if (controls && !this.#equals(this.#currentFocus, this.#goalFocus))
              return;
            this.#currentAnimating = false;
          }
        },
      });

      return () => {
        animationFrameStore.actions.unsubscriberUuid(animationUuid);
      };
    });
  }

  getSize(): SizeProps {
    const camera = this.store.get('camera');
    const size = this.#box.getSize(new THREE.Vector3());
    const center = this.#box.getCenter(new THREE.Vector3());
    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance = this.#isOrthographic(camera)
      ? maxSize * 4
      : maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
    const fitWidthDistance = this.#isOrthographic(camera)
      ? maxSize * 4
      : fitHeightDistance / camera.aspect;
    const distance =
      this.get('margin') * Math.max(fitHeightDistance, fitWidthDistance);
    return { box: this.#box, size, center, distance };
  }

  refresh(object?: THREE.Object3D | THREE.Box3) {
    const group = this.get('group');
    const camera = this.store.get('camera');
    const controls = this.store.get('controls') as unknown as ControlsProto;
    if (this.#isObject3D(object)) this.#box.setFromObject(object);
    else if (this.#isBox3(object)) this.#box.copy(object);
    else if (group) this.#box.setFromObject(group);

    if (this.#box.isEmpty()) {
      const max = camera.position.length() || 10;
      this.#box.setFromCenterAndSize(
        new THREE.Vector3(),
        new THREE.Vector3(max, max, max)
      );
    }

    if (controls?.constructor.name === 'OrthographicTrackballControls') {
      const { distance } = this.getSize();
      const direction = camera.position
        .clone()
        .sub(controls.target)
        .normalize()
        .multiplyScalar(distance);
      const newPos = controls.target.clone().add(direction);
      camera.position.copy(newPos);
    }

    return this;
  }

  clip() {
    const camera = this.store.get('camera');
    const controls = this.store.get('controls') as unknown as ControlsProto;
    const { distance } = this.getSize();
    if (controls) controls.maxDistance = distance * 10;
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();
    if (controls) controls.update();
    return this;
  }

  fit() {
    const { margin, damping } = this.get();
    const camera = this.store.get('camera');
    const controls = this.store.get('controls') as unknown as ControlsProto;
    this.#currentCamera.copy(camera.position);
    if (controls) this.#currentFocus.copy(controls.target);

    const { center, distance } = this.getSize();
    const direction = center
      .clone()
      .sub(camera.position)
      .normalize()
      .multiplyScalar(distance);

    this.#goalCamera.copy(center).sub(direction);
    this.#goalFocus.copy(center);

    if (this.#isOrthographic(camera)) {
      this.#currentZoom = camera.zoom;

      let maxHeight = 0,
        maxWidth = 0;
      const vertices = [
        new THREE.Vector3(this.#box.min.x, this.#box.min.y, this.#box.min.z),
        new THREE.Vector3(this.#box.min.x, this.#box.max.y, this.#box.min.z),
        new THREE.Vector3(this.#box.min.x, this.#box.min.y, this.#box.max.z),
        new THREE.Vector3(this.#box.min.x, this.#box.max.y, this.#box.max.z),
        new THREE.Vector3(this.#box.max.x, this.#box.max.y, this.#box.max.z),
        new THREE.Vector3(this.#box.max.x, this.#box.max.y, this.#box.min.z),
        new THREE.Vector3(this.#box.max.x, this.#box.min.y, this.#box.max.z),
        new THREE.Vector3(this.#box.max.x, this.#box.min.y, this.#box.min.z),
      ];
      // Transform the center and each corner to camera space
      center.applyMatrix4(camera.matrixWorldInverse);
      for (const v of vertices) {
        v.applyMatrix4(camera.matrixWorldInverse);
        maxHeight = Math.max(maxHeight, Math.abs(v.y - center.y));
        maxWidth = Math.max(maxWidth, Math.abs(v.x - center.x));
      }
      maxHeight *= 2;
      maxWidth *= 2;
      const zoomForHeight = (camera.top - camera.bottom) / maxHeight;
      const zoomForWidth = (camera.right - camera.left) / maxWidth;
      this.#goalZoom = Math.min(zoomForHeight, zoomForWidth) / margin;
      if (!damping) {
        camera.zoom = this.#goalZoom;
        camera.updateProjectionMatrix();
      }
    }

    if (damping) {
      this.#currentAnimating = true;
    } else {
      camera.position.copy(this.#goalCamera);
      camera.lookAt(this.#goalFocus);
      if (controls) {
        controls.target.copy(this.#goalFocus);
        controls.update();
      }
      this.loopService.invalidate();
    }
    // if (onFitRef.current) onFitRef.current(this.getSize());
    return this;
  }

  #equals(a: THREE.Vector3, b: THREE.Vector3) {
    const eps = this.get('eps');
    return (
      Math.abs(a.x - b.x) < eps &&
      Math.abs(a.y - b.y) < eps &&
      Math.abs(a.z - b.z) < eps
    );
  }

  #damp(v: THREE.Vector3, t: THREE.Vector3, lambda: number, delta: number) {
    v.x = THREE.MathUtils.damp(v.x, t.x, lambda, delta);
    v.y = THREE.MathUtils.damp(v.y, t.y, lambda, delta);
    v.z = THREE.MathUtils.damp(v.z, t.z, lambda, delta);
  }

  #isOrthographic(camera: THREE.Camera): camera is THREE.OrthographicCamera {
    return camera && (camera as THREE.OrthographicCamera).isOrthographicCamera;
  }

  #isObject3D(object: unknown): object is THREE.Object3D {
    return !!object && (object as THREE.Object3D).isObject3D;
  }

  #isBox3(object: unknown): object is THREE.Box3 {
    return !!object && (object as THREE.Box3).isBox3;
  }
}

@Component({
  selector: 'ngt-soba-bounds',
  template: `
    <ngt-group
      (ready)="object = $event; sobaSoundsStore.set({ group: $event })"
      (animateReady)="animateReady.emit({ entity: object, state: $event })"
      [object3dInputsController]="objectInputsController"
    >
      <ng-content></ng-content>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER, NgtSobaBoundsStore],
})
export class NgtSobaBounds extends NgtSobaExtender<THREE.Group> {
  @Input() set damping(damping: number) {
    this.sobaSoundsStore.set({ damping });
  }

  @Input() set fit(fit: boolean) {
    this.sobaSoundsStore.set({ fit });
  }

  @Input() set clip(clip: boolean) {
    this.sobaSoundsStore.set({ clip });
  }

  @Input() set margin(margin: number) {
    this.sobaSoundsStore.set({ margin });
  }

  @Input() set eps(eps: number) {
    this.sobaSoundsStore.set({ eps });
  }

  @ContentChildren(NgtObject3dInputsController) set children(
    v: QueryList<NgtObject3dInputsController>
  ) {
    requestAnimationFrame(() => {
      this.sobaSoundsStore.hold(
        combineLatest([
          v.changes.pipe(startWith(v)),
          this.sobaSoundsStore.select('group'),
        ]),
        ([controllers, group]: [
          QueryList<NgtObject3dInputsController>,
          THREE.Group
        ]) => {
          controllers.forEach((controller) => {
            controller.appendTo = () => group;
          });
        }
      );
    });
  }

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController,
    public sobaSoundsStore: NgtSobaBoundsStore
  ) {
    super();
  }

  ngOnInit() {
    this.sobaSoundsStore.actions.init();
  }
}

@NgModule({
  declarations: [NgtSobaBounds],
  exports: [NgtSobaBounds, NgtObject3dInputsControllerModule],
  imports: [NgtGroupModule],
})
export class NgtSobaBoundsModule {}
