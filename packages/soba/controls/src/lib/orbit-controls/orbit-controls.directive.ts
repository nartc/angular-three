import {
  EnhancedComponentStore,
  NgtAnimationFrameStore,
  NgtEventsStore,
  NgtLoopService,
  NgtPerformanceStore,
  NgtStore,
  NgtVector3,
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
import { Observable, Subscription, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib/controls/OrbitControls';

export interface NgtSobaOrbitControlsState {
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
  extends EnhancedComponentStore<NgtSobaOrbitControlsState>
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

  @Output() ready = new EventEmitter<void>();
  @Output() change = new EventEmitter<THREE.Event>();
  @Output() start = new EventEmitter<THREE.Event>();
  @Output() end = new EventEmitter<THREE.Event>();

  private animationSubscription?: Subscription;

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
    this.selectors.domElement$,
    (regress, controls, domElement) => ({ regress, controls, domElement }),
    { debounce: true }
  );

  constructor(
    private loopService: NgtLoopService,
    private store: NgtStore,
    private eventsStore: NgtEventsStore,
    private animationFrameStore: NgtAnimationFrameStore,
    private performanceStore: NgtPerformanceStore,
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
    this.ngZone.runOutsideAngular(() => {
      this.updaters.setCamera(this.store.getImperativeState().camera);
      this.updaters.setDomElement(
        typeof this.eventsStore.getImperativeState().connected !== 'boolean'
          ? (this.eventsStore.getImperativeState().connected as HTMLElement)
          : this.store.getImperativeState().renderer?.domElement
      );
      this.setControlsEffect(this.selectors.camera$);
      this.animationSubscription = this.animationFrameStore.register({
        callback: () => {
          const { controls } = this.getImperativeState();
          if (controls && controls.enabled) {
            controls.update();
          }
        },
        obj: null,
      });
      this.setControlsEventsEffect(this.controlsEffectChanges$);
      this.makeDefaultEffect(this.makeDefaultParams$);
    });
  }

  readonly setControlsEffect = this.effect<THREE.Camera | undefined>(
    (params$) =>
      params$.pipe(
        withLatestFrom(this.selectors.enableDamping$),
        tap(([camera, enableDamping]) => {
          this.ngZone.runOutsideAngular(() => {
            if (camera) {
              const controls = new OrbitControls(camera);
              controls.enableDamping = enableDamping;
              this.patchState({ controls });
              this.ready.emit();
            }
          });
        })
      )
  );

  readonly setControlsEventsEffect = this.effect<{
    controls?: OrbitControls;
    regress?: boolean;
    domElement?: HTMLElement;
  }>((changes$) =>
    changes$.pipe(
      tapEffect(({ controls, regress, domElement }) => {
        const changeCallback: (e: THREE.Event) => void = (e) => {
          this.loopService.invalidate(this.store.getImperativeState());
          if (regress) {
            this.performanceStore.regress();
          }

          if (this.change.observed) {
            this.change.emit(e);
          }
        };
        let startCallback: (e: THREE.Event) => void;
        let endCallback: (e: THREE.Event) => void;

        this.ngZone.runOutsideAngular(() => {
          if (controls) {
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
        const oldControls = this.store.getImperativeState().controls;
        this.ngZone.runOutsideAngular(() => {
          if (makeDefault) {
            this.store.patchState({ controls });
          }
        });

        return () => {
          this.ngZone.runOutsideAngular(() => {
            this.store.patchState({ controls: oldControls });
          });
        };
      })
    )
  );

  ngOnDestroy() {
    if (this.animationSubscription) {
      this.animationSubscription.unsubscribe();
    }
    super.ngOnDestroy();
  }

  get controls() {
    return this.store.getImperativeState().controls;
  }
}

@NgModule({
  declarations: [NgtSobaOrbitControls],
  exports: [NgtSobaOrbitControls],
})
export class NgtSobaOrbitControlsModule {}
