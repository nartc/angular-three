import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UnrealBloomPassDirective } from './unreal-bloom-pass.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [UnrealBloomPassDirective],
  exports: [UnrealBloomPassDirective],
})
export class ThreeUnrealBloomPassModule {}
