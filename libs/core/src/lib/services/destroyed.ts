import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class NgtDestroyed extends Subject<void> implements OnDestroy {
  ngOnDestroy() {
    this.next();
    this.complete();
  }
}
