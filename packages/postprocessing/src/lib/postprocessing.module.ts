import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectComposerDirective } from './effect-composer.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [EffectComposerDirective],
  exports: [EffectComposerDirective],
})
export class ThreePostprocessingModule {}
