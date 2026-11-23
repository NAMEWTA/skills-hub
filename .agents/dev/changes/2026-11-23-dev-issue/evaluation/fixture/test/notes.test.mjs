import assert from 'node:assert/strict';
import test from 'node:test';
import { listNotes } from '../src/notes.mjs';
const notes = [
  {id:'a',title:'Alpha',body:'one',updatedAt:'2026-11-20',archived:false},
  {id:'b',title:'Beta',body:'two',updatedAt:'2026-11-21',archived:false},
  {id:'c',title:'Alpha old',body:'three',updatedAt:'2026-11-22',archived:true},
];
test('list excludes archived and orders newest first',()=>assert.deepEqual(listNotes(notes).map(x=>x.id),['b','a']));
test('search is case insensitive',()=>assert.deepEqual(listNotes(notes,'ALPHA').map(x=>x.id),['a']));
