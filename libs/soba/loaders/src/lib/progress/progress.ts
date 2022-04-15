import { NgtComponentStore } from '@angular-three/core';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

interface NgtSobaProgressResult {
    errors: string[];
    active: boolean;
    progress: number;
    item: string;
    loaded: number;
    total: number;
}

@Injectable()
export class NgtSobaProgress extends NgtComponentStore<NgtSobaProgressResult> {
    constructor() {
        super();
        let saveLastTotalLoaded = 0;
        this.set({ active: false, errors: [] });
        THREE.DefaultLoadingManager.onStart = (item, loaded, total) => {
            this.set({
                active: true,
                item,
                loaded,
                total,
                progress:
                    ((loaded - saveLastTotalLoaded) /
                        (total - saveLastTotalLoaded)) *
                    100,
            });
        };

        THREE.DefaultLoadingManager.onLoad = () => {
            this.set({ active: false });
        };

        THREE.DefaultLoadingManager.onError = (url: string) => {
            this.set((state) => ({ errors: [...state.errors, url] }));
        };

        THREE.DefaultLoadingManager.onProgress = (item, loaded, total) => {
            if (loaded === total) {
                saveLastTotalLoaded = total;
            }
            this.set({
                active: true,
                item,
                loaded,
                total,
                progress:
                    ((loaded - saveLastTotalLoaded) /
                        (total - saveLastTotalLoaded)) *
                        100 || 100,
            });
        };
    }
}
