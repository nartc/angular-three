// GENERATED
import { Directive, NgModule } from '@angular/core';
import { TrimeshProps } from '@pmndrs/cannon-worker-api';
import { GetByIndex, NgtPhysicsBody, providePhysicsBody } from '../body';

@Directive({
    selector: '[ngtPhysicTrimesh]',
    exportAs: 'ngtPhysicTrimesh',
    providers: [providePhysicsBody<'Trimesh', TrimeshProps>(NgtPhysicTrimesh)],
})
export class NgtPhysicTrimesh extends NgtPhysicsBody<'Trimesh', TrimeshProps> {
    static ngAcceptInputType_getPhysicProps: GetByIndex<TrimeshProps>;

    override get bodyType(): 'Trimesh' {
        return 'Trimesh';
    }
}

@NgModule({
    declarations: [NgtPhysicTrimesh],
    exports: [NgtPhysicTrimesh],
})
export class NgtPhysicTrimeshModule {}
