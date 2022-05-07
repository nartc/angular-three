import {
  BooleanInput,
  coerceBooleanProperty,
  make,
  makeVector3,
  NgtObjectInputs,
  NgtObjectInputsState,
  NgtObjectPassThroughModule,
  NgtPortalModule,
  NgtRenderState,
  prepare,
  provideObjectHostRef,
  Ref,
  tapEffect,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtSobaOrthographicCameraModule } from '@angular-three/soba/cameras';
import { CommonModule } from '@angular/common';
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
import { filter, tap } from 'rxjs';
import * as THREE from 'three';

export interface NgtSobaGizmoHelperState extends NgtObjectInputsState<THREE.Group> {
  virtualCamera: Ref<THREE.OrthographicCamera>;
  virtualScene: Ref<THREE.Scene>;
  raycast: THREE.Object3D['raycast'];

  alignment: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
  margin: [number, number];
  renderPriority: number;
  autoClear: boolean;
}

@Directive({
  selector: 'ng-template[ngt-soba-gizmo-helper-content]',
})
export class NgtSobaGizmoHelperContent {
  constructor(public templateRef: TemplateRef<{ gizmo: THREE.Group }>) {}

  static ngTemplateContextGuard(dir: NgtSobaGizmoHelperContent, ctx: any): ctx is { gizmo: THREE.Group } {
    return true;
  }
}

type ControlsProto = { update(): void; target: THREE.Vector3 };

const turnRate = 2 * Math.PI; // turn rate in angles per second
const dummy = new THREE.Object3D();
const matrix = make(THREE.Matrix4);
const [q1, q2] = [make(THREE.Quaternion), make(THREE.Quaternion)];
const target = makeVector3();
const targetPosition = makeVector3();

