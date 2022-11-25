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
import { NgtAnyCtor } from '../types';

export const NGT_ARGS = new InjectionToken<unknown[]>('NgtArgs');

export function injectArgs<TCtor extends NgtAnyCtor = NgtAnyCtor>(): ConstructorParameters<TCtor>;
export function injectArgs<TCtor extends NgtAnyCtor = NgtAnyCtor>(
    options: InjectOptions & { optional?: false }
): ConstructorParameters<TCtor>;
export function injectArgs<TCtor extends NgtAnyCtor = NgtAnyCtor>(
    options: InjectOptions & { optional?: true }
): ConstructorParameters<TCtor> | null;
export function injectArgs<TCtor extends NgtAnyCtor = NgtAnyCtor>(options: InjectOptions = {}) {
    return inject<ConstructorParameters<TCtor>>(NGT_ARGS, options);
}

@Directive({
    selector: '[args]',
    standalone: true,
})
export class NgtArgs {
    private readonly templateRef = inject(TemplateRef);
    private readonly vcr = inject(ViewContainerRef);

    private view?: EmbeddedViewRef<any>;

    @Input() set args(args: unknown[] | null) {
        if (!args) return;

        if (this.view) {
            this.view.destroy();
        }

        this.view = this.vcr.createEmbeddedView(
            this.templateRef,
            {},
            { injector: Injector.create({ providers: [{ provide: NGT_ARGS, useValue: args }] }) }
        );
    }
}
