import { logger } from '@nrwl/devkit';

export default async function () {
    logger.info(
        `@angular-three/cannon@v5 does not ship its own Cannon Web Worker API anymore so this schematic/generator is deprecated.`
    );
    logger.info(
        `You can just install @angular-three/cannon using your Package Manager and you're good to go.`
    );
}
