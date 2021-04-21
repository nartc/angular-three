import {
  AnimationLoopParticipant,
  AnimationStore,
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
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

@Directive({
  selector: 'ngt-flyControls',
  exportAs: 'ngtFlyControls',
  providers: [DestroyedService],
})
export class FlyControlsDirective
  extends AnimationLoopParticipant<FlyControls>
  implements OnInit {
  @Output() ready = new EventEmitter<FlyControls>();

  constructor(
    private readonly _ngZone: NgZone,
    @SkipSelf() private readonly canvasStore: CanvasStore,
    @SkipSelf() private readonly _animationStore: AnimationStore,
    private readonly destroyed: DestroyedService
  ) {
    super(_animationStore, _ngZone);
  }

  private _controls?: FlyControls;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.canvasStore.active$
        .pipe(
          runOutsideAngular(this.ngZone, (active, run) => {
            const { camera, renderer } = this.canvasStore.getImperativeState();
            if (active && camera && renderer) {
              this._controls = new FlyControls(camera, renderer.domElement);
              run(() => {
                this.ready.emit(this.controls);
              });
              this.participate(this.controls!);
            }
          }),
          takeUntil(this.destroyed)
        )
        .subscribe();
    });
  }

  get controls(): FlyControls | undefined {
    return this._controls;
  }
}
