import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    {
        path: 'home',
        loadChildren: () =>
            import('./home/home.component').then((m) => m.HomeComponentModule),
    },
    {
        path: 'cubes',
        loadChildren: () =>
            import('./cubes/cubes.component').then((m) => m.SandboxCubesModule),
    },
    {
        path: 'keen-bloom',
        loadChildren: () =>
            import('./keen-bloom/keen-bloom.component').then(
                (m) => m.KeenComponentModule
            ),
    },
    {
        path: 'physic-cubes',
        loadChildren: () =>
            import('./physic-cubes/physic-cubes.component').then(
                (m) => m.SandboxPhysicCubesModule
            ),
    },
    {
        path: 'kinematic-cube',
        loadChildren: () =>
            import('./kinematic-cube/kinematic-cube.component').then(
                (m) => m.KinematicCubeComponentModule
            ),
    },
    {
        path: 'monday-morning',
        loadChildren: () =>
            import('./monday-morning/monday-morning.component').then(
                (m) => m.SandboxMondayMorningModule
            ),
    },
];

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, RouterModule.forRoot(routes)],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
