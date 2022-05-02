import { Directive, Input, NgModule, Optional, Self } from '@angular/core';
import { merge, takeUntil } from 'rxjs';
import { NgtObject, NgtObjectInputs } from '../abstracts/object';
import { startWithUndefined } from '../stores/component-store';

@Directive({
  selector: '[ngtObjectOutputs],[ngtObjectInputs],[ngtObjectInputs][ngtObjectOutputs]',
})
export class NgtObjectPassThrough {
  @Input() set ngtObjectOutputs(wrapper: unknown) {
    this.assertWrapper(wrapper);

    if (wrapper.click.observed) {
      this.host.click.pipe(takeUntil(wrapper.destroy$)).subscribe(wrapper.click.emit.bind(wrapper.click));
    }

    if (wrapper.contextmenu.observed) {
      this.host.contextmenu
        .pipe(takeUntil(wrapper.destroy$))
        .subscribe(wrapper.contextmenu.emit.bind(wrapper.contextmenu));
    }

    if (wrapper.dblclick.observed) {
      this.host.dblclick.pipe(takeUntil(wrapper.destroy$)).subscribe(wrapper.dblclick.emit.bind(wrapper.dblclick));
    }

    if (wrapper.pointerup.observed) {
      this.host.pointerup.pipe(takeUntil(wrapper.destroy$)).subscribe(wrapper.pointerup.emit.bind(wrapper.pointerup));
    }

    if (wrapper.pointerdown.observed) {
      this.host.pointerdown
        .pipe(takeUntil(wrapper.destroy$))
        .subscribe(wrapper.pointerdown.emit.bind(wrapper.pointerdown));
    }

    if (wrapper.pointerover.observed) {
      this.host.pointerover
        .pipe(takeUntil(wrapper.destroy$))
        .subscribe(wrapper.pointerover.emit.bind(wrapper.pointerover));
    }

    if (wrapper.pointerout.observed) {
      this.host.pointerout
        .pipe(takeUntil(wrapper.destroy$))
        .subscribe(wrapper.pointerout.emit.bind(wrapper.pointerout));
    }

    if (wrapper.pointerenter.observed) {
      this.host.pointerenter
        .pipe(takeUntil(wrapper.destroy$))
        .subscribe(wrapper.pointerenter.emit.bind(wrapper.pointerenter));
    }

    if (wrapper.pointerleave.observed) {
      this.host.pointerleave
        .pipe(takeUntil(wrapper.destroy$))
        .subscribe(wrapper.pointerleave.emit.bind(wrapper.pointerleave));
    }

    if (wrapper.pointermove.observed) {
      this.host.pointermove
        .pipe(takeUntil(wrapper.destroy$))
        .subscribe(wrapper.pointermove.emit.bind(wrapper.pointermove));
    }

    if (wrapper.pointermissed.observed) {
      this.host.pointermissed
        .pipe(takeUntil(wrapper.destroy$))
        .subscribe(wrapper.pointermissed.emit.bind(wrapper.pointermissed));
    }

    if (wrapper.pointercancel.observed) {
      this.host.pointercancel
        .pipe(takeUntil(wrapper.destroy$))
        .subscribe(wrapper.pointercancel.emit.bind(wrapper.pointercancel));
    }

    if (wrapper.wheel.observed) {
      this.host.wheel.pipe(takeUntil(wrapper.destroy$)).subscribe(wrapper.wheel.emit.bind(wrapper.wheel));
    }

    if (wrapper.ready.observed) {
      this.host.ready.pipe(takeUntil(wrapper.destroy$)).subscribe(wrapper.ready.emit.bind(wrapper.ready));
    }
  }

  @Input() set ngtObjectInputs(wrapper: unknown) {
    this.assertWrapper(wrapper);

    if (wrapper.shouldPassThroughRef) {
      this.host.ref = wrapper.instance;
    }

    merge(
      wrapper.select((s) => s.attach),
      this.host.select((s) => s.attach)
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.attach = this.host.get((s) => s.attachExplicit) ? this.host.attach : wrapper.attach;
      });

