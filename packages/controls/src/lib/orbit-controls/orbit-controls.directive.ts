import { CanvasStore, DestroyedService } from '@angular-three/core';
import {
  Directive,
  EventEmitter,
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
    @SkipSelf() private readonly canvasStore: CanvasStore,
    private readonly destroyed: DestroyedService
  ) {}

  private _controls?: OrbitControls;

  ngOnInit() {
    this.canvasStore.active$
      .pipe(takeUntil(this.destroyed))
      .subscribe((active) => {
        const { camera, renderer } = this.canvasStore.getImperativeState();
        if (active && camera && renderer) {
          this._controls = new OrbitControls(camera, renderer.domElement);
          this.ready.emit(this.controls);
        }
      });
  }

  get controls(): OrbitControls | undefined {
    return this._controls;
  }
}
