import * as THREE from 'three';

/** Presentation only: no model inputs, calculations or state are read or changed. */
export function createFailureScene(mount, vertices, onModeChange, initiallyPaused) {
const wireVertices = [];
for (let i = 0; i < vertices.length; i += 3) wireVertices.push(vertices[i], vertices[i + 2] - 62, -vertices[i + 1]);
const profile=[[0.6395348837209303, 5.70232558139535], [1.5988372093023255, 6.853488372093024], [3.0697674418604652, 8.388372093023257], [3.5174418604651163, 9.155813953488373], [3.5174418604651163, 12.609302325581396], [2.941860465116279, 14.272093023255815], [2.941860465116279, 17.21395348837209], [2.941860465116279, 20.219767441860466], [2.941860465116279, 23.225581395348836], [2.941860465116279, 26.167441860465118], [2.941860465116279, 27.574418604651164], [2.75, 29.17325581395349], [2.238372093023256, 32.43488372093023], [1.7906976744186047, 35.18488372093023], [1.7267441860465116, 36.14418604651163], [1.7267441860465116, 38.06279069767442], [1.7267441860465116, 41.9], [1.7267441860465116, 45.73720930232558], [1.7267441860465116, 49.574418604651164], [1.7267441860465116, 53.41162790697675], [1.7267441860465116, 56.28953488372093], [1.9186046511627908, 57.12093023255814], [2.238372093023256, 58.336046511627906], [2.1734779086933806, 58.847674418604655], [2.8023014570031757, 59.16744186046512], [3.673848204181297, 59.806976744186045], [4.647091241172894, 60.95813953488372], [5.281489559132288, 62.36511627906977], [5.5, 63.9], [5.242625973281655, 65.56279069767442], [4.647091241172894, 66.84186046511627], [3.811542062401506, 67.86511627906977], [2.8023014570031757, 68.6325581395349], [1.6578638995927086, 69.14418604651163], [0.0, 69.4]];
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setClearColor(0x121212);renderer.outputColorSpace=THREE.SRGBColorSpace;mount.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x121212,170,330);
const camera=new THREE.PerspectiveCamera(42,1,.1,600);camera.position.set(68,65,195);camera.lookAt(7,-10,0);
scene.add(new THREE.HemisphereLight(0xdedede,0x1a1a1a,2.3));const key=new THREE.DirectionalLight(0xebebeb,3);key.position.set(-65,90,65);scene.add(key);const rim=new THREE.DirectionalLight(0x919191,2);rim.position.set(30,15,-60);scene.add(rim);
function material(color,opacity=1){return new THREE.MeshStandardMaterial({color,roughness:.68,metalness:.25,transparent:opacity<1,opacity});}
function box(parent,w,h,d,x,y,z,color){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material(color));m.position.set(x,y,z);parent.add(m);return m;}
function segment(parent,a,b,color=0xb0b0b0,opacity=.55){const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a),new THREE.Vector3(...b)]);const l=new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:true,opacity}));parent.add(l);return l;}
function edges(parent,mesh,color=0xa3a3a3,opacity=.5){const e=new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),new THREE.LineBasicMaterial({color,transparent:true,opacity}));e.position.copy(mesh.position);e.rotation.copy(mesh.rotation);parent.add(e);return e;}
function makeNode(){const group=new THREE.Group();const geom=new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(p[0],p[1]-62)),64);const shell=new THREE.Mesh(geom,material(0x383838,.82));group.add(shell);const wire=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(wireVertices,3)),new THREE.LineBasicMaterial({color:0xf3f3f3,transparent:true,opacity:.95,fog:false,toneMapped:false}));group.add(wire);
 const lights=[];for(let i=0;i<6;i++){const light=new THREE.Mesh(new THREE.BoxGeometry(.72,.72,.72),new THREE.MeshBasicMaterial({color:0xd5d5d5,transparent:true,opacity:.9}));light.position.set(-1.6+(i%3)*1.5,1.4+Math.floor(i/3)*1.6,5);group.add(light);lights.push(light);}group.userData.lights=lights;scene.add(group);return group;}
