import { CanvasStore, distinctKeyMap } from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  SkipSelf,
} from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, switchMap, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

@Directive({
  selector: 'ngt-effect-composer',
  exportAs: 'ngtEffectComposer',
})
export class NgtEffectComposer extends ComponentStore<{}> implements OnInit {
  @Input() renderTarget?: THREE.WebGLRenderTarget;
  @Input() watchSizeChanged = true;
  @Output() ready = new EventEmitter<EffectComposer>();

  private _composer!: EffectComposer;

  get composer(): EffectComposer {
    return this._composer;
  }

  constructor(
    private ngZone: NgZone,
    @SkipSelf() private canvasStore: CanvasStore
  ) {
    super({});
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initComposer(
        this.canvasStore.selectors.internal$.pipe(distinctKeyMap('active'))
      );
    });
  }

  private readonly initComposer = this.effect<boolean>((active$) =>
    active$.pipe(
      withLatestFrom(this.canvasStore.selectors.renderer$),
      switchMap(([active, renderer]) => {
        if (active && renderer) {
          this._composer = new EffectComposer(renderer, this.renderTarget);
          this.ready.emit(this.composer);

          if (this.watchSizeChanged) {
            return this.canvasStore.selectors.internal$.pipe(
              distinctKeyMap('size'),
              tap(({ width, height }) => {
                this.ngZone.runOutsideAngular(() => {
                  this._composer.setSize(width, height);
                });
              })
            );
          }
        }

        return EMPTY;
      })
    )
  );
}
