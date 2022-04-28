import { NgtInstance, provideInstanceRef } from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ngt-value-attribute[value]',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideInstanceRef(NgtValueAttribute)],
})
export class NgtValueAttribute extends NgtInstance<any> {
    @Input() set value(value: any) {
        this.zone.runOutsideAngular(() => {
            if (this.initSubscription) {
                this.initSubscription.unsubscribe();
            }

            this.initSubscription = this.onCanvasReady(
                this.store.ready$,
                () => {
                    this.prepareInstance(value);
                    return () => {
                        this.initSubscription?.unsubscribe();
                    };
                },
                true
            );
        });
    }

    private initSubscription?: Subscription;
}

@NgModule({
    declarations: [NgtValueAttribute],
    exports: [NgtValueAttribute],
})
export class NgtValueAttributeModule {}
