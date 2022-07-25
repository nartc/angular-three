"use strict";(self.webpackChunklibs_documentations=self.webpackChunklibs_documentations||[]).push([[100],{9613:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return g}});var a=n(9496);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=a.createContext({}),s=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=s(e.components);return a.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,p=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),m=s(n),g=o,u=m["".concat(p,".").concat(g)]||m[g]||c[g]||r;return n?a.createElement(u,i(i({ref:t},d),{},{components:n})):a.createElement(u,i({ref:t},d))}));function g(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=m;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var s=2;s<r;s++)i[s]=n[s];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2012:function(e,t,n){n.r(t),n.d(t,{assets:function(){return d},contentTitle:function(){return p},default:function(){return g},frontMatter:function(){return l},metadata:function(){return s},toc:function(){return c}});var a=n(2081),o=n(4604),r=(n(9496),n(9613)),i=["components"],l={id:"migrate-to-v6",title:"Migrate to v6",sidebar_label:"Migrate to v6"},p=void 0,s={unversionedId:"getting-started/migrate-to-v6",id:"getting-started/migrate-to-v6",title:"Migrate to v6",description:"@angular-three/core@6 are mostly about removing old APIs, supporting Angular 14, and THREE 0.142",source:"@site/docs/getting-started/migrate-to-v6.mdx",sourceDirName:"getting-started",slug:"/getting-started/migrate-to-v6",permalink:"/docs/getting-started/migrate-to-v6",draft:!1,editUrl:"https://github.com/nartc/angular-three/tree/main/libs/documentations/docs/docs/getting-started/migrate-to-v6.mdx",tags:[],version:"current",frontMatter:{id:"migrate-to-v6",title:"Migrate to v6",sidebar_label:"Migrate to v6"},sidebar:"docs",previous:{title:"Installation",permalink:"/docs/getting-started/installation"},next:{title:"Migrate to v5",permalink:"/docs/getting-started/migrate-to-v5"}},d={},c=[{value:"Standalone APIs",id:"standalone-apis",level:2},{value:"<code>(animateReady)</code>",id:"animateready",level:2},{value:"<code>make()</code> API",id:"make-api",level:2},{value:"<code>NgtComponentStore</code>",id:"ngtcomponentstore",level:2},{value:"<code>NgtComponentStore#onCanvasReady</code>",id:"ngtcomponentstoreoncanvasready",level:4},{value:"<code>NgtCoreModule</code>",id:"ngtcoremodule",level:2},{value:"<code>NgtColorPipe</code>",id:"ngtcolorpipe",level:2},{value:"<code>NgtFogPipe</code> and <code>NgtFogExp2Pipe</code>",id:"ngtfogpipe-and-ngtfogexp2pipe",level:2},{value:"<code>NgtVector*Pipe</code>",id:"ngtvectorpipe",level:2},{value:"<code>NgtObjectInputs</code> name change",id:"ngtobjectinputs-name-change",level:2},{value:"<code>inject()</code> API",id:"inject-api",level:2},{value:"<code>[parameters]</code> on Materials are removed",id:"parameters-on-materials-are-removed",level:2}],m={toc:c};function g(e){var t=e.components,n=(0,o.Z)(e,i);return(0,r.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"@angular-three/core@6")," are mostly about removing old APIs, supporting Angular 14, and THREE 0.142"),(0,r.kt)("h2",{id:"standalone-apis"},"Standalone APIs"),(0,r.kt)("p",null,"Angular 14 comes with Standalone Components. Angular Three v6 provides all components/directives/pipes as Standalone. However, Angular Three v6 still exposes Module APIs to ease the migrations. Please consider moving to Standalone APIs as Module APIs will be removed in the next major version"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-diff"},"- import { NgtCanvasModule } from '@angular-three/core';\n+ import { NgtCanvas } from '@angular-three/core';\n\n@NgModule({\n    imports: [\n-       NgtCanvasModule\n+       NgtCanvas\n    ]\n})\nexport class AppModule {}\n")),(0,r.kt)("h2",{id:"animateready"},(0,r.kt)("inlineCode",{parentName:"h2"},"(animateReady)")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"(animateReady)")," is removed. Please use ",(0,r.kt)("inlineCode",{parentName:"p"},"(beforeRender)")," instead."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'- <ngt-mesh (animateReady)="onAnimateReady($event)"></ngt-mesh>\n+ <ngt-mesh (beforeRender)="onAnimateReady($event)"></ngt-mesh>\n')),(0,r.kt)("h2",{id:"make-api"},(0,r.kt)("inlineCode",{parentName:"h2"},"make()")," API"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"makeVector*()")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"makeColor()")," have been removed in favor of ",(0,r.kt)("inlineCode",{parentName:"p"},"make()")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-diff"},"- makeVector2();\n+ make(THREE.Vector2);\n\n- makeVector3();\n+ make(THREE.Vector3);\n\n- makeVector4();\n+ make(THREE.Vector4);\n\n- makeColor();\n+ make(THREE.Color);\n")),(0,r.kt)("h2",{id:"ngtcomponentstore"},(0,r.kt)("inlineCode",{parentName:"h2"},"NgtComponentStore")),(0,r.kt)("p",null,"In v5, ",(0,r.kt)("inlineCode",{parentName:"p"},"NgtComponentStore")," is a normal class which can be instantiated. In v6, this has been changed to an abstract class and cannot be instantiated. If you rely on new-ing up an ",(0,r.kt)("inlineCode",{parentName:"p"},"NgtComponentStore"),", please adjust"),(0,r.kt)("h4",{id:"ngtcomponentstoreoncanvasready"},(0,r.kt)("inlineCode",{parentName:"h4"},"NgtComponentStore#onCanvasReady")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"onCanvasReady")," is removed in favor of a more concrete ",(0,r.kt)("inlineCode",{parentName:"p"},"NgtStore#onReady"),". You might be using this method to run some code ",(0,r.kt)("strong",{parentName:"p"},"after")," the ",(0,r.kt)("inlineCode",{parentName:"p"},"NgtCanvas")," finishes initializing"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-diff"},"@Component(/*..*/)\nexport class Some extends NgtComponentStore {\n    constructor(private store: NgtStore) {}\n\n    ngOnInit() {\n-       //      \ud83d\udc47 was available on NgtComponentStore\n-       this.onCanvasReady(this.store.ready$, () => {/*...*/});\n+       //          \ud83d\udc47 this replaces onCanvasReady\n+       this.store.onReady(() => {/*...*/});\n    }\n}\n")),(0,r.kt)("p",null,"This results in a cleaner way to run some code ",(0,r.kt)("strong",{parentName:"p"},"after")," ",(0,r.kt)("inlineCode",{parentName:"p"},"NgtCanvas")," finishes initializing as well as might remove the need for extending ",(0,r.kt)("inlineCode",{parentName:"p"},"NgtComponentStore")," just to access ",(0,r.kt)("inlineCode",{parentName:"p"},"onCanvasReady")),(0,r.kt)("h2",{id:"ngtcoremodule"},(0,r.kt)("inlineCode",{parentName:"h2"},"NgtCoreModule")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"NgtCoreModule")," has been removed. Please use ",(0,r.kt)("inlineCode",{parentName:"p"},"NgtCanvasModule")," instead or use the Standalone ",(0,r.kt)("inlineCode",{parentName:"p"},"NgtCanvas")),(0,r.kt)("h2",{id:"ngtcolorpipe"},(0,r.kt)("inlineCode",{parentName:"h2"},"NgtColorPipe")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"NgtColorPipe")," has been removed. Please use ",(0,r.kt)("inlineCode",{parentName:"p"},"NgtColorAttribute")," instead"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'- <ngt-canvas [scene]="{ background: \'black\' | color }"></ngt-canvas>\n+ <ngt-canvas>\n+   <ngt-color attach="background" color="black"></ngt-color>\n+ </ngt-canvas>\n')),(0,r.kt)("h2",{id:"ngtfogpipe-and-ngtfogexp2pipe"},(0,r.kt)("inlineCode",{parentName:"h2"},"NgtFogPipe")," and ",(0,r.kt)("inlineCode",{parentName:"h2"},"NgtFogExp2Pipe")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"NgtFogPipe")," has been removed. Please use ",(0,r.kt)("inlineCode",{parentName:"li"},"NgtFogAttribute")," instead"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"NgtFogExp2Pipe")," has been removed. Please use ",(0,r.kt)("inlineCode",{parentName:"li"},"NgtFogExp2Attribute")," instead")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'- <ngt-canvas [scene]="{ fog: [\'#171720\', 20, 70] | fog }"></ngt-canvas>\n+ <ngt-canvas>\n+   <ngt-fog attach="fog" [fog]="[\'#171720\', 20, 70]"></ngt-fog>\n+ </ngt-canvas>\n')),(0,r.kt)("h2",{id:"ngtvectorpipe"},(0,r.kt)("inlineCode",{parentName:"h2"},"NgtVector*Pipe")),(0,r.kt)("p",null,"All ",(0,r.kt)("inlineCode",{parentName:"p"},"NgtVector*Pipe")," has been removed. Please use ",(0,r.kt)("inlineCode",{parentName:"p"},"NgtVector*Attribute")," instead"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'- <ngt-spot-light castShadow [shadow]="{ mapSize: [512, 512] | vector2 }"></ngt-spot-light>\n+ <ngt-spot-light castShadow>\n+   <ngt-vector2 [attach]="[\'shadow\', \'mapSize\']" [vector2]="[512, 512]"></ngt-vector2>\n+ </ngt-spot-light>\n')),(0,r.kt)("h2",{id:"ngtobjectinputs-name-change"},(0,r.kt)("inlineCode",{parentName:"h2"},"NgtObjectInputs")," name change"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"NgtObjectInputs")," has been renamed to ",(0,r.kt)("inlineCode",{parentName:"p"},"NgtObjectProps")," as it also contains ",(0,r.kt)("inlineCode",{parentName:"p"},"Outputs"),". Similarly, ",(0,r.kt)("inlineCode",{parentName:"p"},"NgtObjectInputsState")," has been renamed to ",(0,r.kt)("inlineCode",{parentName:"p"},"NgtObjectPropsState"),". Please update your code accordingly if you utilize these symbols."),(0,r.kt)("h2",{id:"inject-api"},(0,r.kt)("inlineCode",{parentName:"h2"},"inject()")," API"),(0,r.kt)("p",null,"Abstract classes are rewritten to use Angular 14 ",(0,r.kt)("inlineCode",{parentName:"p"},"inject()")," API to move the Dependencies out of the ",(0,r.kt)("inlineCode",{parentName:"p"},"constructor"),". This results in cleaner and more scalable inheritance story. Sub-classes ",(0,r.kt)("strong",{parentName:"p"},"do not")," need to pass in the dependencies to ",(0,r.kt)("inlineCode",{parentName:"p"},"super()")," call anymore."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-diff"},"export class Some extends NgtInstance {\n-   constructor(\n-       zone: NgZone,\n-       store: NgtStore,\n-       @Optional()\n-       @SkipSelf()\n-       @Inject(NGT_INSTANCE_REF)\n-       parentRef: AnyFunction<Ref>,\n-       @Optional()\n-       @SkipSelf()\n-       @Inject(NGT_INSTANCE_HOST_REF)\n-       parentHostRef: AnyFunction<Ref>,\n-       private gtlfLoader: NgtGLTFLoader\n-   ) {\n-       super(zone, store, parentRef, parentHostRef);\n-   }\n\n+   constructor(private gltfLoader:  NgtGLTFLoader) {\n+       super();\n+   }\n\n+   // or if you prefer inject()\n+   private gltfLoader = inject(NgtGLTFLoader);\n}\n")),(0,r.kt)("h2",{id:"parameters-on-materials-are-removed"},(0,r.kt)("inlineCode",{parentName:"h2"},"[parameters]")," on Materials are removed"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"[parameters]")," Input on ",(0,r.kt)("inlineCode",{parentName:"p"},"<ngt-*-material>")," are removed. Please use individual inputs instead"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-diff"},'- <ngt-mesh-basic-material\n-     [parameters]="{ color: \'pink\', transparent: true, opacity: 0.5 }"\n- ></ngt-mesh-basic-material>\n\n+ <ngt-mesh-basic-material\n+     color="pink"\n+     opacity="0.4"\n+     transparent\n+ ></ngt-mesh-basic-material>\n')))}g.isMDXComponent=!0}}]);