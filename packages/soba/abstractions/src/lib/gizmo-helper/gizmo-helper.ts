import {
  createInjectionToken,
  extend,
  injectNgtRef,
  injectNgtStore,
  NgtPortal,
  NgtPortalContent,
  NgtRef,
  NgtRxStore,
} from '@angular-three/core';
import { NgtsOrthographicCamera } from '@angular-three/soba/cameras';
import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  CUSTOM_ELEMENTS_SCHEMA,
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, map } from 'rxjs';
import { Group, Matrix4, Object3D, OrthographicCamera, Quaternion, Vector3 } from 'three';
import { OrbitControls } from 'three-stdlib';

type ControlsProto = { update(): void; target: THREE.Vector3 };

const isOrbitControls = (controls: ControlsProto): controls is OrbitControls => {
  return 'minPolarAngle' in (controls as OrbitControls);
};

export interface NgtsGizmoHelperApi {
  tweenCamera: (direction: Vector3) => void;
}

export const [injectNgtsGizmoHelperApi, provideNgtsGizmoHelperApi] =
  createInjectionToken<NgtsGizmoHelperApi>('NgtsGizmoHelper API');

function gizmoHelperApiFactory(gizmo: NgtsGizmoHelper) {
  const store = injectNgtStore();

  return {
    tweenCamera: (direction: Vector3) => {
      const { controls, camera, invalidate } = store.get();
      const defaultControls = controls as unknown as ControlsProto;

      gizmo.animating = true;
      if (defaultControls) gizmo.focusPoint = defaultControls.target;
      gizmo.radius = camera.position.distanceTo(gizmo.target);
      // rotate from current camera orientation
      gizmo.q1.copy(camera.quaternion);
      // to new current camera orientation
      gizmo.targetPosition.copy(direction).multiplyScalar(gizmo.radius).add(gizmo.target);
      gizmo.dummy.lookAt(gizmo.targetPosition);
      gizmo.q2.copy(gizmo.dummy.quaternion);
      invalidate();
    },
  };
}

extend({ Group });

@Directive({
  selector: 'ng-template[ngtsGizmoHelperContent]',
  standalone: true,
})
export class NgtsGizmoHelperContent {}

@Component({
  selector: 'ngts-gizmo-helper',
  standalone: true,
  template: `
    <ngt-portal [renderPriority]="get('renderPriority')">
      <ng-template ngtPortalContent>
        <ngts-orthographic-camera
          [cameraRef]="virtualCameraRef"
          [makeDefault]="true"
          [position]="[0, 0, 200]"
        ></ngts-orthographic-camera>
        <ngt-group
          *ref="gizmoRef"
          [position]="get('gizmoPosition')"
          (beforeRender)="onBeforeRender($any($event).state.delta)"
        >
          <ng-container *ngTemplateOutlet="gizmoHelperContent"></ng-container>
        </ngt-group>
      </ng-template>
    </ngt-portal>
  `,
  imports: [NgtPortal, NgtPortalContent, NgtRef, NgtsOrthographicCamera, NgTemplateOutlet],
  providers: [provideNgtsGizmoHelperApi([NgtsGizmoHelper], gizmoHelperApiFactory)],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsGizmoHelper extends NgtRxStore implements OnInit {
  readonly #store = injectNgtStore();

  readonly gizmoRef = injectNgtRef<Group>();
  readonly virtualCameraRef = injectNgtRef<OrthographicCamera>();

  animating = false;
  radius = 0;
  focusPoint = new Vector3(0, 0, 0);
  q1 = new Quaternion();
  q2 = new Quaternion();

  target = new Vector3();
  targetPosition = new Vector3();
  dummy = new Object3D();

  #defaultUp = new Vector3(0, 0, 0);
  #turnRate = 2 * Math.PI; // turn rate in angles per sec
  #matrix = new Matrix4();

  @Input() set alignment(
    alignment:
      | 'top-left'
      | 'top-right'
      | 'bottom-right'
      | 'bottom-left'
      | 'bottom-center'
      | 'center-right'
      | 'center-left'
      | 'center-center'
      | 'top-center'
  ) {
    this.set({ alignment });
  }

  @Input() set margin(margin: [number, number]) {
    this.set({ margin });
  }

  @Input() set renderPriority(renderPriority: number) {
    this.set({ renderPriority });
  }

  @Input() set autoClear(autoClear: boolean) {
    this.set({ autoClear });
  }

  @Output() updated = new EventEmitter<void>();

  @ContentChild(NgtsGizmoHelperContent, { static: true, read: TemplateRef })
  gizmoHelperContent!: TemplateRef<unknown>;

  override initialize(): void {
    super.initialize();
    this.set({
      alignment: 'bottom-right',
      margin: [80, 80],
      renderPriority: 1,
    });
  }

  ngOnInit() {
    this.#updateDefaultUp();
    this.#setGizmoPosition();
  }

  onBeforeRender(delta: number) {
    if (this.virtualCameraRef.nativeElement && this.gizmoRef.nativeElement) {
      const { controls, camera: mainCamera, invalidate } = this.#store.get();
      const defaultControls = controls as unknown as ControlsProto;
      // Animate step
      if (this.animating) {
        if (this.q1.angleTo(this.q2) < 0.01) {
          this.animating = false;
          // Orbit controls uses UP vector as the orbit axes,
          // so we need to reset it after the animation is done
          // moving it around for the controls to work correctly
          if (isOrbitControls(defaultControls)) {
            mainCamera.up.copy(this.#defaultUp);
          }
        } else {
          const step = delta * this.#turnRate;
          // animate position by doing a slerp and then scaling the position on the unit sphere
          this.q1.rotateTowards(this.q2, step);
          // animate orientation
          mainCamera.position
            .set(0, 0, 1)
            .applyQuaternion(this.q1)
            .multiplyScalar(this.radius)
            .add(this.focusPoint);
          mainCamera.up.set(0, 1, 0).applyQuaternion(this.q1).normalize();
          mainCamera.quaternion.copy(this.q1);
          if (this.updated.observed) this.updated.emit();
          else if (defaultControls) {
            defaultControls.update();
          }
          invalidate();
        }
      }

      // Sync Gizmo with main camera orientation
      this.#matrix.copy(mainCamera.matrix).invert();
      this.gizmoRef.nativeElement.quaternion.setFromRotationMatrix(this.#matrix);
    }
  }

  #setGizmoPosition() {
    this.connect(
      'gizmoPosition',
      combineLatest([
        this.#store.select('size'),
        this.select(selectSlice(['alignment', 'margin'])),
      ]).pipe(
        map(([size, { alignment, margin }]) => {
          const [marginX, marginY] = margin;
          const x = alignment.endsWith('-center')
            ? 0
            : alignment.endsWith('-left')
            ? -size.width / 2 + marginX
            : size.width / 2 - marginX;
          const y = alignment.startsWith('center-')
            ? 0
            : alignment.startsWith('top-')
            ? size.height / 2 - marginY
            : -size.height / 2 + marginY;
          return [x, y, 0];
        })
      )
    );
  }

  #updateDefaultUp() {
    this.hold(this.#store.select('camera'), (camera) => {
      this.#defaultUp.copy(camera.up);
    });
  }
}
