"use strict";(self.webpackChunksandbox=self.webpackChunksandbox||[]).push([[76],{6076:(be,U,P)=>{P.d(U,{St:()=>Pe});var c=P(8368),b=P(9709),k=P(8926),L=P(2435),r=P(2269),s=P(969);const Q=(m,l)=>(m%l+l)%l;class ve extends s.pBf{constructor(l,t){super(),(0,r.Z)(this,"object",void 0),(0,r.Z)(this,"domElement",void 0),(0,r.Z)(this,"enabled",!0),(0,r.Z)(this,"target",new s.Pa4),(0,r.Z)(this,"minDistance",0),(0,r.Z)(this,"maxDistance",1/0),(0,r.Z)(this,"minZoom",0),(0,r.Z)(this,"maxZoom",1/0),(0,r.Z)(this,"minPolarAngle",0),(0,r.Z)(this,"maxPolarAngle",Math.PI),(0,r.Z)(this,"minAzimuthAngle",-1/0),(0,r.Z)(this,"maxAzimuthAngle",1/0),(0,r.Z)(this,"enableDamping",!1),(0,r.Z)(this,"dampingFactor",.05),(0,r.Z)(this,"enableZoom",!0),(0,r.Z)(this,"zoomSpeed",1),(0,r.Z)(this,"enableRotate",!0),(0,r.Z)(this,"rotateSpeed",1),(0,r.Z)(this,"enablePan",!0),(0,r.Z)(this,"panSpeed",1),(0,r.Z)(this,"screenSpacePanning",!0),(0,r.Z)(this,"keyPanSpeed",7),(0,r.Z)(this,"autoRotate",!1),(0,r.Z)(this,"autoRotateSpeed",2),(0,r.Z)(this,"reverseOrbit",!1),(0,r.Z)(this,"keys",{LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"}),(0,r.Z)(this,"mouseButtons",{LEFT:s.RsA.ROTATE,MIDDLE:s.RsA.DOLLY,RIGHT:s.RsA.PAN}),(0,r.Z)(this,"touches",{ONE:s.QmN.ROTATE,TWO:s.QmN.DOLLY_PAN}),(0,r.Z)(this,"target0",void 0),(0,r.Z)(this,"position0",void 0),(0,r.Z)(this,"zoom0",void 0),(0,r.Z)(this,"_domElementKeyEvents",null),(0,r.Z)(this,"getPolarAngle",void 0),(0,r.Z)(this,"getAzimuthalAngle",void 0),(0,r.Z)(this,"setPolarAngle",void 0),(0,r.Z)(this,"setAzimuthalAngle",void 0),(0,r.Z)(this,"getDistance",void 0),(0,r.Z)(this,"listenToKeyEvents",void 0),(0,r.Z)(this,"saveState",void 0),(0,r.Z)(this,"reset",void 0),(0,r.Z)(this,"update",void 0),(0,r.Z)(this,"connect",void 0),(0,r.Z)(this,"dispose",void 0),this.object=l,this.domElement=t,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object instanceof s.cPb?this.object.zoom:1,this.getPolarAngle=()=>p.phi,this.getAzimuthalAngle=()=>p.theta,this.setPolarAngle=o=>{let n=Q(o,2*Math.PI),a=p.phi;a<0&&(a+=2*Math.PI),n<0&&(n+=2*Math.PI);let d=Math.abs(n-a);2*Math.PI-d<d&&(n<a?n+=2*Math.PI:a+=2*Math.PI),S.phi=n-a,e.update()},this.setAzimuthalAngle=o=>{let n=Q(o,2*Math.PI),a=p.theta;a<0&&(a+=2*Math.PI),n<0&&(n+=2*Math.PI);let d=Math.abs(n-a);2*Math.PI-d<d&&(n<a?n+=2*Math.PI:a+=2*Math.PI),S.theta=n-a,e.update()},this.getDistance=()=>e.object.position.distanceTo(e.target),this.listenToKeyEvents=o=>{o.addEventListener("keydown",he),this._domElementKeyEvents=o},this.saveState=()=>{e.target0.copy(e.target),e.position0.copy(e.object.position),e.zoom0=e.object instanceof s.cPb?e.object.zoom:1},this.reset=()=>{e.target.copy(e.target0),e.object.position.copy(e.position0),e.object instanceof s.cPb&&(e.object.zoom=e.zoom0,e.object.updateProjectionMatrix()),e.dispatchEvent(g),e.update(),u=i.NONE},this.update=(()=>{const o=new s.Pa4,n=(new s._fP).setFromUnitVectors(l.up,new s.Pa4(0,1,0)),a=n.clone().invert(),d=new s.Pa4,f=new s._fP,y=2*Math.PI;return function(){const fe=e.object.position;o.copy(fe).sub(e.target),o.applyQuaternion(n),p.setFromVector3(o),e.autoRotate&&u===i.NONE&&H(function Ce(){return 2*Math.PI/60/60*e.autoRotateSpeed}()),e.enableDamping?(p.theta+=S.theta*e.dampingFactor,p.phi+=S.phi*e.dampingFactor):(p.theta+=S.theta,p.phi+=S.phi);let E=e.minAzimuthAngle,N=e.maxAzimuthAngle;return isFinite(E)&&isFinite(N)&&(E<-Math.PI?E+=y:E>Math.PI&&(E-=y),N<-Math.PI?N+=y:N>Math.PI&&(N-=y),p.theta=E<=N?Math.max(E,Math.min(N,p.theta)):p.theta>(E+N)/2?Math.max(E,p.theta):Math.min(N,p.theta)),p.phi=Math.max(e.minPolarAngle,Math.min(e.maxPolarAngle,p.phi)),p.makeSafe(),p.radius*=Z,p.radius=Math.max(e.minDistance,Math.min(e.maxDistance,p.radius)),!0===e.enableDamping?e.target.addScaledVector(D,e.dampingFactor):e.target.add(D),o.setFromSpherical(p),o.applyQuaternion(a),fe.copy(e.target).add(o),e.object.lookAt(e.target),!0===e.enableDamping?(S.theta*=1-e.dampingFactor,S.phi*=1-e.dampingFactor,D.multiplyScalar(1-e.dampingFactor)):(S.set(0,0,0),D.set(0,0,0)),Z=1,!!(_||d.distanceToSquared(e.object.position)>W||8*(1-f.dot(e.object.quaternion))>W)&&(e.dispatchEvent(g),d.copy(e.object.position),f.copy(e.object.quaternion),_=!1,!0)}})(),this.connect=o=>{o===document&&console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.'),e.domElement=o,e.domElement.style.touchAction="none",e.domElement.addEventListener("contextmenu",me),e.domElement.addEventListener("pointerdown",ce),e.domElement.addEventListener("pointercancel",ue),e.domElement.addEventListener("wheel",de)},this.dispose=()=>{var o,n,a,d,f,y;null===(o=e.domElement)||void 0===o||o.removeEventListener("contextmenu",me),null===(n=e.domElement)||void 0===n||n.removeEventListener("pointerdown",ce),null===(a=e.domElement)||void 0===a||a.removeEventListener("pointercancel",ue),null===(d=e.domElement)||void 0===d||d.removeEventListener("wheel",de),null===(f=e.domElement)||void 0===f||f.ownerDocument.removeEventListener("pointermove",V),null===(y=e.domElement)||void 0===y||y.ownerDocument.removeEventListener("pointerup",K),null!==e._domElementKeyEvents&&e._domElementKeyEvents.removeEventListener("keydown",he)};const e=this,g={type:"change"},v={type:"start"},C={type:"end"},i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let u=i.NONE;const W=1e-6,p=new s.$V,S=new s.$V;let Z=1;const D=new s.Pa4;let _=!1;const M=new s.FM8,T=new s.FM8,w=new s.FM8,O=new s.FM8,F=new s.FM8,A=new s.FM8,x=new s.FM8,R=new s.FM8,I=new s.FM8,h=[],z={};function B(){return Math.pow(.95,e.zoomSpeed)}function H(o){e.reverseOrbit?S.theta+=o:S.theta-=o}function $(o){e.reverseOrbit?S.phi+=o:S.phi-=o}const q=(()=>{const o=new s.Pa4;return function(a,d){o.setFromMatrixColumn(d,0),o.multiplyScalar(-a),D.add(o)}})(),J=(()=>{const o=new s.Pa4;return function(a,d){!0===e.screenSpacePanning?o.setFromMatrixColumn(d,1):(o.setFromMatrixColumn(d,0),o.crossVectors(e.object.up,o)),o.multiplyScalar(a),D.add(o)}})(),j=(()=>{const o=new s.Pa4;return function(a,d){const f=e.domElement;if(f&&e.object instanceof s.cPb&&e.object.isPerspectiveCamera){o.copy(e.object.position).sub(e.target);let Y=o.length();Y*=Math.tan(e.object.fov/2*Math.PI/180),q(2*a*Y/f.clientHeight,e.object.matrix),J(2*d*Y/f.clientHeight,e.object.matrix)}else f&&e.object instanceof s.iKG&&e.object.isOrthographicCamera?(q(a*(e.object.right-e.object.left)/e.object.zoom/f.clientWidth,e.object.matrix),J(d*(e.object.top-e.object.bottom)/e.object.zoom/f.clientHeight,e.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),e.enablePan=!1)}})();function X(o){e.object instanceof s.cPb&&e.object.isPerspectiveCamera?Z/=o:e.object instanceof s.iKG&&e.object.isOrthographicCamera?(e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom*o)),e.object.updateProjectionMatrix(),_=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function ee(o){e.object instanceof s.cPb&&e.object.isPerspectiveCamera?Z*=o:e.object instanceof s.iKG&&e.object.isOrthographicCamera?(e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/o)),e.object.updateProjectionMatrix(),_=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function te(o){M.set(o.clientX,o.clientY)}function oe(o){O.set(o.clientX,o.clientY)}function ne(){1==h.length?M.set(h[0].pageX,h[0].pageY):M.set(.5*(h[0].pageX+h[1].pageX),.5*(h[0].pageY+h[1].pageY))}function se(){1==h.length?O.set(h[0].pageX,h[0].pageY):O.set(.5*(h[0].pageX+h[1].pageX),.5*(h[0].pageY+h[1].pageY))}function ae(){const o=h[0].pageX-h[1].pageX,n=h[0].pageY-h[1].pageY,a=Math.sqrt(o*o+n*n);x.set(0,a)}function re(o){if(1==h.length)T.set(o.pageX,o.pageY);else{const a=G(o);T.set(.5*(o.pageX+a.x),.5*(o.pageY+a.y))}w.subVectors(T,M).multiplyScalar(e.rotateSpeed);const n=e.domElement;n&&(H(2*Math.PI*w.x/n.clientHeight),$(2*Math.PI*w.y/n.clientHeight)),M.copy(T)}function ie(o){if(1==h.length)F.set(o.pageX,o.pageY);else{const n=G(o);F.set(.5*(o.pageX+n.x),.5*(o.pageY+n.y))}A.subVectors(F,O).multiplyScalar(e.panSpeed),j(A.x,A.y),O.copy(F)}function le(o){const n=G(o),a=o.pageX-n.x,d=o.pageY-n.y,f=Math.sqrt(a*a+d*d);R.set(0,f),I.set(0,Math.pow(R.y/x.y,e.zoomSpeed)),X(I.y),x.copy(R)}function ce(o){var n,a;!1!==e.enabled&&(0===h.length&&(null===(n=e.domElement)||void 0===n||n.ownerDocument.addEventListener("pointermove",V),null===(a=e.domElement)||void 0===a||a.ownerDocument.addEventListener("pointerup",K)),function Le(o){h.push(o)}(o),"touch"===o.pointerType?function ke(o){switch(ge(o),h.length){case 1:switch(e.touches.ONE){case s.QmN.ROTATE:if(!1===e.enableRotate)return;ne(),u=i.TOUCH_ROTATE;break;case s.QmN.PAN:if(!1===e.enablePan)return;se(),u=i.TOUCH_PAN;break;default:u=i.NONE}break;case 2:switch(e.touches.TWO){case s.QmN.DOLLY_PAN:if(!1===e.enableZoom&&!1===e.enablePan)return;(function De(){e.enableZoom&&ae(),e.enablePan&&se()})(),u=i.TOUCH_DOLLY_PAN;break;case s.QmN.DOLLY_ROTATE:if(!1===e.enableZoom&&!1===e.enableRotate)return;(function we(){e.enableZoom&&ae(),e.enableRotate&&ne()})(),u=i.TOUCH_DOLLY_ROTATE;break;default:u=i.NONE}break;default:u=i.NONE}u!==i.NONE&&e.dispatchEvent(v)}(o):function Re(o){let n;switch(o.button){case 0:n=e.mouseButtons.LEFT;break;case 1:n=e.mouseButtons.MIDDLE;break;case 2:n=e.mouseButtons.RIGHT;break;default:n=-1}switch(n){case s.RsA.DOLLY:if(!1===e.enableZoom)return;(function Ee(o){x.set(o.clientX,o.clientY)})(o),u=i.DOLLY;break;case s.RsA.ROTATE:if(o.ctrlKey||o.metaKey||o.shiftKey){if(!1===e.enablePan)return;oe(o),u=i.PAN}else{if(!1===e.enableRotate)return;te(o),u=i.ROTATE}break;case s.RsA.PAN:if(o.ctrlKey||o.metaKey||o.shiftKey){if(!1===e.enableRotate)return;te(o),u=i.ROTATE}else{if(!1===e.enablePan)return;oe(o),u=i.PAN}break;default:u=i.NONE}u!==i.NONE&&e.dispatchEvent(v)}(o))}function V(o){!1!==e.enabled&&("touch"===o.pointerType?function Ie(o){switch(ge(o),u){case i.TOUCH_ROTATE:if(!1===e.enableRotate)return;re(o),e.update();break;case i.TOUCH_PAN:if(!1===e.enablePan)return;ie(o),e.update();break;case i.TOUCH_DOLLY_PAN:if(!1===e.enableZoom&&!1===e.enablePan)return;(function Ae(o){e.enableZoom&&le(o),e.enablePan&&ie(o)})(o),e.update();break;case i.TOUCH_DOLLY_ROTATE:if(!1===e.enableZoom&&!1===e.enableRotate)return;(function xe(o){e.enableZoom&&le(o),e.enableRotate&&re(o)})(o),e.update();break;default:u=i.NONE}}(o):function je(o){if(!1!==e.enabled)switch(u){case i.ROTATE:if(!1===e.enableRotate)return;!function Ne(o){T.set(o.clientX,o.clientY),w.subVectors(T,M).multiplyScalar(e.rotateSpeed);const n=e.domElement;n&&(H(2*Math.PI*w.x/n.clientHeight),$(2*Math.PI*w.y/n.clientHeight)),M.copy(T),e.update()}(o);break;case i.DOLLY:if(!1===e.enableZoom)return;!function Me(o){R.set(o.clientX,o.clientY),I.subVectors(R,x),I.y>0?X(B()):I.y<0&&ee(B()),x.copy(R),e.update()}(o);break;case i.PAN:if(!1===e.enablePan)return;!function Te(o){F.set(o.clientX,o.clientY),A.subVectors(F,O).multiplyScalar(e.panSpeed),j(A.x,A.y),O.copy(F),e.update()}(o)}}(o))}function K(o){var n,a,d;pe(o),0===h.length&&(null===(n=e.domElement)||void 0===n||n.releasePointerCapture(o.pointerId),null===(a=e.domElement)||void 0===a||a.ownerDocument.removeEventListener("pointermove",V),null===(d=e.domElement)||void 0===d||d.ownerDocument.removeEventListener("pointerup",K)),e.dispatchEvent(C),u=i.NONE}function ue(o){pe(o)}function de(o){!1===e.enabled||!1===e.enableZoom||u!==i.NONE&&u!==i.ROTATE||(o.preventDefault(),e.dispatchEvent(v),function Oe(o){o.deltaY<0?ee(B()):o.deltaY>0&&X(B()),e.update()}(o),e.dispatchEvent(C))}function he(o){!1===e.enabled||!1===e.enablePan||function Fe(o){let n=!1;switch(o.code){case e.keys.UP:j(0,e.keyPanSpeed),n=!0;break;case e.keys.BOTTOM:j(0,-e.keyPanSpeed),n=!0;break;case e.keys.LEFT:j(e.keyPanSpeed,0),n=!0;break;case e.keys.RIGHT:j(-e.keyPanSpeed,0),n=!0}n&&(o.preventDefault(),e.update())}(o)}function me(o){!1!==e.enabled&&o.preventDefault()}function pe(o){delete z[o.pointerId];for(let n=0;n<h.length;n++)if(h[n].pointerId==o.pointerId)return void h.splice(n,1)}function ge(o){let n=z[o.pointerId];void 0===n&&(n=new s.FM8,z[o.pointerId]=n),n.set(o.pageX,o.pageY)}function G(o){return z[(o.pointerId===h[0].pointerId?h[1]:h[0]).pointerId]}void 0!==t&&this.connect(t),this.update()}}const Se=["*"];let Pe=(()=>{class m extends c.WZ{constructor(){super(...arguments),this.change=new b.vpe,this.start=new b.vpe,this.end=new b.vpe,this.init=this.effect((0,k.b)(()=>{const t=this.get(e=>e.camera);t&&this.prepareInstance(new ve(t))})),this.setBeforeRender=this.effect((0,c.oe)(()=>this.store.registerBeforeRender({priority:-1,callback:()=>{this.instance.value.enabled&&this.instance.value.update()}}))),this.connectDomElement=this.effect((0,c.oe)(()=>{const t=this.get(e=>e.domElement)||this.store.get(e=>e.events.connected)||this.store.get(e=>e.gl.domElement);return this.instance.value.connect(t),()=>{this.instance.value.dispose()}})),this.setEvents=this.effect((0,c.oe)(()=>{const{invalidate:t,performance:e}=this.store.get(),g=this.get(u=>u.regress),v=u=>{t(),g&&e.regress(),this.change.observed&&this.change.emit(u)};let C,i;return this.instance.value.addEventListener("change",v),this.start.observed&&(C=u=>{this.start.emit(u)},this.instance.value.addEventListener("start",C)),this.end.observed&&(i=u=>{this.end.emit(u)},this.instance.value.addEventListener("end",i)),()=>{this.instance.value.removeEventListener("change",v),i&&this.instance.value.removeEventListener("end",i),C&&this.instance.value.removeEventListener("start",C)}})),this.setDefaultControls=this.effect((0,c.oe)(()=>{if(this.get(e=>e.makeDefault)){const e=this.store.get(g=>g.controls);return this.store.set({controls:this.instance.value}),()=>{this.store.set({controls:e})}}}))}set enabled(t){this.set({enabled:(0,c.Ig)(t)})}set camera(t){this.set({camera:t})}set domElement(t){this.set({domElement:t})}set makeDefault(t){this.set({makeDefault:(0,c.Ig)(t)})}set regress(t){this.set({regress:(0,c.Ig)(t)})}set target(t){this.set({target:t})}set enableDamping(t){this.set({enableDamping:(0,c.Ig)(t)})}set minDistance(t){this.set({minDistance:(0,c.su)(t)})}set maxDistance(t){this.set({maxDistance:(0,c.su)(t)})}set minZoom(t){this.set({minZoom:(0,c.su)(t)})}set maxZoom(t){this.set({maxZoom:(0,c.su)(t)})}set minPolarAngle(t){this.set({minPolarAngle:(0,c.su)(t)})}set maxPolarAngle(t){this.set({maxPolarAngle:(0,c.su)(t)})}set minAzimuthAngle(t){this.set({minAzimuthAngle:(0,c.su)(t)})}set maxAzimuthAngle(t){this.set({maxAzimuthAngle:(0,c.su)(t)})}set dampingFactor(t){this.set({dampingFactor:(0,c.su)(t)})}set enableZoom(t){this.set({enableZoom:(0,c.Ig)(t)})}set zoomSpeed(t){this.set({zoomSpeed:(0,c.su)(t)})}set enableRotate(t){this.set({enableRotate:(0,c.Ig)(t)})}set rotateSpeed(t){this.set({rotateSpeed:(0,c.su)(t)})}set enablePan(t){this.set({enablePan:(0,c.Ig)(t)})}set panSpeed(t){this.set({panSpeed:(0,c.su)(t)})}set screenSpacePanning(t){this.set({screenSpacePanning:(0,c.Ig)(t)})}set keyPanSpeed(t){this.set({keyPanSpeed:(0,c.su)(t)})}set autoRotate(t){this.set({autoRotate:(0,c.Ig)(t)})}set autoRotateSpeed(t){this.set({autoRotateSpeed:(0,c.su)(t)})}set reverseOrbit(t){this.set({reverseOrbit:(0,c.Ig)(t)})}set keys(t){this.set({keys:t})}set mouseButtons(t){this.set({mouseButtons:t})}set touches(t){this.set({touches:t})}preInit(){this.set(t=>({enabled:t.enabled??!0,enableDamping:t.enableDamping??!0,domElement:t.domElement??this.store.get(e=>e.events.connected)??this.store.get(e=>e.gl.domElement)}))}ngOnInit(){super.ngOnInit(),this.zone.runOutsideAngular(()=>{this.store.onReady(()=>{this.get(t=>t.camera)||this.set(this.store.select(t=>t.camera).pipe((0,L.U)(t=>({camera:t})))),this.init(this.select(t=>t.camera)),this.setBeforeRender(),this.connectDomElement(this.select(this.instance$,this.select(t=>t.domElement))),this.setEvents(this.instance$),this.setDefaultControls(this.select(this.instance$,this.select(t=>t.makeDefault)))})})}get optionFields(){return{...super.optionFields,enabled:!1,target:!0,enableDamping:!1,minDistance:!0,maxDistance:!0,minZoom:!0,maxZoom:!0,minPolarAngle:!0,maxPolarAngle:!0,minAzimuthAngle:!0,maxAzimuthAngle:!0,dampingFactor:!0,enableZoom:!0,zoomSpeed:!0,enableRotate:!0,rotateSpeed:!0,enablePan:!0,panSpeed:!0,screenSpacePanning:!0,keyPanSpeed:!0,autoRotate:!0,autoRotateSpeed:!0,reverseOrbit:!0,keys:!0,mouseButtons:!0,touches:!0}}}return m.\u0275fac=function(){let l;return function(e){return(l||(l=b.n5z(m)))(e||m)}}(),m.\u0275cmp=b.Xpm({type:m,selectors:[["ngt-soba-orbit-controls"]],inputs:{enabled:"enabled",camera:"camera",domElement:"domElement",makeDefault:"makeDefault",regress:"regress",target:"target",enableDamping:"enableDamping",minDistance:"minDistance",maxDistance:"maxDistance",minZoom:"minZoom",maxZoom:"maxZoom",minPolarAngle:"minPolarAngle",maxPolarAngle:"maxPolarAngle",minAzimuthAngle:"minAzimuthAngle",maxAzimuthAngle:"maxAzimuthAngle",dampingFactor:"dampingFactor",enableZoom:"enableZoom",zoomSpeed:"zoomSpeed",enableRotate:"enableRotate",rotateSpeed:"rotateSpeed",enablePan:"enablePan",panSpeed:"panSpeed",screenSpacePanning:"screenSpacePanning",keyPanSpeed:"keyPanSpeed",autoRotate:"autoRotate",autoRotateSpeed:"autoRotateSpeed",reverseOrbit:"reverseOrbit",keys:"keys",mouseButtons:"mouseButtons",touches:"touches"},outputs:{change:"change",start:"start",end:"end"},standalone:!0,features:[b._Bn([(0,c.Nx)(m),(0,c.UV)(m)]),b.qOj,b.jDz],ngContentSelectors:Se,decls:1,vars:0,template:function(t,e){1&t&&(b.F$t(),b.Hsn(0))},encapsulation:2,changeDetection:0}),m})()},2269:(be,U,P)=>{function c(b,k,L){return k in b?Object.defineProperty(b,k,{value:L,enumerable:!0,configurable:!0,writable:!0}):b[k]=L,b}P.d(U,{Z:()=>c})}}]);