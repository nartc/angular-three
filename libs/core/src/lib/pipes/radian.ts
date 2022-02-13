import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'radian' })
export class NgtRadianPipe implements PipeTransform {
    transform(degree: number): number {
        return (degree * Math.PI) / 180;
    }
}

@NgModule({
    declarations: [NgtRadianPipe],
    exports: [NgtRadianPipe],
})
export class NgtRadianPipeModule {}
