import {
  injectNgtRef,
  injectNgtStore,
  NgtArgs,
  NgtPush,
  NgtRxStore,
  NgtVector3,
  startWithUndefined,
} from '@angular-three/core';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { RxActionFactory } from '@rx-angular/state/actions';
import { combineLatest, map } from 'rxjs';
import { OrbitControls } from 'three-stdlib';

@Component({
  selector: 'ngts-orbit-controls',
  standalone: true,
  template: `
    <ngt-primitive
      ngtCompound
      *args="get('args')"
      [enableDamping]="enableDamping$ | ngtPush : true"
    ></ngt-primitive>
  `,
  imports: [NgtArgs, NgtPush],
  providers: [RxActionFactory],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsOrbitControls extends NgtRxStore implements OnInit, OnDestroy {
  @Input() controlsRef = injectNgtRef<OrbitControls>();

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

  @Output() change = new EventEmitter<THREE.Event>();
  @Output() start = new EventEmitter<THREE.Event>();
  @Output() end = new EventEmitter<THREE.Event>();

  readonly #store = injectNgtStore();
  readonly #actions = inject(RxActionFactory<{ setBeforeRender: void }>).create();
  readonly enableDamping$ = this.select('enableDamping');

  override initialize() {
    super.initialize();
    this.set({ enableDamping: true, regress: false });
  }

  ngOnInit() {
    this.#setControls();
    this.#setBeforeRender();
    this.#connectElement();
    this.#makeDefault();
    this.#setEvents();
    this.connect('args', this.controlsRef.$.pipe(map((controls) => [controls])));
  }

  override ngOnDestroy(): void {
    this.controlsRef.nativeElement.dispose();
    super.ngOnDestroy();
  }

  #setControls() {
    this.hold(
      combineLatest([
        this.#store.select('camera'),
        this.select('camera').pipe(startWithUndefined()),
      ]),
      ([defaultCamera, camera]) => {
        const controlsCamera = camera || defaultCamera;
        if (
          !this.controlsRef.nativeElement ||
          this.controlsRef.nativeElement.object !== controlsCamera
        ) {
          this.controlsRef.nativeElement = new OrbitControls(controlsCamera);
        }
      }
    );
  }

  #setBeforeRender() {
    this.effect(this.#actions.setBeforeRender$, () => {
      return this.#store.get('internal').subscribe(() => {
        if (this.controlsRef.nativeElement && this.controlsRef.nativeElement.enabled) {
          this.controlsRef.nativeElement.update();
        }
      }, -1);
    });
    this.#actions.setBeforeRender();
  }

  #connectElement() {
    this.hold(
      combineLatest([
        this.#store.select('gl', 'domElement'),
        this.#store.select('invalidate'),
        this.select('regress'),
        this.controlsRef.$,
      ]),
      ([glDom, , , controls]) => {
        const { events } = this.#store.get();
        const domElement = this.get('domElement') || events.connected || glDom;
        controls.connect(domElement);
      }
    );
  }

  #makeDefault() {
    this.effect(
      combineLatest([this.controlsRef.$, this.select('makeDefault')]),
      ([controls, makeDefault]) => {
        if (makeDefault) {
          const oldControls = this.#store.get('controls');
          this.#store.set({ controls });
          return () => {
            this.#store.set({ controls: oldControls });
          };
        }
      }
    );
  }

  #setEvents() {
    this.effect(this.controlsRef.$, (controls) => {
      const { invalidate, performance } = this.#store.get();
      const regress = this.get('regress');

      const changeCallback: (e: THREE.Event) => void = (e) => {
        invalidate();
        if (regress) performance.regress();
        if (this.change.observed) this.change.emit(e);
      };

      const startCallback = this.start.observed ? this.start.emit.bind(this.start) : null;
      const endCallback = this.end.observed ? this.end.emit.bind(this.end) : null;

      controls.addEventListener('change', changeCallback);
      if (startCallback) controls.addEventListener('start', startCallback);
      if (endCallback) controls.addEventListener('end', endCallback);

      return () => {
        controls.removeEventListener('change', changeCallback);
        if (startCallback) controls.removeEventListener('start', startCallback);
        if (endCallback) controls.removeEventListener('end', endCallback);
      };
    });
  }
}
