import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pi' })
export class NgtPiPipe implements PipeTransform {
    transform(value: number): number {
        return value * Math.PI;
    }
}

@NgModule({
    declarations: [NgtPiPipe],
    exports: [NgtPiPipe],
})
export class NgtPiPipeModule {}
