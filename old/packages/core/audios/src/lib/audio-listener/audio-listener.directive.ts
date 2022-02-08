import {
  applyProps,
  NgtCanvasStore,
  NgtStore,
  zonelessRequestAnimationFrame,
} from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  Input,
  NgModule,
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

  constructor(private canvasStore: NgtCanvasStore) {
    super();
  }

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      this._listener = new THREE.AudioListener();
      const props = {
        filter: this.filter,
        timeDelta: this.timeDelta,
      };
      applyProps(this.listener, props);
      this.effect(this.canvasStore.ready$, () => {
        const camera = this.canvasStore.get('camera');
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
      });
    });
  }
}

@NgModule({
  declarations: [NgtAudioListener],
  exports: [NgtAudioListener],
})
export class NgtAudioListenerModule {}