const node=makeNode();node.scale.setScalar(.74);
function opacity(group,value){group.traverse(o=>{if(o.material){if(o.userData.baseOpacity===undefined)o.userData.baseOpacity=o.material.opacity;o.material.transparent=true;o.material.opacity=o.userData.baseOpacity*value;}});}
// A translucent ocean surface keeps the submerged structure legible.
const oceanGeo=new THREE.PlaneGeometry(650,650,130,130);oceanGeo.rotateX(-Math.PI/2);const ocean=new THREE.Mesh(oceanGeo,new THREE.MeshStandardMaterial({color:0x252525,transparent:true,opacity:.30,roughness:.38,metalness:.45,depthWrite:false,side:THREE.DoubleSide}));scene.add(ocean);
const gridData=[];for(let z=-320;z<=320;z+=10)for(let x=-320;x<320;x+=5)gridData.push(x,0,z,x+5,0,z);for(let x=-320;x<=320;x+=10)for(let z=-320;z<320;z+=5)gridData.push(x,0,z,x,0,z+5);const gridGeo=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(gridData,3));const grid=new THREE.LineSegments(gridGeo,new THREE.LineBasicMaterial({color:0xefefef,transparent:true,opacity:.19,depthWrite:false}));scene.add(grid);
const port=new THREE.Group();port.scale.setScalar(.7);port.position.set(39,0,-8);scene.add(port);
// A compact shipyard seen across a broad stretch of open water.
const quay=box(port,65,4,78,70,0,-20,0x545454);edges(port,quay,0x909090,.38);
const apron=box(port,61,.3,73,69.5,2.15,-20,0x696969);
for(const z of [-49,-17,15]){
 const pier=box(port,25,2.2,7,29,1,z,0x737373);edges(port,pier,0xb5b5b5,.35);
 for(const x of [20,30,39])for(const zz of [z-2,z+2])box(port,.65,10,.65,x,-4,zz,0x4e4e4e);
}
function crane(x,z,height){
 const g=new THREE.Group();g.position.set(x,0,z);port.add(g);
 for(const dx of [-5,5])for(const dz of [-4,4]){
  const leg=box(g,.8,height,.8,dx,height/2+2,dz,0x9c9c9c);
  segment(g,[dx,4,dz],[dx===-5?5:-5,height-3,dz],0x8d8d8d,.6);
 }
 const bridge=box(g,14,1.7,10,0,height+2,0,0xababab);edges(g,bridge,0xd6d6d6,.4);
 for(const dz of [-3,3]){
  box(g,33,.6,.6,-10,height+4,dz,0xababab);
  box(g,.6,10,.6,3,height+9,dz,0xb5b5b5);
  segment(g,[-26,height+4,dz],[3,height+14,dz],0xd0d0d0,.6);
  segment(g,[6,height+4,dz],[3,height+14,dz],0xd0d0d0,.6);
  for(let dx=-23;dx<5;dx+=6)segment(g,[dx,height+4,dz],[dx+3,height+6,dz],0x9f9f9f,.45);
 }
 box(g,4,3,4,-4,height,0,0x686868);
 segment(g,[-20,height+4,0],[-20,6,0],0xd0d0d0,.7);box(g,4,.6,4,-20,5.7,0,0x999999);
}
crane(48,-39,21);crane(49,-7,24);crane(49,24,19);
for(const z of [-44,-15]){
 const hall=box(port,24,7,15,79,5.5,z,0x787878);edges(port,hall,0xa8a8a8,.35);
 const roofShape=new THREE.Shape();roofShape.moveTo(-12,0);roofShape.lineTo(0,3.3);roofShape.lineTo(12,0);roofShape.closePath();
 const roof=new THREE.Mesh(new THREE.ExtrudeGeometry(roofShape,{depth:15,bevelEnabled:false}),material(0x989898));roof.position.set(79,9,z-7.5);port.add(roof);
 for(let dx=-8;dx<=8;dx+=8)box(port,4.5,4,.15,79+dx,4.5,z+7.6,0x484848);
}
for(let row=0;row<3;row++)for(let col=0;col<4;col++){
 const storage=box(port,7,2.7,3,65+col*8.1,3.8,7+row*4.3,(row+col)%3===0?0x828282:0x737373);edges(port,storage,0xababab,.28);
 if((row+col)%2===0)box(port,7,2.7,3,65+col*8.1,6.5,7+row*4.3,0x7d7d7d);
}
// One docked vessel gives the yard a readable sense of scale.
const docked=new THREE.Group();docked.position.set(29,.3,-33);port.add(docked);
const vesselShape=new THREE.Shape();vesselShape.moveTo(-3,-12);vesselShape.lineTo(3,-12);vesselShape.lineTo(3,9);vesselShape.lineTo(0,14);vesselShape.lineTo(-3,9);vesselShape.closePath();
const vesselGeo=new THREE.ExtrudeGeometry(vesselShape,{depth:2,bevelEnabled:true,bevelSize:.35,bevelThickness:.4,bevelSegments:1});vesselGeo.rotateX(-Math.PI/2);
const vessel=new THREE.Mesh(vesselGeo,material(0x8e8e8e));docked.add(vessel);edges(docked,vessel,0xcbcbcb,.45);box(docked,4.5,3.5,5,0,3.7,7,0xbbbbbb);box(docked,4,1,13,0,2.7,-3,0x6b6b6b);
const dish=new THREE.Mesh(new THREE.SphereGeometry(2.1,16,10,0,Math.PI*2,0,.9),material(0xc4c4c4));dish.rotation.z=-.7;dish.position.set(43,9,2);port.add(dish);box(port,.35,5,.35,43,5,2,0xaaaaaa);
// Starlink-like flat spacecraft with one solar-array wing.
const sat=new THREE.Group();sat.position.set(-4,51,-13);sat.scale.setScalar(.8);sat.rotation.set(.2,.3,-.2);scene.add(sat);const panel=box(sat,19,.3,10,-9,0,0,0x4f4f4f);edges(sat,panel,0xb4b4b4,.8);for(let x=-17;x<0;x+=2.8)segment(sat,[x,.2,-5],[x,.2,5],0xbdbdbd,.45);for(let z=-2.5;z<5;z+=2.5)segment(sat,[-18.5,.2,z],[.5,.2,z],0xbdbdbd,.45);box(sat,1,.4,1,2,0,0,0xb1b1b1);const bus=box(sat,6,1.3,8,6,0,0,0xb3b3b3);edges(sat,bus,0xe0e0e0,.7);box(sat,.3,3,.3,7,-2,0,0xadadad);
const tug=new THREE.Group();tug.scale.setScalar(.72);scene.add(tug);const hullShape=new THREE.Shape();hullShape.moveTo(-6,-2.4);hullShape.lineTo(4,-2.4);hullShape.lineTo(7,0);hullShape.lineTo(4,2.4);hullShape.lineTo(-6,2.4);hullShape.closePath();const hullGeo=new THREE.ExtrudeGeometry(hullShape,{depth:2,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.5,bevelThickness:.4});hullGeo.rotateX(-Math.PI/2);const hull=new THREE.Mesh(hullGeo,material(0x7c7c7c));tug.add(hull);edges(tug,hull,0xe6e6e6,.55);const cabin=box(tug,4.5,3.7,3,-1,3.6,0,0xadadad);edges(tug,cabin,0xe6e6e6,.6);box(tug,3,.9,2,-.6,4.2,0,0x515151);box(tug,.2,4,.2,0,7.2,0,0xdfdfdf);tug.visible=false;
const tow=segment(scene,[0,0,0],[0,0,0],0xc6c6c6,.7);
// Expanding wavefronts suggest radio transmission, without projectile-like dots.
const signals = [];
for (let leg = 0; leg < 2; leg++) {
  for (let i = 0; i < 3; i++) {
    const points = Array.from({length: 49}, (_, j) => {
      const angle = j / 48 * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
    });
    const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({color: 0xc9c9c9, transparent: true, opacity: 0, depthWrite: false}));
    scene.add(ring);
    signals.push({ring, leg, phase: i / 3});
  }
}
let paused = initiallyPaused, time = 0, last = 0, visible = false, current = -1, frame = 0, disposed = false;
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);},mix=(a,b,p)=>a+(b-a)*p;
function wave(x,z,t){return 1.65*Math.sin(x*.105+z*.055-t*.95)+.85*Math.cos(z*.115-x*.028-t*.61)+.30*Math.sin(x*.24+z*.16-t*1.25);}
function communication(from, t, active, sparse) {
  const a = new THREE.Vector3(from.position.x, from.position.y + 5.2, from.position.z);
  const b = sat.position.clone().add(new THREE.Vector3(3, -2, 0));
  const d = new THREE.Vector3(69.1, 6.3, -6.6);
  signals.forEach(({ring, leg, phase}) => {
    const start = leg === 0 ? a : b;
    const end = leg === 0 ? b : d;
    const u = (t / 3.6 + phase) % 1;
    ring.visible = active;
    ring.position.copy(start).lerp(end, u);
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), end.clone().sub(start).normalize());
    ring.scale.setScalar(1.2 + u * 7);
    ring.material.opacity = Math.sin(u * Math.PI) * (sparse ? .14 : .3);
  });
}
// Front-load each action; retain the 6.5-second scene duration for caption reading.
function draw(t){const mode=Math.floor(t/6.5)%5,s=t%6.5;if(mode!==current){current=mode;onModeChange(mode);}

 const pos=oceanGeo.attributes.position;for(let i=0;i<pos.count;i++)pos.setY(i,wave(pos.getX(i),pos.getZ(i),t));pos.needsUpdate=true;oceanGeo.computeVertexNormals();const gp=gridGeo.attributes.position;for(let i=0;i<gp.count;i++)gp.setY(i,wave(gp.getX(i),gp.getZ(i),t)+.05);gp.needsUpdate=true;
 node.visible=true;node.position.set(-51,wave(-51,3,t)*.65,3);node.rotation.set(.008*Math.sin(t*.6),.15,0);opacity(node,1);tug.visible=false;tow.visible=false;let sender=node,active=true,sparse=false;
 if(mode===0){sparse=s>.3;node.userData.lights.forEach((l,i)=>{l.material.opacity=sparse&&i>2?.06:.95;});}
 else{
  node.userData.lights.forEach(l=>l.material.opacity=s>.2?.04:.9);
  if(mode===1){
   const tilt=-Math.PI/2*ease((s-.15)/1.2),travel=ease((s-1.2)/3.7);
   const centerX=mix(-51,44,travel);
   node.rotation.set(0,.15,tilt);
   node.position.set(centerX-18.5*Math.sin(tilt),wave(centerX,3,t)*.65,3);
   active=s<.2;
  }
  if(mode===2){
   active=s<.2;const tilt=-Math.PI/2*ease((s-.2)/1.3),back=ease((s-2.15)/3.2);
   const centerX=mix(-51,37,back);
   node.rotation.set(0,.15,tilt);node.position.set(centerX-18.5*Math.sin(tilt),wave(centerX,3,t)*.65,3);
   tug.visible=true;const target=node.position.x+11;
   tug.position.set(s<2.05?mix(67,target,ease((s-.15)/1.85)):target,wave(target,3,t)*.65,3);
   tug.rotation.y=s<2.05?Math.PI:0;tow.visible=s>2.05;
   const a=tow.geometry.attributes.position;
   a.setXYZ(0,node.position.x+5,node.position.y+1,3);a.setXYZ(1,tug.position.x-6,tug.position.y+1,3);a.needsUpdate=true;tow.geometry.computeBoundingSphere();
  }
  if(mode>=3){
   const sinking=ease((s-.15)/3.8);
   node.position.y=wave(-51,3,t)*.65-92*sinking;
   node.rotation.z=.1*sinking;
   opacity(node,1-.35*sinking);
   active=s<.2;
  }
 }
 communication(sender,t,active,sparse);renderer.render(scene,camera);
}

