"use strict";(self.webpackChunksandbox=self.webpackChunksandbox||[]).push([[471],{8471:(R,d,a)=>{a.r(d),a.d(d,{Cube:()=>M,CubeWithMaterials:()=>E,SandboxCubesComponent:()=>f,SandboxCubesModule:()=>P,Scene:()=>C});var b=a(3152),m=a(5313),i=a(397),s=a(7814),_=a(6071),l=a(2313),p=a(6880),h=a(2192),g=a(610),v=a(1955),t=a(9796);const D=function(e){return[e,0,0]},T=function(){return[1.5,0,0]},O=function(e){return["material",e]};function x(e,o){if(1&e&&t._UZ(0,"ngt-mesh-standard-material",2),2&e){const n=o.$implicit;t.Q6J("attach",t.VKq(2,O,""+o.index))("color",n)}}let f=(()=>{class e{}return e.\u0275fac=function(n){return new(n||e)},e.\u0275cmp=t.Xpm({type:e,selectors:[["sandbox-cubes"]],decls:4,vars:0,consts:[["initialLog",""],["attach","background","color","lightblue"]],template:function(n,r){1&n&&(t.TgZ(0,"ngt-canvas",0),t._UZ(1,"ngt-color",1)(2,"sandbox-scene"),t.qZA(),t._UZ(3,"ngt-stats"))},dependencies:function(){return[b.B3,m.rq,p.Q,C]},encapsulation:2,changeDetection:0}),e})(),C=(()=>{class e{}return e.\u0275fac=function(n){return new(n||e)},e.\u0275cmp=t.Xpm({type:e,selectors:[["sandbox-scene"]],decls:6,vars:6,consts:[[3,"position"]],template:function(n,r){1&n&&t._UZ(0,"ngt-ambient-light")(1,"ngt-point-light",0)(2,"sandbox-cube",0)(3,"sandbox-cube",0)(4,"sandbox-cube-with-materials")(5,"ngt-soba-orbit-controls"),2&n&&(t.xp6(1),t.Q6J("position",10),t.xp6(1),t.Q6J("position",t.VKq(3,D,-1.5)),t.xp6(1),t.Q6J("position",t.DdM(5,T)))},dependencies:function(){return[s.wx,s.HY,h.St,M,E]},encapsulation:2,changeDetection:0}),e})(),M=(()=>{class e{constructor(){this.hovered=!1,this.active=!1}onBeforeRender(n){n.rotation.x+=.01}}return e.\u0275fac=function(n){return new(n||e)},e.\u0275cmp=t.Xpm({type:e,selectors:[["sandbox-cube"]],inputs:{position:"position"},decls:3,vars:3,consts:[[3,"scale","position","pointerover","pointerout","click","beforeRender"],[3,"color"]],template:function(n,r){1&n&&(t.TgZ(0,"ngt-mesh",0),t.NdJ("pointerover",function(){return r.hovered=!0})("pointerout",function(){return r.hovered=!1})("click",function(){return r.active=!r.active})("beforeRender",function(u){return r.onBeforeRender(u.object)}),t._UZ(1,"ngt-box-geometry")(2,"ngt-mesh-standard-material",1),t.qZA()),2&n&&(t.Q6J("scale",r.active?1.5:1)("position",r.position),t.xp6(2),t.Q6J("color",r.hovered?"hotpink":"orange"))},dependencies:[l.oX,i.gB,_.hv],encapsulation:2,changeDetection:0}),e})(),E=(()=>{class e{constructor(){this.colors=["red","green","blue","hotpink","orange","teal"]}onBeforeRender(n){n.rotation.x=n.rotation.y+=.01}}return e.\u0275fac=function(n){return new(n||e)},e.\u0275cmp=t.Xpm({type:e,selectors:[["sandbox-cube-with-materials"]],decls:3,vars:1,consts:[[3,"beforeRender"],[3,"attach","color",4,"ngFor","ngForOf"],[3,"attach","color"]],template:function(n,r){1&n&&(t.TgZ(0,"ngt-mesh",0),t.NdJ("beforeRender",function(u){return r.onBeforeRender(u.object)}),t._UZ(1,"ngt-box-geometry"),t.YNc(2,x,1,4,"ngt-mesh-standard-material",1),t.qZA()),2&n&&(t.xp6(2),t.Q6J("ngForOf",r.colors))},dependencies:[g.sg,l.oX,i.gB,_.hv],encapsulation:2,changeDetection:0}),e})(),P=(()=>{class e{}return e.\u0275fac=function(n){return new(n||e)},e.\u0275mod=t.oAB({type:e}),e.\u0275inj=t.cJS({imports:[g.ez,v.Bz.forChild([{path:"",component:f}]),b.DX,m.bg,s.EQ,s.GK,p.x,l.M$,i.N1,_.To,h.Li]}),e})()}}]);