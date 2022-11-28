import { NgtComponentStore } from '@angular-three/core';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

interface SobaProgressResult {
    errors: string[];
    active: boolean;
    progress: number;
    item: string;
    loaded: number;
    total: number;
}

@Injectable({ providedIn: 'root' })
export class SobaProgress extends NgtComponentStore<SobaProgressResult> {
    override initialize() {
        super.initialize();
        let saveLastTotalLoaded = 0;
        this.write({ active: false, errors: [] });

        THREE.DefaultLoadingManager.onStart = (item, loaded, total) => {
            this.write({
                active: true,
                item,
                loaded,
                total,
                progress: ((loaded - saveLastTotalLoaded) / (total - saveLastTotalLoaded)) * 100,
            });
        };

        THREE.DefaultLoadingManager.onLoad = () => {
            this.write({ active: false });
        };

        THREE.DefaultLoadingManager.onError = (url: string) => {
            this.write((state) => ({ errors: [...state.errors, url] }));
        };

        THREE.DefaultLoadingManager.onProgress = (item, loaded, total) => {
            if (loaded === total) {
                saveLastTotalLoaded = total;
            }
            this.write({
                active: true,
                item,
                loaded,
                total,
                progress: ((loaded - saveLastTotalLoaded) / (total - saveLastTotalLoaded)) * 100 || 100,
            });
        };
    }
}
