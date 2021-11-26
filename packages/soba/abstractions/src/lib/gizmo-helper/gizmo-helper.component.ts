import {
  AnimationStore,
  CanvasStore,
  LoopService,
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
  NgtCoreModule,
  NgtObject3dController,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtSceneModule } from '@angular-three/core/scene';
import { NgtSobaExtender } from '@angular-three/soba';
import { NgtSobaOrthographicCameraModule } from '@angular-three/soba/cameras';
import { PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgModule,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import * as THREE from 'three';
import { gizmoHelperConstants } from './constants';
import { SobaGizmoHelperContext } from './gizmo-helper.context';
import {
  ControlsProto,
  InternalSobaGizmoHelperContext,
} from './internal-gizmo-helper.context';

@Component({
  selector: 'ngt-soba-gizmo-helper',
  exportAs: 'ngtSobaGizmoHelper',
  template: `
    <ng-template #gizmoTemplate>
      <ng-container *ngIf="dimensions$ | async as dimension">
        <ngt-soba-orthographic-camera
          [makeDefault]="false"
          [position]="[0, 0, 200]"
          (ready)="onVirtualCameraReady($event)"
        ></ngt-soba-orthographic-camera>
        <ngt-group
          [position]="[dimension.x, dimension.y, 0]"
          (ready)="ready.emit($event); gizmo = $event"
          (animateReady)="animateReady.emit($event)"
        >
          <ng-content></ng-content>
        </ngt-group>
      </ng-container>
    </ng-template>

    <ngt-scene (ready)="virtualScene = $event">
      <ng-template [cdkPortalOutlet]="gizmoPortal"></ng-template>
    </ngt-scene>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NGT_OBJECT_3D_CONTROLLER_PROVIDER, SobaGizmoHelperContext],
  viewProviders: [InternalSobaGizmoHelperContext],
})
export class NgtSobaGizmoHelper
  extends NgtSobaExtender<THREE.Group>
  implements OnInit, OnDestroy
{
  @Input() set alignment(
    v: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'
  ) {
    this.internalSobaGizmoHelperContext.updaters.setAlignment(v);
  }

  @Input() set margin(v: [number, number]) {
    this.internalSobaGizmoHelperContext.updaters.setMargin(v);
  }

  @Input() renderPriority = 0;
  @Input() onUpdate?: () => void; // update controls during animation
  // TODO: in a new major state.controls should be the only means of consuming controls, the
  // onTarget prop can then be removed!
  // return the target to rotate around
  @Input() set onTarget(v: () => THREE.Vector3) {
    this.internalSobaGizmoHelperContext.updaters.setOnTarget(v);
  }

  @ViewChild('gizmoTemplate', { static: true }) set gizmoTemplate(
    v: TemplateRef<unknown>
  ) {
    if (!this.gizmoPortal) {
      this.gizmoPortal = new TemplatePortal<unknown>(v, this.viewContainerRef);
    }
  }

  readonly dimensions$ = this.internalSobaGizmoHelperContext.dimension$;

  gizmoPortal!: TemplatePortal<unknown>;

  mainBackground?: THREE.Scene['background'];

  gizmo?: THREE.Group;
  virtualCamera?: THREE.OrthographicCamera;
  virtualScene!: THREE.Scene;

  private animationTeardown?: () => void;

  constructor(
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    public object3dController: NgtObject3dController,
    private internalSobaGizmoHelperContext: InternalSobaGizmoHelperContext,
    private canvasStore: CanvasStore,
    private animationStore: AnimationStore,
    private loopService: LoopService,
    private ngZone: NgZone,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      const { scene } = this.canvasStore.getImperativeState();
      if (scene!.background) {
        this.mainBackground = scene!.background;
        scene!.background = null;
        this.virtualScene.background = this.mainBackground;
      }

      this.setupAnimation();
    });
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      const { scene } = this.canvasStore.getImperativeState();
      if (this.mainBackground) {
        scene!.background = this.mainBackground;
      }

      if (this.animationTeardown) {
        this.animationTeardown();
      }
    });
  }

  private setupAnimation = () => {
    this.ngZone.runOutsideAngular(() => {
      this.animationTeardown = this.animationStore.registerAnimation(
        ({ delta }) => {
          if (this.virtualCamera && this.gizmo) {
            const { renderer } = this.canvasStore.getImperativeState();
            this.animateStep(delta);
            this.beforeRender();

            renderer!.autoClear = false;
            renderer!.clearDepth();
            renderer!.render(this.virtualScene, this.virtualCamera);
          }
        },
        this.renderPriority
      );
    });
  };

  private beforeRender = () => {
    // Sync gizmo with main camera orientation
    this.ngZone.runOutsideAngular(() => {
      const { camera: mainCamera } = this.canvasStore.getImperativeState();
      gizmoHelperConstants.matrix.copy(mainCamera!.matrix).invert();
      this.gizmo?.quaternion.setFromRotationMatrix(gizmoHelperConstants.matrix);
    });
  };

  private animateStep = (delta: number) => {
    this.ngZone.runOutsideAngular(() => {
      if (!this.internalSobaGizmoHelperContext.animating) return;

      if (gizmoHelperConstants.q1.angleTo(gizmoHelperConstants.q2) < 0.01) {
        this.internalSobaGizmoHelperContext.animating = false;
        return;
      }

      const { camera: mainCamera, controls: defaultControls } =
        this.canvasStore.getImperativeState();
      const step = delta * gizmoHelperConstants.turnRate;

      // animate position by doing a slerp and then scaling the position on the unit sphere
      gizmoHelperConstants.q1.rotateTowards(gizmoHelperConstants.q2, step);

      // animate orientation
      mainCamera!.position
        .set(0, 0, 1)
        .applyQuaternion(gizmoHelperConstants.q1)
        .multiplyScalar(this.internalSobaGizmoHelperContext.radius)
        .add(this.internalSobaGizmoHelperContext.focusPoint);
      mainCamera!.up
        .set(0, 1, 0)
        .applyQuaternion(gizmoHelperConstants.q1)
        .normalize();
      mainCamera!.quaternion.copy(gizmoHelperConstants.q1);

      if (this.onUpdate) this.onUpdate();
      else if (defaultControls)
        (defaultControls as unknown as ControlsProto).update();

      this.loopService.start();
    });
  };

  onVirtualCameraReady(camera: THREE.OrthographicCamera) {
    this.virtualCamera = camera;
    this.internalSobaGizmoHelperContext.initRaycastEffect(camera);
  }
}

@NgModule({
  declarations: [NgtSobaGizmoHelper],
  exports: [NgtSobaGizmoHelper],
  imports: [
    NgtCoreModule,
    NgtGroupModule,
    NgtSceneModule,
    NgtSobaOrthographicCameraModule,
    PortalModule,
    CommonModule,
  ],
})
export class NgtSobaGizmoHelperModule {}
