import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class StateService {
  private currentName$ = new BehaviorSubject<string>('');
  private currentMode$ = new BehaviorSubject<number>(0);

  get currentName() {
    return this.currentName$.asObservable();
  }

  get currentMode() {
    return this.currentMode$.asObservable();
  }

  get currentModeSnapshot() {
    return this.currentMode$.getValue();
  }

  updateCurrentName(value: string) {
    this.currentName$.next(value);
  }

  updateCurrentMode(value: number) {
    this.currentMode$.next(value);
  }
}
