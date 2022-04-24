import { Directive, Input, NgModule, Optional, Self } from '@angular/core';
import { takeUntil } from 'rxjs';
import { NgtObject, NgtObjectInputs } from '../abstracts/object';

@Directive({
    selector:
        '[ngtObjectOutputs],[ngtObjectInputs],[ngtObjectInputs][ngtObjectOutputs]',
})
export class NgtObjectPassThrough {
    @Input() set ngtObjectOutputs(wrapper: unknown) {
        this.assertWrapper(wrapper);

        if (wrapper.click.observed) {
            this.host.click
                .pipe(takeUntil(wrapper.destroy$))
                .subscribe(wrapper.click.emit.bind(wrapper.click));
        }

        if (wrapper.contextmenu.observed) {
            this.host.contextmenu
                .pipe(takeUntil(wrapper.destroy$))
                .subscribe(wrapper.contextmenu.emit.bind(wrapper.contextmenu));
        }

        if (wrapper.dblclick.observed) {
            this.host.dblclick
                .pipe(takeUntil(wrapper.destroy$))
                .subscribe(wrapper.dblclick.emit.bind(wrapper.dblclick));
        }

        if (wrapper.pointerup.observed) {
            this.host.pointerup
                .pipe(takeUntil(wrapper.destroy$))
                .subscribe(wrapper.pointerup.emit.bind(wrapper.pointerup));
        }

        if (wrapper.pointerdown.observed) {
            this.host.pointerdown
                .pipe(takeUntil(wrapper.destroy$))
                .subscribe(wrapper.pointerdown.emit.bind(wrapper.pointerdown));
        }

        if (wrapper.pointerover.observed) {
            this.host.pointerover
                .pipe(takeUntil(wrapper.destroy$))
                .subscribe(wrapper.pointerover.emit.bind(wrapper.pointerover));
        }

        if (wrapper.pointerout.observed) {
            this.host.pointerout
                .pipe(takeUntil(wrapper.destroy$))
                .subscribe(wrapper.pointerout.emit.bind(wrapper.pointerout));
        }

        if (wrapper.pointerenter.observed) {
            this.host.pointerenter
                .pipe(takeUntil(wrapper.destroy$))
                .subscribe(
                    wrapper.pointerenter.emit.bind(wrapper.pointerenter)
                );
        }

        if (wrapper.pointerleave.observed) {
            this.host.pointerleave
                .pipe(takeUntil(wrapper.destroy$))
                .subscribe(
                    wrapper.pointerleave.emit.bind(wrapper.pointerleave)
                );
        }

        if (wrapper.pointermove.observed) {
            this.host.pointermove
                .pipe(takeUntil(wrapper.destroy$))
                .subscribe(wrapper.pointermove.emit.bind(wrapper.pointermove));
        }

        if (wrapper.pointermissed.observed) {
            this.host.pointermissed
                .pipe(takeUntil(wrapper.destroy$))
                .subscribe(
                    wrapper.pointermissed.emit.bind(wrapper.pointermissed)
                );
        }

        if (wrapper.pointercancel.observed) {
            this.host.pointercancel
                .pipe(takeUntil(wrapper.destroy$))
                .subscribe(
                    wrapper.pointercancel.emit.bind(wrapper.pointercancel)
                );
        }

        if (wrapper.wheel.observed) {
            this.host.wheel
                .pipe(takeUntil(wrapper.destroy$))
                .subscribe(wrapper.wheel.emit.bind(wrapper.wheel));
        }

        if (wrapper.ready.observed) {
            this.host.ready
                .pipe(takeUntil(wrapper.destroy$))
                .subscribe(wrapper.ready.emit.bind(wrapper.ready));
        }
    }

    @Input() set ngtObjectInputs(wrapper: unknown) {
        this.assertWrapper(wrapper);

        if (wrapper.shouldPassThroughRef) {
            this.host.ref = wrapper.instance;
        }

        this.host.attach = wrapper.attach;
        this.host.skipParent = wrapper.skipParent;
        this.host.noAttach = wrapper.noAttach;
        this.host.name = wrapper.name;
        this.host.position = wrapper.position;
        this.host.rotation = wrapper.rotation;
        this.host.quaternion = wrapper.quaternion;
        this.host.scale = wrapper.scale;
        this.host.color = wrapper.color;
        this.host.userData = wrapper.userData;
        this.host.castShadow = wrapper.castShadow;
        this.host.receiveShadow = wrapper.receiveShadow;
        this.host.visible = wrapper.visible;
        this.host.matrixAutoUpdate = wrapper.matrixAutoUpdate;
        this.host.dispose = wrapper.dispose;
        this.host.raycast = wrapper.raycast;
        this.host.appendMode = wrapper.appendMode;
        this.host.appendTo = wrapper.appendTo;
    }

    constructor(@Optional() @Self() private host: NgtObject) {
        if (!host) return;
    }

    private assertWrapper(
        wrapper: unknown
    ): asserts wrapper is NgtObjectInputs {
        if (!(wrapper instanceof NgtObjectInputs)) {
            throw new Error(
                `[NgtObjectPassThrough] wrapper is not an NgtObject`
            );
        }
    }
}

@NgModule({
    declarations: [NgtObjectPassThrough],
    exports: [NgtObjectPassThrough],
})
export class NgtObjectPassThroughModule {}
