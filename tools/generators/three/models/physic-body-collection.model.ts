export interface PhysicBodyEntity {
  name: string;
  props: string;
  argsFn: {
    withArgs: boolean;
    defaultArgs: string;
    body: string;
    shorthandReturn: boolean;
  };
  additionalImports: string[];
}

export type PhysicBodyCollection = PhysicBodyEntity[];
