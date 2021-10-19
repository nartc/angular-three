import {
  Object3dControllerDirective,
  OBJECT_3D_CONTROLLER_PROVIDER,
  OBJECT_3D_WATCHED_CONTROLLER,
} from '@angular-three/core';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Group, Object3D } from 'three';
import { HtmlElementDirective } from './html-element.directive';
import { CalculatePosition, HtmlStore } from './html.store';
import { tap } from 'rxjs';

@Component({
  selector: 'ngt-html',
  exportAs: 'ngtHtml',
  template: `
    <div ngtHtmlElement id="ngtHtmlElement"></div>
    <ngt-group
      o3d
      [name]="object3dController.name"
      [position]="object3dController.position"
      [rotation]="object3dController.rotation"
      [quaternion]="object3dController.quaternion"
      [scale]="object3dController.scale"
      [color]="object3dController.color"
      [userData]="object3dController.userData"
      [castShadow]="object3dController.castShadow"
      [receiveShadow]="object3dController.receiveShadow"
      [visible]="object3dController.visible"
      [matrixAutoUpdate]="object3dController.matrixAutoUpdate"
      [appendMode]="object3dController.appendMode"
      [appendTo]="object3dController.appendTo"
      (click)="object3dController.click.emit($event)"
      (contextmenu)="object3dController.contextmenu.emit($event)"
      (dblclick)="object3dController.dblclick.emit($event)"
      (pointerup)="object3dController.pointerup.emit($event)"
      (pointerdown)="object3dController.pointerdown.emit($event)"
      (pointerover)="object3dController.pointerover.emit($event)"
      (pointerout)="object3dController.pointerout.emit($event)"
      (pointerenter)="object3dController.pointerenter.emit($event)"
      (pointerleave)="object3dController.pointerleave.emit($event)"
      (pointermove)="object3dController.pointermove.emit($event)"
      (pointermissed)="object3dController.pointermissed.emit($event)"
      (pointercancel)="object3dController.pointercancel.emit($event)"
      (wheel)="object3dController.wheel.emit($event)"
      (ready)="onHtmlReady($event)"
      (animateReady)="onHtmlAnimateReady()"
    >
    </ngt-group>
    <ng-template #transformDomTemplate>
      <div #transformOuterRef [style]="transformStyles$ | async">
        <div
          #transformInnerRef
          [style]="{ position: 'absolute', pointerEvents: 'auto' }"
        >
          <ng-container *ngTemplateOutlet="domTemplate"></ng-container>
        </div>
      </div>
    </ng-template>

    <ng-template #domTemplate>
      <div
        #renderedRef
        [class]="domClass$ | async"
        [style]="transformStyles$ | async"
      >
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HtmlStore, OBJECT_3D_CONTROLLER_PROVIDER],
})
export class HtmlComponent implements OnInit {
  @Input() set prepend(v: boolean) {
    this.htmlStore.setPrepend(v);
  }

  @Input() set center(v: boolean) {
    this.htmlStore.setCenter(v);
  }

  @Input() set fullscreen(v: boolean) {
    this.htmlStore.setFullscreen(v);
  }

  @Input() set distanceFactor(v: number) {
    this.htmlStore.setDistanceFactor(v);
  }

  @Input() set portal(v: HTMLElement) {
    this.htmlStore.setPortal(v);
  }

  @Input() set occlude(v: Object3D[] | boolean) {
    this.htmlStore.setOcclude(v);
  }

  @Input() set domStyle(v: Partial<CSSStyleDeclaration>) {
    this.htmlStore.setDomStyle(v);
  }

  @Input() set domClass(v: string) {
    this.htmlStore.setDomClass(v);
  }

  @Input() set eps(v: number) {
    this.htmlStore.setEps(v);
  }

  @Input() set sprite(v: boolean) {
    this.htmlStore.setSprite(v);
  }

  @Input() set transform(v: boolean) {
    this.htmlStore.setTransform(v);
  }

  @Input() set zIndexRange(v: number[]) {
    this.htmlStore.setZIndexRange(v);
  }

  @Input() set calculatePosition(v: CalculatePosition) {
    this.htmlStore.setCalculatePosition(v);
  }

  @Input() set htmlElement(v: HtmlElementDirective) {
    this.htmlStore.elementChangedEffect({
      elementRef: v.elRef,
      viewContainerRef: v.viewContainerRef,
    });
  }

  @Output() occludeChange = this.htmlStore.$occlude;

  @ViewChild('transformDomTemplate', { static: true })
  transformDomTemplate!: TemplateRef<unknown>;

  @ViewChild('domTemplate', { static: true })
  domTemplate!: TemplateRef<unknown>;

  @ViewChild(HtmlElementDirective, { static: true })
  set defaultHtmlElement(v: HtmlElementDirective) {
    this.htmlStore.elementChangedEffect({
      elementRef: v.elRef,
      viewContainerRef: v.viewContainerRef,
    });
  }

  @ViewChild('transformOuterRef')
  transformOuterRef?: ElementRef<HTMLDivElement>;
  @ViewChild('transformInnerRef')
  transformInnerRef?: ElementRef<HTMLDivElement>;

  @ViewChild('renderedRef') renderedDomRef!: ElementRef<HTMLDivElement>;

  readonly domClass$ = this.htmlStore.domClass$;
  readonly transformStyles$ = this.htmlStore.transformStyles$;

  constructor(
    @Inject(OBJECT_3D_WATCHED_CONTROLLER)
    public readonly object3dController: Object3dControllerDirective,
    private readonly ngZone: NgZone,
    private readonly htmlStore: HtmlStore
  ) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.htmlStore.renderEffect({
        domTemplate: this.domTemplate,
        transformDomTemplate: this.transformDomTemplate,
      });
    });
  }

  onHtmlAnimateReady() {
    this.htmlStore.animateEffect({
      occludeObserved: this.occludeChange.observed,
      outerRef: this.transformOuterRef,
      innerRef: this.transformInnerRef,
    });
  }

  onHtmlReady(group: Group) {
    this.ngZone.runOutsideAngular(() => {
      this.htmlStore.setGroup(group);
    });
  }
}
