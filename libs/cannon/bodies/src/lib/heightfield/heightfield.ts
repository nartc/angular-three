// GENERATED
import { Directive, NgModule } from '@angular/core';
import { HeightfieldProps } from '@pmndrs/cannon-worker-api';
import { GetByIndex, NgtPhysicsBody, providePhysicsBody } from '../body';

@Directive({
    selector: '[ngtPhysicHeightfield]',
    exportAs: 'ngtPhysicHeightfield',
    providers: [
        providePhysicsBody<'Heightfield', HeightfieldProps>(
            NgtPhysicHeightfield
        ),
    ],
})
export class NgtPhysicHeightfield extends NgtPhysicsBody<
    'Heightfield',
    HeightfieldProps
> {
    static ngAcceptInputType_getPhysicProps: GetByIndex<HeightfieldProps>;

    override get bodyType(): 'Heightfield' {
        return 'Heightfield';
    }
}

@NgModule({
    declarations: [NgtPhysicHeightfield],
    exports: [NgtPhysicHeightfield],
})
export class NgtPhysicHeightfieldModule {}
