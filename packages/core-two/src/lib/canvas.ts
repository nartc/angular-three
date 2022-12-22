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
import { tap } from 'rxjs';
import { createPointerEvents } from './events';
import { injectNgtLoader } from './services/loader';
import { injectNgtResize, NgtResize, NgtResizeResult } from './services/resize';
import { filterFalsy, NgtComponentStore } from './stores/component-store';
import { injectNgtStore, NgtStore, rootStateMap } from './stores/store';
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
  selector: 'ng-template[ngtCanvasContent]',
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
  providers: [NgtStore],
})
export class NgtCanvas extends NgtComponentStore<NgtCanvasInputs> implements OnInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host = inject(ElementRef) as ElementRef<HTMLElement>;
  private readonly store = injectNgtStore({ self: true });

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
    return this.get((s) => s.eventSource) !== this.host.nativeElement ? 'none' : 'auto';
  }

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

  @ContentChild(TemplateRef, { read: TemplateRef, static: true })
  glTemplate!: TemplateRef<unknown>;

  private glView?: EmbeddedViewRef<unknown>;

  ngOnInit() {
    this.cdr.detach();

    if (!this.get((s) => s.eventSource)) {
      this.eventSource = this.host.nativeElement;
    }

    if (this.canvasPointerMissed.observed) {
      // update pointerMissed event
      this.store.set({
        onPointerMissed: (event: MouseEvent) => {
          this.canvasPointerMissed.emit(event);
          this.cdr.detectChanges();
        },
      });
    }

    // setup canvas state
    this.store.init();

    // set rootStateMap
    rootStateMap.set(this.glCanvas.nativeElement, this.store);

    // subscribe to store to listen for ready state
    this.effect(tap(() => this.ready()))(this.store.select((s) => s.ready).pipe(filterFalsy()));
  }

  onResize(result: NgtResizeResult) {
    const { width, height } = result;
    if (width > 0 && height > 0) {
      if (!this.store.isInit) {
        this.store.init();
      }
      this.store.configure(this.get(), this.glCanvas.nativeElement);
    }
  }

  private ready() {
    // canvas is ready
    this.store.set((s) => ({ internal: { ...s.internal, active: true } }));

    const inputs = this.get();
    const state = this.store.get();

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
      this.created.emit(this.store.get());
      this.cdr.detectChanges();
    }

    // state.scene.add(new Mesh(new BoxGeometry(), new MeshBasicMaterial({color: 'red'})));

    // render
    if (this.glView && !this.glView.destroyed) {
      this.glView.destroy();
    }

    this.glView = this.glAnchor.createEmbeddedView(this.glTemplate, {});

    this.cdr.detectChanges();
    this.glView.detectChanges();
  }

  override ngOnDestroy() {
    if (this.glView && !this.glView.destroyed) {
      this.glView.destroy();
    }
    injectNgtLoader.destroy();
    super.ngOnDestroy();
  }
}
