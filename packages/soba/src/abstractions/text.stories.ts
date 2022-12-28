import { extend } from '@angular-three/core';
import { NgtsText } from '@angular-three/soba/abstractions';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { DoubleSide, MeshBasicMaterial } from 'three';
import { StorybookSetup, turn } from '../setup-canvas';

extend({ MeshBasicMaterial });

@Component({
  selector: 'storybook-custom-material-text',
  standalone: true,
  template: `
    <ngts-text
      [text]="text"
      [fontSize]="12"
      [maxWidth]="200"
      [lineHeight]="1"
      [letterSpacing]="0.02"
      [textAlign]="'left'"
      [font]="'https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'"
      [anchorX]="'center'"
      [anchorY]="'middle'"
      (beforeRender)="turn($any($event).object)"
    >
      <ngt-mesh-basic-material
        [color]="color"
        [side]="DoubleSide"
        transparent
        opacity="1"
      ></ngt-mesh-basic-material>
    </ngts-text>
  `,
  imports: [NgtsText],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class CustomMaterialTextStory {
  @Input() text = '';
  @Input() color = 'turquoise';
  readonly turn = turn;
  readonly DoubleSide = DoubleSide;
}

@Component({
  selector: 'storybook-ltr-text',
  standalone: true,
  template: `
    <ngts-text
      [text]="text"
      [color]="'#EC2D2D'"
      [fontSize]="12"
      [maxWidth]="200"
      [lineHeight]="1"
      [letterSpacing]="0.02"
      [textAlign]="'right'"
      [direction]="'auto'"
      [font]="'https://fonts.gstatic.com/s/scheherazade/v20/YA9Ur0yF4ETZN60keViq1kQgtA.woff'"
      [anchorX]="'center'"
      [anchorY]="'middle'"
      (beforeRender)="turn($any($event).object)"
    >
    </ngts-text>
  `,
  imports: [NgtsText],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class LTRTextStory {
  @Input() text = '';
  readonly turn = turn;
}

@Component({
  selector: 'storybook-shadow-text',
  standalone: true,
  template: `
    <ngts-text
      [text]="text"
      [color]="'#EC2D2D'"
      [fontSize]="12"
      [maxWidth]="200"
      [lineHeight]="1"
      [letterSpacing]="0.02"
      [textAlign]="'left'"
      [font]="'https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'"
      [anchorX]="'center'"
      [anchorY]="'middle'"
      [outlineOffsetX]="'10%'"
      [outlineOffsetY]="'10%'"
      [outlineBlur]="'30%'"
      [outlineOpacity]="0.3"
      [outlineColor]="'#EC2D2D'"
      (beforeRender)="turn($any($event).object)"
    >
    </ngts-text>
  `,
  imports: [NgtsText],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class ShadowTextStory {
  @Input() text = '';
  readonly turn = turn;
}

@Component({
  selector: 'storybook-stroke-text',
  standalone: true,
  template: `
    <ngts-text
      [text]="text"
      [color]="'#EC2D2D'"
      [fontSize]="12"
      [maxWidth]="200"
      [lineHeight]="1"
      [letterSpacing]="0.02"
      [textAlign]="'left'"
      [font]="'https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'"
      [anchorX]="'center'"
      [anchorY]="'middle'"
      [strokeWidth]="'2.5%'"
      [strokeColor]="'#fff'"
      (beforeRender)="turn($any($event).object)"
    >
    </ngts-text>
  `,
  imports: [NgtsText],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class StrokeTextStory {
  @Input() text = '';
  readonly turn = turn;
}

@Component({
  selector: 'storybook-outline-text',
  standalone: true,
  template: `
    <ngts-text
      [text]="text"
      [color]="'#EC2D2D'"
      [fontSize]="12"
      [maxWidth]="200"
      [lineHeight]="1"
      [letterSpacing]="0.02"
      [textAlign]="'left'"
      [font]="'https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'"
      [anchorX]="'center'"
      [anchorY]="'middle'"
      [outlineWidth]="2"
      [outlineColor]="'#fff'"
      (beforeRender)="turn($any($event).object)"
    >
    </ngts-text>
  `,
  imports: [NgtsText],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class OutlineTextStory {
  @Input() text = '';
  readonly turn = turn;
}

@Component({
  selector: 'storybook-default-text',
  standalone: true,
  template: `
    <ngts-text
      [text]="text"
      [color]="'#EC2D2D'"
      [fontSize]="12"
      [maxWidth]="200"
      [lineHeight]="1"
      [letterSpacing]="0.02"
      [textAlign]="'left'"
      [font]="'https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'"
      [anchorX]="'center'"
      [anchorY]="'middle'"
      (beforeRender)="turn($any($event).object)"
    >
    </ngts-text>
  `,
  imports: [NgtsText],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class DefaultTextStory {
  @Input() text = '';
  readonly turn = turn;
}

export default {
  title: 'Abstractions/Text',
  decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;

export const Default: Story = (args) => ({
  props: {
    camera: { position: [0, 0, 200] },
    storyComponent: DefaultTextStory,
    storyInputs: args,
  },
  template: `
<storybook-setup [camera]="camera" [storyComponent]="storyComponent" [storyInputs]="storyInputs">
</storybook-setup>
    `,
});

Default.args = {
  text: `LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.`,
};

export const Outline: Story = (args) => ({
  props: {
    camera: { position: [0, 0, 200] },
    storyComponent: OutlineTextStory,
    storyInputs: args,
  },
  template: `
<storybook-setup [camera]="camera" [storyComponent]="storyComponent" [storyInputs]="storyInputs">
</storybook-setup>
    `,
});

Outline.args = {
  text: `LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.`,
};

export const Stroke: Story = (args) => ({
  props: {
    camera: { position: [0, 0, 200] },
    storyComponent: StrokeTextStory,
    storyInputs: args,
  },
  template: `
<storybook-setup [camera]="camera" [storyComponent]="storyComponent" [storyInputs]="storyInputs">
</storybook-setup>
    `,
});

Stroke.args = {
  text: `LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.`,
};

export const Shadow: Story = (args) => ({
  props: {
    camera: { position: [0, 0, 200] },
    storyComponent: ShadowTextStory,
    storyInputs: args,
  },
  template: `
<storybook-setup [camera]="camera" [storyComponent]="storyComponent" [storyInputs]="storyInputs">
</storybook-setup>
    `,
});

Shadow.args = {
  text: `LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.`,
};

export const LTR: Story = (args) => ({
  props: {
    camera: { position: [0, 0, 200] },
    storyComponent: LTRTextStory,
    storyInputs: args,
  },
  template: `
<storybook-setup [camera]="camera" [storyComponent]="storyComponent" [storyInputs]="storyInputs">
</storybook-setup>
    `,
});

LTR.args = {
  text: `ان عدة الشهور عند الله اثنا عشر شهرا في كتاب الله يوم خلق السماوات والارض SOME LATIN TEXT HERE منها اربعة حرم
        ذلك الدين القيم فلاتظلموا فيهن انفسكم وقاتلوا المشركين كافة كما يقاتلونكم كافة واعلموا ان الله مع المتقين`,
};

export const CustomMaterial: Story = (args) => ({
  props: {
    camera: { position: [0, 0, 200] },
    storyComponent: CustomMaterialTextStory,
    storyInputs: args,
  },
  template: `
<storybook-setup [camera]="camera" [storyComponent]="storyComponent" [storyInputs]="storyInputs">
</storybook-setup>
    `,
});

CustomMaterial.args = {
  text: `LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE
      MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO
      CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR.
      EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM.`,
  color: 'turquoise',
};
