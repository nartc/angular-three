import { PhysicBodyCollection } from '../models/physic-body-collection.model';

export const physicBodies: PhysicBodyCollection = [
  {
    name: 'Box',
    props: 'BoxProps',
    argsFn: {
      shorthandReturn: true,
      withArgs: true,
      defaultArgs: '[1, 1, 1]',
      body: 'args',
    },
    additionalImports: [],
  },
  {
    name: 'Plane',
    props: 'PlaneProps',
    argsFn: {
      shorthandReturn: true,
      withArgs: false,
      defaultArgs: '',
      body: '[]',
    },
    additionalImports: [],
  },
  {
    name: 'Cylinder',
    props: 'CylinderProps',
    argsFn: {
      shorthandReturn: true,
      withArgs: true,
      defaultArgs: '[]',
      body: 'args',
    },
    additionalImports: [],
  },
  {
    name: 'Heightfield',
    props: 'HeightfieldProps',
    argsFn: {
      shorthandReturn: true,
      withArgs: true,
      defaultArgs: '',
      body: 'args',
    },
    additionalImports: [],
  },
  {
    name: 'Particle',
    props: 'ParticleProps',
    argsFn: {
      shorthandReturn: true,
      withArgs: false,
      defaultArgs: '',
      body: '[]',
    },
    additionalImports: [],
  },
  {
    name: 'Sphere',
    props: 'SphereProps',
    argsFn: {
      shorthandReturn: false,
      withArgs: true,
      defaultArgs: '[1]',
      body: `{
  if (!Array.isArray(args)) throw new Error("useSphere args must be an array");
  return [args[0]];
}`,
    },
    additionalImports: [],
  },
  {
    name: 'Trimesh',
    props: 'TrimeshProps',
    argsFn: {
      shorthandReturn: true,
      withArgs: true,
      defaultArgs: '',
      body: 'args',
    },
    additionalImports: [],
  },
  {
    name: 'ConvexPolyhedron',
    props: 'ConvexPolyhedronProps',
    argsFn: {
      shorthandReturn: false,
      withArgs: true,
      defaultArgs: '[]',
      body: `{
  return [
    args[0] ? args[0].map(makeTriplet) : undefined,
    args[1],
    args[2] ? args[2].map(makeTriplet) : undefined,
    args[3] ? args[3].map(makeTriplet) : undefined,
    args[4],
  ];
}`,
    },
    additionalImports: ['makeTriplet'],
  },
  {
    name: 'Compound',
    props: 'CompoundBodyProps',
    argsFn: {
      shorthandReturn: true,
      withArgs: true,
      defaultArgs: '',
      body: 'args',
    },
    additionalImports: [],
  },
];
