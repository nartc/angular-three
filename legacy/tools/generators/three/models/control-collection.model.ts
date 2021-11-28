/**
 * {
    name: DragControls.name,
    injectDocument: false,
    importThree: true,
    useRenderer: true,
    useScene: false,
    inputs: [
      {
        name: 'objects',
        import: 'Object3D',
        isOptional: false,
        isArray: true,
        default: '[]',
      },
    ],
    constructor: '(this.objects, camera, renderer.domElement)',
  },
 */

export interface ControlEntity {
  name: string;
  injectDocument: boolean;
  importThree: boolean;
  useRenderer: boolean;
  useScene: boolean;
  inputs: Array<{
    name: string;
    import: string;
    isOptional: boolean;
    isArray: boolean;
    default: string;
  }>;
  constructor: string;
}

export type ControlCollection = ControlEntity[];
