import { Routes } from '@angular/router';

export const routes: Routes = [
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
        data: {
            title: 'Simple Cubes',
            description:
                'Two spinning cubes along with a cube with different materials',
            link: '/cubes',
            asset: 'assets/examples/cubes',
        },
    },
    {
        path: 'keen-bloom',
        loadChildren: () =>
            import('./keen-bloom/keen-bloom.component').then(
                (m) => m.KeenComponentModule
            ),
        data: {
            title: 'Keen Bloom',
            description: 'Simple example to show @angular-three/postprocessing',
            link: '/keen-bloom',
            asset: 'assets/examples/keen',
        },
    },
    {
        path: 'physic-cubes',
        loadChildren: () =>
            import('./physic-cubes/physic-cubes.component').then(
                (m) => m.SandboxPhysicCubesModule
            ),
        data: {
            title: 'Physic Cubes',
            description: 'Simple example to show @angular-three/cannon',
            link: '/physic-cubes',
            asset: 'assets/examples/physic-cubes',
        },
    },
    {
        path: 'kinematic-cube',
        loadChildren: () =>
            import('./kinematic-cube/kinematic-cube.component').then(
                (m) => m.KinematicCubeComponentModule
            ),
        data: {
            title: 'Kinematic Cube',
            description: '@angular-three/cannon example with InstancedMesh',
            link: '/kinematic-cube',
            asset: 'assets/examples/kinematic',
        },
    },
    {
        path: 'monday-morning',
        loadChildren: () =>
            import('./monday-morning/monday-morning.component').then(
                (m) => m.SandboxMondayMorningModule
            ),
        data: {
            title: 'Monday Morning',
            description: '@angular-three/cannon example with Constraints',
            link: '/monday-morning',
            asset: 'assets/examples/monday-morning',
        },
    },
    {
        path: 'object-clump',
        loadChildren: () =>
            import('./object-clump/object-clump.component').then(
                (m) => m.ObjectClumpComponentModule
            ),
        data: {
            title: 'Object Clump',
            description:
                '@angular-three/cannon example with Constraints and Force',
            link: '/object-clump',
            asset: 'assets/examples/clump',
        },
    },
];
