import { filterFalsy, NgtArgs } from '@angular-three/core';
import { Component, inject } from '@angular/core';
import { SobaEnvironmentInputs } from './environment-inputs';
import { SobaEnvironmentMap } from './environment-map';
import { SobaEnvironmentResolver } from './environment-resolver';
import { SobaGroundProjectedEnv } from './ground-projected-env';

@Component({
    selector: 'ngt-soba-environment-ground',
    standalone: true,
    template: `
        <ngt-soba-environment-map [map]="texture$"></ngt-soba-environment-map>
        <ngt-soba-ground-projected-env
            *args="groundProjectedEnvArgs$"
            [height]="readKey('ground')?.height"
            [radius]="readKey('ground')?.radius"
            [scale]="readKey('ground')?.scale ?? 1000"
        ></ngt-soba-ground-projected-env>
    `,
    providers: [SobaEnvironmentResolver],
    imports: [SobaEnvironmentMap, SobaGroundProjectedEnv, NgtArgs],
})
export class SobaEnvironmentGround extends SobaEnvironmentInputs {
    private readonly environmentTexture$ = inject(SobaEnvironmentResolver).use(
        this.getEnvironmentResolverParams$.bind(this)
    );

    readonly texture$ = this.select(
        this.environmentTexture$.pipe(filterFalsy()),
        this.select((s) => s['map']),
        (texture, map) => map ?? texture
    );

    readonly groundProjectedEnvArgs$ = this.select(this.texture$, (texture) => [texture]);
}
