import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  is,
  NgtObjectPassThrough,
  NgtObjectProps,
  NgtObjectPropsState,
  NumberInput,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
  Ref,
  tapEffect,
} from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/group';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  NgModule,
  Output,
  TemplateRef,
} from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';

export interface NgtSobaBoundsSize {
  box: THREE.Box3;
  size: THREE.Vector3;
  center: THREE.Vector3;
  distance: number;
}

export interface NgtSobaBoundsApi {
  getSize: () => NgtSobaBoundsSize;
  refresh(object?: THREE.Object3D | THREE.Box3): NgtSobaBoundsApi;
  clip(): NgtSobaBoundsApi;
  fit(): NgtSobaBoundsApi;
}

export interface NgtSobaBoundsState extends NgtObjectPropsState<THREE.Group> {
  damping: number;
  fit: boolean;
  clip: boolean;
  observe: boolean;
  margin: number;
  eps: number;
}

type ControlsProto = {
  update(): void;
  target: THREE.Vector3;
  maxDistance: number;
  addEventListener: (event: string, callback: (event: any) => void) => void;
  removeEventListener: (event: string, callback: (event: any) => void) => void;
};

const isBox3 = (def: unknown): def is THREE.Box3 => !!def && (def as THREE.Box3).isBox3;

function equals(a: THREE.Vector3, b: THREE.Vector3, eps: number) {
  return Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps && Math.abs(a.z - b.z) < eps;
}

function damp(v: THREE.Vector3, t: THREE.Vector3, lambda: number, delta: number) {
  v.x = THREE.MathUtils.damp(v.x, t.x, lambda, delta);
  v.y = THREE.MathUtils.damp(v.y, t.y, lambda, delta);
  v.z = THREE.MathUtils.damp(v.z, t.z, lambda, delta);
}

@Directive({
  selector: 'ng-template[ngt-soba-bounds-content]',
  standalone: true,
})
export class NgtSobaBoundsContent {
  constructor(
    public templateRef: TemplateRef<{
      bounds: Ref<THREE.Group>;
      api: NgtSobaBoundsApi;
    }>
  ) {}

  static ngTemplateContextGuard(
    dir: NgtSobaBoundsContent,
    ctx: any
  ): ctx is {
    bounds: Ref<THREE.Group>;
    api: NgtSobaBoundsApi;
  } {
    return true;
  }
}

@Component({
  selector: 'ngt-soba-bounds',
  standalone: true,
  template: `
    <ngt-group [ngtObjectPassThrough]="this">
      <ng-container
        *ngIf="content"
        [ngTemplateOutlet]="content.templateRef"
        [ngTemplateOutletContext]="{ bounds: instance, api: api }"
      ></ng-container>
    </ngt-group>
    <ng-content></ng-content>
  `,
  imports: [NgtGroup, NgtObjectPassThrough, NgIf, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtObject(NgtSobaBounds), provideObjectRef(NgtSobaBounds), provideObjectHostRef(NgtSobaBounds)],
})
export class NgtSobaBounds extends NgtObjectProps<THREE.Group, NgtSobaBoundsState> {
  @Input() set damping(damping: NumberInput) {
    this.set({ damping: coerceNumberProperty(damping) });
  }

  @Input() set fit(fit: BooleanInput) {
    this.set({ fit: coerceBooleanProperty(fit) });
  }

  @Input() set clip(clip: BooleanInput) {
    this.set({ clip: coerceBooleanProperty(clip) });
  }

  @Input() set observe(observe: BooleanInput) {
    this.set({ observe: coerceBooleanProperty(observe) });
  }

  @Input() set margin(margin: NumberInput) {
    this.set({ margin: coerceNumberProperty(margin) });
  }

  @Input() set eps(eps: NumberInput) {
    this.set({ eps: coerceNumberProperty(eps) });
  }

  @Output() fitChange = new EventEmitter<NgtSobaBoundsSize>();

  @ContentChild(NgtSobaBoundsContent) content?: NgtSobaBoundsContent;

  private readonly current = {
    animating: false,
    focus: new THREE.Vector3(),
    camera: new THREE.Vector3(),
    zoom: 1,
  };

  private readonly goal = {
    focus: new THREE.Vector3(),
    camera: new THREE.Vector3(),
    zoom: 1,
  };

  private readonly box = new THREE.Box3();

  private count = 0;

