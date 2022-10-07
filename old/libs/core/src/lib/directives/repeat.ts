import { NgForOf } from '@angular/common';
import { Directive, Input, NgModule } from '@angular/core';

@Directive({
  selector: '[ngFor][ngForRepeat]',
  standalone: true,
})
export class NgtRepeat extends NgForOf<number> {
  @Input() set ngForRepeat(count: number) {
    this.ngForOf = Number.isInteger(count) ? Array.from({ length: count }, (_, i) => i) : [];
  }
}

@NgModule({
  imports: [NgtRepeat],
  exports: [NgtRepeat],
})
export class NgtRepeatModule {}
