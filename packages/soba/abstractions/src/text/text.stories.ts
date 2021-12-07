import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
} from '@storybook/angular';
import * as THREE from 'three';
import { NgtSobaText, NgtSobaTextModule } from './text.component';

export default {
  title: 'Soba/Abstractions/Text',
  component: NgtSobaText,
  decorators: [
    componentWrapperDecorator(
      setupCanvas({ cameraPosition: [0, 0, 200], black: true })
    ),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtSobaTextModule,
        NgtMeshBasicMaterialModule,
      ],
    }),
  ],
} as Meta;

const onTextAnimate = (text: THREE.Mesh) => {
  text.rotation.y += 0.01;
};

export const Default = () => ({
  props: { onTextAnimate },
  template: `
    <ngt-soba-text
      #sobaText='ngtSobaText'
      [color]="'#EC2D2D'"
      [fontSize]='12'
      [maxWidth]='200'
      [lineHeight]='1'
      [letterSpacing]='0.02'
      [textAlign]="'left'"
      font='https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'
      anchorX='center'
      anchorY='middle'
      (animateReady)='onTextAnimate(sobaText.object)'
    >
      LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.
    </ngt-soba-text>
  `,
});

export const Outline = () => ({
  props: { onTextAnimate },
  template: `
    <ngt-soba-text
      #sobaText='ngtSobaText'
      [color]="'#EC2D2D'"
      [fontSize]='12'
      [maxWidth]='200'
      [lineHeight]='1'
      [letterSpacing]='0.02'
      [textAlign]="'left'"
      font='https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'
      anchorX='center'
      anchorY='middle'
      [outlineWidth]='2'
      outlineColor='#ffffff'
      (animateReady)='onTextAnimate(sobaText.object)'
    >
      LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.
    </ngt-soba-text>
  `,
});

export const TransparentWithStroke = () => ({
  props: { onTextAnimate },
  template: `
    <ngt-soba-text
      #sobaText='ngtSobaText'
      [fontSize]='12'
      [maxWidth]='200'
      [lineHeight]='1'
      [letterSpacing]='0.02'
      [textAlign]="'left'"
      font='https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'
      anchorX='center'
      anchorY='middle'
      [fillOpacity]='0'
      [strokeWidth]="'2.5%'"
      strokeColor='#ffffff'
      (animateReady)='onTextAnimate(sobaText.object)'
    >
      LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.
    </ngt-soba-text>
  `,
});

export const Shadow = () => ({
  props: { onTextAnimate },
  template: `
    <ngt-soba-text
      #sobaText='ngtSobaText'
      [color]="'#EC2D2D'"
      [fontSize]='12'
      [maxWidth]='200'
      [lineHeight]='1'
      [letterSpacing]='0.02'
      [textAlign]="'left'"
      font='https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'
      anchorX='center'
      anchorY='middle'
      [outlineOffsetX]="'10%'"
      [outlineOffsetY]="'10%'"
      [outlineBlur]="'30%'"
      [outlineOpacity]='0.3'
      outlineColor='#EC2D2D'
      (animateReady)='onTextAnimate(sobaText.object)'
    >
      LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.
    </ngt-soba-text>
  `,
});

export const LTR = () => ({
  props: { onTextAnimate },
  template: `
    <ngt-soba-text
      #sobaText='ngtSobaText'
      [color]="'#EC2D2D'"
      [fontSize]='12'
      [maxWidth]='200'
      [lineHeight]='1'
      [letterSpacing]='0.02'
      textAlign='right'
      direction='auto'
      font='https://fonts.gstatic.com/s/scheherazade/v20/YA9Ur0yF4ETZN60keViq1kQgtA.woff'
      anchorX='center'
      anchorY='middle'
      (animateReady)='onTextAnimate(sobaText.object)'
    >
      ان عدة الشهور عند الله اثنا عشر شهرا في كتاب الله يوم خلق السماوات والارض SOME LATIN TEXT HERE منها اربعة حرم ذلك
      الدين القيم فلاتظلموا فيهن انفسكم وقاتلوا المشركين كافة كما يقاتلونكم كافة واعلموا ان الله مع المتقين
    </ngt-soba-text>
  `,
});

export const CustomMaterial = () => ({
  props: { onTextAnimate, DoubleSide: THREE.DoubleSide },
  template: `
    <ngt-soba-text
      #sobaText='ngtSobaText'
      [fontSize]='12'
      [maxWidth]='200'
      [lineHeight]='1'
      [letterSpacing]='0.02'
      [textAlign]="'left'"
      font='https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'
      anchorX='center'
      anchorY='middle'
      (animateReady)='onTextAnimate(sobaText.object)'
    >
      <ngt-mesh-basic-material
        [parameters]='{side: DoubleSide, color: "turquoise", transparent: true }'
      ></ngt-mesh-basic-material>
      LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.
    </ngt-soba-text>
  `,
});
