import { ThreeCoreImports } from './three-core-imports.enum';
import { ThreeImports } from './three-imports.enum';
import { PassImports } from './pass-imports.enum';
import { SceneAndCamera } from './scene-and-camera.enum';

export interface PassEntity {
  name: string;
  threeCoreImports: ThreeCoreImports[];
  threeImports: ThreeImports[];
  passImports: PassImports[];
  inputs: Array<{
    name: string;
    import: string;
    isArray: boolean;
  }>;
  importReflector?: boolean;
  importFsQuad?: boolean;
  useSceneAndCamera: SceneAndCamera | null;
}

export type ShaderPassEntity = Omit<PassEntity, 'name'>;
export type PassCollection = PassEntity[];