function resize() {
  const w = Math.max(1, mount.clientWidth);
  renderer.setSize(w, w);
  draw(time);
}
function stop() { cancelAnimationFrame(frame); frame = 0; last = 0; }
function start() {
  if (!frame && !disposed && visible && !paused && !document.hidden) frame = requestAnimationFrame(loop);
}
function loop(now) {
  frame = 0;
  if (disposed || !visible || paused || document.hidden) return;
  if (last) time += Math.min(.1, (now-last)/1000);
  last = now;
  draw(time);
  start();
}
const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(mount);
const visibilityObserver = new IntersectionObserver(entries => {
  visible = entries[0]?.isIntersecting ?? false;
  if (visible) start(); else stop();
});
visibilityObserver.observe(mount);
const onVisibilityChange = () => { if (document.hidden) stop(); else start(); };
document.addEventListener('visibilitychange', onVisibilityChange);
resize();
return {
  setPaused(value) { paused = value; if (paused) stop(); else start(); },
  select(mode) { time = mode * 6.5 + (paused ? 4.5 : 0); last = 0; draw(time); },
  dispose() {
    disposed = true; stop(); resizeObserver.disconnect(); visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    const geometries = new Set(), materials = new Set();
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) for (const m of Array.isArray(object.material) ? object.material : [object.material]) materials.add(m);
    });
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose());
    renderer.dispose(); renderer.domElement.remove();
  }
};
}