@Component({
  selector: 'ngt-soba-gizmo-helper',
  template: `
    <ngt-portal [ref]="virtualScene">
      <ng-template ngt-portal-content>
        <ngt-group
          (beforeRender)="beforeRender.emit($event)"
          [ngtObjectInputs]="this"
          [ngtObjectOutputs]="this"
          [position]="(position$ | async)!"
        >
          <ng-container
            *ngIf="content"
            [ngTemplateOutlet]="content.templateRef"
            [ngTemplateOutletContext]="{ gizmo: instance }"
          ></ng-container>
        </ngt-group>

        <ngt-soba-orthographic-camera [ref]="virtualCamera" [position]="[0, 0, 200]"></ngt-soba-orthographic-camera>
      </ng-template>
    </ngt-portal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideObjectHostRef(NgtSobaGizmoHelper)],
})
export class NgtSobaGizmoHelper extends NgtObjectInputs<THREE.Group, NgtSobaGizmoHelperState> {
  @Input() set alignment(alignment: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left') {
    this.set({ alignment });
  }

  @Input() set margin(margin: [number, number]) {
    this.set({ margin });
  }

  @Input() set renderPriority(renderPriority: number) {
    this.set({ renderPriority });
  }

  @Input() set autoClear(autoClear: BooleanInput) {
    this.set({ autoClear: coerceBooleanProperty(autoClear) });
  }

  @Output() beforeRender = new EventEmitter<{
    state: NgtRenderState;
    object: THREE.Group;
  }>();

  @Output() override update = new EventEmitter();

  @ContentChild(NgtSobaGizmoHelperContent)
  content?: NgtSobaGizmoHelperContent;

  get virtualScene() {
    return this.get((s) => s.virtualScene);
  }

  get virtualCamera() {
    return this.get((s) => s.virtualCamera);
  }

  readonly position$ = this.select(
    this.select((s) => s.margin),
    this.select((s) => s.alignment),
    this.store.select((s) => s.size),
    ([marginX, marginY], alignment, size) => {
      const x = alignment.endsWith('-left') ? -size.width / 2 + marginX : size.width / 2 - marginX;
      const y = alignment.startsWith('top-') ? size.height / 2 - marginY : -size.height / 2 + marginY;

      return makeVector3([x, y, 0]);
    }
  );

  private animating = false;
  private focusPoint = makeVector3([0, 0, 0]);
  private radius = 0;

  protected override preInit() {
    super.preInit();

    this.set((state) => ({
      virtualCamera: new Ref(),
      virtualScene: new Ref(prepare(new THREE.Scene(), () => this.store.get())),
      alignment: state.alignment ?? 'bottom-right',
      margin: state.margin ?? [80, 80],
      renderPriority: state.renderPriority ?? 0,
      autoClear: state.autoClear ?? true,
    }));
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        this.switchSceneBackground();
        this.setBeforeRender();
        this.setRaycast(this.get((s) => s.virtualCamera).pipe(filter((camera) => !!camera)));
      });
    });
  }

  private readonly switchSceneBackground = this.effect<void>(
    tapEffect(() => {
      let mainSceneBackground: THREE.Scene['background'];
      const scene = this.store.get((s) => s.scene);
      const virtualScene = this.get((s) => s.virtualScene);

      if (scene.background) {
        mainSceneBackground = scene.background;
        scene.background = null;
        virtualScene.value.background = mainSceneBackground;
      }

      return () => {
        if (mainSceneBackground) {
          scene.background = mainSceneBackground;
        }
      };
    })
  );

  private readonly setBeforeRender = this.effect<void>(
    tapEffect(() => {
      const renderPriority = this.get((s) => s.renderPriority);
      const gl = this.store.get((s) => s.gl);

      return this.store.registerBeforeRender({
        callback: ({ delta }) => {
          const gizmo = this.instance;
          const { camera: mainCamera, controls: defaultControls, invalidate } = this.store.get();
          const { virtualScene, virtualCamera, autoClear } = this.get();

          if (gizmo.value && virtualScene.value && virtualCamera.value) {
            if (this.animating) {
              if (q1.angleTo(q2) < 0.01) {
                this.animating = false;
              } else {
                const step = delta * turnRate;
                // animate position by doing a slerp and then scaling the position on the unit sphere
                q1.rotateTowards(q2, step);
                // animate orientation
                mainCamera.position.set(0, 0, 1).applyQuaternion(q1).multiplyScalar(this.radius).add(this.focusPoint);
                mainCamera.up.set(0, 1, 0).applyQuaternion(q1).normalize();
                mainCamera.quaternion.copy(q1);
                if (this.update.observed) {
                  this.update.emit();
                } else if (defaultControls) {
                  (defaultControls as unknown as ControlsProto).update();
                }

                invalidate();
              }
            }

            // Sync Gizmo with main camera orientation
            matrix.copy(mainCamera.matrix).invert();
            gizmo.value?.quaternion.setFromRotationMatrix(matrix);

            // Render virtual camera
            if (autoClear) {
              gl.autoClear = false;
            }
            gl.clearDepth();
            gl.render(virtualScene.value, virtualCamera.value);
          }
        },
        priority: renderPriority,
      });
    })
  );

  private readonly setRaycast = this.effect<THREE.Camera>(
    tap((virtualCamera) => {
      const pointer = this.store.get((s) => s.pointer);
      const raycaster = new THREE.Raycaster();

      this.set({
        raycast: function (this: THREE.Object3D, _, intersects) {
          raycaster.setFromCamera(pointer, virtualCamera);
          const rc = this.constructor.prototype.raycast.bind(this);
          if (rc) {
            rc(raycaster, intersects);
          }
        },
      });
    })
  );

  readonly tweenCamera = this.effect<THREE.Vector3>(
    tap((direction) => {
      this.animating = true;

      const { controls: defaultControls, camera: mainCamera, invalidate } = this.store.get();

      if (defaultControls) {
        this.focusPoint = (defaultControls as unknown as ControlsProto).target;
      }

      this.radius = mainCamera.position.distanceTo(target);

      // Rotate from current camera orientation
      q1.copy(mainCamera.quaternion);

      // To new current camera orientation
      targetPosition.copy(direction).multiplyScalar(this.radius).add(target);
      dummy.lookAt(targetPosition);
      q2.copy(dummy.quaternion);

      invalidate();
    })
  );
}

@NgModule({
  declarations: [NgtSobaGizmoHelper, NgtSobaGizmoHelperContent],
  exports: [NgtSobaGizmoHelper, NgtSobaGizmoHelperContent],
  imports: [NgtPortalModule, NgtGroupModule, NgtObjectPassThroughModule, CommonModule, NgtSobaOrthographicCameraModule],
})
export class NgtSobaGizmoHelperModule {}
