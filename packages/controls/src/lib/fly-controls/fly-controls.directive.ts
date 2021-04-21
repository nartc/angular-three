import { CanvasStore, DestroyedService } from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  NgZone,
  OnInit,
  Output,
  SkipSelf,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

@Directive({
  selector: 'ngt-flyControls',
  exportAs: 'ngtFlyControls',
  providers: [DestroyedService],
})
export class FlyControlsDirective implements OnInit {
  @Output() ready = new EventEmitter<FlyControls>();

  constructor(
    private readonly ngZone: NgZone,
    @SkipSelf() private readonly canvasStore: CanvasStore,
    private readonly destroyed: DestroyedService
  ) {}

  private _controls?: FlyControls;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.canvasStore.active$
        .pipe(takeUntil(this.destroyed))
        .subscribe((active) => {
          const { camera, renderer } = this.canvasStore.getImperativeState();
          if (active && camera && renderer) {
            this._controls = new FlyControls(camera, renderer.domElement);
            this.ngZone.run(() => {
              this.ready.emit(this.controls);
            });
          }
        });
    });
  }

  get controls(): FlyControls | undefined {
    return this._controls;
  }
}
