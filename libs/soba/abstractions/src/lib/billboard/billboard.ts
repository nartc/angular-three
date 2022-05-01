import {
    BooleanInput,
    coerceBooleanProperty,
    NgtObjectInputs,
    NgtObjectPassThroughModule,
    NgtRenderState,
    provideObjectHostRef,
    Ref,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    Directive,
    EventEmitter,
    Input,
    NgModule,
    Output,
    TemplateRef,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ng-template[ngt-soba-billboard-content]',
})
export class NgtSobaBillboardContent {
    constructor(
        public templateRef: TemplateRef<{ billboard: Ref<THREE.Group> }>
    ) {}

    static ngTemplateContextGuard(
        dir: NgtSobaBillboardContent,
        ctx: any
    ): ctx is { billboard: Ref<THREE.Group> } {
        return true;
    }
}

@Component({
    selector: 'ngt-soba-billboard',
    template: `
        <ngt-group
            (beforeRender)="onBeforeRender($event); beforeRender.emit($event)"
            [ngtObjectInputs]="this"
            [ngtObjectOutputs]="this"
        >
            <ng-container
                *ngIf="content"
                [ngTemplateOutlet]="content.templateRef"
                [ngTemplateOutletContext]="{ billboard: instance }"
            ></ng-container>
        </ngt-group>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideObjectHostRef(NgtSobaBillboard)],
})
export class NgtSobaBillboard extends NgtObjectInputs<THREE.Group> {
    @Input() set follow(value: BooleanInput) {
        this.set({ follow: coerceBooleanProperty(value) });
    }

    @Input() set lockX(value: BooleanInput) {
        this.set({ lockX: coerceBooleanProperty(value) });
    }

    @Input() set lockY(value: BooleanInput) {
        this.set({ lockY: coerceBooleanProperty(value) });
    }

    @Input() set lockZ(value: BooleanInput) {
        this.set({ lockZ: coerceBooleanProperty(value) });
    }

    @ContentChild(NgtSobaBillboardContent) content?: NgtSobaBillboardContent;

    @Output() beforeRender = new EventEmitter<{
        state: NgtRenderState;
        object: THREE.Group;
    }>();

    override isWrapper = true;

    protected override preInit() {
        this.set((state) => ({
            follow: state['follow'] || true,
            lockX: state['lockX'] || false,
            lockY: state['lockY'] || false,
            lockZ: state['lockZ'] || false,
        }));
    }

    onBeforeRender({
        state: { camera },
        object,
    }: {
        state: NgtRenderState;
        object: THREE.Group;
    }) {
        const { follow, lockX, lockY, lockZ } = this.get();

        if (!follow) return;

        // save previous rotation in case we're locking an axis
        const prevRotation = object.rotation.clone();

        // always face the camera
        object.quaternion.copy(camera.quaternion);

        // readjust any axis that is locked
        if (lockX) object.rotation.x = prevRotation.x;
        if (lockY) object.rotation.y = prevRotation.y;
        if (lockZ) object.rotation.z = prevRotation.z;
    }
}

@NgModule({
    declarations: [NgtSobaBillboard, NgtSobaBillboardContent],
    exports: [NgtSobaBillboard, NgtSobaBillboardContent],
    imports: [NgtGroupModule, CommonModule, NgtObjectPassThroughModule],
})
export class NgtSobaBillboardModule {}
