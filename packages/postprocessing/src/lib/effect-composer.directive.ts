import { CanvasStore, DestroyedService } from '@angular-three/core';
import { Directive, Input, OnInit, SkipSelf } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import type { WebGLRenderTarget } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

@Directive({
  selector: 'ngt-effectComposer',
  exportAs: 'ngtEffectComposer',
  providers: [DestroyedService],
})
export class EffectComposerDirective implements OnInit {
  @Input() renderTarget?: WebGLRenderTarget;

  constructor(
    @SkipSelf() private readonly canvasStore: CanvasStore,
    private readonly destroyed: DestroyedService
  ) {}

  private _composer!: EffectComposer;

  ngOnInit() {
    this.canvasStore.active$
      .pipe(takeUntil(this.destroyed))
      .subscribe((active) => {
        const { renderer } = this.canvasStore.getImperativeState();
        if (active && renderer) {
          this._composer = new EffectComposer(renderer, this.renderTarget);
        }
      });
  }

  get composer(): EffectComposer {
    return this._composer;
  }
}
