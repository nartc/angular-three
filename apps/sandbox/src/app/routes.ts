import { Routes } from '@angular/router';
import { environment } from '../environments/environment';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.component').then((m) => m.HomeComponentModule),
  },
  {
    path: 'sandbox',
    loadChildren: () => import('./sandbox/sandbox.component').then((m) => m.SandboxComponentModule),
    data: {
      title: 'Sandbox',
      description: 'Two spinning cubes along with a cube with different materials',
      link: '/sandbox',
      asset: 'assets/examples/cubes',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/cubes',
      hidden: environment.production,
    },
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
      description: 'Example with Height Field physic body using custom Height Field Geometry',
      link: '/height-field',
      asset: 'assets/examples/height-field',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/height-field',
    },
  },
  {
    path: 'movement-regression',
    loadChildren: () =>
      import('./movement-regression/movement-regression.component').then((m) => m.MovementRegressionComponentModule),
    data: {
      title: 'Movement Regression',
      description: 'Performance tip by regressing camera controls using AdaptiveDpr',
      link: '/movement-regression',
      asset: 'assets/examples/movement-regression',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/movement-regression',
    },
  },
  {
    path: 'reuse-gltf',
    loadChildren: () => import('./reuse-gltf/reuse-gltf.component').then((m) => m.ReuseGltfComponentModule),
    data: {
      title: 'Reusing GLTF',
      description: 'Performance tip by reusing GLTF with NgtGLTFLoader',
      link: '/reuse-gltf',
      asset: 'assets/examples/reuse-gltf',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/reuse-gltf',
    },
  },
  {
    path: 'color-grading',
    loadChildren: () => import('./color-grading/color-grading.component').then((m) => m.ColorGradingComponentModule),
    data: {
      title: 'Color Grading',
      description: 'Performance tip by color grading with LUTEffect',
      link: '/color-grading',
      asset: 'assets/examples/color-grading',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/color-grading',
    },
  },
  {
    path: 'level-of-detail',
    loadChildren: () =>
      import('./level-of-detail/level-of-detail.component').then((m) => m.LevelOfDetailComponentModule),
    data: {
      title: 'Level of Detail',
      description: 'Performance tip by leveraging LOD and reusing Geometry',
      link: '/level-of-detail',
      asset: 'assets/examples/level-of-detail',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/level-of-detail',
    },
  },
  {
    path: 'raycast-vehicle',
    loadChildren: () =>
      import('./raycast-vehicle/raycast-vehicle.component').then((m) => m.RaycastVehicleComponentModule),
    data: {
      title: 'Raycast Vehicle',
      description: 'Raycast Vehicle example using @angular-three/cannon (ported from R3F use-cannon)',
      link: '/raycast-vehicle',
      asset: 'assets/examples/raycast-vehicle',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/raycast-vehicle',
    },
  },
];
