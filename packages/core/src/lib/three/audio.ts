import { Directive, Inject, Input, NgZone, OnInit } from '@angular/core';
import * as THREE from 'three';
import {
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObject3dController,
} from '../controllers/object-3d.controller';
import { AnyConstructor } from '../models';

@Directive()
export abstract class NgtCommonAudio<
  TAudioNode extends AudioNode = GainNode,
  TAudio extends THREE.Audio<TAudioNode> = THREE.Audio<TAudioNode>
> implements OnInit
{
  @Input() listener!: THREE.AudioListener;

  #audioArgs: unknown[] = [];
  protected set audioArgs(v: unknown | unknown[]) {
    this.#audioArgs = Array.isArray(v) ? v : [v];
    this.ngZone.runOutsideAngular(() => {
      this.objectController.init();
    });
  }

  constructor(
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    protected objectController: NgtObject3dController,
    protected ngZone: NgZone
  ) {}

  abstract audioType: AnyConstructor<TAudio>;

  #audio!: TAudio;

  ngOnInit() {
    this.objectController.initFn = () => {
      return this.ngZone.runOutsideAngular(() => {
        if (!this.listener) {
          throw new Error('Cannot initialize Audio without an AudioListener');
        }

        this.#audio = new this.audioType(this.listener, ...this.#audioArgs);
        return this.#audio;
      });
    };
    this.ngZone.runOutsideAngular(() => {
      if (!this.#audio) {
        this.objectController.init();
      }
    });
  }

  get audio() {
    return this.#audio;
  }
}
