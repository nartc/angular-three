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
export class NgtsOrbitControls extends NgtRxStore implements OnInit {
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

  #setControls() {
    this.hold(
      combineLatest([
        this.#store.select('camera'),
        this.select('camera').pipe(startWithUndefined()),
      ]),
      ([defaultCamera, camera]) => {
        this.controlsRef.nativeElement = new OrbitControls(camera || defaultCamera);
      }
    );
  }

  #setBeforeRender() {
    this.effect(this.#actions.setBeforeRender$, () => {
      return this.#store.get('internal').subscribe(
        () => {
          if (this.controlsRef.nativeElement && this.controlsRef.nativeElement.enabled) {
            this.controlsRef.nativeElement.update();
          }
        },
        -1,
        this.#store
      );
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
      () => {
        const { gl, events } = this.#store.get();
        const domElement = this.get('domElement') || events.connected || gl.domElement;
        this.controlsRef.nativeElement.connect(domElement);
      }
    );
  }

  #makeDefault() {
    this.effect(combineLatest([this.controlsRef.$, this.select('makeDefault')]), () => {
      const makeDefault = this.get('makeDefault');
      if (makeDefault) {
        const oldControls = this.#store.get('controls');
        this.#store.set({ controls: this.controlsRef.nativeElement });
        return () => {
          this.#store.set({ controls: oldControls });
        };
      }
    });
  }

  #setEvents() {
    this.effect(this.controlsRef.$, () => {
      const { invalidate, performance } = this.#store.get();
      const regress = this.get('regress');

      const changeCallback: (e: THREE.Event) => void = (e) => {
        invalidate();
        if (regress) performance.regress();
        if (this.change.observed) this.change.emit(e);
      };

      const startCallback = this.start.observed ? this.start.emit.bind(this.start) : null;
      const endCallback = this.end.observed ? this.end.emit.bind(this.end) : null;

      this.controlsRef.nativeElement.addEventListener('change', changeCallback);
      if (startCallback) this.controlsRef.nativeElement.addEventListener('start', startCallback);
      if (endCallback) this.controlsRef.nativeElement.addEventListener('end', endCallback);

      return () => {
        this.controlsRef.nativeElement.removeEventListener('change', changeCallback);
        if (startCallback)
          this.controlsRef.nativeElement.removeEventListener('start', startCallback);
        if (endCallback) this.controlsRef.nativeElement.removeEventListener('end', endCallback);
      };
    });
  }
}
