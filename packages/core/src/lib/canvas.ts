import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import create from 'zustand/vanilla';
import { createPointerEvents } from './events';
import { injectNgtLoader } from './services/loader';
import { injectNgtResize, NgtResize, NgtResizeResult } from './services/resize';
import { injectNgtStore, provideNgtStore, rootStateMap } from './store';
import type { NgtCanvasInputs, NgtDomEvent, NgtDpr, NgtState, NgtVector3 } from './types';

@Component({
  selector: 'ngt-canvas-container',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [NgtResize],
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class NgtCanvasContainer {
  @Output() canvasResize = injectNgtResize();
}

@Directive({
  selector: '[ngtCanvasContent]',
  standalone: true,
})
export class NgtCanvasContent {}

@Component({
  selector: 'ngt-canvas',
  standalone: true,
  template: `
    <ngt-canvas-container (canvasResize)="onResize($event)">
      <canvas #glCanvas style="display: block"> </canvas>
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
  providers: [provideNgtStore()],
})
export class NgtCanvas implements OnInit, OnDestroy {
  private readonly inputsStore = create<NgtCanvasInputs>(() => ({
    shadows: false,
    linear: false,
    flat: false,
    legacy: false,
    orthographic: false,
    frameloop: 'always',
    dpr: [1, 2],
    events: createPointerEvents,
  }));

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host = inject(ElementRef) as ElementRef<HTMLElement>;
  private readonly ngtStore = injectNgtStore({ self: true });
  private readonly ngtLoader = injectNgtLoader();

  @HostBinding('class.ngt-canvas') readonly hostClass = true;

  @HostBinding('style.pointerEvents') get pointerEvents() {
    return this.inputsStore.getState().eventSource !== this.host.nativeElement ? 'none' : 'auto';
  }

  @Input() set linear(linear: boolean) {
    this.inputsStore.setState({ linear });
  }

  @Input() set legacy(legacy: boolean) {
    this.inputsStore.setState({ legacy });
  }

  @Input() set flat(flat: boolean) {
    this.inputsStore.setState({ flat });
  }

  @Input() set orthographic(orthographic: boolean) {
    this.inputsStore.setState({ orthographic });
  }

  @Input() set frameloop(frameloop: 'always' | 'demand' | 'never') {
    this.inputsStore.setState({ frameloop });
  }

  @Input() set dpr(dpr: NgtDpr) {
    this.inputsStore.setState({ dpr });
  }

  @Input() set raycaster(raycaster: Partial<THREE.Raycaster>) {
    this.inputsStore.setState({ raycaster });
  }

  @Input() set shadows(shadows: boolean | Partial<THREE.WebGLShadowMap>) {
    this.inputsStore.setState({
      shadows: typeof shadows === 'object' ? (shadows as Partial<THREE.WebGLShadowMap>) : shadows,
    });
  }

  @Input() set camera(camera: NgtCanvasInputs['camera']) {
    this.inputsStore.setState({ camera });
  }

  @Input() set gl(gl: NgtCanvasInputs['gl']) {
    this.inputsStore.setState({ gl });
  }

  @Input() set eventSource(eventSource: NgtCanvasInputs['eventSource']) {
    this.inputsStore.setState({ eventSource });
  }

  @Input() set eventPrefix(eventPrefix: NgtCanvasInputs['eventPrefix']) {
    this.inputsStore.setState({ eventPrefix });
  }

  @Input() set lookAt(lookAt: NgtVector3) {
    this.inputsStore.setState({ lookAt });
  }

  @Input() set performance(performance: NgtCanvasInputs['performance']) {
    this.inputsStore.setState({ performance });
  }

  @Output() created = new EventEmitter<NgtState>();
  @Output() canvasPointerMissed = new EventEmitter();

  @ViewChild('glCanvas', { static: true })
  glCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('glAnchor', { read: ViewContainerRef, static: true })
  glAnchor!: ViewContainerRef;

  @ContentChild(TemplateRef, { read: TemplateRef, static: true })
  glTemplate!: TemplateRef<unknown>;

  private glView?: EmbeddedViewRef<unknown>;
  private subscription?: () => void;

  ngOnInit() {
    this.cdr.detach();

    if (!this.inputsStore.getState().eventSource) {
      this.eventSource = this.host.nativeElement;
    }

    if (this.canvasPointerMissed.observed) {
      // update pointerMissed event
      this.ngtStore.store.setState({
        onPointerMissed: (event: MouseEvent) => {
          this.canvasPointerMissed.emit(event);
          this.cdr.detectChanges();
        },
      });
    }

    // setup canvas state
    this.ngtStore.init();

    // set rootStateMap
    rootStateMap.set(this.glCanvas.nativeElement, this.ngtStore.store);

    // subscribe to store to listen for ready state
    this.subscription = this.ngtStore.store.subscribe((state, prevState) => {
      if (state.ready && prevState.ready !== state.ready) {
        this.ready();
      }
    });
  }

  onResize(result: NgtResizeResult) {
    const { width, height } = result;
    if (width > 0 && height > 0) {
      if (!this.ngtStore.isInit) {
        this.ngtStore.init();
      }
      this.ngtStore.configure(this.inputsStore.getState(), this.glCanvas.nativeElement);
    }
  }

  private ready() {
    // canvas is ready
    this.ngtStore.store.setState((s) => ({
      internal: { ...s.internal, active: true },
    }));

    const inputs = this.inputsStore.getState();
    const state = this.ngtStore.store.getState();

    // Connect to eventsource
    state.events.connect?.(
      inputs.eventSource instanceof ElementRef
        ? inputs.eventSource.nativeElement
        : inputs.eventSource
    );

    // Set up compute function
    if (inputs.eventPrefix) {
      state.setEvents({
        compute: (event, store) => {
          const innerState = store.getState();
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
      this.created.emit(this.ngtStore.store.getState());
      this.cdr.detectChanges();
    }

    // render
    if (this.glView && !this.glView.destroyed) {
      this.glView.destroy();
    }

    this.glView = this.glAnchor.createEmbeddedView(this.glTemplate, {});

    this.cdr.detectChanges();
    this.glView.detectChanges();
  }

  ngOnDestroy() {
    this.subscription?.();
    if (this.glView && !this.glView.destroyed) {
      this.glView.destroy();
    }
    this.ngtLoader.destroy();
  }
}
