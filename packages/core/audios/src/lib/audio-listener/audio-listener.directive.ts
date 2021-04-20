import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input, OnInit } from '@angular/core';
import { AudioListener } from 'three';

@Directive({
  selector: 'ngt-audioListener',
  exportAs: 'ngtAudioListener',
  providers: [{ provide: ThreeObject3d, useExisting: AudioListener }],
})
export class AudioListenerDirective
  extends ThreeObject3d<AudioListener>
  implements OnInit {
  @Input() filter?: AudioNode;
  @Input() timeDelta?: number;

  private _listener!: AudioListener;

  ngOnInit() {
    this.init();
  }

  protected initObject() {
    this._listener = new AudioListener();
  }

  get object3d(): AudioListener {
    return this._listener;
  }
}