    merge(
      wrapper.select((s) => s.skipParent),
      this.host.select((s) => s.skipParent)
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.skipParent = this.host.get((s) => s.skipParentExplicit) ? this.host.skipParent : wrapper.skipParent;
      });

    merge(
      wrapper.select((s) => s.noAttach),
      this.host.select((s) => s.noAttach)
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.noAttach = this.host.get((s) => s.noAttachExplicit) ? this.host.noAttach : wrapper.noAttach;
      });

    merge(
      wrapper.select((s) => s.name),
      this.host.select((s) => s.name)
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.name = this.host.get((s) => s.nameExplicit) ? this.host.name : wrapper.name;
      });

    merge(
      wrapper.select((s) => s.position),
      this.host.select((s) => s.position)
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.position = this.host.get((s) => s.positionExplicit) ? this.host.position : wrapper.position;
      });

    merge(
      wrapper.select((s) => s.rotation),
      this.host.select((s) => s.rotation)
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.rotation = this.host.get((s) => s.rotationExplicit) ? this.host.rotation : wrapper.rotation;
      });

    merge(
      wrapper.select((s) => s.quaternion),
      this.host.select((s) => s.quaternion)
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.quaternion = this.host.get((s) => s.quaternionExplicit) ? this.host.quaternion : wrapper.quaternion;
      });

    merge(
      wrapper.select((s) => s.scale),
      this.host.select((s) => s.scale)
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.scale = this.host.get((s) => s.scaleExplicit) ? this.host.scale : wrapper.scale;
      });

    merge(
      wrapper.select((s) => s.color),
      this.host.select((s) => s.color)
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.color = this.host.get((s) => s.colorExplicit) ? this.host.color : wrapper.color;
      });

    merge(
      wrapper.select((s) => s.userData),
      this.host.select((s) => s.userData)
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.userData = this.host.get((s) => s.userDataExplicit) ? this.host.userData : wrapper.userData;
      });

    merge(
      wrapper.select((s) => s.castShadow).pipe(startWithUndefined()),
      this.host.select((s) => s.castShadow).pipe(startWithUndefined())
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.castShadow = this.host.get((s) => s.castShadowExplicit) ? this.host.castShadow : wrapper.castShadow;
      });

    merge(
      wrapper.select((s) => s.receiveShadow).pipe(startWithUndefined()),
      this.host.select((s) => s.receiveShadow).pipe(startWithUndefined())
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.receiveShadow = this.host.get((s) => s.receiveShadowExplicit)
          ? this.host.receiveShadow
          : wrapper.receiveShadow;
      });

    merge(
      wrapper.select((s) => s.visible),
      this.host.select((s) => s.visible)
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.visible = this.host.get((s) => s.visibleExplicit) ? this.host.visible : wrapper.visible;
      });

    merge(
      wrapper.select((s) => s.matrixAutoUpdate),
      this.host.select((s) => s.matrixAutoUpdate)
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.matrixAutoUpdate = this.host.get((s) => s.matrixAutoUpdateExplicit)
          ? this.host.matrixAutoUpdate
          : wrapper.matrixAutoUpdate;
      });

    merge(
      wrapper.select((s) => s.dispose).pipe(startWithUndefined()),
      this.host.select((s) => s.dispose).pipe(startWithUndefined())
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.dispose = this.host.get((s) => s.disposeExplicit) ? this.host.dispose : wrapper.dispose;
      });

    merge(
      wrapper.select((s) => s.raycast).pipe(startWithUndefined()),
      this.host.select((s) => s.raycast).pipe(startWithUndefined())
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.raycast = this.host.get((s) => s.raycastExplicit) ? this.host.raycast : wrapper.raycast;
      });

    merge(
      wrapper.select((s) => s.appendMode),
      this.host.select((s) => s.appendMode)
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.appendMode = this.host.get((s) => s.appendModeExplicit) ? this.host.appendMode : wrapper.appendMode;
      });

    merge(
      wrapper.select((s) => s.appendTo).pipe(startWithUndefined()),
      this.host.select((s) => s.appendTo).pipe(startWithUndefined())
    )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.appendTo = this.host.get((s) => s.appendToExplicit) ? this.host.appendTo : wrapper.appendTo;
      });
  }

  constructor(@Optional() @Self() private host: NgtObject) {
    if (!host) return;
  }

  private assertWrapper(wrapper: unknown): asserts wrapper is NgtObjectInputs {
    if (!(wrapper instanceof NgtObjectInputs)) {
      throw new Error(`[NgtObjectPassThrough] wrapper is not an NgtObject`);
    }
  }
}

@NgModule({
  declarations: [NgtObjectPassThrough],
  exports: [NgtObjectPassThrough],
})
export class NgtObjectPassThroughModule {}
