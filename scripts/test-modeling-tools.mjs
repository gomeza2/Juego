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
  'orbitBtn', 'moveBtn', 'rotateBtn', 'scaleBtn'
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

console.log('Modeling tools tests passed: unique IDs, UI references, parametric shapes, XYZ scaling, wall apertures, save/restore and blank startup.');
