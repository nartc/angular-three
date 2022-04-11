// GENERATED
import { Directive, NgModule } from '@angular/core';
import { SphereProps } from '@pmndrs/cannon-worker-api';
import { GetByIndex, NgtPhysicsBody } from '../body';

@Directive({
    selector: '[ngtPhysicSphere]',
    exportAs: 'ngtPhysicSphere',
})
export class NgtPhysicSphere extends NgtPhysicsBody<'Sphere', SphereProps> {
    static ngAcceptInputType_getPhysicProps: GetByIndex<SphereProps>;

    override get bodyType(): 'Sphere' {
        return 'Sphere';
    }

    protected override preInit() {
        this.set({
            argsFn: (args: SphereProps['args'] = [1]) => {
                if (!Array.isArray(args))
                    throw new Error('ngtPhysicSphere args must be an array');
                return [args[0]];
            },
        });
    }
}

@NgModule({
    declarations: [NgtPhysicSphere],
    exports: [NgtPhysicSphere],
})
export class NgtPhysicSphereModule {}
