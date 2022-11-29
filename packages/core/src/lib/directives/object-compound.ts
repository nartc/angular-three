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
            // if there is 'ref' set on compound
            if ((compound as NgtAnyRecord)['ref']) {
                (compound as NgtAnyRecord)['ref'].set(hostInstance);
            }
        } else {
            host.ref = compound.instanceRef;
        }

        if (compound.parentCompoundRef) {
            host.setCompoundParentRef(compound.parentCompoundRef);
        }

        compound
            .getInputs$()
            .pipe(takeUntil(compound.destroy$))
            .subscribe((changes) => {
                for (const [key, value] of Object.entries(changes)) {
                    // skip 'ref', it is special
                    if (key === 'ref') continue;
                    const isSetter = is.setter(host, key as keyof typeof host);
                    const hostValue = isSetter ? host.read((s) => s[key]) : hostInstance[key];
                    if (!is.equ(value, hostValue) && !compound.useOnHost.includes(key as keyof TObject & string)) {
                        if (!isSetter) {
                            hostInstance[key] = value;
                        } else {
                            (host as NgtAnyRecord)[key] = value;
                        }
                    }
                }
            });

        compound.observeOutputs(this.host);
    }
}
