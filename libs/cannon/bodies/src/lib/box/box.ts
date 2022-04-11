// GENERATED
import { Directive, NgModule } from '@angular/core';
import { BoxProps } from '@pmndrs/cannon-worker-api';
import { GetByIndex, NgtPhysicsBody, providePhysicsBody } from '../body';

@Directive({
    selector: '[ngtPhysicBox]',
    exportAs: 'ngtPhysicBox',
    providers: [providePhysicsBody<'Box', BoxProps>(NgtPhysicBox)],
})
export class NgtPhysicBox extends NgtPhysicsBody<'Box', BoxProps> {
    static ngAcceptInputType_getPhysicProps: GetByIndex<BoxProps>;

    override get bodyType(): 'Box' {
        return 'Box';
    }

    protected override preInit() {
        this.set({ argsFn: (args: BoxProps['args'] = [1, 1, 1]) => args });
    }
}

@NgModule({
    declarations: [NgtPhysicBox],
    exports: [NgtPhysicBox],
})
export class NgtPhysicBoxModule {}
