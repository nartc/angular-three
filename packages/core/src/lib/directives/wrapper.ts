import {
    Directive,
    EmbeddedViewRef,
    inject,
    InjectionToken,
    InjectOptions,
    Injector,
    Input,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import type { NgtAnyFunction, NgtAnyRecord } from '../types';

export const NGT_WRAPPER = new InjectionToken('NgtWrapper');
export const NGT_IS_WRAPPER = new InjectionToken('is NgtWrapper');

export function injectWrapper(): NgtAnyFunction<NgtAnyRecord>;
export function injectWrapper(options: InjectOptions & { optional?: false }): NgtAnyFunction<NgtAnyRecord>;
export function injectWrapper(options: InjectOptions & { optional?: true }): NgtAnyFunction<NgtAnyRecord> | null;
export function injectWrapper(options: InjectOptions = {}) {
    return inject(NGT_WRAPPER, options);
}

export function injectIsWrapper(): boolean;
export function injectIsWrapper(options: InjectOptions & { optional?: false }): boolean;
export function injectIsWrapper(options: InjectOptions & { optional?: true }): boolean | null;
export function injectIsWrapper(options: InjectOptions = {}) {
    return inject(NGT_IS_WRAPPER, options);
}

export function provideIsWrapper() {
    return { provide: NGT_IS_WRAPPER, useValue: true };
}

@Directive({
    selector: '[wrapper]',
    standalone: true,
})
export class NgtWrapper {
    private readonly templateRef = inject(TemplateRef);
    private readonly vcr = inject(ViewContainerRef);

    private view?: EmbeddedViewRef<unknown>;
    private contentTemplateView?: EmbeddedViewRef<unknown>;

    @Input() set wrapper(wrapper: NgtAnyRecord) {
        let injected = false;
        if (this.view) {
            this.view.destroy();
        }

        if (this.contentTemplateView) {
            this.contentTemplateView.destroy();
        }

        this.view = this.vcr.createEmbeddedView(
            this.templateRef,
            { ready: true },
            {
                injector: Injector.create({
                    providers: [
                        {
                            provide: NGT_WRAPPER,
                            useValue: () => {
                                if (!injected) {
                                    injected = true;
                                    return wrapper;
                                }

                                return null;
                            },
                        },
                    ],
                }),
            }
        );
        this.view.markForCheck();
    }
}
