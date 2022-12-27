import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  createEnvironmentInjector,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { filter } from 'rxjs';
import { createPointerEvents } from './events';
import { provideNgtRenderer } from './renderer/provider';
import { injectNgtLoader } from './services/loader';
import { injectNgtResize, NgtResizeResult } from './services/resize';
import { NgtRxStore } from './stores/rx-store';
import { injectNgtStore, NgtStore, rootStateMap } from './stores/store';
import { NgtCanvasInputs, NgtDomEvent, NgtDpr, NgtState, NgtVector3 } from './types';
import { is } from './utils/is';

@Component({
  selector: 'ngt-canvas-container',
  standalone: true,
  template: '<ng-content></ng-content>',
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class NgtCanvasContainer {
  @Output() canvasResize = injectNgtResize();
}

@Component({
  selector: 'ngt-canvas[scene]',
  standalone: true,
  template: `
    <ngt-canvas-container (canvasResize)="onResize($event)">
      <canvas #glCanvas style="display:block"></canvas>
      <ng-container #glAnchor></ng-container>
    </ngt-canvas-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    `,
  ],
  imports: [NgtCanvasContainer],
  providers: [NgtStore],
})
export class NgtCanvas extends NgtRxStore<NgtCanvasInputs> implements OnInit, OnDestroy {
  readonly #cdr = inject(ChangeDetectorRef);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #host = inject(ElementRef) as ElementRef<HTMLElement>;
  readonly #store = injectNgtStore({ self: true });

  override initialize() {
    super.initialize();
    this.set({
      shadows: false,
      linear: false,
      flat: false,
      legacy: false,
      orthographic: false,
      frameloop: 'always',
      dpr: [1, 2],
      events: createPointerEvents,
    });
  }

  @HostBinding('class.ngt-canvas') readonly hostClass = true;

  @HostBinding('style.pointerEvents') get pointerEvents() {
    return this.get('eventSource') !== this.#host.nativeElement ? 'none' : 'auto';
  }

  @Input() scene!: Type<unknown>;

  @Input() set linear(linear: boolean) {
    this.set({ linear });
  }

  @Input() set legacy(legacy: boolean) {
    this.set({ legacy });
  }

  @Input() set flat(flat: boolean) {
    this.set({ flat });
  }

  @Input() set orthographic(orthographic: boolean) {
    this.set({ orthographic });
  }

  @Input() set frameloop(frameloop: 'always' | 'demand' | 'never') {
    this.set({ frameloop });
  }

  @Input() set dpr(dpr: NgtDpr) {
    this.set({ dpr });
  }

  @Input() set raycaster(raycaster: Partial<THREE.Raycaster>) {
    this.set({ raycaster });
  }

  @Input() set shadows(shadows: boolean | Partial<THREE.WebGLShadowMap>) {
    this.set({
      shadows: typeof shadows === 'object' ? (shadows as Partial<THREE.WebGLShadowMap>) : shadows,
    });
  }

  @Input() set camera(camera: NgtCanvasInputs['camera']) {
    this.set({ camera });
  }

  @Input() set gl(gl: NgtCanvasInputs['gl']) {
    this.set({ gl });
  }

  @Input() set eventSource(eventSource: NgtCanvasInputs['eventSource']) {
    this.set({ eventSource });
  }

  @Input() set eventPrefix(eventPrefix: NgtCanvasInputs['eventPrefix']) {
    this.set({ eventPrefix });
  }

  @Input() set lookAt(lookAt: NgtVector3) {
    this.set({ lookAt });
  }

  @Input() set performance(performance: NgtCanvasInputs['performance']) {
    this.set({ performance });
  }

  @Output() created = new EventEmitter<NgtState>();
  @Output() canvasPointerMissed = new EventEmitter();

  @ViewChild('glCanvas', { static: true })
  glCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('glAnchor', { read: ViewContainerRef, static: true })
  glAnchor!: ViewContainerRef;

  #glComponentRef?: ComponentRef<unknown>;

  ngOnInit() {
    // detach canvas from ChangeDetection
    this.#cdr.detach();

    if (!this.get('eventSource')) {
      this.eventSource = this.#host.nativeElement;
    }

    if (this.canvasPointerMissed.observed) {
      // update pointerMissed event
      this.#store.set({
        onPointerMissed: (event: MouseEvent) => {
          this.canvasPointerMissed.emit(event);
          this.#cdr.detectChanges();
        },
      });
    }

    // setup NgtStore
    this.#store.init();

    // set rootState map
    rootStateMap.set(this.glCanvas.nativeElement, this.#store);

    // subscribe to store to listen for ready state
    this.hold(this.#store.select('ready').pipe(filter((ready) => ready)), () => {
      this.ready();
    });
  }

  onResize(result: NgtResizeResult) {
    const { width, height } = result;
    if (width > 0 && height > 0) {
      if (!this.#store.isInit) {
        this.#store.init();
      }
      this.#store.configure(this.get(), this.glCanvas.nativeElement);
    }
  }

  private ready() {
    // canvas is ready
    this.#store.set((state) => ({ internal: { ...state.internal, active: true } }));

    const inputs = this.get();
    const state = this.#store.get();

    // connect to event source
    state.events.connect?.(
      is.ref(inputs.eventSource) ? inputs.eventSource.nativeElement : inputs.eventSource
    );

    // setup compute function
    if (inputs.eventPrefix) {
      state.setEvents({
        compute: (event, store) => {
          const innerState = store.get();
          const x = event[(inputs.eventPrefix + 'X') as keyof NgtDomEvent] as number;
          const y = event[(inputs.eventPrefix + 'Y') as keyof NgtDomEvent] as number;
          innerState.pointer.set(
            (x / innerState.size.width) * 2 - 1,
            -(y / innerState.size.height) * 2 + 1
          );
          innerState.raycaster.setFromCamera(innerState.pointer, innerState.camera);
        },
      });
    }

    if (this.created.observed) {
      this.created.emit(this.#store.get());
      this.#cdr.detectChanges();
    }

    // render
    if (this.#glComponentRef) {
      this.#glComponentRef.destroy();
    }

    requestAnimationFrame(() => {
      this.#glComponentRef = this.glAnchor.createComponent(this.scene, {
        environmentInjector: createEnvironmentInjector(
          [provideNgtRenderer(this.#store, this.#cdr)],
          this.#environmentInjector
        ),
      });
      this.#glComponentRef.changeDetectorRef.detectChanges();
      this.#cdr.detectChanges();
    });
    this.#cdr.detectChanges();
  }

  override ngOnDestroy() {
    if (this.#glComponentRef) {
      this.#glComponentRef.destroy();
    }
    injectNgtLoader.destroy();
    super.ngOnDestroy();
  }
}
