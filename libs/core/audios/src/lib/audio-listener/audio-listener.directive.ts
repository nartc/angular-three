import { applyProps, NgtCanvasStore, NgtStore } from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  Input,
  NgModule,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-audio-listener',
  exportAs: 'ngtAudioListener',
})
export class NgtAudioListener extends NgtStore implements OnInit {
  @Input() filter?: AudioNode;
  @Input() timeDelta?: number;

  @Output() ready = new EventEmitter<THREE.AudioListener>();

  private _listener!: THREE.AudioListener;
  get listener() {
    return this._listener;
  }

  constructor(private zone: NgZone, private canvasStore: NgtCanvasStore) {
    super();
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(
        this.canvasStore.ready$,
        () => {
          this._listener = new THREE.AudioListener();
          applyProps(this.listener, {
            filter: this.filter,
            timeDelta: this.timeDelta,
          });
          const camera = this.canvasStore.get((s) => s.camera);
          if (camera) {
            camera.add(this.listener);
            this.ready.emit(this.listener);
          }

          return () => {
            if (camera && this.listener) {
              this.listener.clear();
              camera.remove(this.listener);
            }
          };
        },
        true
      );
    });
  }
}

@NgModule({
  declarations: [NgtAudioListener],
  exports: [NgtAudioListener],
})
export class NgtAudioListenerModule {}
