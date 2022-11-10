import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'cubes',
    loadComponent: () => import('./cubes/cubes.component'),
    data: {
      title: 'Simple Cubes',
      description: 'Two spinning cubes along with a cube with different materials',
      link: '/cubes',
      asset: 'assets/examples/cubes',
      source: 'https://github.com/nartc/angular-three/tree/main/packages/sandbox/src/app/cubes',
    },
  },
  {
    path: 'keen-bloom',
    loadComponent: () => import('./keen-bloom/keen-bloom.component'),
    data: {
      title: 'Keen Bloom',
      description: 'Simple example to show @angular-three/postprocessing',
      link: '/keen-bloom',
      asset: 'assets/examples/keen',
      source: 'https://github.com/nartc/angular-three/tree/main/packages/sandbox/src/app/keen-bloom',
    },
  },
  {
    path: 'view-cube',
    loadComponent: () => import('./view-cube/view-cube.component'),
    data: {
      title: 'View Cube',
      description: 'Heads-up-displays using NgtPortal',
      link: '/view-cube',
      asset: 'assets/examples/view-cube',
      source: 'https://github.com/nartc/angular-three/tree/main/packages/sandbox/src/app/view-cube',
    },
  },
  {
    path: 'vertex-colors-instances',
    loadComponent: () => import('./vertex-colors-instances/vertex-colors-instances.component'),
    data: {
      title: 'Vertex Colors Instances',
      description: 'THREE.InstancedMesh with Vertex Colors',
      link: '/vertex-colors-instances',
      asset: 'assets/examples/vertex-colors-instances',
      source: 'https://github.com/nartc/angular-three/tree/main/packages/sandbox/src/app/vertex-colors-instances',
    },
  },
  {
    path: 'physic-cubes',
    loadComponent: () => import('./physic-cubes/physic-cubes.component'),
    data: {
      title: 'Physic Cubes',
      description: 'Simple example to show @angular-three/cannon',
      link: '/physic-cubes',
      asset: 'assets/examples/physic-cubes',
      source: 'https://github.com/nartc/angular-three/tree/main/packages/sandbox/src/app/physic-cubes',
    },
  },
  {
    path: 'kinematic-cube',
    loadComponent: () => import('./kinematic-cube/kinematic-cube.component'),
    data: {
      title: 'Kinematic Cube',
      description: '@angular-three/cannon example with InstancedMesh',
      link: '/kinematic-cube',
      asset: 'assets/examples/kinematic',
      source: 'https://github.com/nartc/angular-three/tree/main/packages/sandbox/src/app/kinematic-cube',
    },
  },
  {
    path: 'color-grading',
    loadComponent: () => import('./color-grading/color-grading.component'),
    data: {
      title: 'Color Grading',
      description: 'Performance tip by color grading with LUTEffect',
      link: '/color-grading',
      asset: 'assets/examples/color-grading',
      source: 'https://github.com/nartc/angular-three/tree/main/packages/sandbox/src/app/color-grading',
    },
  },
  {
    path: 'object-clump',
    loadComponent: () => import('./object-clump/object-clump.component'),
    data: {
      title: 'Object Clump',
      description: '@angular-three/cannon example with Constraints and Force',
      link: '/object-clump',
      asset: 'assets/examples/clump',
      source: 'https://github.com/nartc/angular-three/tree/main/packages/sandbox/src/app/object-clump',
    },
  },
  {
    path: 'level-of-detail',
    loadComponent: () => import('./level-of-detail/level-of-detail.component'),
    data: {
      title: 'Level of Detail',
      description: 'Performance tip by leveraging LOD and reusing Geometry',
      link: '/level-of-detail',
      asset: 'assets/examples/level-of-detail',
      source: 'https://github.com/nartc/angular-three/tree/main/packages/sandbox/src/app/level-of-detail',
    },
  },
  {
    path: 'reuse-gltf',
    loadComponent: () => import('./reuse-gltf/reuse-gltf.component'),
    data: {
      title: 'Reusing GLTF',
      description: 'Performance tip by reusing GLTF with NgtGLTFLoader',
      link: '/reuse-gltf',
      asset: 'assets/examples/reuse-gltf',
      source: 'https://github.com/nartc/angular-three/tree/main/packages/sandbox/src/app/reuse-gltf',
    },
  },
  {
    path: 'monday-morning',
    loadComponent: () => import('./monday-morning/monday-morning.component'),
    data: {
      title: 'Monday Morning',
      description: '@angular-three/cannon example with Constraints',
      link: '/monday-morning',
      asset: 'assets/examples/monday-morning',
      source: 'https://github.com/nartc/angular-three/tree/main/packages/sandbox/src/app/monday-morning',
    },
  },
  {
    path: 'height-field',
    loadComponent: () => import('./height-field/height-field.component'),
    data: {
      title: 'Height Field',
      description: 'Example with Height Field physic body using custom Height Field Geometry',
      link: '/height-field',
      asset: 'assets/examples/height-field',
      source: 'https://github.com/nartc/angular-three/tree/main/packages/sandbox/src/app/height-field',
    },
  },
  {
    path: 'movement-regression',
    loadComponent: () => import('./movement-regression/movement-regression.component'),
    data: {
      title: 'Movement Regression',
      description: 'Performance tip by regressing camera controls using AdaptiveDpr',
      link: '/movement-regression',
      asset: 'assets/examples/movement-regression',
      source: 'https://github.com/nartc/angular-three/tree/main/packages/sandbox/src/app/movement-regression',
    },
  },
];
