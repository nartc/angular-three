import {
  Directive,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SkipSelf,
} from '@angular/core';
import { Object3D } from 'three';
import { AnimationLoopParticipant, ThreeObject3d } from '../abstracts';
import { Object3dControllerDirective } from '../controllers';
import {
  OBJECT_3D_CONTROLLER_PROVIDER,
  OBJECT_3D_WATCHED_CONTROLLER,
} from '../di';
import { AnimationStore, CanvasStore } from '../stores';

@Directive({
  selector: 'ngt-primitive',
  exportAs: 'ngtPrimitive',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: PrimitiveDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class PrimitiveDirective<TObject = unknown>
  extends AnimationLoopParticipant<TObject>
  implements OnInit, OnDestroy {
  @Output() ready = new EventEmitter<TObject>();

  get object(): TObject {
    return this._object;
  }

  @Input()
  set object(value: TObject) {
    if (value == null) {
      console.error('[object] is required');
    }
    this._object = value;
    if (value) {
      this.ready.emit(value);
    }
  }

  private _object!: TObject;

  constructor(
    readonly animationStore: AnimationStore,
    readonly ngZone: NgZone,
    @Inject(OBJECT_3D_WATCHED_CONTROLLER)
    private readonly object3dController: Object3dControllerDirective,
    private readonly canvasStore: CanvasStore,
    @Optional()
    @SkipSelf()
    protected readonly parentObjectDirective?: ThreeObject3d
  ) {
    super(animationStore, ngZone);
  }

  get object3d(): TObject {
    return this._object;
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.appendToParent();
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.ngZone.runOutsideAngular(() => {
      if (this.object3d) {
        this.remove();
      }
    });
  }

  private appendToParent() {
    if (this.object3d && this.object3d instanceof Object3D) {
      if (this.object3dController.appendTo) {
        this.object3dController.appendTo.add(this.object3d);
        return;
      }

      const { scene } = this.canvasStore.getImperativeState();
      if (this.object3dController.appendMode === 'root') {
        if (scene) {
          scene.add(this.object3d);
        }
        return;
      }

      if (this.object3dController.appendMode === 'immediate') {
        if (this.parentObjectDirective) {
          this.parentObjectDirective.object3d.add(this.object3d);
        } else {
          if (scene) {
            scene.add(this.object3d);
          }
        }
      }
    }
  }

  protected remove() {
    if (this.object3d instanceof Object3D) {
      if (this.object3dController.appendTo) {
        this.object3dController.appendTo.remove(this.object3d);
      } else if (
        this.parentObjectDirective &&
        this.object3dController.appendMode === 'immediate'
      ) {
        this.parentObjectDirective.object3d.remove(this.object3d);
      } else {
        const { scene } = this.canvasStore.getImperativeState();
        if (scene) {
          scene.remove(this.object3d);
        }
      }

      this.object3d.clear();
    }
  }
}
