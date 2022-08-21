import { Routes } from '@angular/router';
import { environment } from '../environments/environment';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'sandbox',
    loadComponent: () => import('./sandbox/sandbox.component').then((m) => m.SandboxComponent),
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
    loadComponent: () => import('./cubes/cubes.component').then((m) => m.SandboxCubesComponent),
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
    loadComponent: () => import('./keen-bloom/keen-bloom.component').then((m) => m.KeenBloomComponent),
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
    loadComponent: () => import('./physic-cubes/physic-cubes.component').then((m) => m.SandboxPhysicCubesComponent),
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
    loadComponent: () => import('./kinematic-cube/kinematic-cube.component').then((m) => m.KinematicCubeComponent),
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
    loadComponent: () =>
      import('./monday-morning/monday-morning.component').then((m) => m.SandboxMondayMorningComponent),
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
    loadComponent: () => import('./object-clump/object-clump.component').then((m) => m.ObjectClumpComponent),
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
    loadComponent: () =>
      import('./postprocessing-ssao/postprocessing-ssao.component').then((m) => m.PostProcessingSSAOComponent),
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
    loadComponent: () =>
      import('./vertex-colors-instances/vertex-colors-instances.component').then(
        (m) => m.VertexColorsInstancesComponent
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
    loadComponent: () =>
      import('./height-field/height-field-example.component').then((m) => m.HeightFieldExampleComponent),
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
    loadComponent: () =>
      import('./movement-regression/movement-regression.component').then((m) => m.MovementRegressionComponent),
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
    loadComponent: () => import('./reuse-gltf/reuse-gltf.component').then((m) => m.ReuseGltfComponent),
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
    loadComponent: () => import('./color-grading/color-grading.component').then((m) => m.ColorGradingComponent),
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
    loadComponent: () => import('./level-of-detail/level-of-detail.component').then((m) => m.LevelOfDetailComponent),
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
    loadComponent: () => import('./raycast-vehicle/raycast-vehicle.component').then((m) => m.RaycastVehicleComponent),
    data: {
      title: 'Raycast Vehicle',
      description: 'Raycast Vehicle example using @angular-three/cannon (ported from R3F use-cannon)',
      link: '/raycast-vehicle',
      asset: 'assets/examples/raycast-vehicle',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/raycast-vehicle',
    },
  },
  {
    path: 'xrcubes',
    loadComponent: () => import('./xrcubes/xrcubes.component').then((m) => m.SandboxXRCubesComponent),
    data: {
      title: 'Simple Cubes in VR',
      description: 'Delayed loading of spinning cubes after Enter VR',
      link: '/xrcubes',
      asset: 'assets/examples/cubes',
      source: 'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/xrcubes',
    },
  },
  {
    path: 'transform-and-makedefault',
    loadComponent: () =>
      import('./transform-controls-and-make-default/transform-controls-and-make-default.component').then(
        (m) => m.TransformSandBox
      ),
    data: {
      title: 'TransformControls and makeDefault',
      description: 'Combining TransformControls, OrbitControls and Valtio.',
      link: '/transform-and-makedefault',
      //asset: 'assets/examples/cubes',
      source:
        'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/transform-controls-and-make-default',
    },
  },
];
