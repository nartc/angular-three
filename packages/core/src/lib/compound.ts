import { Directive, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, scan, takeUntil } from 'rxjs';
import type { NgtInstance } from './instance';
import { NgtRef } from './ref';
import { NgtComponentStore } from './stores/component-store';
import type { NgtAnyRecord } from './types';
import { is } from './utils/is';

export type EventEmitterOf<T extends object = object> = {
    [TKey in keyof T]: T[TKey] extends NgtRef ? never : T[TKey] extends EventEmitter<any> ? TKey : never;
}[keyof T];

@Directive()
export abstract class NgtCompound<TObject extends object = any, THost extends NgtInstance = NgtInstance>
    extends NgtComponentStore
    implements OnChanges
{
    readonly instanceRef = new NgtRef();

    get useOnHost(): (keyof TObject | string)[] {
        return [];
    }

    get compoundInputs(): (keyof TObject | string)[] {
        return [];
    }

    get compoundOutputs(): EventEmitterOf<THost>[] {
        return [];
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
