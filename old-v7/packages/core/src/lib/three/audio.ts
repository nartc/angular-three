import { Directive, Input } from '@angular/core';
import { switchMap } from 'rxjs';
import * as THREE from 'three';
import { NgtObject, provideNgtObject } from '../abstracts/object';
import { NgtObjectInputsState } from '../abstracts/object-inputs';
import { NgtRef } from '../ref';
import { skipFirstUndefined } from '../stores/skip-first-undefined';
import type { NgtAnyConstructor, NgtBooleanInput, NgtNumberInput } from '../types';
import { coerceBoolean, coerceNumber } from '../utils/coercion';
import { createNgtProvider } from '../utils/inject';
import { is } from '../utils/is';

export interface NgtCommonAudioState<
  TAudioNode extends AudioNode = GainNode,
  TAudio extends THREE.Audio<TAudioNode> = THREE.Audio<TAudioNode>
> extends NgtObjectInputsState<TAudio> {
  listener: THREE.AudioListener | NgtRef<THREE.AudioListener>;
  buffer: null | AudioBuffer;
  detune: number;
  loop: boolean;
  loopStart: number;
  loopEnd: number;
  offset: number;
  playbackRate: number;
  isPlaying: boolean;
  hasPlaybackControl: boolean;
  sourceType: string;
  source: null | AudioBufferSourceNode;
  filters: AudioNode[];
  duration?: number;
  autoplay?: boolean;
}

@Directive()
export abstract class NgtCommonAudio<
  TAudioNode extends AudioNode = GainNode,
  TAudio extends THREE.Audio<TAudioNode> = THREE.Audio<TAudioNode>
> extends NgtObject<TAudio, NgtCommonAudioState<TAudioNode, TAudio>> {
  abstract get audioType(): NgtAnyConstructor<TAudio>;

  @Input() set listener(listener: THREE.AudioListener | NgtRef<THREE.AudioListener>) {
    this.set({ listener });
  }

  @Input() set buffer(buffer: null | AudioBuffer) {
    this.set({ buffer });
  }

  @Input() set detune(detune: NgtNumberInput) {
    this.set({ detune: coerceNumber(detune) });
  }

  @Input() set loop(loop: NgtBooleanInput) {
    this.set({ loop: coerceBoolean(loop) });
  }

  @Input() set loopStart(loopStart: NgtNumberInput) {
    this.set({ loopStart: coerceNumber(loopStart) });
  }

  @Input() set loopEnd(loopEnd: NgtNumberInput) {
    this.set({ loopEnd: coerceNumber(loopEnd) });
  }

  @Input() set offset(offset: NgtNumberInput) {
    this.set({ offset: coerceNumber(offset) });
  }

  @Input() set playbackRate(playbackRate: NgtNumberInput) {
    this.set({ playbackRate: coerceNumber(playbackRate) });
  }

  @Input() set isPlaying(isPlaying: NgtBooleanInput) {
    this.set({ isPlaying: coerceBoolean(isPlaying) });
  }

  @Input() set hasPlaybackControl(hasPlaybackControl: NgtBooleanInput) {
    this.set({
      hasPlaybackControl: coerceBoolean(hasPlaybackControl),
    });
  }

  @Input() set sourceType(sourceType: string) {
    this.set({ sourceType });
  }

  @Input() set source(source: null | AudioBufferSourceNode) {
    this.set({ source });
  }

  @Input() set filters(filters: AudioNode[]) {
    this.set({ filters });
  }

  @Input() set duration(duration: NgtNumberInput) {
    this.set({ duration: coerceNumber(duration) });
  }

  @Input() set autoplay(autoplay: NgtBooleanInput) {
    this.set({ autoplay: coerceBoolean(autoplay) });
  }

  override initTrigger$ = this.select((s) => s.listener).pipe(
    skipFirstUndefined(),
    switchMap(() => this.instanceArgs$)
  );

  override instanceInitFn(): TAudio {
    const listener = this.getState((s) => s.listener);

    if (!listener) {
      throw new Error(`[NgtCommonAudio] Cannot initialize ${this.audioType} without "THREE.AudioListener"`);
    }

    return new this.audioType(is.ref(listener) ? listener.value : listener);
  }

  override initialize() {
    super.initialize();
    this.set({
      buffer: null,
      detune: 0,
      loop: false,
      loopStart: 0,
      loopEnd: 0,
      offset: 0,
      duration: undefined,
      playbackRate: 1,
      isPlaying: false,
      hasPlaybackControl: true,
      sourceType: 'empty',
      source: null,
      filters: [],
    });
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'autoplay',
      'buffer',
      'detune',
      'loop',
      'loopStart',
      'loopEnd',
      'offset',
      'duration',
      'playbackRate',
      'isPlaying',
      'hasPlaybackControl',
      'sourceType',
      'source',
      'filters',
    ];
  }
}

export const provideNgtCommonAudio = createNgtProvider(NgtCommonAudio, provideNgtObject);
