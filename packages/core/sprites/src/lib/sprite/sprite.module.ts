import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpriteDirective } from './sprite.directive';

@NgModule({
  declarations: [SpriteDirective],
  imports: [CommonModule],
  exports: [SpriteDirective],
})
export class ThreeSpriteModule {}
