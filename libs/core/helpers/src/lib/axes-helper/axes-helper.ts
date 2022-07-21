// GENERATED
import {
  AnyConstructor,
  NgtCommonHelper,
  provideCommonHelperRef,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-axes-helper',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonHelperRef(NgtAxesHelper)],
})
export class NgtAxesHelper extends NgtCommonHelper<THREE.AxesHelper> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.AxesHelper> | undefined;

  @Input() set size(size: NumberInput) {
    this.set({ size: coerceNumberProperty(size) });
  }

  override get helperType(): AnyConstructor<THREE.AxesHelper> {
    return THREE.AxesHelper;
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      size: true,
    };
  }
}

@NgModule({
  imports: [NgtAxesHelper],
  exports: [NgtAxesHelper],
})
export class NgtAxesHelperModule {}
