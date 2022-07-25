"use strict";(self.webpackChunksandbox=self.webpackChunksandbox||[]).push([[215],{9141:(R,p,o)=>{o.r(p),o.d(p,{Clump:()=>y,ObjectClumpComponent:()=>C,ObjectClumpComponentModule:()=>F,Pointer:()=>O,Scene:()=>D});var a=o(9662),c=o(3152),i=o(5313),l=o(397),_=o(7814),f=o(6071),g=o(2313),m=o(5352),h=o(4306),E=o(5913),d=o(1165),M=o(610),B=o(1955),A=o(8405),u=o(6128),e=o(9796);const T=function(){return[1,2]},U=function(){return[0,0,20]},x=function(t){return{position:t,fov:35,near:1,far:40}};function Z(t,s){1&t&&e._UZ(0,"ngt-bloom-effect")}const b=function(){return[30,30,30]},L=function(){return["shadow","mapSize"]},K=function(){return[512,512]},W=function(t,s,n){return[t,s,n]},I=function(){return[0,2,0]},S=function(){return[1,32,32]};let C=(()=>{class t{constructor(){this.kernelSize=A.DD.VERY_LARGE}}return t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=e.Xpm({type:t,selectors:[["sandbox-object-clump"]],decls:2,vars:6,consts:[["shadows","","initialLog","",3,"dpr","camera"]],template:function(n,r){1&n&&(e.TgZ(0,"ngt-canvas",0),e._UZ(1,"sandbox-scene"),e.qZA()),2&n&&e.Q6J("dpr",e.DdM(2,T))("camera",e.VKq(4,x,e.DdM(3,U)))},dependencies:function(){return[c.B3,D]},encapsulation:2,changeDetection:0}),t})(),D=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=e.Xpm({type:t,selectors:[["sandbox-scene"]],decls:11,vars:13,consts:[["intensity","0.25"],["intensity","1","angle","0.2","penumbra","1","castShadow","",3,"position"],[3,"attach","vector2"],["intensity","5","color","purple",3,"position"],["iterations","10",3,"gravity"],["files","assets/adamsbridge.hdr"],["ngt-effect-composer-content",""]],template:function(n,r){1&n&&(e._UZ(0,"ngt-ambient-light",0),e.TgZ(1,"ngt-spot-light",1),e._UZ(2,"ngt-vector2",2),e.qZA(),e._UZ(3,"ngt-directional-light",3),e.TgZ(4,"ngt-physics",4),e._UZ(5,"sandbox-pointer")(6,"sandbox-clump"),e.qZA(),e._UZ(7,"ngt-soba-environment",5),e.TgZ(8,"ngt-effect-composer"),e.YNc(9,Z,1,0,"ng-template",6),e.qZA(),e._UZ(10,"ngt-soba-sky")),2&n&&(e.xp6(1),e.Q6J("position",e.DdM(5,b)),e.xp6(1),e.Q6J("attach",e.DdM(6,L))("vector2",e.DdM(7,K)),e.xp6(1),e.Q6J("position",e.kEZ(8,W,-10,-10,-10)),e.xp6(1),e.Q6J("gravity",e.DdM(12,I)))},dependencies:function(){return[m.dM,m.sY,_.wx,_.KN,i.ML,_.YY,a.rZ,d.$5,d.fH,h.$j,O,y]},encapsulation:2,changeDetection:0}),t})(),O=(()=>{class t extends c.gU{constructor(n,r,v){super(),this.physicBody=n,this.store=r,this.zone=v,this.pointerRef=this.physicBody.useSphere(()=>({type:"Kinematic",args:[3],position:[0,0,0]}),!1)}ngOnInit(){this.zone.runOutsideAngular(()=>{this.store.onReady(()=>this.store.registerBeforeRender({callback:({pointer:n,viewport:r})=>{this.pointerRef.api.position.set(n.x*r.width/2,n.y*r.height/2,0)}}))})}}return t.\u0275fac=function(n){return new(n||t)(e.Y36(a.CN),e.Y36(c.W7),e.Y36(e.R0b))},t.\u0275dir=e.lG2({type:t,selectors:[["sandbox-pointer"]],features:[e._Bn([a.CN]),e.qOj]}),t})();const P=new u.yGw,j=new u.Pa4;let y=(()=>{class t{constructor(n,r){this.textureLoader=n,this.physicBody=r,this.count=40,this.texture$=this.textureLoader.load("assets/cross.jpg"),this.sphereRef=this.physicBody.useSphere(()=>({args:[1],mass:1,angularDamping:.1,linearDamping:.65,position:[u.M8C.randFloatSpread(20),u.M8C.randFloatSpread(20),u.M8C.randFloatSpread(20)]}))}onBeforeRender(n){for(let r=0;r<this.count;r++)n.object.getMatrixAt(r,P),this.sphereRef.api.at(r).applyForce(j.setFromMatrixPosition(P).normalize().multiplyScalar(-50).toArray(),[0,0,0])}}return t.\u0275fac=function(n){return new(n||t)(e.Y36(E.Wt),e.Y36(a.CN))},t.\u0275cmp=e.Xpm({type:t,selectors:[["sandbox-clump"]],features:[e._Bn([E.Wt,a.CN])],decls:4,vars:7,consts:[["castShadow","","receiveShadow","",3,"ref","count","beforeRender"],[3,"args"],["color","red","roughness","0","envMapIntensity","0.2","emissive","#370037",3,"map"]],template:function(n,r){1&n&&(e.TgZ(0,"ngt-instanced-mesh",0),e.NdJ("beforeRender",function(J){return r.onBeforeRender(J)}),e._UZ(1,"ngt-sphere-geometry",1)(2,"ngt-mesh-standard-material",2),e.ALo(3,"async"),e.qZA()),2&n&&(e.Q6J("ref",r.sphereRef.ref)("count",r.count),e.xp6(1),e.Q6J("args",e.DdM(6,S)),e.xp6(1),e.Q6J("map",e.lcZ(3,4,r.texture$)))},dependencies:[g.fk,l.ov,f.hv,M.Ov],encapsulation:2,changeDetection:0}),t})(),F=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[M.ez,B.Bz.forChild([{path:"",component:C}]),m.km,g.R,l.fV,f.To,c.DX,_.EQ,_.Hk,i.fN,_.in,a.M1,d.wj,d.vc,h.Rn,i.pk,a.B$]}),t})()},2269:(R,p,o)=>{function a(c,i,l){return i in c?Object.defineProperty(c,i,{value:l,enumerable:!0,configurable:!0,writable:!0}):c[i]=l,c}o.d(p,{Z:()=>a})}}]);