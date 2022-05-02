import { NgtIcosahedronGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaHtmlModule } from '@angular-three/soba/misc';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { setupCanvas, setupCanvasModules, turnAnimate } from '../setup-canvas';

@Component({
  selector: 'html-occlude-story',
  template: `
    <ngt-group #ngtGroup (beforeRender)="turnAnimate($event.object)">
      <ngt-icosahedron-geometry #ngtIcosahedronGeometry [args]="[5, 5]"></ngt-icosahedron-geometry>
      <ngt-mesh name="pink" [position]="[0, 0, 0]" [geometry]="ngtIcosahedronGeometry.instance">
        <ngt-mesh-basic-material color="hotpink" wireframe></ngt-mesh-basic-material>

        <ngt-soba-html [position]="[0, 0, -6]" htmlClass="html-story-label" [occlude]="[ngtGroup.instance]">
          <ng-template ngt-soba-html-content> A </ng-template>
        </ngt-soba-html>
      </ngt-mesh>

      <ngt-mesh name="yellow" [position]="[16, 0, 0]" [geometry]="ngtIcosahedronGeometry.instance">
        <ngt-mesh-basic-material color="yellow" wireframe></ngt-mesh-basic-material>

        <ngt-soba-html [position]="[0, 0, -6]" htmlClass="html-story-label" [occlude]="[ngtGroup.instance]">
          <ng-template ngt-soba-html-content> B </ng-template>
        </ngt-soba-html>
      </ngt-mesh>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HtmlOccludeStory {
  readonly turnAnimate = turnAnimate;
}

@NgModule({
  declarations: [HtmlOccludeStory],
  exports: [HtmlOccludeStory],
  imports: [NgtGroupModule, NgtMeshModule, NgtIcosahedronGeometryModule, NgtMeshBasicMaterialModule, NgtSobaHtmlModule],
})
class HtmlOccludeStoryModule {}

export default {
  title: 'Misc/HTML',
  decorators: [
    componentWrapperDecorator(setupCanvas({ cameraPosition: [-20, 20, -20] })),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtSobaHtmlModule,
        NgtGroupModule,
        NgtMeshModule,
        NgtMeshBasicMaterialModule,
        NgtIcosahedronGeometryModule,
        HtmlOccludeStoryModule,
      ],
    }),
  ],
} as Meta;

export const Default: Story = (args) => ({
  props: { onBeforeRender: turnAnimate, ...args },
  template: `
        <ngt-group (beforeRender)="onBeforeRender($event.object)">
            <ngt-icosahedron-geometry #ngtGeometry [args]="[2, 2]"></ngt-icosahedron-geometry>
            <ngt-mesh-basic-material
                #ngtMaterial
                wireframe
                color="hotpink"
            ></ngt-mesh-basic-material>
            <ngt-mesh
                [position]="[3, 6, 4]"
                [geometry]="ngtGeometry.instance"
                [material]="ngtMaterial.instance"
            >
                <ngt-soba-html [distanceFactor]="distanceFactor" [htmlClass]="htmlClass">
                    <ng-template ngt-soba-html-content>
                        First
                    </ng-template>
                </ngt-soba-html>
            </ngt-mesh>
            <ngt-mesh
                [position]="[10, 0, 10]"
                [geometry]="ngtGeometry.instance"
                [material]="ngtMaterial.instance"
            >
                <ngt-soba-html [distanceFactor]="distanceFactor" [htmlClass]="htmlClass">
                    <ng-template ngt-soba-html-content>
                        Second
                    </ng-template>
                </ngt-soba-html>
            </ngt-mesh>
            <ngt-mesh
                [position]="[-20, 0, -20]"
                [geometry]="ngtGeometry.instance"
                [material]="ngtMaterial.instance"
            >
                <ngt-soba-html [distanceFactor]="distanceFactor" [htmlClass]="htmlClass">
                    <ng-template ngt-soba-html-content>
                        Third
                    </ng-template>
                </ngt-soba-html>
            </ngt-mesh>
        </ngt-group>
    `,
});

Default.args = {
  distanceFactor: 30,
  htmlClass: 'html-story-block',
};

export const Transform: Story = (args) => ({
  props: { onBeforeRender: turnAnimate, ...args },
  template: `
        <ngt-group (beforeRender)="onBeforeRender($event.object)">
            <ngt-icosahedron-geometry #ngtGeometry [args]="[2, 2]"></ngt-icosahedron-geometry>
            <ngt-mesh-basic-material
                #ngtMaterial
                wireframe
                [color]="color"
            ></ngt-mesh-basic-material>
            <ngt-mesh
                [position]="[3, 6, 4]"
                [geometry]="ngtGeometry.instance"
                [material]="ngtMaterial.instance"
            >
                <ngt-soba-html [transform]="transform" [distanceFactor]="distanceFactor" [htmlClass]="htmlClass">
                    <ng-template ngt-soba-html-content>
                        First
                    </ng-template>
                </ngt-soba-html>
            </ngt-mesh>
            <ngt-mesh
                [position]="[10, 0, 10]"
                [geometry]="ngtGeometry.instance"
                [material]="ngtMaterial.instance"
            >
                <ngt-soba-html [transform]="transform" [distanceFactor]="distanceFactor" [htmlClass]="htmlClass">
                    <ng-template ngt-soba-html-content>
                        Second
                    </ng-template>
                </ngt-soba-html>
            </ngt-mesh>
            <ngt-mesh
                [position]="[-20, 0, -20]"
                [geometry]="ngtGeometry.instance"
                [material]="ngtMaterial.instance"
            >
                <ngt-soba-html [transform]="transform" [distanceFactor]="distanceFactor" [htmlClass]="htmlClass">
                    <ng-template ngt-soba-html-content>
                        Third
                    </ng-template>
                </ngt-soba-html>
            </ngt-mesh>
            <ngt-soba-html
                sprite
                distanceFactor="20"
                [transform]="transform"
                [style]="{background: color, fontSize: '50px', padding: '10px 18px', border: '2px solid black'}"
                [position]="[5, 15, 0]"
            >
                <ng-template ngt-soba-html-content>
                    Transform Mode
                </ng-template>
            </ngt-soba-html>
        </ngt-group>
    `,
});

Transform.args = {
  color: 'palegreen',
  transform: true,
  htmlClass: 'html-story-block margin300',
  distanceFactor: 30,
};

export const RaycastOccluder: Story = () => ({
  template: `<html-occlude-story></html-occlude-story>`,
});
