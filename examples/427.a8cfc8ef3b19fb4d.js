"use strict";(self.webpackChunksandbox=self.webpackChunksandbox||[]).push([[427],{6939:(O,p,s)=>{s.r(p),s.d(p,{Ball:()=>E,Box:()=>x,Ground:()=>A,PostProcessingSSAOComponent:()=>w,Scene:()=>P,SmallBox:()=>D,Wall:()=>M});var u=s(8368),a=s(8786),m=s(693),d=s(3545),_=s(3749),h=s(1210),c=s(9761),l=s(7380),g=s(6076),i=s(7327),t=s(9709);const b=function(){return[16,12,1]},y=function(n){return[0,6,n]},S=function(n){return[n,6,5]},B=function(n){return[0,n,0]},T=function(n){return[6,1,n]},F=function(){return[2,2,2]},U=function(){return[0,2.5,0]},Z=function(){return[5,5,5]},L=function(n){return[n,0,0]},N=function(){return[100,1e3]},C=function(n){return[1,6,n]},G=function(){return[1,128,128]},K=["blendFunction",""];function Q(n,o){if(1&n&&t._UZ(0,"ngt-ssao-effect",2),2&n){const e=t.oxw();t.Q6J("blendFunction",e.blendFunction)}}const R=function(){return[2.5,5,5]},W=function(){return[10,10,10]},I=function(n){return{position:n}};let M=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["sandbox-wall"]],standalone:!0,features:[t.jDz],decls:7,vars:17,consts:[["noAttach","",3,"args"],["ngtGeometry",""],["noAttach","","color","pink"],["ngtMaterial",""],["castShadow","","receiveShadow","",3,"position","geometry","material"],["castShadow","","receiveShadow","",3,"position","rotation","geometry","material"]],template:function(e,r){if(1&e&&(t._UZ(0,"ngt-box-geometry",0,1)(2,"ngt-mesh-lambert-material",2,3)(4,"ngt-mesh",4)(5,"ngt-mesh",5),t.ALo(6,"radian")),2&e){const f=t.MAs(1),v=t.MAs(3);t.Q6J("args",t.DdM(10,b)),t.xp6(4),t.Q6J("position",t.VKq(11,y,-3))("geometry",f.instance.value)("material",v.instance.value),t.xp6(1),t.Q6J("position",t.VKq(13,S,-8))("rotation",t.VKq(15,B,t.lcZ(6,8,-90)))("geometry",f.instance.value)("material",v.instance.value)}},dependencies:[a.gB,d.sA,_.oX,u.j4],encapsulation:2,changeDetection:0}),n})(),D=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["sandbox-small-box"]],standalone:!0,features:[t.jDz],decls:3,vars:5,consts:[["castShadow","","receiveShadow","",3,"position"],[3,"args"],["color","green"]],template:function(e,r){1&e&&(t.TgZ(0,"ngt-mesh",0),t._UZ(1,"ngt-box-geometry",1)(2,"ngt-mesh-lambert-material",2),t.qZA()),2&e&&(t.Q6J("position",t.VKq(2,T,-1.5)),t.xp6(1),t.Q6J("args",t.DdM(4,F)))},dependencies:[_.oX,a.gB,d.sA],encapsulation:2,changeDetection:0}),n})(),x=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["sandbox-box"]],standalone:!0,features:[t.jDz],decls:3,vars:4,consts:[["castShadow","","receiveShadow","",3,"position"],[3,"args"],["color","red"]],template:function(e,r){1&e&&(t.TgZ(0,"ngt-mesh",0),t._UZ(1,"ngt-box-geometry",1)(2,"ngt-mesh-lambert-material",2),t.qZA()),2&e&&(t.Q6J("position",t.DdM(2,U)),t.xp6(1),t.Q6J("args",t.DdM(3,Z)))},dependencies:[_.oX,a.gB,d.sA],encapsulation:2,changeDetection:0}),n})(),A=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["sandbox-ground"]],standalone:!0,features:[t.jDz],decls:4,vars:7,consts:[["receiveShadow","",3,"rotation"],[3,"args"],["color","#ddddff"]],template:function(e,r){1&e&&(t.TgZ(0,"ngt-mesh",0),t.ALo(1,"radian"),t._UZ(2,"ngt-plane-geometry",1)(3,"ngt-mesh-standard-material",2),t.qZA()),2&e&&(t.Q6J("rotation",t.VKq(4,L,t.lcZ(1,2,-90))),t.xp6(2),t.Q6J("args",t.DdM(6,N)))},dependencies:[_.oX,a.U4,d.hv,u.j4],encapsulation:2,changeDetection:0}),n})(),E=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["sandbox-ball"]],standalone:!0,features:[t.jDz],decls:3,vars:5,consts:[["castShadow","","receiveShadow","",3,"position"],[3,"args"],["color","yellow"]],template:function(e,r){1&e&&(t.TgZ(0,"ngt-mesh",0),t._UZ(1,"ngt-sphere-geometry",1)(2,"ngt-mesh-lambert-material",2),t.qZA()),2&e&&(t.Q6J("position",t.VKq(2,C,-1)),t.xp6(1),t.Q6J("args",t.DdM(4,G)))},dependencies:[_.oX,a.ov,d.sA],encapsulation:2,changeDetection:0}),n})(),P=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["sandbox-scene","blendFunction",""]],inputs:{blendFunction:"blendFunction"},standalone:!0,features:[t.jDz],attrs:K,decls:9,vars:2,consts:[["castShadow","",3,"position"],["ngt-effect-composer-content",""],["intensity","30","samples","31","radius","5",3,"blendFunction"]],template:function(e,r){1&e&&(t._UZ(0,"ngt-directional-light",0)(1,"sandbox-small-box")(2,"sandbox-box")(3,"sandbox-ball")(4,"sandbox-wall")(5,"sandbox-ground"),t.TgZ(6,"ngt-effect-composer"),t.YNc(7,Q,1,1,"ng-template",1),t.qZA(),t._UZ(8,"ngt-soba-orbit-controls")),2&e&&t.Q6J("position",t.DdM(1,R))},dependencies:[m.YY,D,x,M,A,c.dM,c.sY,l.SE,g.St,E],encapsulation:2,changeDetection:0}),n})(),w=(()=>{class n{constructor(){this.blendFunction=i.YQ.NORMAL}get blendFunctionName(){return this.blendFunction===i.YQ.NORMAL?"NORMAL":"MULTIPLY"}toggle(){this.blendFunction=this.blendFunction===i.YQ.NORMAL?i.YQ.MULTIPLY:i.YQ.NORMAL}}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["sandbox-postprocessing-ssao"]],standalone:!0,features:[t.jDz],decls:6,vars:6,consts:[[1,"px-4","py-2","rounded","bg-gray-300",3,"click"],[2,"height","400px","width","400px"],[3,"camera"],[3,"blendFunction"]],template:function(e,r){1&e&&(t.TgZ(0,"button",0),t.NdJ("click",function(){return r.toggle()}),t._uU(1),t.qZA(),t.TgZ(2,"div",1)(3,"ngt-canvas",2),t._UZ(4,"sandbox-scene",3),t.qZA(),t._UZ(5,"ngt-stats"),t.qZA()),2&e&&(t.xp6(1),t.hij(" Toggle BlendFunction (current: ",r.blendFunctionName,") "),t.xp6(2),t.Q6J("camera",t.VKq(4,I,t.DdM(3,W))),t.xp6(1),t.Q6J("blendFunction",r.blendFunction))},dependencies:[u.B3,P,h.Q],styles:["[_nghost-%COMP%]{display:flex;flex-direction:column;gap:1rem;height:100%;width:100%;justify-content:center;align-items:center}"],changeDetection:0}),n})()},2877:(O,p,s)=>{s.d(p,{U:()=>_});var u=s(8368),a=s(9709),m=s(969);const d=["*"];let _=(()=>{class c extends u.Jy{objectInitFn(){return new m.ZAu}}return c.\u0275fac=function(){let l;return function(i){return(l||(l=a.n5z(c)))(i||c)}}(),c.\u0275cmp=a.Xpm({type:c,selectors:[["ngt-group"]],standalone:!0,features:[a._Bn([(0,u.RD)(c),(0,u.wY)(c)]),a.qOj,a.jDz],ngContentSelectors:d,decls:1,vars:0,template:function(g,i){1&g&&(a.F$t(),a.Hsn(0))},encapsulation:2,changeDetection:0}),c})()}}]);