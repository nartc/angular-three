import { NgForOf } from '@angular/common';
import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[ngFor][ngForRepeat]',
    standalone: true,
})
export class NgtRepeat extends NgForOf<number> {
    @Input() set ngForRepeat(count: number) {
        this.ngForOf = Number.isInteger(count) ? Array.from({ length: count }, (_, i) => i) : [];
    }
}
