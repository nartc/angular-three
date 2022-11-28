import { Directive, Input } from '@angular/core';
import { takeUntil } from 'rxjs';
import type { NgtCompound } from '../compound';
import { injectInstance } from '../instance';
import type { NgtAnyRecord } from '../types';
import { is } from '../utils/is';

@Directive({
    selector: '[objectCompound]',
    standalone: true,
})
export class NgtObjectCompound<TObject extends object = any> {
    readonly host = injectInstance<TObject>({ optional: true, self: true });

    @Input() set objectCompound(compound: NgtCompound<TObject>) {
        if (!this.host || !is.object3d(this.host.instanceValue)) return;
        const host = this.host;
        const hostInstance = this.host.instanceValue as NgtAnyRecord;
        if (hostInstance) {
            compound.instanceRef.set(hostInstance);
        } else {
            host.ref = compound.instanceRef;
        }

        compound
            .getInputs$()
            .pipe(takeUntil(compound.destroy$))
            .subscribe((changes) => {
                Object.entries(changes).forEach(([key, value]) => {
                    const hostValue = is.setter(host, key as keyof typeof host)
                        ? host.read((s) => s[key])
                        : hostInstance[key];
                    try {
                        if (!is.equ(value, hostValue) && !compound.useOnHost.includes(key as keyof TObject & string)) {
                            hostInstance[key] = value;
                        }
                    } catch (e) {
                        console.log(e);
                    }
                });
            });

        compound.observeOutputs(this.host);
    }
}
