import { Directive, Input, OnInit } from '@angular/core';
import * as THREE from 'three';
import { AnyConstructor } from '../models';
import { NgtObject3d } from './object-3d';

@Directive()
export abstract class NgtCommonAudio<
    TAudioNode extends AudioNode = GainNode,
    TAudio extends THREE.Audio<TAudioNode> = THREE.Audio<TAudioNode>
  >
  extends NgtObject3d<TAudio>
  implements OnInit
{
  @Input() listener!: THREE.AudioListener;

  private _extraArgs: unknown[] = [];
  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
    this.ngZone.runOutsideAngular(() => {
      this.init();
    });
  }

  abstract audioType: AnyConstructor<TAudio>;

  private _audio!: TAudio;

  ngOnInit() {
    if (!this.object3d) {
      this.init();
    }
  }

  protected initObject() {
    if (!this.listener) {
      throw new Error('Cannot initialize Audio without an AudioListener');
    }

    this._audio = new this.audioType(this.listener, ...this._extraArgs);
  }

  get object3d(): TAudio {
    return this._audio;
  }
}
