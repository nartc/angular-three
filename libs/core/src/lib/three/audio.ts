import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import {
    NgtObject,
    NgtObjectInputsState,
    NgtPreObjectInit,
} from '../abstracts/object';
import { tapEffect } from '../stores/component-store';
import type { AnyConstructor, BooleanInput } from '../types';
import { coerceBooleanProperty } from '../utils/coercion';

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

    @Input() set detune(detune: number) {
        this.set({ detune });
    }

    @Input() set loop(loop: BooleanInput) {
        this.set({ loop: coerceBooleanProperty(loop) });
    }

    @Input() set loopStart(loopStart: number) {
        this.set({ loopStart });
    }

    @Input() set loopEnd(loopEnd: number) {
        this.set({ loopEnd });
    }

    @Input() set offset(offset: number) {
        this.set({ offset });
    }

    @Input() set playbackRate(playbackRate: number) {
        this.set({ playbackRate });
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

    @Input() set duration(duration: number) {
        this.set({ duration });
    }

    @Input() set autoplay(autoplay: BooleanInput) {
        this.set({ autoplay: coerceBooleanProperty(autoplay) });
    }

    protected override objectInitFn(): TAudio {
        const { listener } = this.get();

        if (!listener) {
            throw new Error(
                `[NgtCommonAudio] Cannot initialize ${this.audioType} without "THREE.AudioListener"`
            );
        }

        return new this.audioType(listener);
    }

    protected override preInit() {
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

    protected override get preObjectInit(): NgtPreObjectInit {
        return (initFn) => {
            this.effect<THREE.AudioListener>(
                tapEffect(() => {
                    initFn();
                })
            )(this.select((s) => s.listener));
        };
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
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
