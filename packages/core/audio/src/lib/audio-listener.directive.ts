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
import { takeUntil } from 'rxjs/operators';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-audio-listener',
  exportAs: 'ngtAudioListener',
  providers: [DestroyedService],
})
export class NgtAudioListener implements OnInit {
  @Input() filter?: AudioNode;
  @Input() timeDelta?: number;

  @Output() ready = new EventEmitter<THREE.AudioListener>();

  private _listener!: THREE.AudioListener;

  constructor(
    @SkipSelf() private canvasStore: CanvasStore,
    private destroyed: DestroyedService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this._listener = new THREE.AudioListener();

      if (this.filter) {
        this._listener.filter = this.filter;
      }

      if (this.timeDelta) {
        this._listener.timeDelta = this.timeDelta;
      }

      this.canvasStore.selectors.internal$
        .pipe(takeUntil(this.destroyed))
        .subscribe(({ active }) => {
          this.ngZone.runOutsideAngular(() => {
            const { camera } = this.canvasStore.getImperativeState();
            if (active && camera) {
              camera.add(this.audioListener);
              this.ready.emit(this.audioListener);
            }
          });
        });
    });
  }

  get audioListener(): THREE.AudioListener {
    return this._listener;
  }
}
