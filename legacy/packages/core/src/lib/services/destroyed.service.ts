import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DestroyedService extends Subject<void> implements OnDestroy {
  ngOnDestroy() {
    this.next();
    this.complete();
  }
}
