import { AnyConstructor, ThreeObject3d } from '@angular-three/core';
import { Directive, Input, Optional, SkipSelf } from '@angular/core';
import { Audio, Object3D } from 'three';
import { AudioListenerDirective } from '../audio-listener';

@Directive()
export abstract class ThreeAudio<
  TAudioNode extends AudioNode = GainNode,
  TAudio extends Audio<TAudioNode> = Audio<TAudioNode>
> {
  @Input() object3d?: Object3D;

  constructor(
    @Optional()
    @SkipSelf()
    private readonly listenerDirective?: AudioListenerDirective,
    @Optional()
    @SkipSelf()
    protected readonly parentObjectDirective?: ThreeObject3d
  ) {}

  abstract audioType: AnyConstructor<TAudio>;

  private _audio?: TAudio;

  ngOnInit() {
    if (!this.listenerDirective) {
      console.error('AudioListener must exist to initialize Audio');
      return;
    }

    this._audio = new this.audioType(this.listenerDirective.audioListener);

    if (this.object3d) {
      this.object3d.add(this.audio!);
      return;
    }

    if (this.parentObjectDirective) {
      this.parentObjectDirective.object3d.add(this.audio!);
    }
  }

  get audio(): TAudio | undefined {
    return this._audio;
  }
}
