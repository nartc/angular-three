// GENERATED
import { Directive, NgModule } from '@angular/core';
import { CompoundBodyProps } from '@pmndrs/cannon-worker-api';
import { GetByIndex, NgtPhysicsBody, providePhysicsBody } from '../body';

@Directive({
    selector: '[ngtPhysicCompound]',
    exportAs: 'ngtPhysicCompound',
    providers: [
        providePhysicsBody<'Compound', CompoundBodyProps>(NgtPhysicCompound),
    ],
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
