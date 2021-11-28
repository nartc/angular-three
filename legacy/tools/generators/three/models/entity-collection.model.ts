export interface Entity {
  name: string;
  abstractGenerics?: {
    main: string;
    secondary?: string;
  };
}

export interface EntityCollection {
  core: Entity[];
  examples?: Entity[];
  from?: Record<string, string>;
}
