import { CanvasStore, DestroyedService } from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  SkipSelf,
} from '@angular/core';
import { distinctUntilKeyChanged, map, race, takeUntil } from 'rxjs';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

@Directive({
  selector: 'ngt-effect-composer',
  exportAs: 'ngtEffectComposer',
  providers: [DestroyedService],
})
export class NgtEffectComposer implements OnInit {
  @Input() renderTarget?: THREE.WebGLRenderTarget;
  @Input() watchSizeChanged = true;

  @Output() ready = new EventEmitter<EffectComposer>();

  constructor(
    @SkipSelf() private readonly canvasStore: CanvasStore,
    private readonly destroyed: DestroyedService,
    private readonly ngZone: NgZone
  ) {}

  private _composer!: EffectComposer;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      // TODO: figure out how to clean up nested subscription
      this.canvasStore.selectors.internal$
        .pipe(takeUntil(this.destroyed))
        .subscribe((canvasInternal) => {
          this.ngZone.runOutsideAngular(() => {
            const { renderer } = this.canvasStore.getImperativeState();
            if (canvasInternal.active && renderer) {
              this._composer = new EffectComposer(renderer, this.renderTarget);

              this.ready.emit(this.composer);

              if (this.watchSizeChanged) {
                // nested subscription
                this.canvasStore.selectors.internal$
                  .pipe(
                    distinctUntilKeyChanged('size'),
                    map((internal) => internal.size),
                    takeUntil(
                      race(
                        this.canvasStore.selectors.internal$.pipe(
                          distinctUntilKeyChanged('active'),
                          map((internal) => internal.active)
                        ),
                        this.destroyed
                      )
                    )
                  )
                  .subscribe(({ width, height }) => {
                    this.ngZone.runOutsideAngular(() => {
                      this._composer.setSize(width, height);
                    });
                  });
              }
            }
          });
        });
    });
  }

  get composer(): EffectComposer {
    return this._composer;
  }
}
