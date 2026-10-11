import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const start = html.indexOf('function normalizePrompt(text) {');
const end = html.indexOf('function handlePrompt() {', start);
assert.ok(start >= 0 && end > start, 'Could not locate the local scene planner in index.html');

const defaults = 'const architecturalSizeDefaults={wall:[4,2.8,.18],floor:[4,.15,4],door:[.95,2.1,.12],window:[1.4,1.2,.12]};';
const exported = 'globalThis.__scenePlanner={normalizePrompt,promptEntityCatalog,countPromptEntities,parsePromptCount,detectPromptType,promptColorForEntity,promptTextureForEntity,promptArchitecturalSize};';
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(defaults + html.slice(start, end) + exported, sandbox);
const p = sandbox.__scenePlanner;
const prompt = p.normalizePrompt('3 cubos azules y 2 esferas rojas');
const cubes = p.promptEntityCatalog.find(item => item.type === 'cube');
const spheres = p.promptEntityCatalog.find(item => item.type === 'sphere');
assert.equal(p.countPromptEntities(prompt, cubes.aliases), 3, 'Arabic quantities should work');
assert.equal(p.countPromptEntities(prompt, spheres.aliases), 2, 'Two counted groups should not merge');
assert.equal(p.promptColorForEntity(prompt, cubes.aliases, '#000000'), '#82a9ff', 'Color should follow cube');
assert.equal(p.promptColorForEntity(prompt, spheres.aliases, '#000000'), '#f28b72', 'Color should follow sphere');
assert.equal(p.detectPromptType('casa moderna'), 'villa', 'Modern house prompt should pick a building base');

const naturalCounts = p.normalizePrompt('dos paredes de ladrillo y tres pisos de madera');
assert.equal(p.countPromptEntities(naturalCounts, p.promptEntityCatalog.find(item => item.type === 'wall').aliases), 2);
assert.equal(p.countPromptEntities(naturalCounts, p.promptEntityCatalog.find(item => item.type === 'floor').aliases), 3);
assert.equal(p.promptTextureForEntity(naturalCounts, p.promptEntityCatalog.find(item => item.type === 'wall').aliases), 'brick');
assert.equal(p.promptTextureForEntity(naturalCounts, p.promptEntityCatalog.find(item => item.type === 'floor').aliases), 'wood');

const wall = Array.from(p.promptArchitecturalSize('wall', p.normalizePrompt('pared de 4 m de ancho, 3 m de alto y 20 cm de espesor')));
assert.ok(Math.abs(wall[0] - 4) < 1e-9, 'Wall width in meters');
assert.ok(Math.abs(wall[1] - 3) < 1e-9, 'Wall height in meters');
assert.ok(Math.abs(wall[2] - 0.2) < 1e-9, 'Wall thickness conversion from centimetres');

const windowSize = Array.from(p.promptArchitecturalSize('window', p.normalizePrompt('ventana de 120 cm de ancho y 90 cm de alto')));
assert.ok(Math.abs(windowSize[0] - 1.2) < 1e-9, 'Window width conversion');
assert.ok(Math.abs(windowSize[1] - 0.9) < 1e-9, 'Window height conversion');

assert.equal(p.parsePromptCount('', 'cubos'), 2, 'Plural with no quantity should make two objects');

const disk = p.promptEntityCatalog.find(item => item.type === 'disk');
const triangle = p.promptEntityCatalog.find(item => item.type === 'triangle');
assert.ok(disk && triangle, 'Flat and extruded shape aliases should exist');
const geometryPrompt = p.normalizePrompt('2 círculos y un triángulo');
assert.equal(p.countPromptEntities(geometryPrompt, disk.aliases), 2, 'Circle aliases should resolve');
assert.equal(p.countPromptEntities(geometryPrompt, triangle.aliases), 1, 'Triangle aliases should resolve');
assert.equal(p.detectPromptType('un triángulo extruido'), 'triangle', 'Triangle prompt should pick geometry');
assert.equal(p.detectPromptType('círculo'), 'disk', 'Circle prompt should pick disk geometry');
assert.equal(p.detectPromptType('espacio interior abierto'), 'space', 'Interior prompt should pick open room geometry');
console.log('Scene planner tests passed: object counts, per-object colors/textures, dimensions and new modeling shapes.');
