import { PhysicConstraintCollection } from '../models/physic-constraint-collection.model';

export const physicConstraints: PhysicConstraintCollection = [
  {
    name: 'PointToPoint',
    options: 'PointToPointConstraintOpts',
  },
  {
    name: 'ConeTwist',
    options: 'ConeTwistConstraintOpts',
  },
  {
    name: 'Distance',
    options: 'DistanceConstraintOpts',
  },
  {
    name: 'Hinge',
    options: 'HingeConstraintOpts',
  },
  {
    name: 'Lock',
    options: 'LockConstraintOpts',
  },
];
