import { addAfterEffect, addEffect, NgtInjectedRef, NgtRxStore, startWithUndefined } from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import { Directive, inject, Input, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import * as Stats from 'stats.js';

@Directive({
    selector: 'ngts-stats',
    standalone: true,
})
export class NgtsStats extends NgtRxStore implements OnInit {
    readonly #document = inject(DOCUMENT);
    readonly #stats = new Stats();

    @Input() set showPanel(showPanel: number) {
        this.set({ showPanel: showPanel === undefined ? this.get('showPanel') : showPanel });
    }

    @Input() set parent(parent: NgtInjectedRef<HTMLElement>) {
        this.set({ parent });
    }

    @Input() set classes(classes: string) {
        this.set({ classes });
    }

    override initialize(): void {
        super.initialize();
        this.set({ showPanel: 0 });
    }

    ngOnInit() {
        this.effect(
            combineLatest([
                this.select('showPanel'),
                this.select('parent').pipe(startWithUndefined()),
                this.select('classes').pipe(startWithUndefined()),
            ]),
            ([showPanel, parent, classes]) => {
                const node = parent && parent.nativeElement ? parent.nativeElement : this.#document.body;
                this.#stats.showPanel(showPanel);
                node.appendChild(this.#stats.dom);
                if (classes) {
                    this.#stats.dom.classList.add(...classes.split(' ').filter((cls: string) => cls));
                }
                const begin = addEffect(() => this.#stats.begin());
                const end = addAfterEffect(() => this.#stats.end());
                return () => {
                    node.removeChild(this.#stats.dom);
                    begin();
                    end();
                };
            }
        );
    }
}
