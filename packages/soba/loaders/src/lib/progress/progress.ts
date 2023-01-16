import { injectNgtDestroy, NgtRxStore } from '@angular-three/core';
import { DefaultLoadingManager } from 'three';

export function injectNgtsProgress() {
    const progress = new NgtRxStore<{
        errors: string[];
        active: boolean;
        progress: number;
        item: string;
        loaded: number;
        total: number;
    }>();
    progress.set({ errors: [], active: false, progress: 0, item: '', loaded: 0, total: 0 });
    const [, cdr] = injectNgtDestroy(() => {
        progress.ngOnDestroy();
    });
    let saveLastTotalLoaded = 0;

    DefaultLoadingManager.onStart = (item, loaded, total) => {
        progress.set({
            active: true,
            item,
            loaded,
            total,
            progress: ((loaded - saveLastTotalLoaded) / (total - saveLastTotalLoaded)) * 100,
        });
        cdr.detectChanges();
    };

    DefaultLoadingManager.onLoad = () => {
        progress.set({ active: false });
        cdr.detectChanges();
    };

    DefaultLoadingManager.onError = (url) => {
        progress.set({ errors: [...progress.get('errors'), url] });
        cdr.detectChanges();
    };

    DefaultLoadingManager.onProgress = (item, loaded, total) => {
        if (loaded === total) saveLastTotalLoaded = total;
        progress.set({
            item,
            loaded,
            total,
            progress: ((loaded - saveLastTotalLoaded) / (total - saveLastTotalLoaded)) * 100 || 100,
        });
        cdr.detectChanges();
    };

    return progress;
}
