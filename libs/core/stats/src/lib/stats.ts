import { NgtComponentStore, NgtStore } from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    NgModule,
    NgZone,
    OnInit,
} from '@angular/core';
import Stats from 'three/examples/jsm/libs/stats.module';

@Component({
    selector: 'ngt-stats',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtStats extends NgtComponentStore implements OnInit {
    @Input() parent?: HTMLElement;

    private node: HTMLElement;
    private stats?: Stats;

    constructor(
        private zone: NgZone,
        private store: NgtStore,
        @Inject(DOCUMENT) { body }: Document
    ) {
        super();
        this.node = body;
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(
                this.store.ready$,
                () => {
                    if (this.parent) {
                        this.node = this.parent;
                    }

                    this.stats = Stats();
                    this.node.appendChild(this.stats.dom);
                    const animationUuid = this.store.registerBeforeRender({
                        callback: this.stats.update.bind(this.stats),
                    });
                    return () => {
                        if (this.stats) {
                            this.store.unregisterBeforeRender(animationUuid);
                            this.stats.end();
                            this.node.removeChild(this.stats.dom);
                        }
                    };
                },
                true
            );
        });
    }
}

@NgModule({
    declarations: [NgtStats],
    exports: [NgtStats],
})
export class NgtStatsModule {}
