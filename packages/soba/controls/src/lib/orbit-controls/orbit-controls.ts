import {
  makeVector3,
  NgtAnimationFrameStore,
  NgtCanvasStore,
  NgtEventsStore,
  NgtLoop,
  NgtPerformance,
  NgtStore,
  NgtVector3,
  zonelessRequestAnimationFrame,
} from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output,
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { of, switchMap } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

export interface NgtSobaOrbitControlsState {
  enableDamping: boolean;
  makeDefault: boolean;
  regress: boolean;
  controls: OrbitControls;
  camera?: THREE.Camera;
  domElement?: HTMLElement;
  target?: NgtVector3;
}

@Directive({
  selector: 'ngt-soba-orbit-controls',
  exportAs: 'ngtSobaOrbitControls',
})
export class NgtSobaOrbitControls
  extends NgtStore<NgtSobaOrbitControlsState>
  implements OnInit
{
  @Input() set target(v: NgtVector3) {
    this.set({ target: v });
  }

  @Input() set camera(v: THREE.Camera) {
    this.set({ camera: v });
  }

  @Input() set domElement(v: HTMLElement) {
    this.set({ domElement: v });
  }

  @Input() set regress(v: boolean) {
    this.set({ regress: v });
  }

  @Input() set enableDamping(v: boolean) {
    this.set({ enableDamping: v });
  }

  @Input() set makeDefault(v: boolean) {
    this.set({ makeDefault: v });
  }

  @Output() ready = this.select('controls');
  @Output() change = new EventEmitter<THREE.Event>();
  @Output() start = new EventEmitter<THREE.Event>();
  @Output() end = new EventEmitter<THREE.Event>();

  private controlsEventsChanges$ = this.select(
    selectSlice(['regress', 'controls', 'domElement'])
  );

  private makeDefaultParams$ = this.select(
    selectSlice(['makeDefault', 'controls'])
  );
  private controlsTargetParams$ = this.select(
    selectSlice(['target', 'controls'])
  );

  constructor(
    private loop: NgtLoop,
    private canvasStore: NgtCanvasStore,
    private eventsStore: NgtEventsStore,
    private animationFrameStore: NgtAnimationFrameStore,
    private performance: NgtPerformance
  ) {
    super();
    this.set({
      regress: false,
      enableDamping: true,
      makeDefault: false,
    });
  }

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      this.connect('camera', this.canvasStore.select('camera'));
      this.connect(
        'domElement',
        this.eventsStore.select('connected').pipe(
          switchMap((connected) => {
            if (typeof connected !== 'boolean') return of(connected);
            return this.canvasStore.select('renderer', 'domElement');
          })
        )
      );

      this.effect(this.select('controls'), (controls) => {
        let animationUuid: string;
        if (controls.enabled) {
          animationUuid = this.animationFrameStore.register({
            callback: () => {
              controls.update();
            },
          });
        }
        return () => {
          this.animationFrameStore.actions.unregister(animationUuid);
        };
      });

      this.hold(this.select('camera'), (camera) => {
        const enableDamping = this.get('enableDamping');
        if (camera) {
          const controls = new OrbitControls(camera);
          controls.enableDamping = enableDamping;
          this.set({ controls });
        }
      });

      this.hold(this.controlsTargetParams$, ({ controls, target }) => {
        if (controls) {
          const vector3Target = makeVector3(target);
          if (vector3Target) {
            controls.target = vector3Target;
          }
        }
      });

      this.effect(
        this.controlsEventsChanges$,
        ({ controls, regress, domElement }) => {
          const changeCallback: (e: THREE.Event) => void = (e) => {
            this.loop.invalidate();
            if (regress) {
              this.performance.regress();
            }

            if (this.change.observed) {
              this.change.emit(e);
            }
          };
          let startCallback: (e: THREE.Event) => void;
          let endCallback: (e: THREE.Event) => void;

          if (domElement) {
            controls.connect(domElement);
          }

          controls.addEventListener('change', changeCallback);

          if (this.start.observed) {
            startCallback = (event: THREE.Event) => {
              this.start.emit(event);
            };
            controls.addEventListener('start', startCallback);
          }

          if (this.end.observed) {
            endCallback = (event: THREE.Event) => {
              this.end.emit(event);
            };
            controls.addEventListener('end', endCallback);
          }

          return () => {
            controls.removeEventListener('change', changeCallback);
            if (endCallback) controls.removeEventListener('end', endCallback);
            if (startCallback)
              controls.removeEventListener('start', startCallback);
            controls.dispose();
          };
        }
      );

      this.effect(this.makeDefaultParams$, ({ controls, makeDefault }) => {
        const oldControls = this.canvasStore.get('controls');
        if (makeDefault) {
          this.canvasStore.set({ controls });
        }

        return () => {
          this.canvasStore.set({ controls: oldControls });
        };
      });
    });
  }

  get controls() {
    return (this.get('controls') ||
      this.canvasStore.get('controls')) as OrbitControls;
  }
}

@NgModule({
  declarations: [NgtSobaOrbitControls],
  exports: [NgtSobaOrbitControls],
})
export class NgtSobaOrbitControlsModule {}
