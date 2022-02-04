import {
  createExtenderProvider,
  createParentObjectProvider,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtExtender,
  NgtObjectInputsController,
  NgtObjectInputsControllerModule,
  NgtStore,
  zonelessRequestAnimationFrame
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Inject,
  Input,
  NgModule,
  TemplateRef
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import * as THREE from 'three';

export interface NgtSobaCenterState {
  alignTop: boolean;
  innerGroup: THREE.Group;
  outerGroup: THREE.Group;
  ready: boolean;
  contentChecked: number;
}

@Directive({
  selector: 'ng-template[sobaCenterContent]',
  exportAs: 'ngtSobaCenterContent'
})
export class NgtSobaCenterContent {
  constructor(public templateRef: TemplateRef<NgtSobaCenterState>) {
  }
}

@Component({
  selector: 'ngt-soba-center',
  template: `
    <ngt-group
      (ready)='object = $event'
      (animateReady)='
        animateReady.emit({ entity: object, state: $event.state })
      '
      [objectInputsController]='objectInputsController'
    >
      <ngt-group
        name='outer-soba-center-group'
        (ready)='store.set({ outerGroup: $event })'
      >
        <ngt-group
          name='inner-soba-center-group'
          (ready)='store.set({ innerGroup: $event })'
        >
          <ng-container
            [ngTemplateOutlet]='content.templateRef'
            [ngTemplateOutletContext]='store.get()'
          ></ng-container>
        </ngt-group>
      </ngt-group>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    createExtenderProvider(NgtSobaCenter),
    NgtStore,
    createParentObjectProvider(NgtSobaCenter, (center) =>
      center.store.get('innerGroup')
    )
  ]
})
export class NgtSobaCenter extends NgtExtender<THREE.Group> {
  @Input() set alignTop(alignTop: boolean) {
    this.store.set({ alignTop });
  }

  @ContentChild(NgtSobaCenterContent, { static: true })
  content!: NgtSobaCenterContent;

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObjectInputsController,
    public store: NgtStore<NgtSobaCenterState>
  ) {
    super();
    store.set({ alignTop: false, ready: false });
  }

  ngOnInit() {
    this.store.hold(
      this.store.select(
        selectSlice([
          'alignTop',
          'innerGroup',
          'outerGroup',
          'contentChecked'
        ])
      ),
      ({ alignTop, innerGroup, outerGroup }) => {
        if (innerGroup) {
          zonelessRequestAnimationFrame(() => {
            outerGroup.position.set(0, 0, 0);
            outerGroup.updateWorldMatrix(true, true);
            const box3 = new THREE.Box3().setFromObject(innerGroup);
            const center = new THREE.Vector3();
            const sphere = new THREE.Sphere();
            const height = box3.max.y - box3.min.y;
            box3.getCenter(center);
            box3.getBoundingSphere(sphere);

            outerGroup.position.set(
              -center.x,
              -center.y + (alignTop ? height / 2 : 0),
              -center.z
            );
          });
        }
      }
    );
  }

  ngAfterContentChecked() {
    this.store.set((state) => ({
      contentChecked: state.contentChecked ? state.contentChecked + 1 : 1
    }));
  }
}

@NgModule({
  declarations: [NgtSobaCenter, NgtSobaCenterContent],
  exports: [
    NgtSobaCenter,
    NgtSobaCenterContent,
    NgtObjectInputsControllerModule
  ],
  imports: [CommonModule, NgtGroupModule]
})
export class NgtSobaCenterModule {
}
