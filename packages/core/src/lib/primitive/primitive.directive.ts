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
import * as THREE from 'three';
import { AnimationStore } from '../stores/animation.store';
import { CanvasStore } from '../stores/canvas.store';
import { NgtAnimationParticipant } from '../three/animation-participant';
import { NgtObject3d } from '../three/object-3d';
import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
} from '../three/object-3d-watched-controller.di';
import { NgtObject3dController } from '../three/object-3d.controller';

@Directive({
  selector: 'ngt-primitive',
  exportAs: 'ngtPrimitive',
  providers: [
    {
      provide: NgtObject3d,
      useExisting: NgtPrimitive,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtPrimitive<TObject = unknown>
  extends NgtAnimationParticipant<TObject>
  implements OnInit, OnDestroy
{
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
      this.participate(value);
    }
  }

  private _object!: TObject;

  constructor(
    animationStore: AnimationStore,
    ngZone: NgZone,
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    private object3dController: NgtObject3dController,
    private canvasStore: CanvasStore,
    @Optional()
    @SkipSelf()
    protected readonly parentObjectDirective?: NgtObject3d
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
    if (this.object3d && this.object3d instanceof THREE.Object3D) {
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
    if (this.object3d instanceof THREE.Object3D) {
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
