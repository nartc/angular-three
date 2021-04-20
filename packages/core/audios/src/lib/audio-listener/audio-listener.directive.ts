import { CanvasStore, DestroyedService } from '@angular-three/core';
import { Directive, Input, OnInit, SkipSelf } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { AudioListener } from 'three';

@Directive({
  selector: 'ngt-audioListener',
  exportAs: 'ngtAudioListener',
  providers: [DestroyedService],
})
export class AudioListenerDirective implements OnInit {
  @Input() filter?: AudioNode;
  @Input() timeDelta?: number;

  private _listener!: AudioListener;

  constructor(
    @SkipSelf() private readonly canvasStore: CanvasStore,
    private readonly destroyed: DestroyedService
  ) {}

  ngOnInit() {
    this._listener = new AudioListener();

    if (this.filter) {
      this._listener.filter = this.filter;
    }

    if (this.timeDelta) {
      this._listener.timeDelta = this.timeDelta;
    }

    this.canvasStore.active$
      .pipe(takeUntil(this.destroyed))
      .subscribe((active) => {
        const { camera } = this.canvasStore.getImperativeState();
        if (active && camera) {
          camera.add(this.audioListener);
        }
      });
  }

  get audioListener(): AudioListener {
    return this._listener;
  }
}
