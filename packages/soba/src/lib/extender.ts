import { NgtAnimationReady } from '@angular-three/core';
import { Directive, EventEmitter, Output } from '@angular/core';

@Directive()
export abstract class NgtSobaExtender<TEntity> {
  @Output() ready = new EventEmitter<TEntity>();
  @Output() animateReady = new EventEmitter<NgtAnimationReady<TEntity>>();
}