  protected override preInit(): void {
    super.preInit();
    this.set((state) => ({
      damping: state.damping ?? 6,
      fit: state.fit ?? false,
      clip: state.clip ?? false,
      observe: state.observe ?? false,
      margin: state.margin ?? 1.2,
      eps: state.eps ?? 0.01,
    }));
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        this.preventDragHijacking(this.store.select((s) => s.controls));
        this.observeSizeChange(
          this.select(
            this.store.select((s) => s.size),
            this.store.select((s) => s.camera),
            this.store.select((s) => s.controls),
            this.select((s) => s.clip),
            this.select((s) => s.fit),
            this.select((s) => s.observe),
            this.instance$
          )
        );
        this.setBeforeRender();
      });
    });
  }

  private readonly preventDragHijacking = this.effect(
    tapEffect(() => {
      const controls = this.store.get((s) => s.controls) as unknown as ControlsProto;

      if (controls) {
        // Try to prevent drag hijacking
        const callback = () => (this.current.animating = false);
        controls.addEventListener('start', callback);
        return () => controls.removeEventListener('start', callback);
      }
      return;
    })
  );

  private readonly observeSizeChange = this.effect(
    tap(() => {
      const { clip, fit, observe } = this.get();
      if (observe || this.count++ === 0) {
        this.api.refresh();
        if (fit) this.api.fit();
        if (clip) this.api.clip();
      }
    })
  );

  private readonly setBeforeRender = this.effect<void>(
    tapEffect(() =>
      this.store.registerBeforeRender({
        callback: ({ delta }) => {
          if (this.current.animating) {
            const { damping, eps } = this.get();
            const controls = this.store.get((s) => s.controls) as unknown as ControlsProto;
            const camera = this.store.get((s) => s.camera);
            const invalidate = this.store.get((s) => s.invalidate);

            damp(this.current.focus, this.goal.focus, damping, delta);
            damp(this.current.camera, this.goal.camera, damping, delta);
            this.current.zoom = THREE.MathUtils.damp(this.current.zoom, this.goal.zoom, damping, delta);
            camera.position.copy(this.current.camera);

            if (is.orthographic(camera)) {
              camera.zoom = this.current.zoom;
              camera.updateProjectionMatrix();
            }

            if (!controls) {
              camera.lookAt(this.current.focus);
            } else {
              controls.target.copy(this.current.focus);
              controls.update();
            }

            invalidate();
            if (is.orthographic(camera) && !(Math.abs(this.current.zoom - this.goal.zoom) < eps)) return;
            if (!is.orthographic(camera) && !equals(this.current.camera, this.goal.camera, eps)) return;
            if (controls && !equals(this.current.focus, this.goal.focus, eps)) return;
            this.current.animating = false;
          }
        },
      })
    )
  );

  get api(): NgtSobaBoundsApi {
    return {
      getSize: () => {
        const camera = this.store.get((s) => s.camera);
        const margin = this.get((s) => s.margin);

        const size = this.box.getSize(new THREE.Vector3());
        const center = this.box.getCenter(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const fitHeightDistance = is.orthographic(camera)
          ? maxSize * 4
          : maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
        const fitWidthDistance = is.orthographic(camera) ? maxSize * 4 : fitHeightDistance / camera.aspect;
        const distance = margin * Math.max(fitHeightDistance, fitWidthDistance);
        return { box: this.box, size, center, distance };
      },
      clip: () => {
        const { distance } = this.api.getSize();
        const controls = this.store.get((s) => s.controls) as unknown as ControlsProto;
        const camera = this.store.get((s) => s.camera);
        const invalidate = this.store.get((s) => s.invalidate);

        if (controls) controls.maxDistance = distance * 10;
        camera.near = distance / 100;
        camera.far = distance * 100;
        camera.updateProjectionMatrix();
        if (controls) controls.update();
        invalidate();
        return this.api;
      },
      fit: () => {
        const controls = this.store.get((s) => s.controls) as unknown as ControlsProto;
        const camera = this.store.get((s) => s.camera);
        const invalidate = this.store.get((s) => s.invalidate);

        const { damping, margin } = this.get();

        this.current.camera.copy(camera.position);
        if (controls) this.current.focus.copy(controls.target);

        const { center, distance } = this.api.getSize();
        const direction = center.clone().sub(camera.position).normalize().multiplyScalar(distance);

        this.goal.camera.copy(center).sub(direction);
        this.goal.focus.copy(center);

        if (is.orthographic(camera)) {
          this.current.zoom = camera.zoom;

          let maxHeight = 0,
            maxWidth = 0;
          const vertices = [
            new THREE.Vector3(this.box.min.x, this.box.min.y, this.box.min.z),
            new THREE.Vector3(this.box.min.x, this.box.max.y, this.box.min.z),
            new THREE.Vector3(this.box.min.x, this.box.min.y, this.box.max.z),
            new THREE.Vector3(this.box.min.x, this.box.max.y, this.box.max.z),
            new THREE.Vector3(this.box.max.x, this.box.max.y, this.box.max.z),
            new THREE.Vector3(this.box.max.x, this.box.max.y, this.box.min.z),
            new THREE.Vector3(this.box.max.x, this.box.min.y, this.box.max.z),
            new THREE.Vector3(this.box.max.x, this.box.min.y, this.box.min.z),
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
          this.goal.zoom = Math.min(zoomForHeight, zoomForWidth) / margin;
          if (!damping) {
            camera.zoom = this.goal.zoom;
            camera.updateProjectionMatrix();
          }
        }

        if (damping) {
          this.current.animating = true;
        } else {
          camera.position.copy(this.goal.camera);
          camera.lookAt(this.goal.focus);
          if (controls) {
            controls.target.copy(this.goal.focus);
            controls.update();
          }
        }
        if (this.fitChange.observed) {
          this.fitChange.emit(this.api.getSize());
        }
        invalidate();
        return this.api;
      },
      refresh: (object?: THREE.Object3D | THREE.Box3) => {
        const { camera, controls } = this.store.get();

        if (isBox3(object)) this.box.copy(object);
        else {
          const target = object || this.instance.value;
          target.updateWorldMatrix(true, true);
          this.box.setFromObject(target);
        }
        if (this.box.isEmpty()) {
          const max = camera.position.length() || 10;
          this.box.setFromCenterAndSize(new THREE.Vector3(), new THREE.Vector3(max, max, max));
        }

        if (controls?.constructor.name === 'OrthographicTrackballControls') {
          // Put camera on a sphere along which it should moves
          const { distance } = this.api.getSize();
          const direction = camera.position
            .clone()
            .sub((controls as unknown as ControlsProto).target)
            .normalize()
            .multiplyScalar(distance);
          const newPos = (controls as unknown as ControlsProto).target.clone().add(direction);
          camera.position.copy(newPos);
        }

        return this.api;
      },
    };
  }
}

@NgModule({
  imports: [NgtSobaBounds, NgtSobaBoundsContent],
  exports: [NgtSobaBounds, NgtSobaBoundsContent],
})
export class NgtSobaBoundsModule {}
