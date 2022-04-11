// GENERATED
import { Directive, NgModule } from '@angular/core';
import { ConvexPolyhedronProps } from '@pmndrs/cannon-worker-api';
import { GetByIndex, NgtPhysicsBody, makeTriplet } from '../body';

@Directive({
    selector: '[ngtPhysicConvexPolyhedron]',
    exportAs: 'ngtPhysicConvexPolyhedron',
})
export class NgtPhysicConvexPolyhedron extends NgtPhysicsBody<
    'ConvexPolyhedron',
    ConvexPolyhedronProps
> {
    static ngAcceptInputType_getPhysicProps: GetByIndex<ConvexPolyhedronProps>;

    override get bodyType(): 'ConvexPolyhedron' {
        return 'ConvexPolyhedron';
    }

    protected override preInit() {
        this.set({
            argsFn: (args: ConvexPolyhedronProps['args'] = []) => {
                return [
                    args[0] ? args[0].map(makeTriplet) : undefined,
                    args[1],
                    args[2] ? args[2].map(makeTriplet) : undefined,
                    args[3] ? args[3].map(makeTriplet) : undefined,
                    args[4],
                ];
            },
        });
    }
}

@NgModule({
    declarations: [NgtPhysicConvexPolyhedron],
    exports: [NgtPhysicConvexPolyhedron],
})
export class NgtPhysicConvexPolyhedronModule {}
