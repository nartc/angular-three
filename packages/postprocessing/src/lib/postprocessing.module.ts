import { NgModule } from '@angular/core';
import { NgtEffectComposer } from './effect-composer.directive';

@NgModule({
  declarations: [NgtEffectComposer],
  exports: [NgtEffectComposer],
})
export class NgtPostprocessingModule {}
