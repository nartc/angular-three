import {
  injectNgtRef,
  injectNgtStore,
  NgtArgs,
  NgtPush,
  NgtRendererFlags,
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
import { combineLatest } from 'rxjs';
import { OrbitControls } from 'three-stdlib';

@Component({
  selector: 'ngts-orbit-controls',
  standalone: true,
  template: `
    <ngt-primitive
      ngtCompound
      *args="[ref.nativeElement]"
      [enableDamping]="enableDamping$ | ngtPush : true"
    ></ngt-primitive>
  `,
  imports: [NgtArgs, NgtPush],
  providers: [RxActionFactory],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsOrbitControls extends NgtRxStore implements OnInit {
  static [NgtRendererFlags.COMPOUND] = true;

  @Input() ref = injectNgtRef<OrbitControls>();

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
  readonly #actions = inject<RxActionFactory<{ setBeforeRender: void }>>(RxActionFactory).create();
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
  }

  #setControls() {
    this.hold(
      combineLatest([
        this.#store.select('camera'),
        this.select('camera').pipe(startWithUndefined()),
      ]),
      () => {
        const camera = this.get('camera') || this.#store.get('camera');
        if (!this.ref.nativeElement) {
          this.ref.nativeElement = new OrbitControls(camera);
        }
      }
    );
  }

  #setBeforeRender() {
    this.effect(this.#actions.setBeforeRender$, () => {
      return this.#store.get('internal').subscribe(
        () => {
          if (this.ref.nativeElement && this.ref.nativeElement.enabled) {
            this.ref.nativeElement.update();
          }
        },
        -1,
        this.#store
      );
    });
    this.#actions.setBeforeRender();
  }

  #connectElement() {
    this.effect(
      combineLatest([
        this.#store.select('gl', 'domElement'),
        this.#store.select('invalidate'),
        this.select('regress'),
        this.ref.$,
      ]),
      () => {
        const { gl, events } = this.#store.get();
        const domElement = this.get('domElement') || events.connected || gl.domElement;
        if (this.ref.nativeElement) {
          this.ref.nativeElement.connect(domElement);
        }

        return () => {
          if (this.ref.nativeElement) {
            this.ref.nativeElement.dispose();
          }
        };
      }
    );
  }

  #makeDefault() {
    this.effect(combineLatest([this.ref.$, this.select('makeDefault')]), () => {
      const makeDefault = this.get('makeDefault');
      if (makeDefault) {
        const oldControls = this.#store.get('controls');
        this.#store.set({ controls: this.ref.nativeElement });
        return () => {
          this.#store.set({ controls: oldControls });
        };
      }
    });
  }

  #setEvents() {
    this.effect(this.ref.$, () => {
      const { invalidate, performance } = this.#store.get();
      const regress = this.get('regress');

      const changeCallback: (e: THREE.Event) => void = (e) => {
        invalidate();
        if (regress) performance.regress();

        if (this.change.observed) this.change.emit(e);
      };

      const startCallback = this.start.observed ? this.start.emit.bind(this.start) : null;
      const endCallback = this.end.observed ? this.end.emit.bind(this.end) : null;

      this.ref.nativeElement.addEventListener('change', changeCallback);
      if (startCallback) this.ref.nativeElement.addEventListener('start', startCallback);
      if (endCallback) this.ref.nativeElement.addEventListener('end', endCallback);

      return () => {
        this.ref.nativeElement.removeEventListener('change', changeCallback);
        if (startCallback) this.ref.nativeElement.removeEventListener('start', startCallback);
        if (endCallback) this.ref.nativeElement.removeEventListener('end', endCallback);
      };
    });
  }
}
