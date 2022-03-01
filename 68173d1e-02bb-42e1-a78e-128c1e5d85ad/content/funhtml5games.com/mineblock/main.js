function noise(t,e,i){var n=255&Math.floor(t),o=255&Math.floor(e),r=255&Math.floor(i)
t-=Math.floor(t),e-=Math.floor(e),i-=Math.floor(i)
var a=fade(t),s=fade(e),l=fade(i),h=p[n]+o,c=p[h]+r,d=p[h+1]+r,u=p[n+1]+o,y=p[u]+r,f=p[u+1]+r
return lerp(l,lerp(s,lerp(a,grad(p[c],t,e,i),grad(p[y],t-1,e,i)),lerp(a,grad(p[d],t,e-1,i),grad(p[f],t-1,e-1,i))),lerp(s,lerp(a,grad(p[c+1],t,e,i-1),grad(p[y+1],t-1,e,i-1)),lerp(a,grad(p[d+1],t,e-1,i-1),grad(p[f+1],t-1,e-1,i-1))))}function lerp(t,e,i){return e+t*(i-e)}function grad(t,e,i,n){var o=15&t,r=8>o?e:i,a=4>o?i:12==o||14==o?e:n
return(0==(1&o)?r:-r)+(0==(2&o)?a:-a)}function fade(t){return t*t*t*(t*(6*t-15)+10)}function pinkNoise(t,e,i,n,o,r){r||(r=.5)
for(var a=0,s=1,l=n;l>=o;l/=2)a+=noise(t/l,e/l,i/l)*s,s*=r
return a}function generateBlock(t,e,i,n){var o
if(i<.75+2*noise(23.2*e,938.2*i,28.1*n))o="bedrock"
else{var r=pinkNoise(e,i,n+t,32,2)+(2*i/SY-NY)/NY
o=-.2>r?"rock":-.1>r?"dirt":0>r?GRASSY?"dirt":"grass":HY/4>i?"apricot jelly":HY/2>i?"water":"air",Math.pow(noise(e/20+t,i/20,n/20+1e3),3)<-.2&&(o="candy"),Math.pow(noise(e/20,i/20+t,n/20),3)<-.1&&(o="air")}return o}function generateChunk(t,e,i){function n(t,e,i){return s[t+(e<<LOGNX)+(i<<LOGNX+LOGNY)]}function o(t,e){for(var i=NY-1;i>=0;--i){var o=n(t,i,e)
if("air"!==o.type)return{iy:i,b:o}}}function r(t,e,i){for(i=i||0;t--;){var r=i+irand(NX-2*i),a=i+irand(NZ-2*i),s=o(r,a)
s&&s.iy<NY-1&&BLOCK_TYPES[s.b.type].plantable&&(s=n(r,s.iy+1,a),s.type=e)}}for(var a={key:e+","+i,chunkx:e,chunkz:i,blocks:Array(NX*NY*NZ),entities:{}},s=a.blocks,l=0,h=0;NZ>h;++h)for(var c=0;NY>c;++c)for(var d=0;NX>d;++d)s[l++]={light:[0,0,0,0],dirtyLight:!1,dirtyGeometry:!1,type:generateBlock(t,d+e,c*SY,h+i)}
for(var u=BLOCK_TYPES.soybeans.upon,p=0;NX>p;++p)for(var y=p+e,f=0;NZ>f;++f){var g=f+i
if(2*noise(y/10,9938,g/10)+noise(y/1,9938,g/1)<-.5){var m=o(p,f)
m&&m.iy<NY-1&&BLOCK_TYPES[m.b.type][u]&&(n(p,m.iy+1,f).type="soybeans")}}r(4,"flower"),r(6,"weeds")
for(var d=0;NX>d;++d)for(var h=0;NZ>h;++h)for(var A=!1,v=NY-1;v>=0;--v){var E=n(d,v,h),k=BLOCK_TYPES[E.type]
E.light[3]=k.opaque?0:A?0:LIGHT_SUN,E.dirtyLight=!1,k.luminosity&&(E.dirtyLight=!0),A&&!k.opaque&&(E.dirtyLight=!0),A=A||k.opaque||k.translucent}return a}function irand(t){return Math.floor(Math.random()*t)}function scale(t,e){for(var i=0;i<t.length;++i)"number"==typeof t[i]?t[i]*=e:scale(t[i],e)
return t}function hopEntity(t,e){e=e||1,t.dx=2*tweak()*e,t.dz=2*tweak()*e,t.dy=6*e,t.falling=!0}function initGL(t,e){var i=""
try{gl=t.getContext("experimental-webgl",e)||t.getContext("webgl",e),gl&&(gl.viewportWidth=t.width,gl.viewportHeight=t.height)}catch(n){i=n,console.log(i)}return gl?(gl.mainShader=new Shader("main"),gl.particles=new ParticleSystem,gl.textures={terrain:loadTexture("terrain.png")},gl.wireframe=new Wireframe,gl):void 0}function $(t){return document.getElementById(t)}function getShader(t,e){var i=$(e)
if(!i)return null
for(var n="",o=i.firstChild;o;)3==o.nodeType&&(n+=o.textContent),o=o.nextSibling
var r
if("fragment"==i.type)r=t.createShader(t.FRAGMENT_SHADER)
else{if("vertex"!=i.type)return null
r=t.createShader(t.VERTEX_SHADER)}return t.shaderSource(r,n),t.compileShader(r),t.getShaderParameter(r,t.COMPILE_STATUS)?r:(alert(t.getShaderInfoLog(r)),null)}function Shader(t,e){var i=getShader(gl,t+"-vs"),n=getShader(gl,(e||t)+"-fs")
this.program=gl.createProgram(),gl.attachShader(this.program,i),gl.attachShader(this.program,n),gl.linkProgram(this.program),gl.getProgramParameter(this.program,gl.LINK_STATUS)||alert("Could not initialize shaders: "+gl.getProgramInfoLog(this.program)),this.attributes={}
for(var o=gl.getProgramParameter(this.program,gl.ACTIVE_ATTRIBUTES),r=0;o>r;++r){var a=gl.getActiveAttrib(this.program,r)
this.attributes[a.name]=gl.getAttribLocation(this.program,a.name)}this.uniforms={}
for(var s=gl.getProgramParameter(this.program,gl.ACTIVE_UNIFORMS),r=0;s>r;++r){var l=gl.getActiveUniform(this.program,r)
this.uniforms[l.name]=gl.getUniformLocation(this.program,l.name)}}function mvPushMatrix(){mvMatrixStack.push(mat4.clone(mvMatrix))}function mvPopMatrix(){if(0==mvMatrixStack.length)throw"Invalid popMatrix!"
mvMatrix=mvMatrixStack.pop()}function Chunk(t){var e=t.chunkx,i=t.chunkz
e&=~(NX-1),i&=~(NZ-1),this.chunkx=e,this.chunkz=i,this.blocks=Array(NX*NY*NZ),this.entities={},this.lastUpdate=0,this.nDirty=0,this.opaqueBuffers=new BufferSet,this.translucentBuffers=new BufferSet,GAME.chunks[this.chunkx+","+this.chunkz]=this
var n=t.blocks
n||(n=generateChunk(GAME.seed,this.chunkx,this.chunkz).blocks)
for(var o=0;NX*NY*NZ>o;++o){var r=coords(o)
r=coords(this.chunkx+r.x,r.y,this.chunkz+r.z),r.data=n[o],this.blocks[o]=new Block(r,this),(this.blocks[o].dirtyLight||this.blocks[o].dirtyGeometry)&&this.nDirty++}if(t.blocks&&!GAME.loading){for(var a=3,s=0;2>s;++s){var l=a+irand(NX-2*a),h=a+irand(NZ-2*a),c=topmost(this.chunkx+l,this.chunkz+h)
c&&c.type.plantable&&buildTree(c.neighbor(FACE_TOP))}invalidateEdgesNeighboringChunk(this)}for(var o in t.entities||{})new Entity(t.entities[o])}function pointToAttribute(t,e,i){gl.bindBuffer(gl.ARRAY_BUFFER,e[i]),gl.vertexAttribPointer(t.attributes[i],e[i].itemSize,gl.FLOAT,!1,0,0),gl.bindBuffer(gl.ARRAY_BUFFER,null)}function hDistance(t,e){return Math.sqrt((t.x-e.x)*(t.x-e.x)+(t.z-e.z)*(t.z-e.z))}function distance(t,e){return Math.sqrt((t.x-e.x)*(t.x-e.x)+(t.y-e.y)*(t.y-e.y)+(t.z-e.z)*(t.z-e.z))}function signedHDistanceFromLine(t,e,i){return(i.z-t.z)*Math.sin(e)-(i.x-t.x)*Math.cos(e)}function choice(t){return t||(t=2),Math.floor(Math.random()*t)}function coords(t,e,i){var n
"object"==typeof t?(n=void 0===t.x?{x:t[0],y:t[1],z:t[2]}:{x:t.x,y:t.y,z:t.z},n.z=Math.floor(n.z),n.y=Math.floor(n.y/SY)*SY,n.x=Math.floor(n.x)):n=void 0===e?{x:t%NX,y:(t>>LOGNX)%NY*SY,z:(t>>LOGNX+LOGNY)%NZ}:{x:Math.floor(t),y:Math.floor(e/SY)*SY,z:Math.floor(i)},n.chunkx=n.x&~(NX-1),n.chunkz=n.z&~(NZ-1)
var o=n.x-n.chunkx,r=n.z-n.chunkz
return n.i=o+(n.y/SY<<LOGNX)+(r<<LOGNX+LOGNY),(n.y<0||n.y>=HY)&&(n.outofbounds=!0),n}function chunk(t,e){return t&=~(NX-1),e&=~(NZ-1),GAME.chunks[t+","+e]}function makeChunk(t,e){t&=~(NX-1),e&=~(NZ-1)
var i
return chunk(t,e)||(GEN_STAT.start(),i=new Chunk({chunkx:t,chunkz:e}),invalidateEdgesNeighboringChunk(i),GEN_STAT.end()),i}function invalidateEdgesNeighboringChunk(t){var e=t.chunkx,i=t.chunkz
if(chunk(e-1,i))for(var n=0;NY>n;++n)for(var o=0;NZ>o;++o)block(e-1,n*SY,i+o).invalidateGeometry()
if(chunk(e+NX,i))for(var n=0;NY>n;++n)for(var o=0;NZ>o;++o)block(e+NX,n*SY,i+o).invalidateGeometry()
if(chunk(e,i-1))for(var n=0;NY>n;++n)for(var r=0;NX>r;++r)block(e+r,n*SY,i-1).invalidateGeometry()
if(chunk(e,i+NZ))for(var n=0;NY>n;++n)for(var r=0;NX>r;++r)block(e+r,n*SY,i+NZ).invalidateGeometry()}function block(t,e,i){var n=coords(t,e,i)
if(!n.outofbounds){var o=chunk(n.chunkx,n.chunkz)
if(o)return o.blocks[n.i]}return new Block(n)}function drawScene(t,e){RENDER_STAT.start(),t.y+t.eyeHeight>=0?gl.clearColor(.5,.8,.98,1):gl.clearColor(0,0,0,1),gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
var i=t.aspectRatio||gl.viewportWidth/gl.viewportHeight
mat4.perspective(pMatrix,t.horizontalFieldOfView/i,i,.1,t.viewDistance),mat4.identity(mvMatrix),mat4.rotateX(mvMatrix,mvMatrix,t.pitch),mat4.rotateY(mvMatrix,mvMatrix,t.yaw),mat4.identity(mvMatrix),mat4.rotateX(mvMatrix,mvMatrix,t.pitch),mat4.rotateY(mvMatrix,mvMatrix,t.yaw),mat4.identity(mvMatrix),mat4.rotateX(mvMatrix,mvMatrix,t.pitch),mat4.rotateY(mvMatrix,mvMatrix,t.yaw),mat4.translate(mvMatrix,mvMatrix,[-t.x,-t.y,-t.z]),mat4.translate(mvMatrix,mvMatrix,[0,-t.eyeHeight,0]),gl.mainShader.use(),gl.enable(gl.DEPTH_TEST),gl.activeTexture(gl.TEXTURE0),gl.bindTexture(gl.TEXTURE_2D,gl.textures.terrain),gl.uniform1i(gl.mainShader.uniforms.uSampler,0),gl.uniform1f(gl.mainShader.uniforms.uFogDistance,2*t.viewDistance/5)
var n=block(t.x,t.y+t.eyeHeight,t.z)
if(n.type.translucent){var o=n.type.translucent
$("hud").style.backgroundColor="rgba("+o.join(",")+")"}else $("hud").style.backgroundColor=""
$("pause").style.backgroundColor=$("hud").style.backgroundColor,gl.uniformMatrix4fv(gl.mainShader.uniforms.uPMatrix,!1,pMatrix),gl.uniformMatrix4fv(gl.mainShader.uniforms.uMVMatrix,!1,mvMatrix),gl.disable(gl.CULL_FACE)
for(var r in GAME.chunks){var a=GAME.chunks[r]
a.visible&&(a.opaqueBuffers.render(gl.mainShader),a.renderEntities(t))}gl.mainShader.disuse(),gl.particles.render(),gl.mainShader.use(),gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA),gl.enable(gl.BLEND),gl.enable(gl.CULL_FACE)
for(var r in GAME.chunks){var a=GAME.chunks[r]
a.visible&&a.translucentBuffers.render(gl.mainShader)}gl.disable(gl.BLEND),gl.disable(gl.CULL_FACE),gl.mainShader.disuse(),PICKED&&e&&gl.wireframe.render(),RENDER_STAT.end()}function frac(t){return t-Math.floor(t)}function carf(t){return Math.ceil(t)-t}function updateWorld(){UPDATE_STAT.start(),PICKED=pickp(),SPREAD_OUT&&loadNearbyChunks(AVATAR,SPREAD_OUT)
for(var t in GAME.chunks){var e=GAME.chunks[t]
e.hdistance=Math.max(0,hDistance(AVATAR,e.centerPoint())-CHUNK_RADIUS),e.visible=e.hdistance<AVATAR.viewDistance,e.update()}UPDATE_STAT.end()}function loadNearbyChunks(t,e,i){GAME.pendingChunks||(GAME.pendingChunks={})
var n=!i
i=i||1e3
for(var o=-e;e>=o;o+=Math.min(NX,2*e))for(var r=-e;e>=r;r+=Math.min(NZ,2*e)){var a=t.x+o&~(NX-1),s=t.z+r&~(NZ-1)
if(!chunk(a,s))if(n){var l=a+","+s
GAME.pendingChunks[l]||(GAME.pendingChunks[l]=!0,GAME.mapgenWorker||(GAME.mapgenWorker=new Worker("mapgen.js"),GAME.mapgenWorker.onmessage=function(t){chunk(t.data.chunkx,t.data.chunkz)||(new Chunk(t.data),GAME.pendingChunks[t.data.chunkx+","+t.data.chunkz]=!1)}),GAME.mapgenWorker.postMessage({seed:GAME.seed,chunkx:a,chunkz:s}))}else if(makeChunk(a,s),--i<=0)return!0}}function processInput(t,e){KEYS.O&&(GAME.timeOfDay=(GAME.timeOfDay+e)%(2*Math.PI)),t.ddx=t.ddz=0,(KEYS.W||KEYS["&"])&&(t.ddz-=t.type.acceleration),(KEYS.A||KEYS["%"])&&(t.ddx-=t.type.acceleration),(KEYS.S||KEYS["("])&&(t.ddz+=t.type.acceleration),(KEYS.D||KEYS["'"])&&(t.ddx+=t.type.acceleration),t.ddy=0,(t.flying||t.swimming)&&(KEYS[" "]?t.ddy+=t.type.acceleration:KEYS[16]&&(t.ddy-=t.type.acceleration))}function togglePointerLock(){canvas_container.requestPointerLock&&(window.pointerLocked?document.exitPointerLock():canvas_container.requestPointerLock())}function ballistics(t,e){function i(e,i,n){for(var o=SY*Math.floor((i+c)/SY);o<i+t.height;o+=SY)if(block(e,o,n).type.solid)return!0
return c&&block(e,i,n).type.solid&&block(e,i+t.height+c,n).type.solid?!0:!1}var n={x:t.x,y:t.y,z:t.z}
if(t.swimming=t.falling&&block(t).type.liquid,t.ddx||t.ddz){var o=t.type.acceleration*e,r=Math.cos(t.yaw),a=Math.sin(t.yaw)
t.dx+=e*(t.ddx*r-t.ddz*a),t.dz+=e*(t.ddx*a+t.ddz*r)}else if(!t.falling){var o=(t.type.acceleration||DRAG)*e
t.dx>0&&(t.dx=Math.max(0,t.dx-o)),t.dx<0&&(t.dx=Math.min(0,t.dx+o)),t.dz>0&&(t.dz=Math.max(0,t.dz-o)),t.dz<0&&(t.dz=Math.min(0,t.dz+o))}t.ddy?t.dy+=e*t.ddy:(t.flying||t.swimming)&&(t.dy=t.dy>0?Math.max(0,t.dy-e*(t.type.acceleration||DRAG)):Math.min(0,t.dy+e*(t.type.acceleration||DRAG)))
var s=sqr(t.dx)+sqr(t.dz);(t.flying||t.swimming)&&(s+=sqr(t.dy)),s=Math.sqrt(s)
var l=t.flying?t.type.fly_max:t.type.walk_max
if(void 0!==l){l*=1-(block(t).type.viscosity||0)
var h=s/l
h>1&&(t.dx/=h,t.dz/=h,(t.flying||t.swimming)&&(t.dy/=h))}if(t.dyaw&&(t.yaw+=e*t.dyaw),t.dpitch&&(t.pitch+=e*t.dpitch),t.dx||t.dz){t.x+=t.dx*e,t.z+=t.dz*e
var c=t.swimming||!t.falling&&!t.flying?.5:0,d=t.type.radius||t.type.scale/2
t.dx<0&&i(t.x-d,t.y,t.z)?(t.x=Math.max(t.x,Math.floor(t.x)+d),t.dx=(t.rebound||0)*-t.dx):t.dx>0&&i(t.x+d,t.y,t.z)&&(t.x=Math.min(t.x,Math.ceil(t.x)-d),t.dx=(t.rebound||0)*-t.dx),t.dz<0&&i(t.x,t.y,t.z-d)?(t.z=Math.max(t.z,Math.floor(t.z)+d),t.dz=(t.rebound||0)*-t.dz):t.dz>0&&i(t.x,t.y,t.z+d)&&(t.z=Math.min(t.z,Math.ceil(t.z)-d),t.dz=(t.rebound||0)*-t.dz)
var u=t.dx<0&&frac(t.x)<d,p=t.dx>0&&carf(t.x)>d,y=t.dz<0&&frac(t.z)<d,f=t.dz>0&&carf(t.z)>d
u&&y&&i(t.x-d,t.y,t.z-d)?frac(t.x)>frac(t.z)?t.x=Math.max(t.x,Math.floor(t.x)+d):t.z=Math.max(t.z,Math.floor(t.z)+d):u&&f&&i(t.x-d,t.y,t.z+d)?frac(t.x)>carf(t.z)?t.x=Math.max(t.x,Math.floor(t.x)+d):t.z=Math.min(t.z,Math.ceil(t.z)-d):p&&f&&i(t.x+d,t.y,t.z+d)?carf(t.x)>carf(t.z)?t.x=Math.min(t.x,Math.ceil(t.x)-d):t.z=Math.min(t.z,Math.ceil(t.z)-d):p&&y&&i(t.x+d,t.y,t.z-d)&&(carf(t.x)>frac(t.z)?t.x=Math.min(t.x,Math.ceil(t.x)-d):t.z=Math.max(t.z,Math.floor(t.z)+d))}!t.falling||t.swimming&&t.ddy||(t.dy-=GRAVITY*e),t.y+=t.dy*e
var g=block(t)
g.type.solid&&(t.flying||t.falling?(t.rebound&&t.falling&&t.dy<0?(t.dy=t.rebound*-t.dy-3,t.dx/=2,t.dz/=2,t.dy<0&&(t.falling=!1,t.dy=0)):(t.flying=t.falling=!1,t.dy=0),t.y=SY*Math.floor(t.y/SY+1)):t.y=Math.min(SY*Math.floor(t.y/SY+1),t.y+5*e)),t.falling||t.flying||block(t.x,t.y-SY,t.z).type.solid||(t.falling=!0,t.y=SY*Math.floor(t.y/SY)-.001,t.dy=0),(t.flying||t.falling)&&t.dy>0&&block(t.x,t.y+t.height,t.z).type.solid&&(t.y=Math.min(t.y,SY*Math.floor((t.y+t.height)/SY)-t.height),t.dy=0),t.travelled+=distance(t,n),g.type.onstep&&g.type.onstep.call(g,t),t.y<-555&&t.die()}function pickp(){return pick(AVATAR.x,AVATAR.y+AVATAR.eyeHeight,AVATAR.z,AVATAR.pitch,AVATAR.yaw)}function pick(t,e,i,n,o){function r(t,e){return e*(0>e?Math.ceil(t-1)-t:Math.floor(t+1)-t)}function a(t){return SY*Math.ceil(t/SY-1)}function s(t){return SY*Math.floor(t/SY+1)}for(var l=-1/Math.sin(n),h=1/Math.cos(n),c=h/Math.sin(o),d=-h/Math.cos(o),u=0,p=0;3e3>p&&!(0>l?0>e:e>=HY)&&!(u>PICK_MAX);++p){var y=block(t,e,i)
if(y&&!y.type.empty&&!y.type.unpickable)return y
var f=r(t,c),g=l*(0>l?a(e)-e:s(e)-e),m=r(i,d),A=1.001
f>m&&g>m?(A*=m,PICKED_FACE=d>0?0:1):f>g?(A*=g,PICKED_FACE=l>0?2:3):(A*=f,PICKED_FACE=c>0?4:5),u+=A,t+=A/c,e+=A/l,i+=A/d}return null}function tick(){requestAnimationFrame(tick)
var t=wallClock(),e=t-window.lastFrame
if(FPS_STAT.add(e),window.lastFrame=t,!GAME||GAME.loading);else if("pause"!==window.mode){e>.1&&(e=.05),GAME.clock+=e,gl.textures.terrain.loaded&&(gl.viewport(0,0,gl.viewportWidth,gl.viewportHeight),drawScene(AVATAR,!$("hud").hide)),processInput(AVATAR,e)
for(var i in GAME.chunks){var n=GAME.chunks[i]
n.tick(e)}gl.particles.tick(e),t>GAME.lastUpdate+GAME.UPDATE_PERIOD&&(updateWorld(),GAME.lastUpdate=t)}}function loadTexture(t){var i=gl.TEXTURE_2D,n=gl.createTexture()
return n.image=new Image,n.image.onload=function(){if(gl.bindTexture(i,n),gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,!e),gl.texParameteri(i,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE),gl.texParameteri(i,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE),gl.texParameteri(i,gl.TEXTURE_MAG_FILTER,gl.NEAREST),gl.texParameteri(i,gl.TEXTURE_MIN_FILTER,gl.NEAREST),e){gl.texParameteri(i,gl.TEXTURE_MAG_FILTER,gl.LINEAR),gl.texParameteri(i,gl.TEXTURE_MIN_FILTER,gl.LINEAR)
for(var t=[gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,gl.TEXTURE_CUBE_MAP_NEGATIVE_X,gl.TEXTURE_CUBE_MAP_POSITIVE_Z,gl.TEXTURE_CUBE_MAP_POSITIVE_X,gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,gl.TEXTURE_CUBE_MAP_POSITIVE_Y],o=0;6>o;++o){var r=document.createElement("canvas")
r.width=n.image.height,r.height=n.image.height
var a=r.getContext("2d")
a.drawImage(n.image,o*r.width,0,r.width,r.height,0,0,r.width,r.height),gl.texImage2D(t[o],0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,r)}}else gl.texImage2D(i,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,n.image)
gl.bindTexture(i,null),n.loaded=!0},n.image.src=t,n}function topmost(t,e){for(var i=NY-1;i>=0;--i){var n=block(t,i*SY,e)
if(n.type.solid||n.type.liquid)return n}return null}function Block(t,e){this.x=t.x,this.y=t.y,this.z=t.z,this.i=t.i,this.outofbounds=t.outofbounds,this.chunk=e,this.light=[0,0,0,t.y>=HY?LIGHT_SUN:0],this.dirtyLight=!1,this.dirtyGeometry=!1,this.type=BLOCK_TYPES.air
for(var i in t.data)this[i]=t.data[i],"type"==i&&(this.type=BLOCK_TYPES[this.type])}function changeArray(t,e){for(var i=!1,n=0;n<t.length;++n)t[n]!==e[n]&&(i=!0,t[n]=e[n])
return i}function tileCoord(t,e){var i=t.tile||t.type.tile||t.sourcetype.tile
"number"==typeof i&&(i=[i,0])
var n=0
return 4!==i.length||e!==FACE_TOP&&e!==FACE_BOTTOM?12===i.length&&void 0!==e&&(n=2*e):n=2,{s:i[n],t:i[n+1]}}function blockGeometryHash(t){for(var e=t.vertices={aPos:[],aLighting:[],aColor:[],aTexCoord:[],indices:[]},i=(1-(t.type.scale||1))/2,n=1-i,o=t.type.scale||1,r=t.type.hashes||1,a=0;r>a;++a){var s=(.5+a)/r,l=e.aPos.length/3
e.aPos.push(t.x+i,t.y,t.z+s,t.x+n,t.y,t.z+s,t.x+n,t.y+o,t.z+s,t.x+i,t.y+o,t.z+s,t.x+s,t.y,t.z+i,t.x+s,t.y,t.z+n,t.x+s,t.y+o,t.z+n,t.x+s,t.y+o,t.z+i),e.indices.push(l+0,l+1,l+2,l+0,l+2,l+3,l+4,l+5,l+6,l+4,l+6,l+7)
var h=tileCoord(t),c=1,d=c-1
c%1===0&&(c-=ZERO),d%1===0&&(d+=ZERO)
for(var u=0;2>u;++u)e.aTexCoord.push(h.s+ZERO,h.t+c,h.s+ONE,h.t+c,h.s+ONE,h.t+d,h.s+ZERO,h.t+d)}for(var a=0;a<e.aPos.length/3;++a)e.aLighting.push.apply(e.aLighting,t.light||block(t).light),e.aColor.push.apply(e.aColor,t.type.color||[1,1,1])
return e}function vclamp(t){for(var e=0;e<t.length;++e)t[e]=Math.min(1,Math.max(0,t[e]))
return t}function tweaker(t){return[.25*pinkNoise(t[0],t[1],t[2]+1593.1,4,1),.25*pinkNoise(t[0],t[1],t[2]+2483.7,4,1),.25*pinkNoise(t[0],t[1],t[2]+9384.3,4,1)]}function faces(t){return[[t[0],t[1],t[5],t[4]],[t[2],t[3],t[7],t[6]],[t[3],t[2],t[1],t[0]],[t[4],t[5],t[6],t[7]],[t[3],t[0],t[4],t[7]],[t[1],t[2],t[6],t[5]]]}function blockGeometryBlock(t){for(var e=t.vertices={aPos:[],aLighting:[],aColor:[],aTexCoord:[],indices:[]},i=0;6>i;++i){var n=t.neighbor(i),o=n.type.opaque
if(o=o||t.type.translucent&&t.type===n.type,!o){for(var r=e.aPos.length/3,a=_FACES[i],s=3;s>=0;--s){var l=[t.x+a[s][0],t.y+a[s][1]*SY,t.z+a[s][2]]
e.aPos=e.aPos.concat(l),i===FACE_LEFT||i===FACE_RIGHT?e.aLighting.push(n.light[0]*DARKFACE,n.light[1]*DARKFACE,n.light[2]*DARKFACE,n.light[3]*DARKFACE):e.aLighting=e.aLighting.concat(n.light)
var h=t.type.color||[1,1,1]
e.aColor=e.aColor.concat(vclamp(vec3.add([0,0,0],h,tweaker(l))))}var c,d,u=tileCoord(t,i)
i===FACE_TOP||i===FACE_BOTTOM?(c=0,d=1):t.type.stack&&"y"===AXIS[t.facing]?(c=t.type.stack-t.position-SY,d=c+SY):SY%1===0?(c=0,d=c+SY):(c=SY-frac(t.y),d=c+SY),c%1===0&&(c+=ZERO),d%1===0&&(d-=ZERO),e.aTexCoord.push(u.s+ONE,u.t+c,u.s+ZERO,u.t+c,u.s+ZERO,u.t+d,u.s+ONE,u.t+d),e.indices.push(r,r+1,r+2,r,r+2,r+3)}}}function buildTree(t){function e(t){for(var e=0;6>e;++e)if(e!=FACE_BOTTOM&&e!=FACE_TOP)for(var i=t.neighbor(e),n=0;3>n;++n,i=i.neighbor(e))i.placeBlock(BLOCK_TYPES.frond,n,e)}for(var i,n=.6,o=.2,r=7*Math.random()+3,a=0;r>a&&!t.outofbounds;++a)t.placeBlock(BLOCK_TYPES.log),i?(t.bottomSize=i.topSize,t.bottomOffset=i.topOffset):(t.bottomSize=n,t.bottomOffset=[Math.random()*(1-t.bottomSize),Math.random()*(1-t.bottomSize)]),t.topSize=n+(o-n)*(a+1)/r,t.topOffset=[Math.random()*(1-t.topSize),Math.random()*(1-t.topSize)],t.radius0=t.bottomSize/2,t.radius1=t.topSize/2,i=t,t=t.neighbor(FACE_TOP)
i&&e(i)}function blockGeometryFrond(t){var e=t.vertices={aPos:[],aLighting:[],aColor:[],aTexCoord:[],indices:[]},i=t.neighbor(t.facing).type!==t.type,n=t.position-.5,o=t.facing===FACE_LEFT||t.facing===FACE_RIGHT,r=t.facing===FACE_RIGHT||t.facing===FACE_FRONT,a=o?2:0,s=o?0:2,l=tileCoord(t),h=[[9,0,8],[16,3,7],[16,2,0],[7,0,0],[0,3,1],[0,3,15],[7,0,16],[16,2,16],[16,3,9]],c=[[7,0,0],[0,3,1],[0,2,3],[2,1,11],[7,1,16],[9,1,16],[14,1,11],[16,2,3],[16,2,0]]
i&&(h=c)
for(var d=0;d<h.length;++d){var u=h[d][a]/16,p=h[d][s]/16
r&&(u=1-u,p=1-p)
var y=(h[d][1]+2*sqr(n+h[d][2]/16))/16
e.aPos.push(t.x+u,t.y+1-y,t.z+p),e.aTexCoord.push(l.s+.01+.98*h[d][0]/16,l.t+.01+.98*h[d][2]/16),e.aLighting=e.aLighting.concat(t.light),e.aColor=e.aColor.concat(t.color||t.type.color||[1,1,1])}for(var d=1;d<h.length-1;++d)e.indices.push(0,d,d+1)}function blockGeometryLog(t){function e(t,e,i,n){return[[t-n,e,i-n],[t+n,e,i-n],[t+n,e,i+n],[t-n,e,i+n]]}t.vertices={aPos:[],aLighting:[],aColor:[],aTexCoord:[],indices:[]}
var i=15,n=noise(t.x,234.567+t.y/i,t.z)%(.5-t.radius0)+.5,o=noise(t.x,234.567+(t.y+1)/i,t.z)%(.5-t.radius1)+.5,r=noise(t.x,123.456+t.y/i,t.z)%(.5-t.radius0)+.5,a=noise(t.x,123.456+(t.y+1)/i,t.z)%(.5-t.radius1)+.5,s=faces(e(n,0,r,t.radius0).concat(e(o,1,a,t.radius1)))
geometryBox(t.vertices,{light:t.light,color:[1,1,1],yaw:0,pitch:0,x:t.x,y:t.y,z:t.z,tile:t.type,faces:s})}function entityGeometryHash(t,e){blockGeometryHash(t)
for(var i=0;i<t.vertices.aPos.length;i+=3)t.vertices.aPos[i]-=.5,t.vertices.aPos[i+2]-=.5
appendGeometry(e,t.vertices)}function appendGeometry(t,e,i){if(t.aLighting.append(e.aLighting),!i){var n=t.aPos.length/3
t.aPos.append(e.aPos),t.aColor.append(e.aColor),t.aTexCoord.append(e.aTexCoord)
for(var o=0;o<e.indices.length;++o)t.indices.push(n+e.indices[o])}}function blockGeometryBillboard(t){t.vertices={aPos:[],aLighting:[],aColor:[],aTexCoord:[],indices:[]},entityGeometryBillboard({x:t.x,y:t.y,z:t.z,type:t.type},t.vertices)}function entityGeometryBillboard(t,e){var i=e.aPos.length/3
e.aColor.push(1,1,1,1,1,1,1,1,1,1,1,1),e.indices.push(i+0,i+1,i+2,i+0,i+2,i+3)
var n=block(t).light,o=[AVATAR.x-t.x,AVATAR.y+AVATAR.eyeHeight-t.y,AVATAR.z-t.z]
vec3.normalize(o,o)
var r=[o[2],0,-o[0]]
vec3.normalize(r,r)
var a=vec3.cross(vec3.create(),o,r)
vec3.normalize(a,a)
for(var s=t.type.scale||.25,l=[-s,-s,s,-s,s,s,-s,s],h=t.type.bob?t.type.bob*(1+Math.sin(2*t.age()))/2:0,c=[t.x,t.y+s+h,t.z],d=0;d<l.length;d+=2){for(var u=l[d],p=l[d+1],y=0;3>y;++y)e.aPos.push(u*r[y]+p*a[y]+c[y])
e.aLighting.append(n)}var f=tileCoord(t)
e.aTexCoord.push(f.s+ZERO,f.t+ONE,f.s+ONE,f.t+ONE,f.s+ONE,f.t+ZERO,f.s+ZERO,f.t+ZERO)}function ppiped(t,e,i,n,o,r){return[[t,i,o],[e,i,o],[e,i,r],[t,i,r],[t,n,o],[e,n,o],[e,n,r],[t,n,r]]}function geometryBox(t,e){for(var i=0;6>i;++i){for(var n=t.aPos.length/3,o=e.faces[i],r=0;4>r;++r){var a=o[r],s=Math.cos(e.yaw),l=Math.sin(e.yaw),h=a[0]*s-a[2]*l,c=a[1],d=a[0]*l+a[2]*s
t.aPos.push(e.x+h,e.y+c,e.z+d),t.aLighting=t.aLighting.concat(e.light),t.aColor=t.aColor.concat(e.color)}var u=tileCoord(e.tile,i),p=0,y=e.texheight||1
p%1===0&&(p+=ZERO),y%1===0&&(y-=ZERO),t.aTexCoord.push(u.s+ONE,u.t+y,u.s+ZERO,u.t+y,u.s+ZERO,u.t+p,u.s+ONE,u.t+p),t.indices.push(n,n+1,n+2,n,n+2,n+3)}return t}function entityGeometryBlock(t,e){var i=t.type.stack||t.sourcetype.stack||SY
t.sourcetype.faces||(t.sourcetype.faces=faces(ppiped(-t.type.radius,t.type.radius,0,i*t.type.radius*2,-t.type.radius,t.type.radius))),geometryBox(e,{light:block(t).light,color:t.type.color||t.sourcetype.color||[1,1,1],texheight:i,faces:t.sourcetype.faces,yaw:t.yaw,x:t.x,y:t.y+1/8*(1+Math.sin(2*t.age()))/2,z:t.z,tile:t})}function Wireframe(){this.shader=new Shader("wireframe")
for(var t=[0,0,0,1,0,0,1,0,1,0,0,1,0,1,0,1,1,0,1,1,1,0,1,1],e=[4,5,5,6,6,7,7,4,0,1,1,2,2,3,3,0,0,4,1,5,2,6,3,7],i=1;i<t.length;i+=3)t[i]*=SY
this.aPos=makeBuffer(t,3),this.indices=makeBuffer(e,1,!1,!0)}function Entity(t,e){function i(i,o){n[i]=void 0!==t[i]?t[i]:void 0!==e[i]?e[i]:"function"==typeof o?o():o}var n=this
t=t||{},e=e||{},i("x",0),i("y",HY),i("z",0),i("dx",0),i("dy",0),i("dz",0),i("ddx",0),i("ddy",0),i("ddz",0),i("yaw",0),i("pitch",0),i("dyaw",0),i("dpitch",0),i("travelled",0),i("birthday",GAME.clock),i("id",function(){return GAME.nextEntityID++}),i("type"),i("sourcetype",{}),"string"==typeof this.type&&(this.type=ENTITY_TYPES[this.type]),"string"==typeof this.sourcetype&&(this.sourcetype=BLOCK_TYPES[this.sourcetype]),this.height=this.type.height||this.type.scale,this.flying=this.falling=!1,this.chunk=chunk(0,0),this.chunk.entities[this.id]=this,this.type.init&&this.type.init.apply(this)}function initCamera(t){function e(e,i){void 0===t[e]&&(t[e]=i)}e("horizontalFieldOfView",Math.PI/3),e("viewDistance",20),e("pitch",0),e("yaw",0),e("eyeHeight",0)}function resize_screen(){window.innerWidth<100||(scalefactor=window.innerHeight/480,854*scalefactor>window.innerWidth&&(scalefactor=window.innerWidth/854),document.getElementById("canvas_container").style.transform="scale("+scalefactor+", "+scalefactor+")")}function embed_toggle(){$("embed_code").style.display="block";$("instructions").style.display="none";hidefooter();}function help_toggle(){$("instructions").style.display="block";$("embed_code").style.display="none";hidefooter();}function hidefooter(){$("footer").style.display="none";clearTimeout(footertimer);footertimer=setTimeout(showfooter,60000);}var footertimer=false;function showfooter(){$("instructions").style.display="none";$("embed_code").style.display="none";$("footer").style.display="block";}function onLoad(){var t=$("canvas_container"),e=$("canvas"),i={}
return setTimeout(resize_screen,500),window.onresize=resize_screen,mobile?($("instructions").innerHTML='<table style="width:100%;"><tr><td style="width:33%;"><img src="pickaxe.png"><br>MINE<br>(OR LONGPRESS SCREEN)</td><td style="width:33%;"><img src="placeblock.png"><br>PLACE BLOCK<br>(OR TAP SCREEN)</td><td style="width:33%;"><img src="jump.png"><br>JUMP<br>(DOUBLE TAP TO FLY)</td></tr><tr><td colspan="3">USE DPAD TO MOVE - SWIPE SCREEN TO LOOK AROUND</td></tr></table>',$("embedgame").style.display="none",$("dpadcont").innerHTML='<div ontouchstart="showAndHideUI(true);" class="dpad" style="top:24px;right:4px;">&#128281;</div><div ontouchstart="onkeytouch(\' \',1);" ontouchend="onkeytouch(\' \',0);" class="dpad" style="bottom:24px;right:4px;"><img src="jump.png"></div><div ontouchstart="onkeytouch(\'C\',1);" ontouchend="onkeytouch(\'C\',0);" class="dpad" style="bottom:252px;right:4px;">&#127796;</div><div ontouchstart="digplace({button:0});" ontouchend="" class="dpad" style="bottom:176px;right:4px;"><img src="pickaxe.png"></div><div ontouchstart="digplace({button:1});" ontouchend="" class="dpad" style="bottom:100px;right:4px;"><img src="placeblock.png"></div><div ontouchstart="KEYS.W=1;event.preventDefault();" ontouchend="KEYS.W=0;event.preventDefault();" class="dpad" style="bottom:176px;left:80px;"><img src="arrow-up.png" style="width:48px;"></div><div ontouchstart="KEYS.S=1;event.preventDefault();" ontouchend="KEYS.S=0;event.preventDefault();" class="dpad" style="bottom:34px;left:80px;"><img src="arrow-down.png" style="width:48px;"></div><div ontouchstart="KEYS.A=1;event.preventDefault();" ontouchend="KEYS.A=0;event.preventDefault();" class="dpad" style="bottom:104px;left:12px;"><img src="arrow-left.png" style="width:48px;"></div><div ontouchstart="KEYS.D=1;event.preventDefault();" ontouchend="KEYS.D=0;event.preventDefault();" class="dpad" style="bottom:104px;left:148px;"><img src="arrow-right.png" style="width:48px;"></div>',$("crosshair").style.fontSize="35px"):$("throbber").innerHTML="Now works on mobile!",$("embedgame").onclick=embed_toggle,$("helpgame").onclick=help_toggle,initGL(e,i)?(t.requestFullscreen=t.requestFullscreen||t.mozRequestFullscreen||t.mozRequestFullScreen||t.webkitRequestFullscreen,t.requestPointerLock=t.requestPointerLock||t.mozRequestPointerLock||t.webkitRequestPointerLock,document.exitPointerLock=document.exitPointerLock||document.mozExitPointerLock||document.webkitExitPointerLock,window.pointerLockRequiresFullscreen=!!t.mozRequestPointerLock,window.addEventListener("keydown",onkeydown,!0),window.addEventListener("keyup",onkeyup,!0),window.addEventListener("mousemove",onmousemove,!0),window.addEventListener("mousedown",onmousedown,!0),$("canvas_container").addEventListener("touchmove",ontouchmove,!0),$("canvas_container").addEventListener("touchstart",ontouchdown,!0),$("canvas_container").addEventListener("touchend",ontouchend,!0),window.addEventListener("focus",onfocus,!0),document.oncontextmenu=function(){return event.preventDefault(),event.stopPropagation(),!1},document.addEventListener("fullscreenchange",fullscreenChange,!1),document.addEventListener("mozfullscreenchange",fullscreenChange,!1),document.addEventListener("webkitfullscreenchange",fullscreenChange,!1),document.addEventListener("pointerlockchange",pointerLockChange,!1),document.addEventListener("mozpointerlockchange",pointerLockChange,!1),document.addEventListener("webkitpointerlockchange",pointerLockChange,!1),document.addEventListener("pointerlockerror",pointerLockError,!1),document.addEventListener("mozpointerlockerror",pointerLockError,!1),document.addEventListener("webkitpointerlockerror",pointerLockError,!1),createInventoryUI(),void(!/\d/.test(location.host)||($("newgame").onclick=function(){newGame(1)},$("loadgame").onclick=function(){loadGame(1)},t.requestPointerLock,$("resumegame").onclick=function(){mobile?(pointerLocked=!0,showAndHideUI()):togglePointerLock()},$("savegame").onclick=function(){setTimeout("GAME=null;AVATAR=null;showAndHideUI();",500),GAME.save(function(){message("Saved.")})},showAndHideUI(),tick()))):void failinit("<b>This browser is not supported.<br><br>Please use Chrome or Firefox.</b>")}function newGame(t){function e(){if(n=loadNearbyChunks({x:0,z:0},SPREAD_OUT,1))setTimeout(e,0)
else if(i){for(var t in GAME.chunks){var n=GAME.chunks[t]
n.update(!0)}i--,setTimeout(e,0)}else new Entity({type:"player",x:NX/2-.5,y:HY/2,z:NZ/2+.5}),GAME.loading=!1,showAndHideUI()}SY=t,HY=NY*SY,GAME=new Game,GAME.loading=!0,showAndHideUI()
var i=10
togglePointerLock(),makeChunk(0,0),e()}function failinit(t){$("failinit").innerHTML=t,show("failinit",!0),document.getElementById("instructions").style.display="none"
for(var e=document.getElementsByTagName("button"),i=0;i<e.length;++i)e[i].style.display="none"
show("title",!0)}function makeItemSlot(t){var e=document.createElement("div")
e.className="toolbox"
var i=document.createElement("canvas")
return i.className="tool",i.id=t,i.width=i.height=48,mobile&&(i.ontouchstart=function(){pickTool(parseInt(this.id.replace("hud","")))}),e.appendChild(i),e}function slotClick(t){t.preventDefault()
var e=t.currentTarget
if(t.ctrlKey&&HELD)e.get()||e.set({type:HELD.type,qty:0}),e.get().type===HELD.type&&(++e.get().qty,--HELD.qty<1&&(HELD=null))
else if(t.ctrlKey&&e.get())HELD={type:e.get().type,qty:Math.ceil(e.get().qty/2)},e.get().qty>HELD.qty?e.get().qty-=HELD.qty:e.set(null)
else if(HELD&&e.get()&&HELD.type===e.get().type)e.get().qty+=HELD.qty,HELD=null
else{var i=e.get()
e.set(HELD),HELD=i}redisplayInventory(AVATAR)}function makeInventorySlot(t,e){var i=380-58*Math.floor(e/9),n=152+58*(e%9)
mobile&&(n+=60),9>e&&(i+=16),9>e&&!mobile&&(i+=20)
var o=makeItemSlot(t+e)
o.style.left=n+"px",o.style.top=i+"px",o.get=function(){return AVATAR.inventory[e]},o.set=function(t){AVATAR.inventory[e]=t},o.position=e,$(t).appendChild(o)}function createInventoryUI(){$("inventory").addEventListener("mousemove",function(t){var e=$("inventory").getBoundingClientRect(),i=t.clientX-e.left,n=t.clientY-e.top,o=$("held")
o.style.left=i-o.width/2+"px",o.style.top=n-o.height/2+"px"},!1)
for(var t=0;36>t;++t)makeInventorySlot("inventory",t),9>t&&makeInventorySlot("hud",t)
var e=document.createElement("div")
e.innerHTML="&rarr;",e.style.position="absolute",e.style.left="414px",e.style.top="74px",e.style.fontSize="48px",$("inventory").appendChild(e)}function onfocus(){GAME&&AVATAR&&drawScene(AVATAR,!0)}function onkeytouch(t,e){window.event.preventDefault(),onkeydown({keyCode:t.charCodeAt(0)},e)}function onkeyup(t){onkeydown(t,0)}function onkeydown(t,e){t=t||window.event;if($('title').style.display!='block')t.preventDefault&&t.preventDefault()
var i=t.keyCode,n=String.fromCharCode(i).toUpperCase()
if(i>=112&&124>i&&(n="F"+(i-111)),void 0===e&&(e=(KEYS[i]||0)+1),t.ctrlKey&&(i="^"+i,n="^"+n),KEYS[i]=KEYS[n]=e,1===e){if(("	"===n||27===i)&&togglePointerLock(),"L"===n&&canvas_container.requestFullscreen&&canvas_container.requestFullscreen(),"pause"===window.mode)return
if(" "===n&&(GAME.clock<AVATAR.lastHop+.25?(AVATAR.flying=!AVATAR.flying,AVATAR.flying&&(AVATAR.falling=!1)):AVATAR.flying||AVATAR.falling||(AVATAR.dy=VJUMP,AVATAR.falling=!0),AVATAR.lastHop=GAME.clock),"T"===n&&GAME&&AVATAR&&!GAME.loading){var o=AVATAR.inventory[AVATAR.slot]&&AVATAR.inventory[AVATAR.slot].qty&&AVATAR.inventory[AVATAR.slot].type
if(o){o=BLOCK_TYPES[o]||ENTITY_TYPES[o]
var r
o.isEntity||(r=o,o="block"),AVATAR.toss(new Entity({type:o,sourcetype:r})),--AVATAR.inventory[AVATAR.slot].qty,redisplayInventory(AVATAR)}}if("C"===n&&PICKED&&buildTree(PICKED.neighbor(PICKED_FACE)),(190===i||221===i)&&pickTool((AVATAR.slot+1)%9),(188===i||219===i)&&pickTool((AVATAR.slot+8)%9),"^S"===n&&GAME.save(function(){message("Game saved.")}),"^L"===n&&loadGame(1),"^0"===n&&(AVATAR.yaw=AVATAR.pitch=0),"F1"===n){var a=$("hud")
a.hide=!a.hide,showAndHideUI()}var s=i-"1".charCodeAt(0)
s>=0&&9>s&&pickTool(s)}}function renderInventoryItem(t,e){var i=t.getContext("2d")
i.clearRect(0,0,t.width,t.height)
var n=e&&e.qty,o=n&&e.type
if(o){o=BLOCK_TYPES[o]||ENTITY_TYPES[o]
var r=tileCoord(o)
if(i.drawImage($("terrain"),16*r.s,16*r.t,16,16,0,0,t.width,t.height),o.color){for(var a=i.getImageData(0,0,t.width,t.height),s=0;s<a.width*a.height;++s)a.data[4*s+0]*=o.color[0],a.data[4*s+1]*=o.color[1],a.data[4*s+2]*=o.color[2]
i.putImageData(a,0,0)}n>1&&(i.fillStyle="white",i.font="12pt Verdana",i.textAlign="right",i.fillText(n,t.width-2,t.height-3)),t.title=o.name}else t.title=null}function redisplayInventory(t){"inventory"===window.mode&&renderInventoryItem($("held"),HELD)
for(var e=0;e<t.inventory.length;++e){var i=$(window.mode+e)
if(!i)break
renderInventoryItem(i,t.inventory[e])}}function onmousemove(t){if(window.pointerLocked&&GAME&&!GAME.loading){var e=t.movementX||t.mozMovementX||t.webkitMovementX||0,i=t.movementY||t.mozMovementY||t.webkitMovementY||0,n=.01
AVATAR.yaw+=e*n,AVATAR.pitch+=i*n,AVATAR.pitch=Math.max(Math.min(Math.PI/2,AVATAR.pitch),-Math.PI/2)}}function onmousedown(t){if(!mobile&&window.pointerLocked&&GAME&&!GAME.loading){if(t=t||window.event,t.preventDefault&&t.preventDefault(),PICKED)if(0===t.button)PICKED.breakBlock()
else{var e=PICKED.neighbor(PICKED_FACE),n=AVATAR.inventory[AVATAR.slot]&&AVATAR.inventory[AVATAR.slot].qty&&AVATAR.inventory[AVATAR.slot].type
n&&(n=BLOCK_TYPES[n]||ENTITY_TYPES[n]),!e.outofbounds&&n&&(n.isEntity?new Entity({type:n,x:e.x+.5,y:e.y,z:e.z+.5}):e.placeBlock(n),--AVATAR.inventory[AVATAR.slot].qty<=0&&(AVATAR.inventory[i]=null),redisplayInventory(AVATAR))}return!1}}function digplace(t){if(window.pointerLocked&&GAME&&!GAME.loading){if(0===t.button)PICKED.breakBlock()
else{var e=PICKED.neighbor(PICKED_FACE),n=AVATAR.inventory[AVATAR.slot]&&AVATAR.inventory[AVATAR.slot].qty&&AVATAR.inventory[AVATAR.slot].type
n&&(n=BLOCK_TYPES[n]||ENTITY_TYPES[n]),!e.outofbounds&&n&&(n.isEntity?new Entity({type:n,x:e.x+.5,y:e.y,z:e.z+.5}):e.placeBlock(n),--AVATAR.inventory[AVATAR.slot].qty<=0&&(AVATAR.inventory[i]=null),redisplayInventory(AVATAR))}return!1}}function ontouchmove(t){if("page"!=t.target.className&&"crosshair"!=t.target.id)return t.preventDefault()
touchdata.moved=1,clearTimeout(touchdata.timer)
var e=t.changedTouches[0]
if(touchdata.currentx=parseInt(e.clientX),touchdata.currenty=parseInt(e.clientY),t.movementX=touchdata.currentx-touchdata.startx,t.movementY=touchdata.currenty-touchdata.starty,touchdata.startx=parseInt(e.clientX),touchdata.starty=parseInt(e.clientY),GAME&&!GAME.loading){t.preventDefault(),t.stopPropagation()
var i=t.movementX,n=t.movementY,o=.01
AVATAR.yaw+=i*o,AVATAR.pitch+=n*o,AVATAR.pitch=Math.max(Math.min(Math.PI/2,AVATAR.pitch),-Math.PI/2)}}function start_dig_timer(){touchdata.timer=setTimeout("touchdata.moved=1;start_dig_timer();digplace({button:0});",1e3)}function ontouchdown(t){var e=t.changedTouches[0]
if(touchdata.startx=parseInt(e.clientX),touchdata.starty=parseInt(e.clientY),touchdata.moved=0,window.pointerLocked&&GAME&&!GAME.loading){if(t.preventDefault(),"page"!=t.target.className&&"crosshair"!=t.target.id)return
start_dig_timer()}return}function ontouchend(t){clearTimeout(touchdata.timer),"page"!=t.target.className&&"crosshair"!=t.target.id||touchdata.moved||digplace({button:1})}function ce(t){return t||(t=event),void 0!==t.preventDefault?t.preventDefault():void 0!==t.cancelBubble&&(t.returnValue=0,t.cancelBubble=!0),!1}function Stat(t,e,i){this.name=t,this.alpha=e||.95,this.beta=i||.99,this.low=0,this.high=0,this.value=0,this.places=1}function fullscreenChange(){window.fullscreen=(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullscreenElement||document.mozFullScreenElement)===canvas_container,window.pointerLockRequiresFullscreen&&window.fullscreen&&!window.pointerLocked&&togglePointerLock()}function pointerLockChange(){window.pointerLocked=(document.pointerLockElement||document.mozPointerLockElement||document.webkitPointerLockElement)===canvas_container,window.pointerLocked&&window.showOptions&&(window.showOptions=!1),showAndHideUI()}function showAndHideUI(t){mobile&&!t&&(window.pointerLocked=!0),t&&(window.pointerLocked=!1),window.mode=GAME?GAME.loading?"loading":window.pointerLocked?"hud":AVATAR.dead?"dead":GAME.showInventory?"inventory":window.showOptions?"options":"pause":"title"
for(var e=0;e<_MODES.length;++e)show(_MODES[e],window.mode===_MODES[e]&&!$(window.mode).hide)
"pause"==window.mode&&show("title",!0),("inventory"===window.mode||"hud"===window.mode)&&redisplayInventory(AVATAR)}function show(t,e){$(t).style.display=e?"block":"none"}function pointerLockError(t){}function tweak(){return Math.random()-.5}function ParticleSystem(){this.nextID=1,this.particles={},this.shader=new Shader("particle")}function makeBuffer(t,e,i,n){var o=gl.createBuffer(),r=i?gl.DYNAMIC_DRAW:gl.STATIC_DRAW,a=n?gl.ELEMENT_ARRAY_BUFFER:gl.ARRAY_BUFFER,s=n?Uint16Array:Float32Array
return gl.bindBuffer(a,o),gl.bufferData(a,new s(t),r),gl.bindBuffer(a,null),o.itemSize=e,o.numItems=t.length/e,o}function updateBuffer(t,e,i,n){if(!e||0===e.length)return null
var o=n?gl.ELEMENT_ARRAY_BUFFER:gl.ARRAY_BUFFER,r=n?Uint16Array:Float32Array
return!t||t.itemSize!==i||t.itemSize*t.numItems<e.length?(t=gl.createBuffer(),gl.bindBuffer(o,t),gl.bufferData(o,new r(e),gl.DYNAMIC_DRAW),t.itemSize=i,t.numItems=e.length/i):(gl.bindBuffer(o,t),gl.bufferSubData(o,0,new r(e))),gl.bindBuffer(o,null),t}function BufferSet(t){this.elementCount=0,t&&this.update(t)}function pickTool(t){AVATAR.slot=t
for(var e=0;9>e;++e)$("hud"+e).parentNode.style.borderColor=e===t?"white":"rgb(128, 128, 128)"}function sqr(t){return t*t}function Game(t){function e(e,n){i[e]=t.hasOwnProperty(e)?t[e]:n}t=t||{}
var i=this
e("seed",9999999*Math.random()),e("timeOfDay",Math.PI),e("nextEntityID",1),e("clock",0),this.lastUpdate=this.clock,this.chunks={},this.UPDATE_PERIOD=.1}function wallClock(){return+new Date/1e3}function loadGame(t,e){prepStorage(function(){var i=DB.transaction(["games","chunks"],"readonly"),n=i.objectStore("games"),o=n.get(t)
o.onsuccess=function(){if(!o.result)return void message("Load game failed!")
"block"!=document.getElementById("title").style.display&&togglePointerLock(),GAME=new Game(o.result),GAME.loading=!0,showAndHideUI()
var t=i.objectStore("chunks")
t.openCursor().onsuccess=function(t){var i=t.target.result
if(i){var n=new Chunk(i.value)
n.nDirty=1,i["continue"]()}else GAME.loading=!1,message("Game loaded."),showAndHideUI(),e&&e()}}})}function prepStorage(t){if(DB)return void setTimeout(t,0)
window.indexedDB=window.indexedDB||window.webkitIndexedDB||window.mozIndexedDB||window.msIndexedDB
var e=window.indexedDB.open("mineblock",DB_VERSION)
e.onsuccess=function(e){DB=e.target.result,DB.onerror=function(t){},setTimeout(t,0)},e.onupgradeneeded=function(t){var e=t.target.result
e.objectStoreNames.contains("games")&&e.deleteObjectStore("games"),e.objectStoreNames.contains("chunks")&&e.deleteObjectStore("chunks"),e.createObjectStore("games",{autoIncrement:!0}),e.createObjectStore("chunks",{keyPath:"key"})}}function saveChunk(t,e){var i=DB.transaction(["chunks"],"readwrite").objectStore("chunks"),n=i.put(t.data())
n.onsuccess=e}function loadChunk(t){var e=DB.transaction(["chunks"],"readonly").objectStore("chunks"),i=e.get(t)
i.onsuccess=function(){var t=i.result
if(t){new Chunk(t.value)}},i.onerror=function(t){}}function makeFramebufferForTile(t,e,i){var n=gl.createFramebuffer()
gl.bindFramebuffer(gl.FRAMEBUFFER,n),n.left=16*e+2,n.top=16*(15-i)+2,n.width=12,n.height=12,gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0)
var o=gl.createRenderbuffer()
return gl.bindRenderbuffer(gl.RENDERBUFFER,o),gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,t.image.width,t.image.height),gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,o),gl.bindRenderbuffer(gl.RENDERBUFFER,null),gl.bindFramebuffer(gl.FRAMEBUFFER,null),n}function renderToFramebuffer(t,e){gl.bindFramebuffer(gl.FRAMEBUFFER,e),gl.viewport(e.left,e.top,e.width,e.height),gl.scissor(e.left,e.top,e.width,e.height),gl.enable(gl.SCISSOR_TEST),drawScene(t),gl.bindFramebuffer(gl.FRAMEBUFFER,null),gl.disable(gl.SCISSOR_TEST)}function center(t){return{x:t.x,y:t.y+(t.height||SY)/2,z:t.z}}function message(){var t=document.createElement("div")
m=arguments[0]
for(var e=1;e<arguments.length;++e)m+=arguments[e]
t.innerText="> "+m,$("chat").appendChild(t),$("chat").hider=setTimeout(function(){t.style.display="none"},5e3),$("chat").scrollTop=$("chat").scrollHeight}var scalefactor=1,touchdata=[]
void 0!==document.onselectstart&&(document.onselectstart=ce)
for(var deviceAgent=navigator.userAgent.toLowerCase(),mobile=deviceAgent.match(/(iphone|ipod|ipad|android)/),permutation=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],p=Array(512),i=0;256>i;++i)p[i+256]=p[i]=permutation[i]
if("undefined"!=typeof exports){exports.noise=noise,exports.pinkNoise=pinkNoise
for(var st=+new Date,g=0,i=0;1e5>i;++i)g+=pinkNoise(823.2*i,27.533*i,2982.02*i,64,2)
var e=+new Date-st
require("assert").equal(g,8.171890399128474),require("util").puts(e/1e3+" sec")}var LOGNX=4,LOGNY=5,LOGNZ=4,NX=1<<LOGNX,NY=1<<LOGNY,NZ=1<<LOGNZ,CHUNK_RADIUS=Math.sqrt(NX*NX+NZ*NZ),SY=1,HY=NY*SY,LIGHT_SUN=6,GRASSY=!1,BLOCK_TYPES={air:{tile:0,empty:!0,opaque:!1},rock:{tile:1,solid:!0,opaque:!0},"ruby ore":{tile:[6,3],solid:!0,opaque:!0,drop:"ruby"},dirt:{tile:1,color:[233/255,107/255,0],solid:!0,opaque:!0,plantable:!0},grass:{tile:[1,1],color:[.1,.6,0],solid:!0,opaque:!0,plantable:!0,update:function(){this.neighbor(FACE_TOP).type.opaque&&this.placeBlock(BLOCK_TYPES.dirt)}},flag:{tile:4,solid:!0,opaque:!0,stack:1},testpattern:{tile:5,solid:!0,opaque:!0},bedrock:{tile:6,solid:!0,opaque:!0},ice:{tile:7,solid:!0,translucent:[36,205,205,.5]},flower:{tile:8,hashes:1,scale:.6,upon:"plantable"},grassy:{tile:[4,2],hashes:2,height:.5},soybeans:{tile:[7,2],hashes:2,upon:"plantable",drop:"soybean"},weeds:{tile:[11,2],hashes:3,upon:"plantable",onstep:function(t){t.type===ENTITY_TYPES.player&&(!this.lastSpawn||this.lastSpawn+60<GAME.clock)&&(new Entity({type:"chumpa",x:this.x+1-frac(t.x),y:this.y,z:this.z+1-frac(t.z)}),this.lastSpawn=GAME.clock)}},lamp:{tile:9,hashes:1,luminosity:[8,2,2],scale:.6,upon:"solid"},candy:{tile:10,solid:!0,opaque:!0},"grape jelly":{tile:14,liquid:!0,translucent:[154,40,155,.85],viscosity:.85},"strawberry jelly":{tile:13,liquid:!0,translucent:[200,81,83,.85],viscosity:.85},"apricot jelly":{tile:15,liquid:!0,translucent:[191,124,66,.85],viscosity:.85},water:{tile:[6,2],liquid:!0,translucent:[30,137,157,.5],viscosity:.5,unpickable:!0},"miso soup":{tile:[10,2],liquid:!0,translucent:[174,154,112,.85],viscosity:.5,unpickable:!0},rope:{tile:[1,2],liquid:!0,hashes:1,update:function(){this.tile=[this.neighbor(FACE_BOTTOM).type===this.type?0:1,2]
var t=this.neighbor(FACE_TOP).type
t.solid||t===this.type||this.breakBlock()},afterPlacement:function(){var t=this.neighbor(FACE_BOTTOM),e=t.neighbor(FACE_BOTTOM)
!e.outofbounds&&t.type.empty&&e.type.empty&&t.placeBlock(this.type)}},mystery:{tile:[2,2,2,1],opaque:!0,solid:!0,stack:1},obelisk:{tile:[5,1],stack:2,solid:!0,opaque:!0},log:{tile:[4,3,4,4],solid:!0,geometry:"log"},frond:{tile:[5,3],geometry:"frond"}}
for(var i in BLOCK_TYPES)BLOCK_TYPES[i].name=i
"undefined"!=typeof importScripts&&(importScripts("perlin.js"),self.onmessage=function(t){var e=generateChunk(t.data.seed,t.data.chunkx,t.data.chunkz)
postMessage(e)}),document.addEventListener("DOMContentLoaded",onLoad,!1)
var gl
try{var mvMatrix=mat4.create()}catch(e){failinit("<b>This browser is not supported.<br><br>Please use Chrome or Firefox.</b>")}var mvMatrixStack=[],pMatrix=mat4.create(),DB,GAME,AVATAR,SPREAD_OUT=16,PICKED=null,PICKED_FACE=0,PICK_MAX=8,HELD,CRAFT=Array(9),CRAFTABLE,KEYS={},DB_VERSION="11",GEN_STAT=new Stat("Chunk-gen"),RENDER_STAT=new Stat("Render"),UPDATE_STAT=new Stat("Update"),FPS_STAT=new Stat("FPS")
FPS_STAT.invert=!0
for(var GRAVITY=23,PARTICLE_GRAVITY=6.4,DRAG=20,VJUMP=7.7,DARKFACE=.5,FACE_FRONT=0,FACE_BACK=1,FACE_BOTTOM=2,FACE_TOP=3,FACE_RIGHT=4,FACE_LEFT=5,DISTANCE=[1,1,SY,SY,1,1],OPPOSITE={},AXIS={},i=0;6>i;++i)OPPOSITE[i]=1^i,AXIS[i]="zyx"[Math.floor(i/2)]
var ENTITY_TYPES={player:{invisible:!0,radius:.3,height:1.8,walk_max:4.3,fly_max:10.8,acceleration:20,init:function(){AVATAR=GAME.avatar=this,initCamera(this),this.inventory=Array(36),this.lastHop=0,this.viewDistance=100
var t=1.62
this.eyeHeight=t
var e=topmost(this.x,this.z)
e?this.y=e.y+1:this.flying=!0,pickTool(0)},update:function(){var t=1.25*this.viewDistance
if(this.y<-t){this.y=t,GAME.seed+=1
var e=this
setTimeout(function(){e.y=t,GAME.chunks={},makeChunk(0,0),chunk(0,0).entities[AVATAR.id]=AVATAR,chunk(0,0).update()},0)}}},block:{fly_max:20,init:function(){this.dyaw=1,hopEntity(this),this.height=2*SY*this.type.radius,this.rebound=.75,this.sourcetype===BLOCK_TYPES.grass&&(this.sourcetype=BLOCK_TYPES.dirt),this.height=2*(this.type.stack||this.sourcetype.stack||SY)*this.type.radius},collectable:!0,radius:.125},soybean:{tile:[9,2],scale:.25,fly_max:20,collectable:!0,init:function(){hopEntity(this)},billboard:!0,bob:1/8},ruby:{tile:[6,4],scale:.25,fly_max:20,collectable:!0,init:function(){hopEntity(this)},billboard:!0,bob:1/8},chumpa:{tile:11,billboard:!0,scale:.1,init:function(){this.rebound=.75,this.landed=this.birthday,this.liveliness=.25+Math.random(),hopEntity(this,1+.5*Math.random())},update:function(){this.tile=this.falling?12:11,this.falling?this.landed=GAME.clock:block(this).type===BLOCK_TYPES.weeds&&this.age()>2?this.die():this.landed+this.liveliness<GAME.clock&&hopEntity(this,1+.5*Math.random())}}}
for(var i in ENTITY_TYPES)ENTITY_TYPES[i].name=i,ENTITY_TYPES[i].isEntity=!0
Shader.prototype.use=function(){gl.useProgram(this.program)
for(var t in this.attributes)gl.enableVertexAttribArray(this.attributes[t])},Shader.prototype.disuse=function(){for(var t in this.attributes)gl.disableVertexAttribArray(this.attributes[t])
gl.useProgram(null)},Chunk.prototype.data=function(){for(var t={key:this.chunkx+","+this.chunkz,chunkx:this.chunkx,chunkz:this.chunkz,blocks:Array(NX*NY*NZ),entities:{}},e=0;NX*NY*NZ>e;++e)t.blocks[e]=this.blocks[e].data()
for(var e in this.entities){var i=this.entities[e]
t.entities[e]=i.data()}return t},Chunk.prototype.generateBuffers=function(t){t=t&&!(this.opaqueBuffers.empty()&&this.translucentBuffers.empty())
for(var e={},i={},n=0;n<this.blocks.length;++n){var o=this.blocks[n]
if(!o.type.empty){o.vertices||o.buildGeometry()
var r=o.type.translucent?i:e
r.indices||(r.aPos=[],r.aTexCoord=[],r.aLighting=[],r.aColor=[],r.indices=[]),appendGeometry(r,o.vertices,t)}}t?(this.opaqueBuffers.updateLight(e),this.translucentBuffers.updateLight(i)):(this.opaqueBuffers.update(e),this.translucentBuffers.update(i))},Chunk.prototype.tick=function(t){for(var e in this.entities){var i=this.entities[e]
if(i.type.tick&&i.type.tick.apply(i,[i]),i.type.collectable&&i.age()>1){var n=distance(center(AVATAR),i)
n<AVATAR.type.radius?(AVATAR.gain("block"===i.type.name?i.sourcetype.name:i.type.name),redisplayInventory(AVATAR),pickTool(AVATAR.slot),i.die()):3>n&&(i.flying=!0,i.dx=AVATAR.x-i.x,i.dy=AVATAR.y+1-i.y,i.dz=AVATAR.z-i.z,i.dx*=i.type.fly_max/n,i.dy*=i.type.fly_max/n,i.dz*=i.type.fly_max/n)}ballistics(i,t)}},Chunk.prototype.updatePeriod=function(){return Math.max(GAME.UPDATE_PERIOD,2*this.hdistance/AVATAR.viewDistance)},Chunk.prototype.update=function(t){if(this.nDirty>0&&(t||GAME.clock>this.lastUpdate+this.updatePeriod())){this.nDirty=0
for(var e=0,i=0,n={},o=this.blocks.length-1;o>=0;--o){var r=this.blocks[o],a=r.x+NX*r.z
r.sheltered=!!n[a],!r.sheltered&&r.type.opaque&&(n[a]=r),r.type.upon&&!r.neighbor(FACE_BOTTOM).type[r.type.upon]&&r.breakBlock(),r.type.update&&r.type.update.apply(r),(r.dirtyLight||r.dirtyGeometry)&&(r.dirtyLight&&e++,r.dirtyGeometry&&i++,r.update())}this.lastUpdate=GAME.clock,this.generateBuffers(0===i)}else{var r=this.blocks[Math.floor(Math.random()*NX*NY*NZ)]
r.type.update&&r.type.update.apply(r)}for(var o in this.entities){var s=this.entities[o]
s.type.update&&s.type.update.apply(s,[s])}},Chunk.prototype.centerPoint=function(){return{x:this.chunkx+NX/2,y:HY/2,z:this.chunkz+NZ/2}},Entity.prototype.age=function(){return GAME.clock-this.birthday}
var _DZ=NX*NY,_DY=NX,_DX=1
Block.prototype.neighbor=function(t){switch(t){case FACE_FRONT:return this.z-this.chunk.chunkz>0?this.chunk.blocks[this.i-_DZ]:block(this.x,this.y,this.z-1)
case FACE_BACK:return this.z-this.chunk.chunkz<NZ-1?this.chunk.blocks[this.i+_DZ]:block(this.x,this.y,this.z+1)
case FACE_BOTTOM:return this.y>0?this.chunk.blocks[this.i-_DY]:block(this.x,this.y-SY,this.z)
case FACE_TOP:return this.y<HY-SY?this.chunk.blocks[this.i+_DY]:block(this.x,this.y+SY,this.z)
case FACE_RIGHT:return this.x-this.chunk.chunkx>0?this.chunk.blocks[this.i-_DX]:block(this.x-1,this.y,this.z)
case FACE_LEFT:return this.x-this.chunk.chunkx<NX-1?this.chunk.blocks[this.i+_DX]:block(this.x+1,this.y,this.z)}},Block.prototype.eachNeighbor=function(t){t(this.neighbor(FACE_FRONT),FACE_FRONT),t(this.neighbor(FACE_BACK),FACE_BACK),t(this.neighbor(FACE_BOTTOM),FACE_BOTTOM),t(this.neighbor(FACE_TOP),FACE_TOP),t(this.neighbor(FACE_RIGHT),FACE_RIGHT),t(this.neighbor(FACE_LEFT),FACE_LEFT)},Chunk.prototype.renderEntities=function(t){var e={aPos:[],aTexCoord:[],aLighting:[],aColor:[],indices:[]}
for(var i in this.entities){var n=this.entities[i]
n!==t&&n.buildGeometry(e)}var o=new BufferSet(e)
o.render(gl.mainShader)},window.requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame
var BLOCK_SAVE="light dirtyLight dirtyGeometry position facing radius0 radius1".split(" ")
Block.prototype.data=function(){for(var t={type:this.type.name},e=0;e<BLOCK_SAVE.length;++e){var i=BLOCK_SAVE[e]
void 0!==this[i]&&(t[i]=this[i])}return t},Block.prototype.invalidateLight=function(t){this.dirtyLight||(this.dirtyLight=!0,delete this.vertices,this.chunk&&++this.chunk.nDirty),t&&this.eachNeighbor(function(t){t.invalidateLight()})},Block.prototype.invalidateGeometry=function(t){this.dirtyGeometry||(this.dirtyLight=!0,this.dirtyGeometry=!0,this.chunk&&++this.chunk.nDirty),t&&this.eachNeighbor(function(t){t.invalidateGeometry()})},Block.prototype.update=function(){this.dirtyGeometry&&delete this.vertices,this.dirtyLight=this.dirtyGeometry=!1
var t=[0,0,0,0]
if(this.type.opaque);else{if(this.type.luminosity)for(var e=0;3>e;++e)t[e]=this.type.luminosity[e]
this.sheltered||(t[3]=LIGHT_SUN),this.eachNeighbor(function(e,i){for(var n=0;4>n;++n)t[n]=Math.max(t[n],e.light[n]-DISTANCE[i])})}changeArray(this.light,t)&&this.eachNeighbor(function(t){t.invalidateLight()})},Block.prototype.breakBlock=function(){if(!this.type.empty){var t=this.type,e=this.position,i=this.facing,n=tileCoord(this)
this.type=BLOCK_TYPES.air,delete this.position,delete this.facing,this.invalidateGeometry(!0),e||new Entity({type:t.drop||"block",x:this.x+.5,y:this.y+(this.height||SY)/2,z:this.z+.5,sourcetype:t},this)
for(var o=0;20>o;++o)gl.particles.spawn({x0:this.x+.5,y0:this.y+.5,z0:this.z+.5,tile:n})
t.stack&&(e>0&&this.neighbor(OPPOSITE[i]).breakBlock(),e+SY<t.stack&&this.neighbor(i).breakBlock())}},Block.prototype.placeBlock=function(t,e,i){this.outofbounds||("string"==typeof t&&BLOCK_TYPES[t],t.stack&&(void 0===e&&(e=0),void 0===i&&(i=FACE_TOP)),this.type=t,this.position=e,this.facing=i,this.invalidateGeometry(!0),this.type.afterPlacement&&this.type.afterPlacement.apply(this),this.type.stack&&this.position+DISTANCE[i]<this.type.stack&&this.neighbor(i).placeBlock(t,e+DISTANCE[i],i))},Block.prototype.toString=function(){var t=this.type.name+" ["+this.x+","+this.y+","+this.z+"] &#9788;"+this.light.join(",")
return void 0!==this.position&&(t+=" #"+this.position),void 0!==this.facing&&(t+=" ^"+this.facing),this.outofbounds&&(t+=" &#9760;"),this.sheltered&&(t+=" &#9730;"),t}
var ZERO=.01,ONE=1-ZERO,_CORNERS=[[0,0,0],[1,0,0],[1,0,1],[0,0,1],[0,1,0],[1,1,0],[1,1,1],[0,1,1]],_FACES=faces(_CORNERS),_block_geometries={log:blockGeometryLog,frond:blockGeometryFrond}
Block.prototype.buildGeometry=function(){this.type.empty||(this.type.geometry?_block_geometries[this.type.geometry](this):this.type.billboard?blockGeometryBillboard(this):this.type.hashes?blockGeometryHash(this):blockGeometryBlock(this))},Entity.prototype.buildGeometry=function(t){this.type.geometry?this.type.geometry(this,t):this.type.invisible||(this.type.billboard?entityGeometryBillboard(this,t):this.sourcetype.hashes?entityGeometryHash(this,t):entityGeometryBlock(this,t))},Entity.prototype.gain=function(t,e){void 0===e&&(e=1)
for(var i=0;i<this.inventory.length;++i)if(this.inventory[i]&&this.inventory[i].type===t)return this.inventory[i].qty+=e
for(var i=0;i<this.inventory.length;++i)if(!this.inventory[i]||!this.inventory[i].type)return this.inventory[i]={type:t,qty:e}
message("Inventory full!")},Array.prototype.append=function(t){this.push.apply(this,t)},Wireframe.prototype.render=function(){mvPushMatrix(),mat4.translate(mvMatrix,mvMatrix,[PICKED.x,PICKED.y,PICKED.z]),this.shader.use(),gl.lineWidth(2),gl.uniformMatrix4fv(this.shader.uniforms.uPMatrix,!1,pMatrix),gl.uniformMatrix4fv(this.shader.uniforms.uMVMatrix,!1,mvMatrix),pointToAttribute(this.shader,this,"aPos"),gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indices),gl.drawElements(gl.LINES,this.indices.numItems,gl.UNSIGNED_SHORT,0),gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null),this.shader.disuse(),gl.enable(gl.DEPTH_TEST),mvPopMatrix()},mat4.toInverseMat3=function(t,e){var i,n=t[0],o=t[1],r=t[2],a=t[4],s=t[5],l=t[6],h=t[8],c=t[9],d=t[10],u=d*s-l*c,p=-d*a+l*h,y=c*a-s*h,f=n*u+o*p+r*y
return f?(i=1/f,e||(e=mat3.create()),e[0]=u*i,e[1]=(-d*o+r*c)*i,e[2]=(l*o-r*s)*i,e[3]=p*i,e[4]=(d*n-r*h)*i,e[5]=(-l*n+r*a)*i,e[6]=y*i,e[7]=(-c*n+o*h)*i,e[8]=(s*n-o*a)*i,e):null},Entity.prototype.data=function(){for(var t={},e="x y z dx dy dz yaw pitch dyaw dpitch travelled birthday id".split(" "),i=0;i<e.length;++i){var n=e[i]
t[n]=this[n]}return t.type=this.type.name,t.sourcetype=this.sourcetype.name,t},Entity.prototype.die=function(){this.dead=!0,delete this.chunk.entities[this.id],this.type===ENTITY_TYPES.player&&togglePointerLock()},Entity.prototype.toString=function(){var t="["+this.x.toFixed(2)+","+this.y.toFixed(2)+","+this.z.toFixed(2)+"] "
return t+="&lt;"+this.yaw.toFixed(2)+","+this.pitch.toFixed(2)+"&gt",t+=" +["+this.dx.toFixed(2)+","+this.dy.toFixed(2)+","+this.dz.toFixed(2)+"] ",t+=this.flying?"F":this.falling?"f":"w",this.swimming&&(t+="s"),t},Entity.prototype.facing=function(){var t=Math.cos(this.pitch)
return{dy:-Math.sin(this.pitch),dx:t*Math.sin(this.yaw),dz:-t*Math.cos(this.yaw)}},Entity.prototype.toss=function(t){var e=10*(1+tweak()/4),i=this.facing()
t.x=this.x,t.y=this.y+this.eyeHeight,t.z=this.z,t.dx=this.dx+(1+tweak()/2)*i.dx*e,t.dy=this.dy+(1+tweak()/2)*i.dy*e,t.dz=this.dz+(1+tweak()/2)*i.dz*e,t.yaw=Math.random()*Math.PI*2},Stat.prototype.start=function(){this.startTime=+new Date},Stat.prototype.end=function(t){void 0===t&&(t=this.startTime),this.add(+new Date-t)},Stat.prototype.add=function(t){this.value=this.alpha*this.value+(1-this.alpha)*t,this.low=t<this.low?t:this.beta*this.low+(1-this.beta)*this.value,this.high=t>this.high?t:this.beta*this.high+(1-this.beta)*this.value},Stat.prototype.toString=function(){var t=this.value,e=this.low,i=this.high
if(this.invert){t=1/t
var n=1/i
i=1/e,e=n}return this.name+": "+t.toFixed(this.places)+" ("+e.toFixed(this.places)+" "+i.toFixed(this.places)+")"}
var _MODES="title,loading,hud,inventory,pause".split(",")
ParticleSystem.prototype.spawn=function(t){var e=Math.random(),i={dx:2*tweak(),dy:.5+3*Math.random(),dz:2*tweak(),x0:0,y0:0,z0:0,id:gl.particles.nextID++,birthday:GAME.clock-e,life:e+.5+Math.random()/2,tile:{s:10,t:0}}
for(var n in i)void 0!==t[n]&&(i[n]=t[n])
var o=4
return i.tile=[16*i.tile.s+Math.floor(Math.random()*(15-o)),16*i.tile.t+Math.floor(Math.random()*(15-o))],this.add(i),i},ParticleSystem.prototype.add=function(t){this.particles[t.id]=t,delete this.buffers},ParticleSystem.prototype.remove=function(t){delete this.particles[t.id],delete this.buffers},ParticleSystem.prototype.tick=function(t){for(var e in this.particles){var i=this.particles[e]
i.life-=t,i.life<0&&this.remove(i)}},ParticleSystem.prototype.bounceParticle=function(t){var e=(t.dx>0?carf(t.x0):frac(t.x0))/t.dx,i=(t.dz>0?carf(t.z0):frac(t.z0))/t.dz,n=t.dy+Math.sqrt(t.dy*t.dy+2*PARTICLE_GRAVITY*frac(t.y0))/2*PARTICLE_GRAVITY,o=Math.min(e,n,i)
if(o<t.life){var r=this.spawn({x0:t.x0+o*t.dx,y0:t.y0+o*t.dy-.5*PARTICLE_GRAVITY*o*o,z0:t.z0+o*t.dz,dy:t.dy-PARTICLE_GRAVITY*o,life:t.life-o,birthday:t.birthday+o})
t.life-=o
var a=.5
return o===e?r.dx*=-a:o===i?r.dz*=-a:r.dy*=-a,r}},BufferSet.prototype.empty=function(){return!this.elementCount},BufferSet.prototype.update=function(t){this.aPos=updateBuffer(this.aPos,t.aPos,3),this.aTexCoord=updateBuffer(this.aTexCoord,t.aTexCoord,2),this.aLighting=updateBuffer(this.aLighting,t.aLighting,4),this.aColor=updateBuffer(this.aColor,t.aColor,3),this.indices=updateBuffer(this.indices,t.indices,1,!0),this.elementCount=t&&t.indices?t.indices.length:0},BufferSet.prototype.updateLight=function(t){this.aLighting=updateBuffer(this.aLighting,t.aLighting,4)},BufferSet.prototype.render=function(t){this.empty()||(pointToAttribute(t,this,"aPos"),pointToAttribute(t,this,"aTexCoord"),pointToAttribute(t,this,"aLighting"),pointToAttribute(t,this,"aColor"),gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indices),gl.drawElements(gl.TRIANGLES,this.elementCount,gl.UNSIGNED_SHORT,0),gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null))},ParticleSystem.prototype.render=function(){if(this.shader.use(),!this.buffers){var t=[],e=[],i=[],n=[]
for(var o in this.particles){var r=this.particles[o]
t.push(r.x0,r.y0,r.z0),e.push(r.dx,r.dy,r.dz),i.push(r.birthday),n.push.apply(n,r.tile)}this.buffers={},this.buffers.aInitialPos=makeBuffer(t,3),this.buffers.aVelocity=makeBuffer(e,3),this.buffers.aBirthday=makeBuffer(i,1),this.buffers.aTexCoord=makeBuffer(n,2)}gl.uniform1f(this.shader.uniforms.uClock,parseFloat(GAME.clock)),gl.uniform1f(this.shader.uniforms.uGravity,PARTICLE_GRAVITY),gl.uniformMatrix4fv(this.shader.uniforms.uPMatrix,!1,pMatrix),gl.uniformMatrix4fv(this.shader.uniforms.uMVMatrix,!1,mvMatrix),gl.activeTexture(gl.TEXTURE0),gl.bindTexture(gl.TEXTURE_2D,gl.textures.terrain)
var a=gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic")
a&&gl.texParameterf(gl.TEXTURE_2D,a.TEXTURE_MAX_ANISOTROPY_EXT,1),gl.uniform1i(this.shader.uniforms.uSampler,0),pointToAttribute(this.shader,this.buffers,"aInitialPos"),pointToAttribute(this.shader,this.buffers,"aVelocity"),pointToAttribute(this.shader,this.buffers,"aBirthday"),pointToAttribute(this.shader,this.buffers,"aTexCoord"),gl.drawArrays(gl.POINTS,0,this.buffers.aInitialPos.numItems),this.shader.disuse()},Game.prototype.data=function(){return{seed:this.seed,timeOfDay:this.timeOfDay,nextEntityID:this.nextEntityID,clock:this.clock}},window.lastFrame=wallClock(),Game.prototype.save=function(t){var e=this
prepStorage(function(){function i(){r.length>0?saveChunk(e.chunks[r.pop()],i):t()}var n=DB.transaction(["games","chunks"],"readwrite"),o=n.objectStore("games"),r=(n.objectStore("chunks"),Object.keys(e.chunks)),a=e.data(),s=void 0===GAME.id?o.add(a):o.put(a,GAME.id)
s.onsuccess=i})}