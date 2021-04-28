import { Directive, OnChanges, SimpleChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Directive()
export abstract class Controller implements OnChanges {
  readonly change$ = new ReplaySubject<SimpleChanges>(1);

  ngOnChanges(changes: SimpleChanges) {
    this.change$.next(changes);
  }
}
