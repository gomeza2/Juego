import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
assert.deepEqual(duplicateIds, [], 'HTML IDs must be unique');

const refs = [...html.matchAll(/\$\('([^']+)'\)/g)].map(match => match[1]);
const missingRefs = [...new Set(refs.filter(id => !ids.includes(id)))];
assert.deepEqual(missingRefs, [], 'All direct DOM helper references should resolve');

const types = [...html.matchAll(/^\s{2}([A-Za-z]\w*):\{name:/gm)].map(match => match[1]);
const uiTypes = [...html.matchAll(/data-type="([^"]+)"/g)].map(match => match[1]);
const missingTypes = [...new Set(uiTypes.filter(type => !types.includes(type)))];
assert.deepEqual(missingTypes, [], 'Every library data-type needs a metadata entry');

const requiredIds = [
  'scaleX', 'scaleY', 'scaleZ', 'applyScaleXYZBtn',
  'archSizeX', 'archSizeY', 'archSizeZ', 'applyArchSizeBtn',
  'wallOpeningType', 'openingWidth', 'openingHeight',
  'polygonSides', 'bevelRadius', 'archSizePanel',
  'orbitBtn', 'moveBtn', 'rotateBtn', 'scaleBtn',
  'repeatMirrorPanel', 'arrayAxis', 'arrayCount', 'arraySpacing', 'arraySpacingUnit',
  'arrayCreateBtn', 'mirrorAxis', 'mirrorCreateBtn',
  'booleanPanel', 'booleanMode', 'booleanApplyBtn',
  'planeCutAxis', 'planeCutSide', 'planeCutPosition', 'planeCutPositionValue', 'planeCutApplyBtn',
  'edgeBevelPanel', 'edgeBevelRadius', 'edgeBevelSegments', 'edgeBevelUnit', 'edgeBevelApplyBtn', 'edgeBevelRemoveBtn'
];
for (const id of requiredIds) assert.equal(ids.filter(value => value === id).length, 1, 'Expected exactly one #' + id);

const dimensionTypes = ['wall','floor','door','window','space','disk','triangle','rectangle','polygon','roundedCube'];
for (const type of dimensionTypes) {
  assert.ok(types.includes(type), 'Missing metadata for ' + type);
  assert.ok(html.includes(type + ':['), 'Missing parametric default dimensions for ' + type);
}
for (const type of ['space','disk','triangle','rectangle','polygon','roundedCube']) {
  assert.ok(html.includes('data-type="' + type + '"'), 'Missing library card for ' + type);
  assert.ok(html.includes('<option value="' + type + '"'), 'Missing quick-add option for ' + type);
  assert.ok(html.includes("type==='" + type + "'"), 'Missing geometry builder for ' + type);
}
assert.ok(html.includes('selected.scale.set(values[0],values[1],values[2])'), 'XYZ scale must apply independently');
assert.ok(html.includes('Math.abs(v)<.05||Math.abs(v)>20'), 'Signed scale values must support reflected objects');
assert.ok(html.includes("$('arrayCreateBtn').addEventListener('click',createObjectArray)"), 'Array button must invoke the copy generator');
assert.ok(html.includes('function createObjectArray()'), 'Object array generator must exist');
assert.ok(html.includes('for(let i=1;i<=count;i++)'), 'Object array must create the requested number of additional copies');
assert.ok(html.includes("data.position[axisIndex]=base.getComponent(axisIndex)+spacing*i"), 'Array copies must use predictable center-to-center axis spacing');
assert.ok(html.includes("$('mirrorCreateBtn').addEventListener('click',createMirroredCopy)"), 'Mirror button must invoke the reflection generator');
assert.ok(html.includes('function createMirroredCopy()'), 'Mirror copy generator must exist');
assert.ok(html.includes('"three-csg-ts":"https://cdn.jsdelivr.net/npm/three-csg-ts@3.2.0/lib/esm/index.js"'), 'CSG module must be mapped to a pinned CDN version');
assert.ok(html.includes("const {CSG}=await csgModulePromise"), 'Boolean engine must load lazily rather than breaking editor startup if the CDN is unavailable');
assert.ok(html.includes("const booleanSolidTypes=new Set("), 'Boolean operations must explicitly limit themselves to solid single-mesh forms');
assert.ok(html.includes("function applyBooleanOperation()"), 'Boolean operation handler must exist');
assert.ok(html.includes("if(mode==='union')result=CSG.union(a,b)"), 'Union must combine the selected solid and cutter');
assert.ok(html.includes("else if(mode==='subtract')result=CSG.subtract(a,b)"), 'Subtraction must create A minus B');
assert.ok(html.includes("else result=CSG.intersect(a,b)"), 'Intersection must keep only the shared volume');
assert.ok(html.includes('function serializeBooleanGeometry(geometry)'), 'Boolean result geometry must be serialized');
assert.ok(html.includes('function restoreBooleanGeometry(data)'), 'Boolean result geometry must be reconstructed from JSON');
assert.ok(html.includes('booleanGeometry:node.userData.booleanGeometry||null'), 'Boolean geometry must be included in project JSON');
assert.ok(html.includes("if(type==='boolean')root.userData.booleanGeometry=data.booleanGeometry||null"), 'Boolean geometry must be restored with scene nodes');
assert.ok(html.includes("$('booleanApplyBtn').addEventListener('click',applyBooleanOperation)"), 'Boolean UI button must invoke the operation');
assert.ok(html.includes("const edgeBevelTypes=new Set(['cube','rectangle','roundedCube'])"), 'Direct edge bevel must only target compatible single-mesh solids');
assert.ok(html.includes('function applyEdgeBevelToRoot(root,radius,segments=3,store=true)'), 'Actual rounded bevel geometry transform must be defined');
assert.ok(html.includes('new RoundedBoxGeometry(size.x,size.y,size.z,safeSegments,safeRadius)'), 'Bevel must change the underlying mesh geometry instead of only its appearance');
assert.ok(html.includes("if(root.userData.edgeBevel)applyEdgeBevelToRoot(root,root.userData.edgeBevel,root.userData.edgeBevelSegments||3,false)"), 'Edge bevel settings must be reapplied when JSON restores a model');
assert.ok(html.includes('edgeBevel:node.userData.edgeBevel??null'), 'Edge bevel radius must be serialized to project JSON');
assert.ok(html.includes('edgeBevelSegments:node.userData.edgeBevelSegments??null'), 'Edge bevel segment count must be serialized to project JSON');
assert.ok(html.includes("root.userData.edgeBevel=Number(data.edgeBevel)"), 'Edge bevel settings must be restored from serialized objects');
assert.ok(html.includes('function applyPlaneCut()'), 'Plane cut handler must exist');
assert.ok(html.includes('const cutterGeometry=new THREE.BoxGeometry(cutterSize.x,cutterSize.y,cutterSize.z)'), 'Plane cut must use a real subtractive solid to form the cap face');
assert.ok(html.includes('result=CSG.subtract(worldA,cutter)'), 'Plane cut must produce an actual boolean mesh');
assert.ok(html.includes("data.name=source.name+' · corte '+axis.toUpperCase()+' '+percentage+'%'"), 'Plane cut result should be identifiable in the scene hierarchy');
assert.ok(html.includes("modelRoot.remove(source);disposeTree(source);designObjects[sourceIndex]=root"), 'Plane cut should replace the source object while preserving its scene position in the hierarchy');
assert.ok(html.includes("source.userData.designType==='boolean'")===false, 'Avoid requiring a boolean source type in the plane-cut path');
assert.ok(html.includes('reflection.clone().multiply(originalRotation).multiply(reflection)'), 'Mirror must reflect both position and orientation across the chosen plane');
assert.ok(html.includes('data.scale[axisIndex]*=-1'), 'Mirror copy must reverse scale along the reflected axis');
assert.ok(html.includes("$('arraySpacingUnit').textContent=unitSystem"), 'Array spacing must follow the selected measurement system');
assert.ok(html.includes("import { TransformControls } from 'three/addons/controls/TransformControls.js';"), 'Interactive TransformControls module must be imported');
assert.ok(html.includes('new TransformControls(camera,renderer.domElement)'), 'The 3D manipulation gizmo must attach to the active camera and viewport');
assert.ok(html.includes("transformGizmo.setMode(transformMode==='orbit'?'translate':transformMode)"), 'Transform tool mode must initialize correctly');
assert.ok(html.includes('transformGizmo.translationSnap=snapEnabled?snapStep:null'), 'Grid snapping must apply to interactive movement');
assert.ok(html.includes("$('moveBtn').addEventListener('click',()=>setTransformTool('translate'))"), 'Move button must change transform mode');
assert.ok(html.includes("$('rotateBtn').addEventListener('click',()=>setTransformTool('rotate'))"), 'Rotate button must change transform mode');
assert.ok(html.includes("$('scaleBtn').addEventListener('click',()=>setTransformTool('scale'))"), 'Scale button must change transform mode');
assert.ok(html.includes("['g','r','s'].includes(e.key.toLowerCase())"), 'G/R/S keyboard shortcuts must be available');
assert.ok(html.includes("transformGizmo.addEventListener('dragging-changed'"), 'Orbiting must pause during gizmo dragging and history must update');
assert.ok(html.includes('rebuildTransformGizmo();'), 'Manipulator must be rebuilt when switching camera views');
assert.ok(html.includes('root.userData.archOpening=opening'), 'Wall aperture settings must be assigned');
assert.ok(html.includes('archOpening:node.userData.archOpening||null'), 'Wall aperture must serialize');
assert.ok(html.includes("root.userData.archOpening={type:['door','window'].includes(opening.type)?opening.type:'none'"), 'Wall aperture must restore');
assert.ok(html.includes('polygonSides:node.userData.polygonSides||null'), 'Polygon side count must serialize');
assert.ok(html.includes('bevelRadius:node.userData.bevelRadius??null'), 'Bevel radius must serialize');
assert.ok(html.includes('if(!restored)startBlankProject({skipHistory:true,notify:false})'), 'First launch must use a blank scene');
assert.ok(html.includes('function startBlankProject(options={})'), 'New-project action must create a blank scene');

console.log('Modeling tools tests passed: unique IDs, parametric shapes, transforms, arrays, mirrors, booleans, plane cuts, edge bevels and persistence.');
