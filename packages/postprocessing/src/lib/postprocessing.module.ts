import { NgModule } from '@angular/core';
import { EffectComposerDirective } from './effect-composer.directive';

@NgModule({
  declarations: [EffectComposerDirective],
  exports: [EffectComposerDirective],
})
export class ThreePostprocessingModule {}
