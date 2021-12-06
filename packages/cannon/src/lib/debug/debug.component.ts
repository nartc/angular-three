import { NgtColor, NgtCoreModule } from '@angular-three/core';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  NgZone,
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
export class NgtCannonDebug implements AfterContentInit {
  @Input() set color(v: NgtColor) {
    this.cannonDebugStore.updaters.setColor(v);
  }

  @Input() set scale(v: number) {
    this.cannonDebugStore.updaters.setScale(v);
  }

  @Input() set impl(v: NgtCannonDebuggerInterface) {
    this.cannonDebugStore.updaters.setImpl(v);
  }

  constructor(
    private ngZone: NgZone,
    private cannonDebugStore: NgtCannonDebugStore
  ) {}

  ngAfterContentInit() {
    this.ngZone.runOutsideAngular(() => {
      this.cannonDebugStore.init();
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
  imports: [NgtCoreModule, NgtPrimitiveModule],
})
export class NgtCannonDebugModule {}
