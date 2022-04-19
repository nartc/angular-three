import {
    addAfterCallback,
    addCallback,
    coerceNumberProperty,
    NgtComponentStore,
    NumberInput,
    tapEffect,
} from '@angular-three/core';
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
    @Input() set showPanel(showPanel: NumberInput) {
        this._showPanel = coerceNumberProperty(showPanel);
    }

    private node: HTMLElement;
    private _stats?: Stats;
    private _showPanel = 0;

    constructor(private zone: NgZone, @Inject(DOCUMENT) { body }: Document) {
        super();
        this.node = body;
    }

    get stats() {
        return this._stats;
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.effect<void>(
                tapEffect(() => {
                    if (this.parent) {
                        this.node = this.parent;
                    }

                    this._stats = Stats();
                    this._stats.showPanel(this._showPanel);
                    this.node.appendChild(this._stats.dom);

                    const beginCallbackCleanup = addCallback(() =>
                        this._stats!.begin()
                    );

                    const endCallbackCleanup = addAfterCallback(() =>
                        this._stats!.end()
                    );

                    return () => {
                        if (this._stats) {
                            this.node.removeChild(this._stats.dom);
                            beginCallbackCleanup();
                            endCallbackCleanup();
                        }
                    };
                })
            )();
        });
    }
}

@NgModule({
    declarations: [NgtStats],
    exports: [NgtStats],
})
export class NgtStatsModule {}
