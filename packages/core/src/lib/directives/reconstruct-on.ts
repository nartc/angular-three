import { Directive, EmbeddedViewRef, inject, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgtStore } from '../stores/store';
import type { NgtState } from '../types';

@Directive({
    selector: '[reconstructOn]',
    standalone: true,
})
export class NgtReconstructOn implements OnDestroy {
    private readonly store = inject(NgtStore);
    private readonly templateRef = inject(TemplateRef);
    private readonly vcr = inject(ViewContainerRef);

    private view?: EmbeddedViewRef<unknown>;
    private subscription?: Subscription;
    private rAF?: ReturnType<typeof requestAnimationFrame>;

    @Input() set reconstructOn(fields: (keyof NgtState)[] | '') {
        queueMicrotask(() => {
            this.destroy();
            const selectors = Array.isArray(fields)
                ? fields.reduce((acc, field) => {
                      acc[field] = this.store.select((s) => s[field]);
                      return acc;
                  }, {} as Record<string, Observable<any>>)
                : (s: NgtState) => s;

            this.subscription = this.store.select(selectors as any, { debounce: true }).subscribe(() => {
                this.reconstructView();
            });
        });
    }

    private reconstructView() {
        if (this.view && !this.view.destroyed) {
            this.view.destroy();
        }
        this.view = this.vcr.createEmbeddedView(this.templateRef);
        this.view.detectChanges();
    }

    private destroy() {
        if (this.view && !this.view.destroyed) {
            this.view.destroy();
        }
        this.subscription?.unsubscribe();
    }

    ngOnDestroy() {
        this.destroy();
    }
}
