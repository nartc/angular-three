// GENERATED
import { Directive, NgModule } from '@angular/core';
import { CompoundBodyProps } from '@pmndrs/cannon-worker-api';
import { GetByIndex, NgtPhysicsBody } from '../body';

@Directive({
    selector: '[ngtPhysicCompound]',
    exportAs: 'ngtPhysicCompound',
})
export class NgtPhysicCompound extends NgtPhysicsBody<
    'Compound',
    CompoundBodyProps
> {
    static ngAcceptInputType_getPhysicProps: GetByIndex<CompoundBodyProps>;

    override get bodyType(): 'Compound' {
        return 'Compound';
    }
}

@NgModule({
    declarations: [NgtPhysicCompound],
    exports: [NgtPhysicCompound],
})
export class NgtPhysicCompoundModule {}
