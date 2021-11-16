export interface PhysicBodyEntity {
  name: string;
  props: string;
  argsFn: {
    withArgs: boolean;
    defaultArgs: string;
    body: string;
    asUnknown: boolean;
  };
  additionalImports: string[];
}

export type PhysicBodyCollection = PhysicBodyEntity[];
