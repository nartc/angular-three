import { NgtMeshBasicMaterial } from '@angular-three/core/materials';
import { SobaText } from '@angular-three/soba/abstractions';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import * as THREE from 'three';
import { setupCanvas, setupCanvasImports, turnAnimation } from '../setup-canvas';

export default {
    title: 'Abstractions/Text',
    decorators: [
        componentWrapperDecorator(setupCanvas({ camera: { position: [0, 0, 200] } })),
        moduleMetadata({ imports: [setupCanvasImports, NgtMeshBasicMaterial, SobaText] }),
    ],
} as Meta;

export const Default: Story = (args) => ({
    props: { ...args, beforeRender: turnAnimation },
    template: `
<ngt-soba-text
    [text]="text"
    color="#EC2D2D"
    [fontSize]="12"
    [maxWidth]="200"
    [lineHeight]="1"
    [letterSpacing]="0.02"
    textAlign="left"
    font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
    anchorX="center"
    anchorY="middle"
    [beforeRender]="beforeRender"
>
</ngt-soba-text>
  `,
});

Default.args = {
    text: `LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.`,
};

export const CustomMaterial: Story = (args) => ({
    props: {
        ...args,
        beforeRender: turnAnimation,
        DoubleSide: THREE.DoubleSide,
    },
    template: `
<ngt-soba-text
    [text]="text"
    [fontSize]="12"
    [maxWidth]="200"
    [lineHeight]="1"
    [letterSpacing]="0.02"
    textAlign="left"
    font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
    anchorX="center"
    anchorY="middle"
    [beforeRender]="beforeRender"
>
    <ngt-mesh-basic-material
        [side]="DoubleSide"
        color="orange"
        [transparent]="true"
    ></ngt-mesh-basic-material>
</ngt-soba-text>
  `,
});

CustomMaterial.args = {
    text: `LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.`,
};
