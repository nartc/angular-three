import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Directive,
    ElementRef,
    HostListener,
    NgModule,
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Directive({
    selector: 'video[sandboxAutoplay]',
})
export class AutoplayVideoDirective {
    constructor(private videoElementRef: ElementRef<HTMLVideoElement>) {}

    @HostListener('mouseover')
    onMouseOver() {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.videoElementRef.nativeElement.play().catch(() => {});
    }

    @HostListener('mouseout')
    onMouseOut() {
        this.videoElementRef.nativeElement.pause();
        this.videoElementRef.nativeElement.currentTime = 0;
    }
}

@Component({
    selector: 'sandbox-home',
    template: `
        <div class="container">
            <small class="container__hint">
                *Interact (click anywhere) on the page to start seeing the
                examples on hover
            </small>
            <h1>Angular Three Examples</h1>
            <div class="container__examples">
                <a
                    class="container__example"
                    *ngFor="let example of examples"
                    [routerLink]="example.link"
                >
                    <video sandboxAutoplay muted loop playsinline>
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

            .container__hint {
                position: absolute;
                right: 1rem;
                font-size: x-small;
                font-style: italic;
            }

            .container__examples {
                display: grid;
                grid-template-columns: repeat(4, minmax(0, 1fr));
                gap: 2rem;
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
    declarations: [HomeComponent, AutoplayVideoDirective],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: HomeComponent }]),
    ],
})
export class HomeComponentModule {}
