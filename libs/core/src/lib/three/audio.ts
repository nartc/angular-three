import { Directive, Input } from '@angular/core';
import { switchMap } from 'rxjs';
import * as THREE from 'three';
import {
  NgtObject,
  NgtObjectInputsState,
  provideNgtObject,
} from '../abstracts/object';
import type { AnyConstructor, BooleanInput, NumberInput } from '../types';
import { coerceBooleanProperty, coerceNumberProperty } from '../utils/coercion';
import { createNgtProvider } from '../utils/inject';

export interface NgtCommonAudioState<
  TAudioNode extends AudioNode = GainNode,
  TAudio extends THREE.Audio<TAudioNode> = THREE.Audio<TAudioNode>
> extends NgtObjectInputsState<TAudio> {
  listener: THREE.AudioListener;
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
  abstract get audioType(): AnyConstructor<TAudio>;

  @Input() set listener(listener: THREE.AudioListener) {
    this.set({ listener });
  }

  @Input() set buffer(buffer: null | AudioBuffer) {
    this.set({ buffer });
  }

  @Input() set detune(detune: NumberInput) {
    this.set({ detune: coerceNumberProperty(detune) });
  }

  @Input() set loop(loop: BooleanInput) {
    this.set({ loop: coerceBooleanProperty(loop) });
  }

  @Input() set loopStart(loopStart: NumberInput) {
    this.set({ loopStart: coerceNumberProperty(loopStart) });
  }

  @Input() set loopEnd(loopEnd: NumberInput) {
    this.set({ loopEnd: coerceNumberProperty(loopEnd) });
  }

  @Input() set offset(offset: NumberInput) {
    this.set({ offset: coerceNumberProperty(offset) });
  }

  @Input() set playbackRate(playbackRate: NumberInput) {
    this.set({ playbackRate: coerceNumberProperty(playbackRate) });
  }

  @Input() set isPlaying(isPlaying: BooleanInput) {
    this.set({ isPlaying: coerceBooleanProperty(isPlaying) });
  }

  @Input() set hasPlaybackControl(hasPlaybackControl: BooleanInput) {
    this.set({
      hasPlaybackControl: coerceBooleanProperty(hasPlaybackControl),
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

  @Input() set duration(duration: NumberInput) {
    this.set({ duration: coerceNumberProperty(duration) });
  }

  @Input() set autoplay(autoplay: BooleanInput) {
    this.set({ autoplay: coerceBooleanProperty(autoplay) });
  }

  override initTrigger$ = this.select((s) => s.listener).pipe(
    switchMap(() => this.instanceArgs$)
  );

  override instanceInitFn(): TAudio {
    const listener = this.get((s) => s.listener);

    if (!listener) {
      throw new Error(
        `[NgtCommonAudio] Cannot initialize ${this.audioType} without "THREE.AudioListener"`
      );
    }

    return new this.audioType(listener);
  }

  override preInit() {
    super.preInit();
    this.set((s) => ({
      buffer: s.buffer || null,
      detune: s.detune || 0,
      loop: s.loop || false,
      loopStart: s.loopStart || 0,
      loopEnd: s.loopEnd || 0,
      offset: s.offset || 0,
      duration: s.duration || undefined,
      playbackRate: s.playbackRate || 1,
      isPlaying: s.isPlaying || false,
      hasPlaybackControl: s.hasPlaybackControl || true,
      sourceType: s.sourceType || 'empty',
      source: s.source || null,
      filters: s.filters || [],
    }));
  }

  protected override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      autoplay: true,
      buffer: false,
      detune: false,
      loop: false,
      loopStart: false,
      loopEnd: false,
      offset: false,
      duration: true,
      playbackRate: false,
      isPlaying: false,
      hasPlaybackControl: false,
      sourceType: false,
      source: false,
      filters: false,
    };
  }
}

export const provideNgtCommonAudio = createNgtProvider(
  NgtCommonAudio,
  provideNgtObject
);
