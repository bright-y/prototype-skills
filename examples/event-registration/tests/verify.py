#!/usr/bin/env python3
"""Dependency-free checks for this teaching example. Requires existing Python 3 + Node."""
from pathlib import Path
import hashlib
import re
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
NODE = shutil.which('node')
if not NODE:
    sys.exit('Node is required for JavaScript checks. No packages are installed by this script.')

def run_node(source, *args):
    result = subprocess.run([NODE, '-e', source, *map(str, args)], capture_output=True, text=True)
    if result.returncode:
        sys.exit(result.stdout + result.stderr)
    print(result.stdout.strip()) if result.stdout.strip() else None

source = (ROOT / 'before/index.html').read_text()
split = (ROOT / 'after-split/index.html').read_text()
scripts = re.findall(r'<script src="([^"]+)"></script>', split)
css = (ROOT / 'after-split/assets/styles.css').read_text()
combined = '\n'.join(f'/* Source section: {name} */\n{(ROOT / "after-split" / name).read_text()}' for name in scripts)
assert re.search(r'<style>\n(.*?)</style>', source, re.S).group(1) == css, 'Styles changed during extraction'
assert re.search(r'<script>\n(.*?)</script>', source, re.S).group(1) == combined, 'Scripts changed during extraction'
clean_source = re.sub(r'  <style>.*?</style>\n|  <script>.*?</script>\n', '', source, flags=re.S)
clean_split = re.sub(r'  <link rel="stylesheet"[^>]+>\n|  <script src="[^"]+"></script>\n', '', split)
assert clean_source == clean_split, 'HTML shell changed during extraction'
print('PASS source extraction: identical HTML shell, CSS and ordered JavaScript')

paths = {}
for version in ('after-split', 'after-change'):
    paths[version] = {p.relative_to(ROOT / version).as_posix(): p for p in (ROOT / version).rglob('*') if p.is_file()}
assert paths['after-split'].keys() == paths['after-change'].keys()
changed = [name for name in sorted(paths['after-split']) if paths['after-split'][name].read_bytes() != paths['after-change'][name].read_bytes()]
assert changed == ['assets/js/fields.js', 'assets/js/store.js'], changed
print('PASS maintenance scope: only fields.js and store.js changed')

for page in ROOT.rglob('*.html'):
    html = page.read_text()
    for value in re.findall(r'(?:src|href)="([^"]+)"', html):
        if value.startswith('#'):
            continue
        assert not re.match(r'(?:https?:)?//', value), f'External dependency: {page}: {value}'
        relative = value.split('#', 1)[0].split('?', 1)[0]
        assert (page.parent / relative).exists(), f'Missing link: {page}: {value}'
    for inline in re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>', html, re.S):
        if inline.strip():
            result = subprocess.run([NODE, '--check'], input=inline, capture_output=True, text=True)
            assert result.returncode == 0, f'{page}: {result.stderr}'
for script in ROOT.rglob('*.js'):
    result = subprocess.run([NODE, '--check', str(script)], capture_output=True, text=True)
    assert result.returncode == 0, result.stderr
print('PASS local HTML links, offline resources and recursive JavaScript syntax')

run_node(r'''
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const root = process.argv[1];
function environment(version) {
  const values = new Map();
  const storage = {getItem: key => values.has(key) ? values.get(key) : null, setItem: (key, value) => values.set(key, value)};
  const sandbox = {window: {localStorage: storage}};
  vm.createContext(sandbox);
  for (const file of ['fields.js', 'store.js']) vm.runInContext(fs.readFileSync(path.join(root, version, 'assets/js', file), 'utf8'), sandbox);
  return {D: sandbox.window.WeekendDemo, values, storage};
}
const base = environment('after-split');
const changed = environment('after-change');
const person = {name: '演示参与者', email: 'demo@example.com'};
assert.equal(Object.keys(base.D.validate(person)).length, 0);
assert.ok(changed.D.validate(person).phone);
assert.ok(changed.D.validate({...person, phone: '12345'}).phone);
assert.equal(Object.keys(changed.D.validate({...person, phone: '13800000000'})).length, 0);
assert.ok(base.D.validate({name: '', email: 'invalid'}).name);
assert.ok(base.D.validate({name: '', email: 'invalid'}).email);
console.log('PASS required name/email and new mainland mobile validation');
const old = {id: 'legacy-1', eventId: 'prototype-workshop', ...person, createdAt: '2026-11-01T00:00:00Z', custom: {note: 'keep me'}};
base.D.store.save(old);
const baselineRecord = base.D.store.find('legacy-1');
assert.equal(baselineRecord.phone, undefined);
changed.values.set(changed.D.storageKey, JSON.stringify([old]));
const first = JSON.parse(JSON.stringify(changed.D.store.find('legacy-1')));
assert.deepEqual(first, old);
assert.match(changed.D.details(first), /未填写（旧记录）/);
const newRecord = {id: 'new-1', eventId: 'prototype-workshop', ...person, phone: '13800000000', createdAt: '2026-11-09T00:00:00Z'};
changed.D.store.save(newRecord);
changed.D.store.save(newRecord);
assert.equal(changed.D.store.all().length, 2);
assert.equal(changed.D.store.find('new-1').phone, newRecord.phone);
assert.deepEqual(JSON.parse(JSON.stringify(changed.D.store.find('legacy-1'))), old);
const reopened = changed.D.createStore(changed.storage);
assert.equal(reopened.find('new-1').phone, newRecord.phone);
console.log('PASS legacy data preserved, mobile saved, reopened store and duplicate-id protection');
changed.values.set(changed.D.storageKey, '{broken');
assert.throws(() => changed.D.store.save({...newRecord, id: 'must-not-save'}));
assert.equal(changed.values.get(changed.D.storageKey), '{broken');
const blocked = changed.D.createStore({getItem: () => null, setItem: () => {throw new Error('quota');}});
assert.throws(() => blocked.save(newRecord), /暂时无法保存/);
assert.equal(changed.D.escape('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
assert.ok(!changed.D.details({...person, name: '<script>bad</script>'}).includes('<script>'));
console.log('PASS corrupt data retained, storage errors surfaced and text rendered safely');
''', ROOT)
print('SOURCE_SHA256', hashlib.sha256((ROOT / 'before/index.html').read_bytes()).hexdigest())
print('ALL CHECKS PASSED. Browser interactions and screenshots are separate checks.')
