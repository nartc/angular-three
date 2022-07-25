"use strict";(self.webpackChunksandbox=self.webpackChunksandbox||[]).push([[35],{7035:(W,F,r)=>{r.r(F),r.d(F,{HeightFieldExampleComponent:()=>A,HeightFieldExampleComponentModule:()=>K});var u=r(9662),p=r(3152),d=r(5313),f=r(397),x=r(7814),S=r(6071),y=r(2313),z=r(6880),Z=r(2192),C=r(610),w=r(1955),H=r(5e3),e=r(9796),J=r(3494),M=r(6128);const E=["elementSize","","heights",""],V=["*"];let b=(()=>{class t extends f.DE{constructor(){super(...arguments),this.elementSize=0}set heights(n){this.set({heights:n})}ngOnInit(){super.ngOnInit(),this.zone.runOutsideAngular(()=>{this.store.onReady(()=>{this.effect((0,J.b)(()=>{if(!this.instanceValue)return;const n=this.get(i=>i.heights),o=this.elementSize,l=this.elementSize,g=n.flatMap((i,a)=>i.flatMap((m,h)=>[a*o,h*l,m])),c=[];for(let i=0;i<n.length-1;i++)for(let a=0;a<n[i].length-1;a++){const m=n[i].length,h=i*m+a;c.push(h+1,h+m,h+m+1),c.push(h+m,h+1,h)}this.instanceValue.setIndex(c),this.instanceValue.setAttribute("position",new M.a$l(g,3)),this.instanceValue.computeVertexNormals(),this.instanceValue.computeBoundingBox(),this.instanceValue.computeBoundingSphere()}))(this.select(this.instance$,this.select(n=>n.heights)))})})}}return t.\u0275fac=function(){let s;return function(o){return(s||(s=e.n5z(t)))(o||t)}}(),t.\u0275cmp=e.Xpm({type:t,selectors:[["sandbox-height-field-geometry","elementSize","","heights",""]],inputs:{elementSize:"elementSize",heights:"heights"},features:[e._Bn([(0,p.O2)(t)]),e.qOj],attrs:E,ngContentSelectors:V,decls:1,vars:0,template:function(n,o){1&n&&(e.F$t(),e.Hsn(0))},encapsulation:2,changeDetection:0}),t})();const D=["elementSize","","heights","","position","","rotation",""];let I=(()=>{class t{constructor(n){this.physicBody=n,this.elementSize=0,this.heights=[],this.position=[0,0,0],this.rotation=[0,0,0],this.color=H[17][4],this.heightFieldRef=this.physicBody.useHeightfield(()=>({args:[this.heights,{elementSize:this.elementSize}],position:this.position,rotation:this.rotation}))}}return t.\u0275fac=function(n){return new(n||t)(e.Y36(u.CN))},t.\u0275cmp=e.Xpm({type:t,selectors:[["sandbox-height-field","elementSize","","heights","","position","","rotation",""]],inputs:{elementSize:"elementSize",heights:"heights",position:"position",rotation:"rotation"},features:[e._Bn([u.CN])],attrs:D,decls:3,vars:4,consts:[["castShadow","","receiveShadow","",3,"ref"],[3,"color"],[3,"elementSize","heights"]],template:function(n,o){1&n&&(e.TgZ(0,"ngt-mesh",0),e._UZ(1,"ngt-mesh-phong-material",1)(2,"sandbox-height-field-geometry",2),e.qZA()),2&n&&(e.Q6J("ref",o.heightFieldRef.ref),e.xp6(1),e.Q6J("color",o.color),e.xp6(1),e.Q6J("elementSize",o.elementSize)("heights",o.heights))},dependencies:[y.oX,S.l6,b],encapsulation:2,changeDetection:0}),t})();const T=["columns","","rows","","spread",""],O=function(){return[.2,16,16]},U=function(){return["attributes","color"]},j=function(t){return[t,3]};function L(t,s){if(1&t&&(e.ynx(0),e.TgZ(1,"ngt-instanced-mesh",1)(2,"ngt-sphere-geometry",2),e._UZ(3,"ngt-instanced-buffer-attribute",3),e.qZA(),e._UZ(4,"ngt-mesh-phong-material",4),e.qZA(),e.BQk()),2&t){const n=s.ngIf,o=e.oxw();e.xp6(1),e.Q6J("count",n.number)("ref",o.sphereRef.ref),e.xp6(1),e.Q6J("args",e.DdM(5,O)),e.xp6(1),e.Q6J("attach",e.DdM(6,U))("args",e.VKq(7,j,n.colors))}}let R=(()=>{class t extends p.gU{constructor(n){super(),this.physicBody=n,this.spread=0,this.sphereRef=this.physicBody.useSphere(o=>({args:[.2],mass:1,position:[(o%this.get(l=>l.columns)-(this.get(l=>l.columns)-1)/2)*this.spread,2,(Math.floor(o/this.get(l=>l.columns))-(this.get(l=>l.rows)-1)/2)*this.spread]})),this.viewModel$=this.select(this.select(o=>o.columns),this.select(o=>o.rows),(o,l)=>{const g=o*l,c=new Float32Array(3*g),i=new M.Ilk;for(let a=0;a<g;a++)i.set(H[17][Math.floor(5*Math.random())]).convertSRGBToLinear().toArray(c,3*a);return{colors:c,number:g}})}set columns(n){this.set({columns:(0,p.su)(n)})}set rows(n){this.set({rows:(0,p.su)(n)})}}return t.\u0275fac=function(n){return new(n||t)(e.Y36(u.CN))},t.\u0275cmp=e.Xpm({type:t,selectors:[["sandbox-spheres","columns","","rows","","spread",""]],inputs:{columns:"columns",rows:"rows",spread:"spread"},features:[e._Bn([u.CN]),e.qOj],attrs:T,decls:2,vars:3,consts:[[4,"ngIf"],["castShadow","","receiveShadow","",3,"count","ref"],[3,"args"],[3,"attach","args"],["vertexColors",""]],template:function(n,o){1&n&&(e.YNc(0,L,5,9,"ng-container",0),e.ALo(1,"async")),2&n&&e.Q6J("ngIf",e.lcZ(1,1,o.viewModel$))},dependencies:[C.O5,S.l6,y.fk,f.ov,d.aS,C.Ov],encapsulation:2,changeDetection:0}),t})();const $=function(t){return[0,t,10]},G=function(t){return{position:t}},N=function(){return[0,3,0]},X=function(t,s){return[t,0,s]},P=function(t){return[t,0,0]};let A=(()=>{class t{constructor(){this.scale=10,this.heights=function Y({width:t,height:s,number:n,scale:o}){const l=[],g=[];for(let i=0;i<n;i++)g.push([Math.random(),Math.random()]);let c=0;for(let i=0;i<t;i++){const a=[];for(let m=0;m<s;m++){let h=1/0;g.forEach(B=>{const Q=(B[0]-i/t)**2+(B[1]-m/s)**2;Q<h&&(h=Q)});const v=Math.sqrt(h);v>c&&(c=v),a.push(v)}l.push(a)}for(let i=0;i<t;i++)for(let a=0;a<s;a++)l[i][a]*=o/c;return l}({height:128,number:10,scale:1,width:128})}}return t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=e.Xpm({type:t,selectors:[["sandbox-height-field-example"]],inputs:{scale:"scale"},decls:12,vars:25,consts:[["shadows","",3,"camera"],["attach","background","color","#171720"],["enableDamping","","dampingFactor","0.2",3,"minPolarAngle","maxPolarAngle"],["intensity","0.5"],["castShadow","",3,"position"],[3,"elementSize","heights","position","rotation"],["rows","3","columns","3",3,"spread"]],template:function(n,o){1&n&&(e.TgZ(0,"ngt-canvas",0),e._UZ(1,"ngt-color",1)(2,"ngt-soba-orbit-controls",2),e.ALo(3,"radian"),e.ALo(4,"radian"),e.TgZ(5,"ngt-physics"),e._UZ(6,"ngt-ambient-light",3)(7,"ngt-directional-light",4)(8,"sandbox-height-field",5),e.ALo(9,"radian"),e._UZ(10,"sandbox-spheres",6),e.qZA(),e._UZ(11,"ngt-stats"),e.qZA()),2&n&&(e.Q6J("camera",e.VKq(17,G,e.VKq(15,$,-10))),e.xp6(2),e.Q6J("minPolarAngle",e.lcZ(3,9,60))("maxPolarAngle",e.lcZ(4,11,60)),e.xp6(5),e.Q6J("position",e.DdM(19,N)),e.xp6(1),e.Q6J("elementSize",o.scale/128)("heights",o.heights)("position",e.WLB(20,X,-o.scale/2,o.scale/2))("rotation",e.VKq(23,P,e.lcZ(9,13,-90))),e.xp6(2),e.Q6J("spread",4))},dependencies:function(){return[z.Q,p.B3,d.rq,Z.St,u.rZ,x.wx,x.YY,I,R,p.j4]},encapsulation:2,changeDetection:0}),t})(),K=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[C.ez,w.Bz.forChild([{path:"",component:A}]),z.x,f.II,y.M$,S.Bg,y.R,f.fV,d.$5,p.DX,d.bg,Z.Li,p.kZ,u.M1,x.EQ,x.in]}),t})()}}]);