import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtObject, NgtObjectState } from '../abstracts/object';
import type { AnyConstructor } from '../types';

export interface NgtCommonAudioState<
    TAudioNode extends AudioNode = GainNode,
    TAudio extends THREE.Audio<TAudioNode> = THREE.Audio<TAudioNode>
> extends NgtObjectState<TAudio> {
    listener: THREE.AudioListener;
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

    protected override objectInitFn(): TAudio {
        const { listener } = this.get();
        if (!listener) {
            throw new Error(
                `[NgtCommonAudio] Cannot initialize ${this.audioType} without "THREE.AudioListener"`
            );
        }

        return new this.audioType(listener);
    }

    override ngOnInit() {
        this.init();
        super.ngOnInit();
    }

    protected override get subInputs(): Record<string, boolean> {
        return { listener: false };
    }
}
