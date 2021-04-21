import {
  CanvasStore,
  DestroyedService,
  runOutsideAngular,
} from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  NgZone,
  OnInit,
  Output,
  SkipSelf,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Directive({
  selector: 'ngt-orbitControls',
  exportAs: 'ngtOrbitControls',
  providers: [DestroyedService],
})
export class OrbitControlsDirective implements OnInit {
  @Output() ready = new EventEmitter<OrbitControls>();

  constructor(
    private readonly ngZone: NgZone,
    @SkipSelf() private readonly canvasStore: CanvasStore,
    private readonly destroyed: DestroyedService
  ) {}

  private _controls?: OrbitControls;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.canvasStore.active$
        .pipe(
          runOutsideAngular(this.ngZone, (active, run) => {
            const { camera, renderer } = this.canvasStore.getImperativeState();
            if (active && camera && renderer) {
              this._controls = new OrbitControls(camera, renderer.domElement);
              run(() => {
                this.ready.emit(this.controls);
              });
            }
          }),
          takeUntil(this.destroyed)
        )
        .subscribe();
    });
  }

  get controls(): OrbitControls | undefined {
    return this._controls;
  }
}
