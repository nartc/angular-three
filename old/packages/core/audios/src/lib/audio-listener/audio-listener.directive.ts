import { applyProps, EnhancedRxState, NgtStore } from '@angular-three/core';
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
export class NgtAudioListener extends EnhancedRxState implements OnInit {
  @Input() filter?: AudioNode;
  @Input() timeDelta?: number;

  @Output() ready = new EventEmitter<THREE.AudioListener>();

  #listener!: THREE.AudioListener;
  get listener() {
    return this.#listener;
  }

  constructor(private store: NgtStore) {
    super();
  }

  ngOnInit() {
    this.#listener = new THREE.AudioListener();
    const props = {
      filter: this.filter,
      timeDelta: this.timeDelta,
    };
    applyProps(this.listener, props);
    this.holdEffect(this.store.select('ready'), (ready) => {
      const camera = this.store.get('camera');
      if (ready && camera) {
        camera.add(this.listener);
        this.ready.emit(this.listener);
      }

      return () => {
        if (ready && camera) {
          this.listener.clear();
          camera.remove(this.listener);
        }
      };
    });
  }
}

@NgModule({
  declarations: [NgtAudioListener],
  exports: [NgtAudioListener],
})
export class NgtAudioListenerModule {}
