import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'sandbox-home',
    template: `
        <div class="container">
            <h1>Angular Three Examples</h1>
            <div class="container__examples">
                <a
                    class="container__example"
                    *ngFor="let example of examples"
                    [routerLink]="example.link"
                >
                    <video autoplay muted loop>
                        <source
                            *ngFor="let source of ['webm', 'mp4']"
                            [src]="example.asset + '.' + source"
                            [type]="'video/' + source"
                        />
                    </video>
                </a>
            </div>
        </div>
    `,
    styles: [
        `
            .container {
                display: flex;
                flex-direction: column;
                max-width: 80%;
                margin: auto;
            }

            .container__examples {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr;
                gap: 1rem;
            }

            .container__example {
                height: 200px;
                border: 1px solid;
                border-radius: 0.25rem;
                position: relative;

                display: flex;
                justify-content: center;
                align-items: center;
            }

            .container__example video {
                position: absolute;
                z-index: 0;
                object-fit: cover;
                width: 100%;
                height: 100%;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
    readonly examples = [
        { title: 'Simple Cubes', link: '/cubes', asset: 'assets/cubes' },
        {
            title: 'Physic Cubes',
            link: '/physic-cubes',
            asset: 'assets/physic-cubes',
        },
        { title: 'Keen Bloom', link: '/keen-bloom', asset: 'assets/keen' },
        {
            title: 'Kinematic Cube',
            link: '/kinematic-cube',
            asset: 'assets/kinematic',
        },
        {
            title: 'Monday Morning',
            link: '/monday-morning',
            asset: 'assets/monday-morning',
        },
    ] as const;
}

@NgModule({
    declarations: [HomeComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: HomeComponent }]),
    ],
})
export class HomeComponentModule {}
