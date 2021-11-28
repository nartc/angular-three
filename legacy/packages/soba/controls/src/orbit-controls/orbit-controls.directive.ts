import {
  AnimationStore,
  CanvasStore,
  EnhancedComponentStore,
  EventsStore,
  LoopService,
  NgtVector3,
  PerformanceStore,
  tapEffect,
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
import { Observable, tap } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface SobaOrbitControlsState {
  enableDamping: boolean;
  makeDefault: boolean;
  regress: boolean;
  camera?: THREE.Camera;
  domElement?: HTMLElement;
  controls?: OrbitControls;
  target?: NgtVector3;
}

@Directive({
  selector: 'ngt-soba-orbit-controls',
  exportAs: 'ngtSobaOrbitControls',
})
export class NgtSobaOrbitControls
  extends EnhancedComponentStore<SobaOrbitControlsState>
  implements OnInit
{
  @Input() set target(v: NgtVector3) {
    this.updaters.setTarget(v);
  }

  @Input() set camera(v: THREE.Camera) {
    this.updaters.setCamera(v);
  }

  @Input() set domElement(v: HTMLElement) {
    this.updaters.setDomElement(v);
  }

  @Input() set regress(v: boolean) {
    this.updaters.setRegress(v);
  }

  @Input() set enableDamping(v: boolean) {
    this.updaters.setEnableDamping(v);
  }

  @Input() set makeDefault(v: boolean) {
    this.updaters.setMakeDefault(v);
  }

  @Output() change = new EventEmitter<THREE.Event>();
  @Output() start = new EventEmitter<THREE.Event>();
  @Output() end = new EventEmitter<THREE.Event>();

  private animationTearDown?: () => void;

  private readonly controlsParams$ = this.select(
    this.selectors.camera$,
    this.selectors.domElement$,
    (camera, domElement) => ({ camera, domElement }),
    { debounce: true }
  );

  private readonly makeDefaultParams$ = this.select(
    this.selectors.makeDefault$,
    this.selectors.controls$,
    (makeDefault, controls) => ({ makeDefault, controls }),
    { debounce: true }
  );

  private readonly controlsEffectChanges$: Observable<{
    controls?: OrbitControls;
    regress?: boolean;
  }> = this.select(
    this.selectors.regress$,
    this.selectors.controls$,
    (regress, controls) => ({ regress, controls }),
    { debounce: true }
  );

  constructor(
    private loopService: LoopService,
    private canvasStore: CanvasStore,
    private eventsStore: EventsStore,
    private animationStore: AnimationStore,
    private performanceStore: PerformanceStore,
    private ngZone: NgZone
  ) {
    super({
      target: undefined,
      regress: false,
      enableDamping: true,
      makeDefault: false,
      camera: undefined,
      domElement: undefined,
      controls: undefined,
    });
  }

  ngOnInit() {
    this.updaters.setDomElement(
      typeof this.eventsStore.getImperativeState().connected !== 'boolean'
        ? (this.eventsStore.getImperativeState().connected as HTMLElement)
        : this.canvasStore.getImperativeState().renderer!.domElement
    );
    this.updaters.setCamera(this.canvasStore.getImperativeState().camera);
    this.setControlsEffect(this.controlsParams$);
    this.animationTearDown = this.animationStore.registerAnimation(() => {
      const { controls } = this.getImperativeState();
      if (controls && controls.enabled) {
        controls.update();
      }
    });
    this.setControlsEventsEffect(this.controlsEffectChanges$);
    this.makeDefaultEffect(this.makeDefaultParams$);
  }

  readonly setControlsEffect = this.effect<{
    camera?: THREE.Camera;
    domElement?: HTMLElement;
  }>((params$) =>
    params$.pipe(
      tap(({ camera, domElement }) => {
        this.ngZone.runOutsideAngular(() => {
          if (camera) {
            this.patchState({
              controls: new OrbitControls(camera, domElement),
            });
          }
        });
      })
    )
  );

  readonly setControlsEventsEffect = this.enhancedEffect<{
    controls?: OrbitControls;
    regress?: boolean;
  }>((changes$) =>
    changes$.pipe(
      tapEffect(({ controls, regress }) => {
        const changeCallback: (e: THREE.Event) => void = (e) => {
          this.loopService.start();
          if (regress) {
            this.performanceStore.getImperativeState().regress();
          }

          if (this.change.observed) {
            this.change.emit(e);
          }
        };
        let startCallback: (e: THREE.Event) => void;
        let endCallback: (e: THREE.Event) => void;

        this.ngZone.runOutsideAngular(() => {
          if (controls) {
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
          }
        });

        return () => {
          this.ngZone.runOutsideAngular(() => {
            if (controls) {
              controls.removeEventListener('change', changeCallback);
              if (endCallback) controls.removeEventListener('end', endCallback);
              if (startCallback)
                controls.removeEventListener('start', startCallback);
              controls.dispose();
            }
          });
        };
      })
    )
  );

  readonly makeDefaultEffect = this.effect<{
    makeDefault: boolean;
    controls?: OrbitControls;
  }>((params$) =>
    params$.pipe(
      tapEffect(({ controls, makeDefault }) => {
        const oldControls = this.canvasStore.getImperativeState().controls;
        this.ngZone.runOutsideAngular(() => {
          if (makeDefault) {
            this.canvasStore.patchState({ controls });
          }
        });

        return () => {
          this.ngZone.runOutsideAngular(() => {
            this.canvasStore.patchState({ controls: oldControls });
          });
        };
      })
    )
  );

  ngOnDestroy() {
    if (this.animationTearDown) {
      this.animationTearDown();
    }
    super.ngOnDestroy();
  }
}

@NgModule({
  declarations: [NgtSobaOrbitControls],
  exports: [NgtSobaOrbitControls],
})
export class NgtSobaOrbitControlsModule {}
