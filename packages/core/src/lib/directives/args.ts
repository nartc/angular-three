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
import { isObservable, Observable, Subscription } from 'rxjs';
import { NgtAnyCtor } from '../types';

export const NGT_ARGS = new InjectionToken<unknown[]>('NgtArgs');

export function injectArgs<TCtor extends NgtAnyCtor = NgtAnyCtor>(): () => ConstructorParameters<TCtor>;
export function injectArgs<TCtor extends NgtAnyCtor = NgtAnyCtor>(
    options: InjectOptions & { optional?: false }
): () => ConstructorParameters<TCtor>;
export function injectArgs<TCtor extends NgtAnyCtor = NgtAnyCtor>(
    options: InjectOptions & { optional?: true }
): (() => ConstructorParameters<TCtor>) | null;
export function injectArgs<TCtor extends NgtAnyCtor = NgtAnyCtor>(options: InjectOptions = {}) {
    return inject<() => ConstructorParameters<TCtor>>(NGT_ARGS, options);
}

@Directive({
    selector: '[args]',
    standalone: true,
})
export class NgtArgs {
    private readonly templateRef = inject(TemplateRef);
    private readonly vcr = inject(ViewContainerRef);

    private view?: EmbeddedViewRef<any>;
    private subscription?: Subscription;
    private rAF?: ReturnType<typeof requestAnimationFrame>;

    @Input() set args(args: Observable<Array<unknown>> | Array<unknown>) {
        if (isObservable(args)) {
            this.destroyView();
            this.subscription?.unsubscribe();
            if (this.rAF) {
                cancelAnimationFrame(this.rAF);
            }
            this.rAF = requestAnimationFrame(() => {
                this.subscription = args.subscribe((results) => {
                    let injected = false;
                    this.destroyView();
                    this.view = this.vcr.createEmbeddedView(
                        this.templateRef,
                        {},
                        {
                            injector: Injector.create({
                                providers: [
                                    {
                                        provide: NGT_ARGS,
                                        useValue: () => {
                                            if (!injected) {
                                                injected = true;
                                                return results;
                                            }
                                            return null;
                                        },
                                    },
                                ],
                            }),
                        }
                    );
                    this.view.markForCheck();
                });
            });
        } else {
            if (args.length === 1 && args[0] === null) {
                return;
            }
            let injected = false;

            this.destroyView();
            this.view = this.vcr.createEmbeddedView(
                this.templateRef,
                {},
                {
                    injector: Injector.create({
                        providers: [
                            {
                                provide: NGT_ARGS,
                                useValue: () => {
                                    if (!injected) {
                                        injected = true;
                                        return args;
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

    private destroyView() {
        if (this.view) {
            this.view.destroy();
        }
    }
}
