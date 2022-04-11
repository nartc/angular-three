// GENERATED
import { Directive, NgModule } from '@angular/core';
import { CylinderProps } from '@pmndrs/cannon-worker-api';
import { GetByIndex, NgtPhysicsBody, providePhysicsBody } from '../body';

@Directive({
    selector: '[ngtPhysicCylinder]',
    exportAs: 'ngtPhysicCylinder',
    providers: [
        providePhysicsBody<'Cylinder', CylinderProps>(NgtPhysicCylinder),
    ],
})
export class NgtPhysicCylinder extends NgtPhysicsBody<
    'Cylinder',
    CylinderProps
> {
    static ngAcceptInputType_getPhysicProps: GetByIndex<CylinderProps>;

    override get bodyType(): 'Cylinder' {
        return 'Cylinder';
    }

    protected override preInit() {
        this.set({ argsFn: (args: CylinderProps['args'] = []) => args });
    }
}

@NgModule({
    declarations: [NgtPhysicCylinder],
    exports: [NgtPhysicCylinder],
})
export class NgtPhysicCylinderModule {}
