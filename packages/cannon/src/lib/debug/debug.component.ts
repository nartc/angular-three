import { NgtColor } from '@angular-three/core';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  NgZone,
  OnInit,
} from '@angular/core';
import { NgtCannonDebugStore } from './debug.store';
import { NgtCannonDebuggerInterface } from './models/debug';

@Component({
  selector: 'ngt-cannon-debug',
  template: `
    <ngt-primitive [object]="scene"></ngt-primitive>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtCannonDebugStore],
})
export class NgtCannonDebug implements OnInit {
  @Input() set color(v: NgtColor) {
    this.cannonDebugStore.set({ color: v });
  }

  @Input() set scale(v: number) {
    this.cannonDebugStore.set({ scale: v });
  }

  @Input() set impl(v: NgtCannonDebuggerInterface) {
    this.cannonDebugStore.set({ impl: v });
  }

  constructor(
    private ngZone: NgZone,
    private cannonDebugStore: NgtCannonDebugStore
  ) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.cannonDebugStore.actions.init();
    });
  }

  get scene() {
    return this.cannonDebugStore.scene;
  }

  get api() {
    return this.cannonDebugStore.api;
  }
}

@NgModule({
  declarations: [NgtCannonDebug],
  exports: [NgtCannonDebug],
  imports: [NgtPrimitiveModule],
})
export class NgtCannonDebugModule {}
