"use strict";(self.webpackChunksandbox=self.webpackChunksandbox||[]).push([[73],{9073:(A,r,a)=>{a.r(r),a.d(r,{Bust:()=>d,LevelOfDetailComponent:()=>y,Scene:()=>u});var m=a(8368),g=a(8999),c=a(693),f=a(3749),h=a(6076),l=a(6509),_=a(9341),M=a(9612),i=a(5688),t=a(9709);const D=function(){return["material","envMapIntensity"]};function v(n,o){if(1&n&&(t.TgZ(0,"ngt-mesh",3),t._UZ(1,"ngt-value",4),t.qZA()),2&n){const e=o.$implicit;t.Q6J("geometry",e.nodes.Mesh_0001.geometry)("material",e.materials.default),t.xp6(1),t.Q6J("attach",t.DdM(4,D))("value",.25)}}function E(n,o){if(1&n&&(t.YNc(0,v,2,5,"ngt-mesh",2),t.ALo(1,"async")),2&n){const e=t.oxw();t.Q6J("ngForOf",t.lcZ(1,1,e.levels$))}}const O=function(){return[15,25,35,100]};function b(n,o){if(1&n&&t._UZ(0,"sandbox-bust",5),2&n){const e=o.$implicit;t.Q6J("position",e.position)("rotation",e.rotation)}}const P=function(){return[0,0,0]},T=function(){return[50,50,50]},L=function(){return[1,2]},B=function(){return[0,0,40]},C=function(n){return{position:n}},U=[...Array(800)].map(()=>({position:[40-80*Math.random(),40-80*Math.random(),40-80*Math.random()],rotation:[Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2]}));let d=(()=>{class n{constructor(e){this.gltfLoader=e,this.levels$=this.gltfLoader.load(["assets/bust-1-d.glb","assets/bust-2-d.glb","assets/bust-3-d.glb","assets/bust-4-d.glb"])}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(l.iY))},n.\u0275cmp=t.Xpm({type:n,selectors:[["sandbox-bust"]],inputs:{position:"position",rotation:"rotation"},standalone:!0,features:[t.jDz],decls:2,vars:4,consts:[[3,"distances","position","rotation"],["ngt-soba-detailed-content",""],["receiveShadow","","castShadow","",3,"geometry","material",4,"ngFor","ngForOf"],["receiveShadow","","castShadow","",3,"geometry","material"],[3,"attach","value"]],template:function(e,s){1&e&&(t.TgZ(0,"ngt-soba-detailed",0),t.YNc(1,E,2,3,"ng-template",1),t.qZA()),2&e&&t.Q6J("distances",t.DdM(3,O))("position",s.position)("rotation",s.rotation)},dependencies:[_.E7,_.Wb,f.oX,i.sg,i.Ov,g.mI],encapsulation:2,changeDetection:0}),n})(),u=(()=>{class n{constructor(){this.positions=U}}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["sandbox-scene"]],standalone:!0,features:[t.jDz],decls:5,vars:5,consts:[[3,"position","rotation",4,"ngFor","ngForOf"],["zoomSpeed","0.075"],["intensity","0.5",3,"position"],["intensity","2.5","castShadow","",3,"position"],["preset","city"],[3,"position","rotation"]],template:function(e,s){1&e&&(t.YNc(0,b,1,2,"sandbox-bust",0),t._UZ(1,"ngt-soba-orbit-controls",1)(2,"ngt-point-light",2)(3,"ngt-spot-light",3)(4,"ngt-soba-environment",4)),2&e&&(t.Q6J("ngForOf",s.positions),t.xp6(2),t.Q6J("position",t.DdM(3,P)),t.xp6(1),t.Q6J("position",t.DdM(4,T)))},dependencies:[d,i.sg,h.St,c.HY,c.KN,M.$5],encapsulation:2,changeDetection:0}),n})(),y=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["sandbox-level-of-detail"]],standalone:!0,features:[t.jDz],decls:3,vars:6,consts:[["shadows","","frameloop","demand",3,"dpr","camera","created"]],template:function(e,s){1&e&&(t.TgZ(0,"ngt-canvas",0),t.NdJ("created",function(p){return p.gl.shadowMap.autoUpdate=!1,p.gl.shadowMap.needsUpdate=!0}),t._UZ(1,"sandbox-scene"),t.qZA(),t._UZ(2,"ngt-soba-loader")),2&e&&t.Q6J("dpr",t.DdM(2,L))("camera",t.VKq(4,C,t.DdM(3,B)))},dependencies:[m.B3,u,l.iX],encapsulation:2,changeDetection:0}),n})()}}]);