"use strict";(self.webpackChunksandbox=self.webpackChunksandbox||[]).push([[960],{4960:(x,_,a)=>{a.r(_),a.d(_,{Bust:()=>M,LevelOfDetailComponent:()=>f,LevelOfDetailComponentModule:()=>I,Scene:()=>h});var d=a(3152),u=a(5313),i=a(7814),p=a(2313),m=a(2192),c=a(5913),l=a(733),g=a(1165),r=a(610),v=a(1955),t=a(9796);const O=function(){return[1,2]},E=function(){return[0,0,40]},L=function(n){return{position:n}};function P(n,o){if(1&n&&t._UZ(0,"sandbox-bust",5),2&n){const e=o.$implicit;t.Q6J("position",e.position)("rotation",e.rotation)}}const C=function(){return[0,0,0]},b=function(){return[50,50,50]},T=function(){return["material","envMapIntensity"]};function B(n,o){if(1&n&&(t.TgZ(0,"ngt-mesh",3),t._UZ(1,"ngt-value",4),t.qZA()),2&n){const e=o.$implicit;t.Q6J("geometry",e.nodes.Mesh_0001.geometry)("material",e.materials.default),t.xp6(1),t.Q6J("attach",t.DdM(4,T))("value",.25)}}function y(n,o){if(1&n&&(t.YNc(0,B,2,5,"ngt-mesh",2),t.ALo(1,"async")),2&n){const e=t.oxw();t.Q6J("ngForOf",t.lcZ(1,1,e.levels$))}}const U=function(){return[15,25,35,100]},A=[...Array(800)].map(()=>({position:[40-80*Math.random(),40-80*Math.random(),40-80*Math.random()],rotation:[Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2]}));let f=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["sandbox-level-of-detail"]],decls:3,vars:6,consts:[["shadows","","frameloop","demand",3,"dpr","camera","created"]],template:function(e,s){1&e&&(t.TgZ(0,"ngt-canvas",0),t.NdJ("created",function(D){return D.gl.shadowMap.autoUpdate=!1,D.gl.shadowMap.needsUpdate=!0}),t._UZ(1,"sandbox-scene"),t.qZA(),t._UZ(2,"ngt-soba-loader")),2&e&&t.Q6J("dpr",t.DdM(2,O))("camera",t.VKq(4,L,t.DdM(3,E)))},dependencies:function(){return[d.B3,c.iX,h]},encapsulation:2,changeDetection:0}),n})(),h=(()=>{class n{constructor(){this.positions=A}}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["sandbox-scene"]],decls:5,vars:5,consts:[[3,"position","rotation",4,"ngFor","ngForOf"],["zoomSpeed","0.075"],["intensity","0.5",3,"position"],["intensity","2.5","castShadow","",3,"position"],["preset","city"],[3,"position","rotation"]],template:function(e,s){1&e&&(t.YNc(0,P,1,2,"sandbox-bust",0),t._UZ(1,"ngt-soba-orbit-controls",1)(2,"ngt-point-light",2)(3,"ngt-spot-light",3)(4,"ngt-soba-environment",4)),2&e&&(t.Q6J("ngForOf",s.positions),t.xp6(2),t.Q6J("position",t.DdM(3,C)),t.xp6(1),t.Q6J("position",t.DdM(4,b)))},dependencies:function(){return[r.sg,m.St,i.HY,i.KN,g.$5,M]},encapsulation:2,changeDetection:0}),n})(),M=(()=>{class n{constructor(e){this.gltfLoader=e,this.levels$=this.gltfLoader.load(["assets/bust-1-d.glb","assets/bust-2-d.glb","assets/bust-3-d.glb","assets/bust-4-d.glb"])}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(c.iY))},n.\u0275cmp=t.Xpm({type:n,selectors:[["sandbox-bust"]],inputs:{position:"position",rotation:"rotation"},decls:2,vars:4,consts:[[3,"distances","position","rotation"],["ngt-soba-detailed-content",""],["receiveShadow","","castShadow","",3,"geometry","material",4,"ngFor","ngForOf"],["receiveShadow","","castShadow","",3,"geometry","material"],[3,"attach","value"]],template:function(e,s){1&e&&(t.TgZ(0,"ngt-soba-detailed",0),t.YNc(1,y,2,3,"ng-template",1),t.qZA()),2&e&&t.Q6J("distances",t.DdM(3,U))("position",s.position)("rotation",s.rotation)},dependencies:[r.sg,l.E7,l.Wb,p.oX,u.mI,r.Ov],encapsulation:2,changeDetection:0}),n})(),I=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[r.ez,v.Bz.forChild([{path:"",component:f}]),l.eL,p.M$,u.pk,d.DX,c.Ts,m.Li,i.GK,i.Hk,g.wj]}),n})()}}]);