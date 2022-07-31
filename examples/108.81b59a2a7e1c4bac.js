"use strict";(self.webpackChunksandbox=self.webpackChunksandbox||[]).push([[108],{5108:(z,p,r)=>{r.r(p),r.d(p,{Box:()=>M,InstancedSpheres:()=>g,KinematicCubeComponent:()=>L,Plane:()=>D,Scene:()=>x});var a=r(2167),b=r(8368),h=r(8999),c=r(8786),i=r(693),l=r(3545),u=r(3749),C=r(1210),_=r(5e3),B=r(969),n=r(9709);const y=function(){return[1,16,16]},E=function(){return["attributes","color"]},v=function(e){return[e,3]},P=function(){return[1e3,1e3]},K=function(){return[30,0,30]},R=function(){return["shadow","mapSize"]},S=function(e,s){return[e,0,s]},T=function(e){return[0,0,e]},d=function(e){return[e,0,0]},Z=function(){return[0,.9,0]},O=function(){return[6,0,0]},f=function(e){return[0,e,0]},U=function(){return[0,6,0]},A=function(){return[.9,0,0]},J=function(){return{alpha:!1}},Q=function(e){return[0,e,16]},I=function(e){return{position:e}},m=_[Math.floor(Math.random()*_.length)];let g=(()=>{class e{constructor(t){this.physicBody=t,this.number=100,this.sphereRef=this.physicBody.useSphere(o=>({args:[1],mass:1,position:[Math.random()-.5,Math.random()-.5,2*o]}))}ngOnInit(){this.colors=new Float32Array(3*this.number);const t=new B.Ilk;for(let o=0;o<this.number;o++)t.set(m[Math.floor(5*Math.random())]).convertSRGBToLinear().toArray(this.colors,3*o)}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(a.CN))},e.\u0275cmp=n.Xpm({type:e,selectors:[["sandbox-spheres"]],inputs:{number:"number"},standalone:!0,features:[n._Bn([a.CN]),n.jDz],decls:4,vars:9,consts:[["castShadow","","receiveShadow","",3,"ref","count"],[3,"args"],[3,"attach","args"],["vertexColors",""]],template:function(t,o){1&t&&(n.TgZ(0,"ngt-instanced-mesh",0)(1,"ngt-sphere-geometry",1),n._UZ(2,"ngt-instanced-buffer-attribute",2),n.qZA(),n._UZ(3,"ngt-mesh-phong-material",3),n.qZA()),2&t&&(n.Q6J("ref",o.sphereRef.ref)("count",o.number),n.xp6(1),n.Q6J("args",n.DdM(5,y)),n.xp6(1),n.Q6J("attach",n.DdM(6,E))("args",n.VKq(7,v,o.colors)))},dependencies:[u.fk,c.ov,h.aS,l.l6],encapsulation:2,changeDetection:0}),e})(),M=(()=>{class e{constructor(t){this.physicBody=t,this.boxSize=[4,4,4],this.boxRef=this.physicBody.useBox(()=>({mass:1,type:"Kinematic",args:this.boxSize}))}onBoxBeforeRender({clock:t}){const o=t.getElapsedTime();this.boxRef.api.position.set(5*Math.sin(2*o),5*Math.cos(2*o),3),this.boxRef.api.rotation.set(Math.sin(6*o),Math.cos(6*o),0)}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(a.CN))},e.\u0275cmp=n.Xpm({type:e,selectors:[["sandbox-box"]],standalone:!0,features:[n._Bn([a.CN]),n.jDz],decls:3,vars:4,consts:[[3,"ref","castShadow","receiveShadow","beforeRender"],[3,"args"]],template:function(t,o){1&t&&(n.TgZ(0,"ngt-mesh",0),n.NdJ("beforeRender",function(W){return o.onBoxBeforeRender(W.state)}),n._UZ(1,"ngt-box-geometry",1)(2,"ngt-mesh-lambert-material"),n.qZA()),2&t&&(n.Q6J("ref",o.boxRef.ref)("castShadow",!0)("receiveShadow",!0),n.xp6(1),n.Q6J("args",o.boxSize))},dependencies:[u.oX,c.gB,l.sA],encapsulation:2,changeDetection:0}),e})(),D=(()=>{class e{constructor(t){this.physicBody=t,this.planeRef=this.physicBody.usePlane(()=>({position:this.position,rotation:this.rotation}))}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(a.CN))},e.\u0275cmp=n.Xpm({type:e,selectors:[["sandbox-plane"]],inputs:{color:"color",position:"position",rotation:"rotation"},standalone:!0,features:[n._Bn([a.CN]),n.jDz],decls:3,vars:6,consts:[["receiveShadow","",3,"ref","rotation","position"],[3,"args"],[3,"color"]],template:function(t,o){1&t&&(n.TgZ(0,"ngt-mesh",0),n._UZ(1,"ngt-plane-geometry",1)(2,"ngt-mesh-phong-material",2),n.qZA()),2&t&&(n.Q6J("ref",o.planeRef.ref)("rotation",o.rotation)("position",o.position),n.xp6(1),n.Q6J("args",n.DdM(5,P)),n.xp6(1),n.Q6J("color",o.color))},dependencies:[u.oX,c.U4,l.l6],encapsulation:2,changeDetection:0}),e})(),x=(()=>{class e{constructor(){this.niceColor=m}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=n.Xpm({type:e,selectors:[["sandbox-scene"]],standalone:!0,features:[n.jDz],decls:12,vars:38,consts:[["intensity","0.35"],["intensity","2","angle","0.3","penumbra","1","castShadow","",3,"position"],[3,"attach","vector2"],["intensity","0.5",3,"position"],[3,"gravity"],[3,"color"],[3,"color","position","rotation"],[3,"number"]],template:function(t,o){1&t&&(n._UZ(0,"ngt-hemisphere-light",0),n.TgZ(1,"ngt-spot-light",1),n._UZ(2,"ngt-vector2",2),n.qZA(),n._UZ(3,"ngt-point-light",3),n.TgZ(4,"ngt-physics",4),n._UZ(5,"sandbox-plane",5)(6,"sandbox-plane",6)(7,"sandbox-plane",6)(8,"sandbox-plane",6)(9,"sandbox-plane",6)(10,"sandbox-box")(11,"sandbox-spheres",7),n.qZA()),2&t&&(n.xp6(1),n.Q6J("position",n.DdM(19,K)),n.xp6(1),n.Q6J("attach",n.DdM(20,R))("vector2",256),n.xp6(1),n.Q6J("position",n.WLB(21,S,-30,-30)),n.xp6(1),n.Q6J("gravity",n.VKq(24,T,-30)),n.xp6(1),n.Q6J("color",o.niceColor[4]),n.xp6(1),n.Q6J("color",o.niceColor[1])("position",n.VKq(26,d,-6))("rotation",n.DdM(28,Z)),n.xp6(1),n.Q6J("color",o.niceColor[2])("position",n.DdM(29,O))("rotation",n.VKq(30,f,-.9)),n.xp6(1),n.Q6J("color",o.niceColor[3])("position",n.DdM(32,U))("rotation",n.DdM(33,A)),n.xp6(1),n.Q6J("color",o.niceColor[0])("position",n.VKq(34,f,-6))("rotation",n.VKq(36,d,-.9)),n.xp6(2),n.Q6J("number",100))},dependencies:[i.Lu,i.KN,h.ML,i.HY,a.rZ,D,M,g],encapsulation:2,changeDetection:0}),e})(),L=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=n.Xpm({type:e,selectors:[["sandbox-kinematic-cube"]],standalone:!0,features:[n.jDz],decls:3,vars:7,consts:[["shadows","",3,"gl","camera"]],template:function(t,o){1&t&&(n.TgZ(0,"ngt-canvas",0),n._UZ(1,"sandbox-scene"),n.qZA(),n._UZ(2,"ngt-stats")),2&t&&n.Q6J("gl",n.DdM(2,J))("camera",n.VKq(5,I,n.VKq(3,Q,-12)))},dependencies:[b.B3,x,C.Q],encapsulation:2,changeDetection:0}),e})()}}]);