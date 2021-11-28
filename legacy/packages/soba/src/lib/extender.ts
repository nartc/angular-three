import { NgtAnimationReady, NgtMaterial } from '@angular-three/core';
import { ContentChild, Directive, EventEmitter, Output } from '@angular/core';

@Directive()
export abstract class NgtSobaExtender<TEntity> {
  @Output() ready = new EventEmitter<TEntity>();
  @Output() animateReady = new EventEmitter<NgtAnimationReady<TEntity>>();

  @ContentChild(NgtMaterial) material?: NgtMaterial;
}
