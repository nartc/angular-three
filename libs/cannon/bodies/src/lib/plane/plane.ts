// GENERATED
import { Directive, NgModule } from '@angular/core';
import { PlaneProps } from '@pmndrs/cannon-worker-api';
import { GetByIndex, NgtPhysicsBody, providePhysicsBody } from '../body';

@Directive({
    selector: '[ngtPhysicPlane]',
    exportAs: 'ngtPhysicPlane',
    providers: [providePhysicsBody<'Plane', PlaneProps>(NgtPhysicPlane)],
})
export class NgtPhysicPlane extends NgtPhysicsBody<'Plane', PlaneProps> {
    static ngAcceptInputType_getPhysicProps: GetByIndex<PlaneProps>;

    override get bodyType(): 'Plane' {
        return 'Plane';
    }

    protected override preInit() {
        this.set({ argsFn: () => [] });
    }
}

@NgModule({
    declarations: [NgtPhysicPlane],
    exports: [NgtPhysicPlane],
})
export class NgtPhysicPlaneModule {}
