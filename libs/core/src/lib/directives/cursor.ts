// import { DOCUMENT } from '@angular/common';
// import { Directive, Inject, NgModule, Optional, Self } from '@angular/core';
// import { mapTo, merge, takeUntil } from 'rxjs';
// import { NgtObjectInputsController } from '../controllers/object-inputs.controller';
// import { NgtDestroyed } from '../services/destroyed';
//
// @Directive({
//     selector: '[ngtCursor]',
//     exportAs: 'ngtCursor',
//     providers: [NgtDestroyed],
// })
// export class NgtCursor {
//     constructor(
//         @Optional()
//         @Self()
//         objectInputsController: NgtObjectInputsController,
//         @Inject(DOCUMENT) document: Document,
//         destroyed: NgtDestroyed
//     ) {
//         if (!objectInputsController) return;
//         merge(
//             objectInputsController.pointerover.pipe(mapTo(true)),
//             objectInputsController.pointerout.pipe(mapTo(false))
//         )
//             .pipe(takeUntil(destroyed))
//             .subscribe((hovered) => {
//                 document.body.style.cursor = hovered ? 'pointer' : 'auto';
//             });
//     }
// }
//
// @NgModule({
//     declarations: [NgtCursor],
//     exports: [NgtCursor],
// })
// export class NgtCursorModule {}
