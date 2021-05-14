!function(){"use strict";var e={5358:function(e,t,n){n(5901),n(2189),n(1047),n(5769),n(3238),n(1418),n(7460),n(4078),n(987),n(8410);var i,r=n(2601),o=n(2930),a=n(9698),s=n(5061),u=n(5345),l=n(8029),c=n(4143),h=n(1487),p=n(4213),f=n(7985),d=function(){return(d=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}).apply(this,arguments)},m=function(e,t,n,i){return new(n||(n=Promise))((function(r,o){function a(e){try{u(i.next(e))}catch(e){o(e)}}function s(e){try{u(i.throw(e))}catch(e){o(e)}}function u(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}u((i=i.apply(e,t||[])).next())}))},v=function(e,t){var n,i,r,o,a={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,i&&(r=2&o[0]?i.return:o[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,o[1])).done)return r;switch(i=0,r&&(o=[2&o[0],r.value]),o[0]){case 0:case 1:r=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,i=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(r=a.trys,(r=r.length>0&&r[r.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!r||o[1]>r[0]&&o[1]<r[3])){a.label=o[1];break}if(6===o[0]&&a.label<r[1]){a.label=r[1],r=o;break}if(r&&a.label<r[2]){a.label=r[2],a.ops.push(o);break}r[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],i=0}finally{n=r=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},y=function(){function e(e,t){void 0===t&&(t=null),this.pixelRatio=1,this.width=0,this.height=0,this.startTime=0,this.time=0,this.frameCountsPerRender=1,this.renderCount=0,this.isRunning=!1,this.animationId=0,this.isDisposed=!1,this.isInited=!1,this.container=e,this.canvas=t}return Object.defineProperty(e,"isWebGLAvailable",{get:function(){return this.isCheckedWebGLAvailable||(this._isWebGLAvailable=f.$.isWebGLAvailable(),this.isCheckedWebGLAvailable=!0),this._isWebGLAvailable},enumerable:!1,configurable:!0}),e.initImgTexture=function(e,t){return void 0===t&&(t=null),m(this,void 0,void 0,(function(){return v(this,(function(n){return[2,new Promise((function(n){var i=new u.d,r={wrapS:p.uWy,wrapT:p.uWy,minFilter:p.wem,magFilter:p.wem,generateMipmaps:!1},o=t=null!==t?Object.assign({},r,t):d({},r);i.load(e,(function(e){e.generateMipmaps=o.generateMipmaps,e.wrapS=o.wrapS,e.wrapT=o.wrapT,e.minFilter=o.minFilter,e.magFilter=o.magFilter,e.needsUpdate=!0,n(e)}))}))]}))}))},e.getUV=function(e,t,n,i){var r=e/t,o=n/i,a=new h.F(1,1),s=new h.F(0,0),u=1;return r>o?(u=e/n,a.y=t/i/u,s.y=.5*(1-a.y)):(u=t/i,a.x=e/n/u,s.x=.5*(1-a.x)),{uvSize:a,uvOffset:s}},e.disposeObject3D=function(e,t,n,i,r){if(void 0===t&&(t=!0),void 0===n&&(n=!0),void 0===i&&(i=!0),void 0===r&&(r=!0),t&&e.children&&e.children.length>0)for(var o=void 0;o=e.children[0];)this.disposeObject3D(o,n,i,r),e.remove(o);r&&e.parent&&e.parent.remove(e),e instanceof l.K&&(n&&e.geometry.dispose(),i&&e.material instanceof c.F&&e.material.dispose())},e.prototype.getContainer=function(){return this.container},e.prototype.getCanvas=function(){return this.canvas},e.prototype.getWidth=function(){return this.width},e.prototype.getHeight=function(){return this.height},e.prototype.getScene=function(){return this.scene},e.prototype.init=function(){return m(this,void 0,void 0,(function(){return v(this,(function(t){switch(t.label){case 0:if(!e.isWebGLAvailable)throw Error("not support webgl");return[4,this.initWebGL()];case 1:return t.sent(),this.isInited=!0,[2]}}))}))},e.prototype.setPixelRatio=function(e,t){void 0===t&&(t=!1),this.renderer&&(this.pixelRatio=e,this.renderer.setPixelRatio(this.pixelRatio),t&&this.onResize())},e.prototype.initWebGL=function(){return m(this,void 0,void 0,(function(){return v(this,(function(e){switch(e.label){case 0:return this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,this.initRenderer(),this.initCamera(),this.scene=new s.x,this.scene.matrixAutoUpdate=!1,this.scene.matrixWorldNeedsUpdate=!0,this.update=this.update.bind(this),[4,this.initContents()];case 1:return e.sent(),[2]}}))}))},e.prototype.initContents=function(){return m(this,void 0,void 0,(function(){return v(this,(function(e){return[2]}))}))},e.prototype.initDatGUI=function(e){},e.prototype.initRenderer=function(){this.pixelRatio=window.devicePixelRatio;var e={alpha:!0};this.canvas&&(e.canvas=this.canvas),this.renderer=new r.b(e),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.setClearColor(new a.I(0,0,0),0),this.canvas||(this.canvas=this.renderer.domElement,this.container.appendChild(this.canvas))},e.prototype.initCamera=function(){this.camera=new o.c(45,1,1,1e6),this.camera.position.z=500,this.camera.lookAt(0,0,0)},e.prototype.update=function(){this.animationId=requestAnimationFrame(this.update),this.render()},e.prototype.start=function(){this.isInited&&(this.stop(),this.isRunning=!0,this.startTimeUpdate(),this.renderCount=0,this.update())},e.prototype.startTimeUpdate=function(){this.startTime=(new Date).getTime()},e.prototype.stop=function(){this.isInited&&(this.isRunning=!1,this.animationId&&cancelAnimationFrame(this.animationId))},e.prototype.setFrameCountsPerRender=function(e){this.frameCountsPerRender=e},e.prototype.render=function(e){void 0===e&&(e=!1),this.isInited&&(this.time=(new Date).getTime()-this.startTime,(e||this.renderCount++%this.frameCountsPerRender==0)&&(this.renderCount%=this.frameCountsPerRender,this.beforeRenderContents(),this.renderer.render(this.scene,this.camera),this.afterRenderContents()))},e.prototype.beforeRenderContents=function(){},e.prototype.afterRenderContents=function(){},e.prototype.onResize=function(e,t,n){void 0===e&&(e=null),void 0===t&&(t=0),void 0===n&&(n=0),this.isInited&&(this.width=t||this.container.offsetWidth||1,this.height=n||this.container.offsetHeight||1,this.updateCamera(),this.renderer.setSize(this.width,this.height),this.onResizeContents(),e&&e(),this.render(!0))},e.prototype.onResizeContents=function(){},e.prototype.updateCamera=function(){var e=this.camera;e.aspect=this.width/this.height;var t=this.height/2/Math.tan(e.fov*Math.PI/180/2);e.position.z=t,e.updateMatrix(),e.updateProjectionMatrix()},e.prototype.dispose=function(){if(!this.isDisposed){if(this.stop(),this.renderer){if(this.renderer.clear(),this.renderer.dispose(),this.renderer.info.programs)for(var e=0,t=this.renderer.info.programs;e<t.length;e++){t[e].destroy()}for(var n=this.renderer.getContext(),i=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),r=0;r<i;++r)n.activeTexture(n.TEXTURE0+r),n.bindTexture(n.TEXTURE_2D,null),n.bindTexture(n.TEXTURE_CUBE_MAP,null);n.bindBuffer(n.ARRAY_BUFFER,null),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,null),n.bindRenderbuffer(n.RENDERBUFFER,null),n.bindFramebuffer(n.FRAMEBUFFER,null);var o=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,o);for(var a=n.getParameter(n.MAX_VERTEX_ATTRIBS),s=0;s<a;++s)n.vertexAttribPointer(s,1,n.FLOAT,!1,0,0);n.canvas.width=1,n.canvas.height=1,this.renderer.forceContextLoss()}delete this.scene,delete this.camera,delete this.renderer,this.isDisposed=!0,this.isInited=!1}},e.isCheckedWebGLAvailable=!1,e._isWebGLAvailable=!1,e}(),x=(n(1013),n(2410),n(7902)),g=n(2699),b=n(7934),w=n(7213),T=n(4987),R=n(4665),C=(n(1572),n(3352),n(6056),n(7753),n(3712),n(2979),n(6160),n(1849),n(5540),n(896),n(936),n(40),n(5923),n(5246),n(7635),n(8774),n(8373),n(9706),n(6964),n(4630),n(5389),n(1244),n(9981),n(3807),n(2627),n(4950),n(1964),n(1848)),F=n(3170),V=n(4628),D=n(8551),I=n(7516),P=function(e,t,n){this.variables=[],this.currentTextureIndex=0;var i=p.VzW,r=new s.x,o=new C.V;o.position.z=1;var a={passThruTexture:{value:null}},u=f("uniform sampler2D passThruTexture;\n\nvoid main() {\n\n  vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n  gl_FragColor = texture2D( passThruTexture, uv );\n\n}\n",a),c=new l.K(new V.B(2,2),u);function h(n){n.defines.resolution="vec2( "+e.toFixed(1)+", "+t.toFixed(1)+" )"}function f(e,t){t=t||{};var n=new D.j({uniforms:t,vertexShader:"void main()  {\n\n  gl_Position = vec4( position, 1.0 );\n\n}\n",fragmentShader:e});return h(n),n}r.add(c),this.setDataType=function(e){return i=e,this},this.addVariable=function(e,t,n){var i={name:e,initialValueTexture:n,material:this.createShaderMaterial(t),dependencies:null,renderTargets:[],wrapS:null,wrapT:null,minFilter:p.TyD,magFilter:p.TyD};return this.variables.push(i),i},this.setVariableDependencies=function(e,t){e.dependencies=t},this.init=function(){if(!1===n.capabilities.isWebGL2&&!1===n.extensions.has("OES_texture_float"))return"No OES_texture_float support for float textures.";if(0===n.capabilities.maxVertexTextures)return"No support for vertex shader textures.";for(var i=0;i<this.variables.length;i++){var r=this.variables[i];r.renderTargets[0]=this.createRenderTarget(e,t,r.wrapS,r.wrapT,r.minFilter,r.magFilter),r.renderTargets[1]=this.createRenderTarget(e,t,r.wrapS,r.wrapT,r.minFilter,r.magFilter),this.renderTexture(r.initialValueTexture,r.renderTargets[0]),this.renderTexture(r.initialValueTexture,r.renderTargets[1]);var o=r.material,a=o.uniforms;if(null!==r.dependencies)for(var s=0;s<r.dependencies.length;s++){var u=r.dependencies[s];if(u.name!==r.name){for(var l=!1,c=0;c<this.variables.length;c++)if(u.name===this.variables[c].name){l=!0;break}if(!l)return"Variable dependency not found. Variable="+r.name+", dependency="+u.name}a[u.name]={value:null},o.fragmentShader="\nuniform sampler2D "+u.name+";\n"+o.fragmentShader}}return this.currentTextureIndex=0,null},this.compute=function(){for(var e=this.currentTextureIndex,t=0===this.currentTextureIndex?1:0,n=0,i=this.variables.length;n<i;n++){var r=this.variables[n];if(null!==r.dependencies)for(var o=r.material.uniforms,a=0,s=r.dependencies.length;a<s;a++){var u=r.dependencies[a];o[u.name].value=u.renderTargets[e].texture}this.doRenderTarget(r.material,r.renderTargets[t])}this.currentTextureIndex=t},this.getCurrentRenderTarget=function(e){return e.renderTargets[this.currentTextureIndex]},this.getAlternateRenderTarget=function(e){return e.renderTargets[0===this.currentTextureIndex?1:0]},this.addResolutionDefine=h,this.createShaderMaterial=f,this.createRenderTarget=function(n,r,o,a,s,u){return n=n||e,r=r||t,o=o||p.uWy,a=a||p.uWy,s=s||p.TyD,u=u||p.TyD,new I.d(n,r,{wrapS:o,wrapT:a,minFilter:s,magFilter:u,format:p.wk1,type:i,depthBuffer:!1})},this.createTexture=function(){var n=new Float32Array(e*t*4);return new F.I(n,e,t,p.wk1,p.VzW)},this.renderTexture=function(e,t){a.passThruTexture.value=e,this.doRenderTarget(u,t),a.passThruTexture.value=null},this.doRenderTarget=function(e,t){var i=n.getRenderTarget();c.material=e,n.setRenderTarget(t),n.render(r,o),c.material=u,n.setRenderTarget(i)}},S=n(7595),A=n(5596),_=n.n(A),E=(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),M=function(e,t,n,i){return new(n||(n=Promise))((function(r,o){function a(e){try{u(i.next(e))}catch(e){o(e)}}function s(e){try{u(i.throw(e))}catch(e){o(e)}}function u(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}u((i=i.apply(e,t||[])).next())}))},O=function(e,t){var n,i,r,o,a={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,i&&(r=2&o[0]?i.return:o[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,o[1])).done)return r;switch(i=0,r&&(o=[2&o[0],r.value]),o[0]){case 0:case 1:r=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,i=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(r=a.trys,(r=r.length>0&&r[r.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!r||o[1]>r[0]&&o[1]<r[3])){a.label=o[1];break}if(6===o[0]&&a.label<r[1]){a.label=r[1],r=o;break}if(r&&a.label<r[2]){a.label=r[2],a.ops.push(o);break}r[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],i=0}finally{n=r=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},z=100,L=512,k=64,G=[{family:"Lobster",color:new a.I("#2CE54F")},{family:"Zilla Slab",color:new a.I("#2D6DA4")},{family:"EB Garamond",color:new a.I("#D2CDD1")},{family:"Black Ops One",color:new a.I("#2E4972")},{family:"Righteous",color:new a.I("#D2DC0C")},{family:"Fredericka the Great",color:new a.I("#A1759D")},{family:"Jost",color:new a.I("#3D8724")},{family:"Bubblegum Sans",color:new a.I("#6796EC")},{family:"Bangers",color:new a.I("#8C9280")},{family:"Press Start 2P",color:new a.I("#400EE1")},{family:"Ultra",color:new a.I("#D55BA1")},{family:"Codystar",color:new a.I("#B92105")},{family:"Cookie",color:new a.I("#AC6AF1")},{family:"Vidaloka",color:new a.I("#FC953A")},{family:"Wallpoet",color:new a.I("#79828E")},{family:"Aclonica",color:new a.I("#5864D6")}],U=function(e){function t(t){var n=e.call(this)||this;return n.typeIndex=0,n.numTypes=0,n.drawScale=1,n.imgPositionsData=[],n.imgColorsData=[],n.renderer=t,n.matrixAutoUpdate=!1,n.numTypes=G.length,n}return E(t,e),t.prototype.init=function(){return M(this,void 0,void 0,(function(){return O(this,(function(e){switch(e.label){case 0:return[4,this.initWebFonts()];case 1:return e.sent(),this.initPointTexture(),[4,this.initComputeRenderer()];case 2:return e.sent(),this.initGeometry(),this.initMaterial(),this.points=new x.w(this.geometry,this.material),this.points.matrixAutoUpdate=!1,this.add(this.points),this.updateMatrix(),[2]}}))}))},t.prototype.initWebFonts=function(){return M(this,void 0,void 0,(function(){return O(this,(function(e){return[2,new Promise((function(e,t){_().load({google:{families:G.map((function(e){return e.family})),text:"A"},timeout:1e4,fontactive:function(e){},fontinactive:function(e){},active:function(){e(!0)},inactive:function(){e("load fonts error")}})}))]}))}))},t.prototype.initPointTexture=function(){var e=document.createElement("canvas");e.width=k*this.numTypes,e.height=k;var t=e.getContext("2d");if(t){for(var n=0;n<this.numTypes;n++)this.drawType(t,57.6,G[n].family,new a.I("#ffffff"),k*n+32,32);this.pointTexture=new R.x(e),this.pointTexture.minFilter=p.wem,this.pointTexture.magFilter=p.wem,this.pointTexture.generateMipmaps=!1,this.pointTexture.needsUpdate=!0}},t.prototype.initComputeRenderer=function(){return M(this,void 0,void 0,(function(){var e,t,i;return O(this,(function(r){switch(r.label){case 0:for(this.gpuComputeRenderer=new P(z,z,this.renderer),this.gpuComputeRenderer.setDataType(p.cLu),e=0;e<this.numTypes;e++)(t=this.gpuComputeRenderer.createTexture()).minFilter=p.TyD,t.magFilter=p.TyD,this.imgPositionsData.push(t),(i=this.gpuComputeRenderer.createTexture()).minFilter=p.TyD,i.magFilter=p.TyD,this.imgColorsData.push(i);return[4,this.initTypesData()];case 1:return r.sent(),this.positionVelocityVariable=this.gpuComputeRenderer.addVariable("positionVelocityTexture",n(3328).Z,this.imgPositionsData[this.typeIndex]),this.positionVelocityVariable.material.uniforms.pointerPos={value:new h.F},this.positionVelocityVariable.material.uniforms.pointerForceRadius={value:0},this.positionVelocityVariable.material.uniforms.isPointerActive={value:0},this.positionVelocityVariable.material.uniforms.transitionValue={value:0},this.positionVelocityVariable.material.uniforms.imgPositionsData={value:this.imgPositionsData[this.typeIndex]},this.colorVariable=this.gpuComputeRenderer.addVariable("colorTexture",n(4195).Z,this.imgColorsData[this.typeIndex]),this.colorVariable.material.uniforms.imgColorsData={value:this.imgColorsData[this.typeIndex]},this.gpuComputeRenderer.setVariableDependencies(this.positionVelocityVariable,[this.positionVelocityVariable]),this.gpuComputeRenderer.setVariableDependencies(this.colorVariable,[this.colorVariable,this.positionVelocityVariable]),this.gpuComputeRenderer.init(),[2]}}))}))},t.prototype.initMaterial=function(){this.material=new w.F({vertexShader:n(3899).Z,fragmentShader:n(559).Z,depthWrite:!1,depthTest:!1,transparent:!0,uniforms:{pointTexture:{value:this.pointTexture},positionVelocityTexture:{value:null},colorTexture:{value:null},dataTextureSize:{value:z},dataCanvasSize:{value:L},pointSize:{value:1},drawScale:{value:1},time:{value:0},typeIndex:{value:0},numTypes:{value:this.numTypes}}})},t.prototype.initGeometry=function(){this.geometry=new b.u;for(var e=[],t=[],n=[],i=0;i<1e4;i++)e.push(0,0,0),t.push(i),n.push(this.getRandomValue(),this.getRandomValue(),this.getRandomValue(),this.getRandomValue());this.geometry.setAttribute("position",new T.a$(e,3)),this.geometry.setAttribute("vertexIndex",new T.a$(t,1)),this.geometry.setAttribute("randomValue",new T.a$(n,4))},t.prototype.getRandomValue=function(){return(Math.random()+Math.random()+Math.random())/3},t.prototype.initTypesData=function(){return M(this,void 0,void 0,(function(){var e,t,n;return O(this,(function(i){if((e=document.createElement("canvas")).width=L,e.height=L,!(t=e.getContext("2d")))return[2];for(n=0;n<this.numTypes;n++)this.createTypeImgData(n,t);return[2]}))}))},t.prototype.drawType=function(e,t,n,i,r,o){e.font=t+"px '"+n+"'",e.fillStyle="#"+i.getHexString(),e.textBaseline="middle",e.textAlign="center",e.fillText("A",r,o)},t.prototype.createTypeImgData=function(e,t){this.drawType(t,460.8,G[e].family,G[e].color,256,256),this.createImgDataFromCanvas(e,t)},t.prototype.createImgDataFromCanvas=function(e,t){return M(this,void 0,void 0,(function(){var n,i,r,o,a,s,u,l,c,h,p,f,d,m,v,y,x,g,b,w;return O(this,(function(T){for(n=t.getImageData(0,0,L,L),i=[],r=[],o=[],a=n.data.length/4,v=0;v<a;v++)s=4*v,u=n.data[s+0],l=n.data[s+1],c=n.data[s+2],h=n.data[s+3],p=v%L,f=Math.floor(v/L),0!==h&&(i.push(r.length),r.push([p-256,-(f-256)]),o.push([u,l,c,h]));for(t.clearRect(0,0,L,L),i=this.shuffleArray(i),d=this.imgPositionsData[e].image.data,m=this.imgColorsData[e].image.data,v=0;v<1e4;v++)y=v%i.length,x=i[y],g=r[x],b=o[x],d[(w=4*y)+0]=g[0],d[w+1]=g[1],d[w+2]=0,d[w+3]=0,m[w+0]=b[0],m[w+1]=b[1],m[w+2]=b[2],m[w+3]=b[3];return[2]}))}))},t.prototype.shuffleArray=function(e){for(var t=e.slice(),n=t.length-1;n>0;n--){var i=Math.floor(Math.random()*(n+1)),r=t[n];t[n]=t[i],t[i]=r}return t},t.prototype.onResize=function(){var e=this.renderer.getPixelRatio(),t=Math.min(window.innerWidth,window.innerHeight);this.drawScale=t/L,this.material.uniforms.drawScale.value=this.drawScale,this.material.uniforms.pointSize.value=.029296875*t*e,this.positionVelocityVariable.material.uniforms.pointerForceRadius.value=.3125*t*e},t.prototype.onPointerMove=function(e,t){var n=(e-.5*window.innerWidth)/this.drawScale,i=-(t-.5*window.innerHeight)/this.drawScale;S.ZP.to(this.positionVelocityVariable.material.uniforms.pointerPos.value,{x:n,y:i,duration:.4,ease:S.Au.easeOut,overwrite:!0}),this.activatePointer()},t.prototype.activatePointer=function(){0===this.positionVelocityVariable.material.uniforms.isPointerActive.value&&S.ZP.to(this.positionVelocityVariable.material.uniforms.isPointerActive,.4,{value:1,ease:S.Au.easeOut})},t.prototype.update=function(e){void 0===e&&(e=0),this.material.uniforms.time.value=e,this.gpuComputeRenderer.compute(),this.positionVelocityVariable.material.uniforms.transitionValue.value=0,this.material.uniforms.positionVelocityTexture.value=this.gpuComputeRenderer.getCurrentRenderTarget(this.positionVelocityVariable).texture,this.material.uniforms.colorTexture.value=this.gpuComputeRenderer.getCurrentRenderTarget(this.colorVariable).texture},t.prototype.changeType=function(){this.typeIndex=(this.typeIndex+1)%this.numTypes,this.material.uniforms.typeIndex.value=this.typeIndex,this.positionVelocityVariable.material.uniforms.transitionValue.value=1,this.positionVelocityVariable.material.uniforms.imgPositionsData.value=this.imgPositionsData[this.typeIndex],this.colorVariable.material.uniforms.imgColorsData.value=this.imgColorsData[this.typeIndex]},t}(g.T),W=function(){var e=function(t,n){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])})(t,n)};return function(t,n){function i(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}}(),j=function(e,t,n,i){return new(n||(n=Promise))((function(r,o){function a(e){try{u(i.next(e))}catch(e){o(e)}}function s(e){try{u(i.throw(e))}catch(e){o(e)}}function u(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}u((i=i.apply(e,t||[])).next())}))},B=function(e,t){var n,i,r,o,a={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,i&&(r=2&o[0]?i.return:o[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,o[1])).done)return r;switch(i=0,r&&(o=[2&o[0],r.value]),o[0]){case 0:case 1:r=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,i=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(r=a.trys,(r=r.length>0&&r[r.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!r||o[1]>r[0]&&o[1]<r[3])){a.label=o[1];break}if(6===o[0]&&a.label<r[1]){a.label=r[1],r=o;break}if(r&&a.label<r[2]){a.label=r[2],a.ops.push(o);break}r[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],i=0}finally{n=r=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},N=function(e){function t(t,n){void 0===n&&(n=null);if(!y.isWebGLAvailable)throw alert("not supported"),new Error("not supported");return e.call(this,t,n)||this}return W(t,e),t.prototype.initCamera=function(){e.prototype.initCamera.call(this),this.camera.matrixAutoUpdate=!1},t.prototype.initContents=function(){var e;return j(this,void 0,void 0,(function(){return B(this,(function(t){switch(t.label){case 0:return this.particle=new U(this.renderer),[4,this.particle.init()];case 1:return t.sent(),null===(e=this.scene)||void 0===e||e.add(this.particle),[2]}}))}))},t.prototype.onResizeContents=function(){this.particle.onResize()},t.prototype.onPointerMove=function(e,t){this.particle.onPointerMove(e,t)},t.prototype.beforeRenderContents=function(){this.particle.update(this.time)},t.prototype.changeType=function(){this.particle.changeType()},t}(y),q=function(e,t,n,i){return new(n||(n=Promise))((function(r,o){function a(e){try{u(i.next(e))}catch(e){o(e)}}function s(e){try{u(i.throw(e))}catch(e){o(e)}}function u(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}u((i=i.apply(e,t||[])).next())}))},Z=function(e,t){var n,i,r,o,a={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,i&&(r=2&o[0]?i.return:o[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,o[1])).done)return r;switch(i=0,r&&(o=[2&o[0],r.value]),o[0]){case 0:case 1:r=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,i=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(r=a.trys,(r=r.length>0&&r[r.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!r||o[1]>r[0]&&o[1]<r[3])){a.label=o[1];break}if(6===o[0]&&a.label<r[1]){a.label=r[1],r=o;break}if(r&&a.label<r[2]){a.label=r[2],a.ops.push(o);break}r[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],i=0}finally{n=r=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},K=function(){function e(){this.init()}return e.prototype.init=function(){return q(this,void 0,void 0,(function(){var e;return Z(this,(function(t){switch(t.label){case 0:return e=document.body.querySelector(".js-mainCanvas"),this.mainGL=new N(e.parentElement,e),[4,this.mainGL.init()];case 1:return t.sent(),this.onResize=this.onResize.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onTouchMove=this.onTouchMove.bind(this),this.onClick=this.onClick.bind(this),window.addEventListener("resize",this.onResize),window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("touchmove",this.onTouchMove),e.addEventListener("click",this.onClick),this.onResize(),this.mainGL.start(),[2]}}))}))},e.prototype.onResize=function(e){this.mainGL.onResize()},e.prototype.onPointerMove=function(e,t){this.mainGL.onPointerMove(e,t)},e.prototype.onMouseMove=function(e){this.onPointerMove(e.clientX,e.clientY)},e.prototype.onTouchMove=function(e){var t=e.touches[0];this.onPointerMove(t.clientX,t.clientY)},e.prototype.onClick=function(e){this.mainGL.changeType()},e}();(window.gpgpuParticle=window.gpgpuParticle||{}).main=new K},4195:function(e,t){t.Z="#define GLSLIFY 1\n// resolution (DataTextureのサイズ), positionVelocityTexture, colorTextureはthree.jsによって自動的に定義済み\n\nvec3 hsv2rgb(vec3 c) {\n  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\nvec3 rgb2hsv(vec3 c){\n  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n\n  float d = q.x - min(q.w, q.y);\n  float e = 1.0e-10;\n  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);\n}\n\nuniform sampler2D imgColorsData;\n\nvoid main(void) {\n  vec2 uv = gl_FragCoord.xy / resolution;\n\n  vec2 velocity = texture2D(positionVelocityTexture, uv).zw;\n\n  vec4 colorFrom = texture2D(colorTexture, uv);\n  vec4 colorTo = texture2D(imgColorsData, uv);\n  vec4 color = colorFrom + (colorTo - colorFrom) * 0.8;\n\n  vec3 hsv = rgb2hsv(color.rbg);\n  float velocityValue = min(1.0, length(velocity) / 20.0);\n  hsv.r += velocityValue;\n  hsv.g -= velocityValue * 4.0;\n  color.rgb = hsv2rgb(hsv);\n\n  gl_FragColor = color;\n}\n"},3328:function(e,t){t.Z="#define GLSLIFY 1\n// resolution (DataTextureのサイズ), positionVelocityTextureはthree.jsによって自動的に定義済み\n\nuniform float dataCanvasSize;\nuniform vec2 pointerPos;\nuniform float pointerForceRadius;\nuniform float isPointerActive;\nuniform float transitionValue;\nuniform sampler2D imgPositionsData;\n\nconst float FRICTION = 0.8;\nconst float POINTER_FORCE_FACTOR = 5.0;\nconst float SELF_FORCE_FACTOR = 0.1;\nconst float TRANSITION_FORCE_FACTOR = 100.0;\n\nvoid main(void) {\n  vec2 uv = gl_FragCoord.xy / resolution;\n\n  vec4 positionVelocityData = texture2D(positionVelocityTexture, uv);\n\n  vec2 acceralation = vec2(0.0);\n  vec2 posFrom = positionVelocityData.xy;\n  vec2 velocity = positionVelocityData.zw;\n\n  vec2 posTo = texture2D(imgPositionsData, uv).xy;\n\n  // ポインターによる加速 (ポインターの位置から放射状に力が弱くなる)\n  vec2 pointerForceVector = posTo - pointerPos;\n  float pointerForcePower = max(0.0, pointerForceRadius - max(4.0, length(pointerForceVector))) / pointerForceRadius;\n  pointerForcePower = smoothstep(0.1, 0.9, pointerForcePower * pointerForcePower) * POINTER_FORCE_FACTOR;\n  acceralation += normalize(pointerForceVector) * pointerForcePower;\n\n  // 遷移時にかかる力 (ポインタの位置から爆発っぽくなる)\n  acceralation += normalize(pointerForceVector) * TRANSITION_FORCE_FACTOR * transitionValue;\n\n  // 元の位置に戻ろうとする力による加速\n  vec2 selfForce = (posTo - posFrom) * SELF_FORCE_FACTOR;\n  acceralation += selfForce;\n\n  // 速度に加速度をプラス\n  velocity += acceralation * isPointerActive;\n\n  // 抵抗\n  velocity *= FRICTION;\n\n  gl_FragColor = vec4(posFrom + velocity, velocity);\n}\n"},559:function(e,t){t.Z="precision highp float;\nprecision highp int;\n#define GLSLIFY 1\n\nuniform sampler2D pointTexture;\nuniform float alpha;\nuniform float typeIndex;\nuniform float numTypes;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  vec2 uvUnit = vec2(1.0 / numTypes, 1.0);\n  vec2 uv = gl_PointCoord.xy * uvUnit + vec2(uvUnit.x * typeIndex, 0.0);\n  uv.y = 1.0 - uv.y;\n  vec4 color = texture2D(pointTexture, uv);\n  color *= (vColor / 255.0);\n  if(color.a == 0.0) discard;\n  gl_FragColor = color;\n}\n"},3899:function(e,t){t.Z="precision highp float;\nprecision highp int;\n#define GLSLIFY 1\n\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 projectionMatrix;\n\nuniform float time;\nuniform sampler2D positionVelocityTexture;\nuniform sampler2D colorTexture;\n\nuniform float dataTextureSize;\nuniform float dataCanvasSize;\nuniform float drawScale;\nuniform float pointSize;\n\nattribute vec3 position;\nattribute float vertexIndex;\nattribute vec4 randomValue;\n\nvarying vec4 vColor;\n\nvoid main(void){\n  vec4 modelPos = modelMatrix * vec4(vec3(0.0), 1.0);\n\n  float colIndex = mod(vertexIndex, dataTextureSize);\n  float rowIndex = floor(vertexIndex / dataTextureSize);\n  vec2 dataTextureUV = (vec2(colIndex, rowIndex) + vec2(0.5)) / dataTextureSize;\n\n  vec4 positionVelocityData = texture2D(positionVelocityTexture, dataTextureUV);\n\n  vec2 pos = positionVelocityData.xy * drawScale;\n  modelPos.xy += pos;\n\n  vColor = texture2D(colorTexture, dataTextureUV);\n  vColor.a -= randomValue.y * 255.0 * 0.5;\n\n  gl_Position = projectionMatrix * viewMatrix * modelPos;\n  gl_PointSize = pointSize * (1.0 + 0.4 * randomValue.x + min(1.0, length(positionVelocityData.zw) / 10.0));\n}\n"}},t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={exports:{}};return e[i](r,r.exports,n),r.exports}n.m=e,n.x=function(){},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,{a:t}),t},n.d=function(e,t){for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){var e={3:0},t=[[5358,956]],i=function(){},r=function(r,o){for(var a,s,u=o[0],l=o[1],c=o[2],h=o[3],p=0,f=[];p<u.length;p++)s=u[p],n.o(e,s)&&e[s]&&f.push(e[s][0]),e[s]=0;for(a in l)n.o(l,a)&&(n.m[a]=l[a]);for(c&&c(n),r&&r(o);f.length;)f.shift()();return h&&t.push.apply(t,h),i()},o=self.webpackChunk=self.webpackChunk||[];function a(){for(var i,r=0;r<t.length;r++){for(var o=t[r],a=!0,s=1;s<o.length;s++){var u=o[s];0!==e[u]&&(a=!1)}a&&(t.splice(r--,1),i=n(n.s=o[0]))}return 0===t.length&&(n.x(),n.x=function(){}),i}o.forEach(r.bind(null,0)),o.push=r.bind(null,o.push.bind(o));var s=n.x;n.x=function(){return n.x=s||function(){},(i=a)()}}(),n.x()}();