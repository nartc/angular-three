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

export const NGT_WRAPPER = new InjectionToken('NgtWrapper');
export const NGT_TEST_WRAPPER = new InjectionToken('Test');
export function injectWrapper(): any;
export function injectWrapper(options: InjectOptions & { optional?: false }): any;
export function injectWrapper(options: InjectOptions & { optional?: true }): any | null;
export function injectWrapper(options: InjectOptions = {}) {
    return inject(NGT_WRAPPER, options);
}

@Directive({
    selector: '[wrapper]',
    standalone: true,
})
export class NgtWrapper {
    private readonly templateRef = inject(TemplateRef);
    private readonly vcr = inject(ViewContainerRef);

    private view?: EmbeddedViewRef<any>;

    @Input() set wrapper(wrapper: any) {
        if (this.view) {
            this.view.destroy();
        }

        this.view = this.vcr.createEmbeddedView(
            this.templateRef,
            {},
            { injector: Injector.create({ providers: [{ provide: NGT_WRAPPER, useValue: wrapper }] }) }
        );
    }
}
