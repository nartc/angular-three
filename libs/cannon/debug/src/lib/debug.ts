import {
    BodyProps,
    BodyShapeType,
    NgtPhysicsStore,
    propsToBody,
} from '@angular-three/cannon';
import {
    NgtAnimationFrameStore,
    NgtCanvasStore,
    NgtStore,
    tapEffect,
} from '@angular-three/core';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import {
    ChangeDetectionStrategy,
    Component,
    NgModule,
    NgZone,
    OnInit,
} from '@angular/core';
import { Quaternion, Vec3, World } from 'cannon-es';
import cannonDebugger from 'cannon-es-debugger';
import * as THREE from 'three';
import { NgtCannonDebugApi, NgtCannonDebugState } from './models/debug';

const v = new THREE.Vector3();
const s = new THREE.Vector3(1, 1, 1);
const q = new THREE.Quaternion();

@Component({
    selector: 'ngt-cannon-debug',
    template: `
        <ngt-primitive [object]="scene"></ngt-primitive>
        <ng-content></ng-content>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtCannonDebug
    extends NgtStore<NgtCannonDebugState>
    implements OnInit
{
    scene = new THREE.Scene();

    constructor(
        private zone: NgZone,
        private physicsStore: NgtPhysicsStore,
        private animationFrameStore: NgtAnimationFrameStore,
        private canvasStore: NgtCanvasStore
    ) {
        super();

        if (!physicsStore) {
            throw new Error('ngt-cannon-debug must be used within ngt-physics');
        }

        this.set({
            color: 'black',
            scale: 1,
            impl: cannonDebugger,
            bodies: [],
            refs: {},
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.registerAnimation();
            });
        });
    }

    get api() {
        const { bodies, refs } = this.get();
        return {
            add(id: string, props: BodyProps, type: BodyShapeType) {
                const body = propsToBody(id, props, type);
                bodies.push(body);
                refs[id] = body;
            },
            remove(id: string) {
                const debugBodyIndex = bodies.indexOf(refs[id]);
                if (debugBodyIndex > -1) bodies.splice(debugBodyIndex, 1);
                delete refs[id];
            },
        };
    }

    private readonly registerAnimation = this.effect<void>(
        tapEffect(() => {
            let instance: NgtCannonDebugApi;
            let lastBodies = 0;

            const animationUuid = this.animationFrameStore.register({
                callback: () => {
                    const { bodies, refs, impl, color, scale } = this.get();
                    const { refs: physicsRefs } = this.physicsStore.get();

                    if (!instance || lastBodies !== bodies.length) {
                        lastBodies = bodies.length;
                        this.scene.children = [];
                        instance = impl!(this.scene, { bodies } as World, {
                            color: color as THREE.ColorRepresentation,
                            scale,
                        });
                    }

                    for (const uuid in refs) {
                        physicsRefs[uuid].matrix.decompose(v, q, s);
                        refs[uuid].position.copy(v as unknown as Vec3);
                        refs[uuid].quaternion.copy(q as unknown as Quaternion);
                    }

                    instance.update();
                },
            });

            return () => {
                this.animationFrameStore.unregister(animationUuid);
            };
        })
    );
}

@NgModule({
    declarations: [NgtCannonDebug],
    exports: [NgtCannonDebug],
    imports: [NgtPrimitiveModule],
})
export class NgtCannonDebugModule {}
