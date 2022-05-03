import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.component').then((m) => m.HomeComponentModule),
  },
  {
    path: 'cubes',
    loadChildren: () => import('./cubes/cubes.component').then((m) => m.SandboxCubesModule),
    data: {
      title: 'Simple Cubes',
      description: 'Two spinning cubes along with a cube with different materials',
      link: '/cubes',
      asset: 'assets/examples/cubes',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/cubes',
    },
  },
  {
    path: 'keen-bloom',
    loadChildren: () => import('./keen-bloom/keen-bloom.component').then((m) => m.KeenComponentModule),
    data: {
      title: 'Keen Bloom',
      description: 'Simple example to show @angular-three/postprocessing',
      link: '/keen-bloom',
      asset: 'assets/examples/keen',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/keen-bloom',
    },
  },
  {
    path: 'physic-cubes',
    loadChildren: () => import('./physic-cubes/physic-cubes.component').then((m) => m.SandboxPhysicCubesModule),
    data: {
      title: 'Physic Cubes',
      description: 'Simple example to show @angular-three/cannon',
      link: '/physic-cubes',
      asset: 'assets/examples/physic-cubes',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/physic-cubes',
    },
  },
  {
    path: 'kinematic-cube',
    loadChildren: () => import('./kinematic-cube/kinematic-cube.component').then((m) => m.KinematicCubeComponentModule),
    data: {
      title: 'Kinematic Cube',
      description: '@angular-three/cannon example with InstancedMesh',
      link: '/kinematic-cube',
      asset: 'assets/examples/kinematic',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/kinematic-cube',
    },
  },
  {
    path: 'monday-morning',
    loadChildren: () => import('./monday-morning/monday-morning.component').then((m) => m.SandboxMondayMorningModule),
    data: {
      title: 'Monday Morning',
      description: '@angular-three/cannon example with Constraints',
      link: '/monday-morning',
      asset: 'assets/examples/monday-morning',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/monday-morning',
    },
  },
  {
    path: 'object-clump',
    loadChildren: () => import('./object-clump/object-clump.component').then((m) => m.ObjectClumpComponentModule),
    data: {
      title: 'Object Clump',
      description: '@angular-three/cannon example with Constraints and Force',
      link: '/object-clump',
      asset: 'assets/examples/clump',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/object-clump',
    },
  },
  {
    path: 'postprocessing-ssao',
    loadChildren: () =>
      import('./postprocessing-ssao/postprocessing-ssao.component').then((m) => m.PostProcessingSSAOComponentModule),
    data: {
      title: 'Postprocessing SSAO',
      description: '@angular-three/postprocessing example with SSAO',
      link: '/postprocessing-ssao',
      asset: 'assets/examples/postprocessing-ssao',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/postprocessing-ssao',
    },
  },
  {
    path: 'vertex-colors-instances',
    loadChildren: () =>
      import('./vertex-colors-instances/vertex-colors-instances.component').then(
        (m) => m.VertexColorsInstancesComponentModule
      ),
    data: {
      title: 'Vertex Colors Instances',
      description: 'THREE.InstancedMesh with Vertex Colors',
      link: '/vertex-colors-instances',
      asset: 'assets/examples/vertex-colors-instances',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/vertex-colors-instances',
    },
  },
  {
    path: 'height-field',
    loadChildren: () =>
      import('./height-field/height-field-example.component').then((m) => m.HeightFieldExampleComponentModule),
    data: {
      title: 'Height Field',
      description: 'Height field',
      link: '/height-field',
      asset: 'assets/examples/height-field',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/height-field',
    },
  },
];
