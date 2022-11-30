import {
    Directive,
    EventEmitter,
    inject,
    NgZone,
    OnChanges,
    reflectComponentType,
    SimpleChanges,
    Type,
} from '@angular/core';
import { Observable, scan, takeUntil } from 'rxjs';
import type { NgtInstance } from './instance';
import { injectCompoundInstanceRef } from './instance';
import { NgtRef } from './ref';
import { NgtComponentStore } from './stores/component-store';
import { NgtStore } from './stores/store';
import type { NgtAnyRecord } from './types';
import { getInstanceLocalState } from './utils/get-instance-local-state';
import { is } from './utils/is';

export type EventEmitterOf<T extends object = object> = {
    [TKey in keyof T]: T[TKey] extends NgtRef ? never : T[TKey] extends EventEmitter<any> ? TKey : never;
}[keyof T];

@Directive()
export abstract class NgtCompound<
        TObject extends object = any,
        THost extends NgtInstance<TObject> = NgtInstance<TObject>
    >
    extends NgtComponentStore
    implements OnChanges
{
    protected readonly zone = inject(NgZone);
    protected readonly store = inject(NgtStore);

    readonly parentCompoundRef = injectCompoundInstanceRef({ skipSelf: true, optional: true });
    readonly instanceRef = new NgtRef<TObject>();

    get ngtInstance(): NgtInstance<TObject> | undefined {
        return getInstanceLocalState(this.instanceRef?.value)?.hostInstance;
    }

    get useOnHost(): (keyof TObject | string)[] {
        return [];
    }

    get compoundInputs(): (keyof TObject | string)[] {
        const inputsFromMetadata = reflectComponentType(this.constructor as Type<unknown>)?.inputs;
        if (!inputsFromMetadata) return [];
        return inputsFromMetadata.map(({ propName }) => propName);
    }

    get compoundOutputs(): EventEmitterOf<THost>[] {
        const outputsFromMetadata = reflectComponentType(this.constructor as Type<unknown>)?.outputs;
        if (!outputsFromMetadata) return [];
        return outputsFromMetadata.map(({ propName }) => propName) as EventEmitterOf<THost>[];
    }

    ngOnChanges(changes: SimpleChanges) {
        this.write(
            Object.entries(changes).reduce((acc, [key, change]) => {
                if (!is.equ(change.currentValue, change.previousValue)) {
                    acc[key] = change.currentValue;
                }
                return acc;
            }, {} as NgtAnyRecord)
        );
    }

    getInputs$() {
        return this.select(
            this.compoundInputs.reduce((acc, inputName) => {
                acc[inputName] = this.select((s) => s[inputName]);
                return acc;
            }, {} as Record<keyof TObject | string, Observable<any>>),
            { debounce: true }
        ).pipe(
            scan((result, rawChanges, index) => {
                for (const [key, value] of Object.entries(rawChanges)) {
                    if (value === undefined && index === 0) continue;
                    if (!is.equ(value, result[key])) {
                        result[key as keyof typeof result] = value;
                    }
                }
                return result;
            })
        );
    }

    observeOutputs(host: THost) {
        for (const output of this.compoundOutputs) {
            const wrapperEvent = this[output as keyof typeof this];
            const hostEvent = host[output];
            if (wrapperEvent instanceof EventEmitter && hostEvent instanceof EventEmitter && wrapperEvent.observed) {
                hostEvent.pipe(takeUntil(this.destroy$)).subscribe(wrapperEvent.emit.bind(wrapperEvent));
            }
        }
    }
}
