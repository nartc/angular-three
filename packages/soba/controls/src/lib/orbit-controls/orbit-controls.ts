import {
  createEventEmitter,
  defaultProjector,
  injectNgtStore,
  injectRef,
  NgtArgs,
  NgtComponentStore,
  NgtPush,
  NgtVector3,
  NgtWrapper,
  tapEffect,
} from '@angular-three/core-two';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, Output } from '@angular/core';
import { tap } from 'rxjs';
import { OrbitControls } from 'three-stdlib';

@NgtWrapper()
@Component({
  selector: 'ngts-orbit-controls',
  standalone: true,
  template: `
    <ngt-primitive
      *args="[controlsRef.$ | ngtPush : null]"
      [enableDamping]="getKey('enableDamping')"
    ></ngt-primitive>
  `,
  imports: [NgtArgs, NgtPush],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsOrbitControls extends NgtComponentStore implements OnInit {
  @Input() set camera(camera: THREE.Camera) {
    this.set({ camera });
  }

  @Input() set domElement(domElement: HTMLElement) {
    this.set({ domElement });
  }

  @Input() set makeDefault(makeDefault: boolean) {
    this.set({ makeDefault });
  }

  @Input() set regress(regress: boolean) {
    this.set({ regress });
  }

  @Input() set target(target: NgtVector3) {
    this.set({ target });
  }

  @Input() set enableDamping(enableDamping: boolean) {
    this.set({ enableDamping });
  }

  @Output() change = createEventEmitter<THREE.Event>();
  @Output() start = createEventEmitter<THREE.Event>();
  @Output() end = createEventEmitter<THREE.Event>();

  private readonly store = injectNgtStore();
  readonly controlsRef = injectRef<OrbitControls>();

  override initialize() {
    super.initialize();
    this.set({ enableDamping: true });
  }

  ngOnInit() {
    this.setControls();
    this.setBeforeRender();
    this.connectElement();
    this.makeDefaultControls();
    this.setEvents();
  }

  private setControls() {
    this.effect(
      tap(() => {
        const camera = this.get((s) => s['camera']) || this.store.get((s) => s.camera);
        this.controlsRef.nativeElement = new OrbitControls(camera);
      })
    )(this.store.select((s) => s.camera, { debounce: true }));
  }

  private setBeforeRender() {
    this.effect<void>(
      tapEffect(() =>
        this.store
          .get((s) => s.internal)
          .subscribe(
            () => {
              if (this.controlsRef.nativeElement && this.controlsRef.nativeElement.enabled) {
                this.controlsRef.nativeElement.update();
              }
            },
            -1,
            this.store
          )
      )
    )();
  }

  private connectElement() {
    this.effect(
      tapEffect(() => {
        const { gl, events } = this.store.get();
        const domElement = this.get((s) => s['domElement']) || events.connected || gl.domElement;
        if (this.controlsRef.nativeElement) {
          this.controlsRef.nativeElement.connect(domElement);
        }

        return () => {
          if (this.controlsRef.nativeElement) {
            this.controlsRef.nativeElement.dispose();
          }
        };
      })
    )(
      this.select(
        this.store.select((s) => s.gl.domElement),
        this.store.select((s) => s.invalidate),
        this.select((s) => s['regress']),
        this.controlsRef.$,
        defaultProjector,
        { debounce: true }
      )
    );
  }

  private makeDefaultControls() {
    this.effect(
      tapEffect(() => {
        const makeDefault = this.get((s) => s['makeDefault']);
        if (makeDefault) {
          const oldControls = this.store.get((s) => s.controls);
          this.store.set({ controls: this.controlsRef.nativeElement });
          return () => {
            this.store.set({ controls: oldControls });
          };
        }
      })
    )(
      this.select(
        this.controlsRef.$,
        this.select((s) => s['makeDefault']),
        defaultProjector,
        { debounce: true }
      )
    );
  }

  private setEvents() {
    this.effect(
      tapEffect(() => {
        const { invalidate, performance } = this.store.get();
        const regress = this.get((s) => s['regress']);

        const changeCallback: (e: THREE.Event) => void = (e) => {
          invalidate();
          if (regress) {
            performance.regress();
          }

          if (this.change.observed) {
            this.change.emit(e);
          }
        };
        let startCallback: (e: THREE.Event) => void;
        let endCallback: (e: THREE.Event) => void;

        this.controlsRef.nativeElement.addEventListener('change', changeCallback);

        if (this.start.observed) {
          startCallback = (event: THREE.Event) => {
            this.start.emit(event);
          };
          this.controlsRef.nativeElement.addEventListener('start', startCallback);
        }

        if (this.end.observed) {
          endCallback = (event: THREE.Event) => {
            this.end.emit(event);
          };
          this.controlsRef.nativeElement.addEventListener('end', endCallback);
        }

        return () => {
          this.controlsRef.nativeElement.removeEventListener('change', changeCallback);
          if (endCallback) this.controlsRef.nativeElement.removeEventListener('end', endCallback);
          if (startCallback)
            this.controlsRef.nativeElement.removeEventListener('start', startCallback);
        };
      })
    )(this.select(this.controlsRef.$, defaultProjector, { debounce: true }));
  }
}
