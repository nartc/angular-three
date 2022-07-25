"use strict";(self.webpackChunksandbox=self.webpackChunksandbox||[]).push([[64],{8064:(Q,g,a)=>{a.r(g),a.d(g,{ReuseGltfComponent:()=>d,ReuseGltfComponentModule:()=>R,Scene:()=>M,Shoe:()=>f});var s=a(3152),u=a(5313),v=a(397),i=a(4372),_=a(6071),h=a(2313),p=a(2192),D=a(5913),l=a(1165),m=a(610),e=a(9796),E=a(1955),y=a(6128);const Z=function(){return[1,2]},x=function(){return[0,0,150]},O=function(t){return{position:t,fov:40}},T=function(){return[0,0,0]},P=function(t){return[0,.5,t]},A=function(t){return[0,0,t]};function C(t,o){1&t&&(e._UZ(0,"sandbox-shoe",3)(1,"sandbox-shoe",4),e.ALo(2,"radian")),2&t&&(e.Q6J("position",e.DdM(6,T)),e.xp6(1),e.Q6J("scale",-1)("rotation",e.VKq(7,P,e.lcZ(2,4,180)))("position",e.VKq(9,A,-2)))}const c=function(){return["material","envMapIntensity"]},U=function(){return["normalMap","encoding"]};function J(t,o){if(1&t&&(e.ynx(0),e.TgZ(1,"ngt-group",1)(2,"ngt-mesh",2),e._UZ(3,"ngt-value",3),e.qZA(),e.TgZ(4,"ngt-mesh",4)(5,"ngt-mesh-standard-material",5),e._UZ(6,"ngt-value",3),e.qZA()(),e.TgZ(7,"ngt-mesh",2),e._UZ(8,"ngt-value",3),e.qZA(),e.TgZ(9,"ngt-mesh",2),e._UZ(10,"ngt-value",3),e.qZA(),e.TgZ(11,"ngt-mesh",2),e._UZ(12,"ngt-value",3),e.qZA(),e.TgZ(13,"ngt-mesh",2),e._UZ(14,"ngt-value",3),e.qZA(),e.TgZ(15,"ngt-mesh",2),e._UZ(16,"ngt-value",3),e.qZA(),e.TgZ(17,"ngt-mesh",2),e._UZ(18,"ngt-value",3),e.qZA()(),e.BQk()),2&t){const n=o.ngIf,r=e.oxw();e.xp6(1),e.Q6J("ngtObjectPassThrough",r),e.xp6(1),e.Q6J("geometry",n.nodes.shoe.geometry)("material",n.materials.laces),e.xp6(1),e.Q6J("attach",e.DdM(37,c))("value",.8),e.xp6(1),e.Q6J("geometry",n.nodes.shoe_1.geometry),e.xp6(1),e.Q6J("color",r.color)("aoMap",n.materials.mesh.aoMap)("normalMap",n.materials.mesh.normalMap)("roughnessMap",n.materials.mesh.roughnessMap)("metalnessMap",n.materials.mesh.metalnessMap),e.xp6(1),e.Q6J("attach",e.DdM(38,U))("value",r.encoding),e.xp6(1),e.Q6J("geometry",n.nodes.shoe_2.geometry)("material",n.materials.caps),e.xp6(1),e.Q6J("attach",e.DdM(39,c))("value",.8),e.xp6(1),e.Q6J("geometry",n.nodes.shoe_3.geometry)("material",n.materials.inner),e.xp6(1),e.Q6J("attach",e.DdM(40,c))("value",.8),e.xp6(1),e.Q6J("geometry",n.nodes.shoe_4.geometry)("material",n.materials.sole),e.xp6(1),e.Q6J("attach",e.DdM(41,c))("value",.8),e.xp6(1),e.Q6J("geometry",n.nodes.shoe_5.geometry)("material",n.materials.stripes),e.xp6(1),e.Q6J("attach",e.DdM(42,c))("value",.8),e.xp6(1),e.Q6J("geometry",n.nodes.shoe_6.geometry)("material",n.materials.band),e.xp6(1),e.Q6J("attach",e.DdM(43,c))("value",.8),e.xp6(1),e.Q6J("geometry",n.nodes.shoe_7.geometry)("material",n.materials.patch),e.xp6(1),e.Q6J("attach",e.DdM(44,c))("value",.8)}}let d=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=e.Xpm({type:t,selectors:[["sandbox-reuse-gltf"]],decls:2,vars:6,consts:[["shadows","","initialLog","",3,"dpr","camera"]],template:function(n,r){1&n&&(e.TgZ(0,"ngt-canvas",0),e._UZ(1,"sandbox-scene"),e.qZA()),2&n&&e.Q6J("dpr",e.DdM(2,Z))("camera",e.VKq(4,O,e.DdM(3,x)))},dependencies:function(){return[s.B3,M]},encapsulation:2,changeDetection:0}),t})(),M=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=e.Xpm({type:t,selectors:[["sandbox-scene"]],decls:3,vars:0,consts:[["environment","city","intensity","0.6"],["ngt-soba-stage-content",""],["autoRotate",""],["color","tomato",3,"position"],["color","orange",3,"scale","rotation","position"]],template:function(n,r){1&n&&(e.TgZ(0,"ngt-soba-stage",0),e.YNc(1,C,3,11,"ng-template",1),e.qZA(),e._UZ(2,"ngt-soba-orbit-controls",2))},dependencies:function(){return[l.f4,l.sz,p.St,f,s.j4]},encapsulation:2,changeDetection:0}),t})(),f=(()=>{class t extends s.Kw{constructor(){super(...arguments),this.gltfLoader=(0,e.f3M)(D.iY),this.shoe$=this.gltfLoader.load("assets/shoe.gltf"),this.encoding=y.rnI}}return t.\u0275fac=function(){let o;return function(r){return(o||(o=e.n5z(t)))(r||t)}}(),t.\u0275cmp=e.Xpm({type:t,selectors:[["sandbox-shoe"]],features:[e._Bn([(0,s.RD)(t),(0,s.wY)(t),(0,s.Hm)(t)]),e.qOj],decls:2,vars:3,consts:[[4,"ngIf"],[3,"ngtObjectPassThrough"],["castShadow","","receiveShadow","",3,"geometry","material"],[3,"attach","value"],["castShadow","","receiveShadow","",3,"geometry"],["envMapIntensity","0.8",3,"color","aoMap","normalMap","roughnessMap","metalnessMap"]],template:function(n,r){1&n&&(e.YNc(0,J,19,45,"ng-container",0),e.ALo(1,"async")),2&n&&e.Q6J("ngIf",e.lcZ(1,1,r.shoe$))},dependencies:[m.O5,i.U,s.VL,h.oX,u.mI,_.hv,m.Ov],encapsulation:2,changeDetection:0}),t})(),R=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[E.Bz.forChild([{path:"",component:d}]),m.ez,i.I,s.y2,h.M$,u.pk,_.To,l.YS,s.kZ,p.Li,s.DX,v.fV,_.Bg,l.hJ]}),t})()}}]);