import {
  Directive,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { UnknownRecord } from '../models';

@Directive()
export abstract class Controller implements OnChanges, OnInit {
  abstract get props(): string[];

  abstract get controller(): Controller | undefined;

  readonly change$ = new ReplaySubject<SimpleChanges>(1);

  constructor(protected ngZone: NgZone) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.controller) {
      this.controller.ngOnChanges(changes);
      this.change$.next(changes);
    } else {
      this.change$.next(changes);
    }
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.controller) {
        this.props.forEach((prop) => {
          (this as UnknownRecord)[prop] = (
            this.controller as unknown as UnknownRecord
          )[prop];
        });
      }
    });
  }
}
