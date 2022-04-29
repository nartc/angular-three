import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtSobaTextModule } from '@angular-three/soba/abstractions';
import {
    componentWrapperDecorator,
    Meta,
    moduleMetadata,
    Story,
} from '@storybook/angular';
import * as THREE from 'three';
import { setupCanvas, setupCanvasModules, turnAnimate } from '../setup-canvas';

export default {
    title: 'Abstractions/Text',
    decorators: [
        componentWrapperDecorator(setupCanvas({ cameraPosition: [0, 0, 200] })),
        moduleMetadata({
            imports: [
                ...setupCanvasModules,
                NgtSobaTextModule,
                NgtMeshBasicMaterialModule,
            ],
        }),
    ],
} as Meta;

export const Default: Story = (args) => ({
    props: { ...args, onTextAnimate: turnAnimate },
    template: `
        <ngt-soba-text
          [text]="text"
          color="#EC2D2D"
          fontSize="12"
          maxWidth="200"
          lineHeight="1"
          letterSpacing="0.02"
          textAlign="left"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          (beforeRender)="onTextAnimate($event.object)"
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

export const Garfield: Story = (args) => ({
    props: { ...args, onTextAnimate: turnAnimate },
    template: `
        <ngt-soba-text
          [text]="text"
          color="#EC2D2D"
          fontSize="12"
          maxWidth="200"
          lineHeight="1"
          letterSpacing="0.02"
          textAlign="left"
          font="https://fonts.cdnfonts.com/s/1761/Garfield.woff"
          anchorX="center"
          anchorY="middle"
          (beforeRender)="onTextAnimate($event.object)"
        >
        </ngt-soba-text>
  `,
});

Garfield.args = {
    text: `LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.`,
};

export const Outline: Story = (args) => ({
    props: { ...args, onTextAnimate: turnAnimate },
    template: `
        <ngt-soba-text
          [text]="text"
          color="#EC2D2D"
          fontSize="12"
          maxWidth="200"
          lineHeight="1"
          letterSpacing="0.02"
          textAlign="left"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          outlineWidth="2"
          outlineColor="#ffffff"
          (beforeRender)="onTextAnimate($event.object)"
        >
        </ngt-soba-text>
  `,
});

Outline.args = {
    text: `LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.`,
};

export const TransparentWithStroke: Story = (args) => ({
    props: { ...args, onTextAnimate: turnAnimate },
    template: `
        <ngt-soba-text
          [text]="text"
          fontSize="12"
          maxWidth="200"
          lineHeight="1"
          letterSpacing="0.02"
          textAlign="left"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          fillOpacity="0"
          strokeWidth="2.5%"
          strokeColor="#ffffff"
          (beforeRender)="onTextAnimate($event.object)"
        >
        </ngt-soba-text>
  `,
});

TransparentWithStroke.args = {
    text: `LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.`,
};

export const Shadow: Story = (args) => ({
    props: { ...args, onTextAnimate: turnAnimate },
    template: `
        <ngt-soba-text
          [text]="text"
          color="#EC2D2D"
          fontSize="12"
          maxWidth="200"
          lineHeight="1"
          letterSpacing="0.02"
          textAlign="left"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          outlineOffsetX="10%"
          outlineOffsetY="10%"
          outlineBlur="30%"
          outlineOpacity="0.3"
          outlineColor="#EC2D2D"
          (beforeRender)="onTextAnimate($event.object)"
        >
        </ngt-soba-text>
  `,
});

Shadow.args = {
    text: `LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.`,
};

export const LTR: Story = (args) => ({
    props: { ...args, onTextAnimate: turnAnimate },
    template: `
        <ngt-soba-text
          [text]="text"
          color="#EC2D2D"
          fontSize="12"
          maxWidth="200"
          lineHeight="1"
          letterSpacing="0.02"
          textAlign="right"
          direction="auto"
          font="https://fonts.gstatic.com/s/scheherazade/v20/YA9Ur0yF4ETZN60keViq1kQgtA.woff"
          anchorX="center"
          anchorY="middle"
          (beforeRender)="onTextAnimate($event.object)"
        >
        </ngt-soba-text>
  `,
});

LTR.args = {
    text: `ان عدة الشهور عند الله اثنا عشر شهرا في كتاب الله يوم خلق السماوات والارض SOME LATIN TEXT HERE منها اربعة حرم ذلك
      الدين القيم فلاتظلموا فيهن انفسكم وقاتلوا المشركين كافة كما يقاتلونكم كافة واعلموا ان الله مع المتقين`,
};

// TODO: broken at the moment
export const CustomMaterial: Story = (args) => ({
    props: {
        ...args,
        onTextAnimate: turnAnimate,
        DoubleSide: THREE.DoubleSide,
    },
    template: `
        <ngt-mesh-basic-material
            #ngtMaterial
            [side]="DoubleSide"
            color="orange"
            transparent
            noAttach
        ></ngt-mesh-basic-material>
        <ngt-soba-text
          [text]="text"
          [material]="ngtMaterial.instance"
          fontSize="12"
          maxWidth="200"
          lineHeight="1"
          letterSpacing="0.02"
          textAlign="left"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          (beforeRender)="onTextAnimate($event.object)"
        >
        </ngt-soba-text>
  `,
});

CustomMaterial.args = {
    text: `LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.`,
};
