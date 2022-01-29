import { DOCUMENT } from '@angular/common';
import { Directive, Inject, NgModule, Optional, Self } from '@angular/core';
import { mapTo, merge, takeUntil } from 'rxjs';
import { NgtObject3dInputsController } from '../controllers/object-3d-inputs.controller';
import { NgtDestroyedService } from '../services/destroyed.service';

@Directive({
  selector: '[ngtCursor]',
  exportAs: 'ngtCursor',
  providers: [NgtDestroyedService],
})
export class NgtCursor {
  constructor(
    @Optional()
    @Self()
    objectInputsController: NgtObject3dInputsController,
    @Inject(DOCUMENT) document: Document,
    destroyed: NgtDestroyedService
  ) {
    if (!objectInputsController) return;
    merge(
      objectInputsController.pointerover.pipe(mapTo(true)),
      objectInputsController.pointerout.pipe(mapTo(false))
    )
      .pipe(takeUntil(destroyed))
      .subscribe((hovered) => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
      });
  }
}

@NgModule({
  declarations: [NgtCursor],
  exports: [NgtCursor],
})
export class NgtCursorModule {}
