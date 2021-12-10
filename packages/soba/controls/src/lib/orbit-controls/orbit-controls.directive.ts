import {
  EnhancedRxState,
  NgtAnimationFrameStore,
  NgtEventsStore,
  NgtLoopService,
  NgtPerformanceStore,
  NgtStore,
  NgtVector3,
} from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  Input,
  NgModule,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { of, switchMap } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib/controls/OrbitControls';

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
  extends EnhancedRxState<NgtSobaOrbitControlsState>
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

  #controlsEventsChanges$ = this.select(
    selectSlice(['regress', 'controls', 'domElement'])
  );

  #makeDefaultParams$ = this.select(selectSlice(['makeDefault', 'controls']));

  constructor(
    private loopService: NgtLoopService,
    private store: NgtStore,
    private eventsStore: NgtEventsStore,
    private animationFrameStore: NgtAnimationFrameStore,
    private performanceStore: NgtPerformanceStore,
    private ngZone: NgZone
  ) {
    super();
    this.set({
      target: undefined,
      regress: false,
      enableDamping: true,
      makeDefault: false,
      camera: undefined,
      domElement: undefined,
    });
  }

  ngOnInit() {
    this.connect('camera', this.store.select('camera'));
    this.connect(
      'domElement',
      this.eventsStore.select('connected').pipe(
        switchMap((connected) => {
          if (typeof connected !== 'boolean') return of(connected);
          return this.store.select('renderer', 'domElement');
        })
      )
    );

    this.holdEffect(this.select('controls'), (controls) => {
      let animationUuid: string;
      if (controls.enabled) {
        animationUuid = this.animationFrameStore.register({
          callback: () => {
            controls.update();
          },
        });
      }
      return () => {
        this.animationFrameStore.actions.unsubscriberUuid(animationUuid);
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

    this.holdEffect(
      this.#controlsEventsChanges$,
      ({ controls, regress, domElement }) => {
        return this.ngZone.runOutsideAngular(() => {
          const changeCallback: (e: THREE.Event) => void = (e) => {
            this.loopService.invalidate();
            if (regress) {
              this.performanceStore.regress();
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
        });
      }
    );

    this.holdEffect(this.#makeDefaultParams$, ({ controls, makeDefault }) => {
      const oldControls = this.store.get('controls');
      if (makeDefault) {
        this.store.set({ controls });
      }

      return () => {
        this.store.set({ controls: oldControls });
      };
    });
  }

  get controls() {
    return (this.store.get('controls') ||
      this.get('controls')) as OrbitControls;
  }
}

@NgModule({
  declarations: [NgtSobaOrbitControls],
  exports: [NgtSobaOrbitControls],
})
export class NgtSobaOrbitControlsModule {}
