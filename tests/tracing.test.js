import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreStroke,glyphFor,LATIN_LETTERS,CYRILLIC_LETTERS} from '../tracing.js';
test('an accurate full stroke passes',()=>{const p=[[20,80],[50,15],[80,80]];assert.ok(scoreStroke(p,p).pass);});
test('empty input, taps and incomplete marks fail',()=>{const p=[[20,20],[80,80]];assert.equal(scoreStroke([],p).pass,false);assert.equal(scoreStroke([[20,20]],p).pass,false);assert.equal(scoreStroke([[20,20],[30,30]],p).pass,false);});
test('a reverse stroke cannot pass',()=>{const p=[[20,20],[80,80]];assert.equal(scoreStroke([...p].reverse(),p).pass,false);});
test('closed letters also reject the reverse stroke direction',()=>{for(const letter of ['O','О','Ф']){const p=glyphFor(letter)[0];assert.equal(scoreStroke([...p].reverse(),p).pass,false,letter);}});
test('covering the area with a scribble fails',()=>{const p=[[20,20],[80,80]],scribble=Array.from({length:100},(_,i)=>[i%2?0:100,i]);assert.equal(scoreStroke(scribble,p).pass,false);});
test('every letter has stroke geometry, including digraphs',()=>{for(const x of [...LATIN_LETTERS,...CYRILLIC_LETTERS]){const g=glyphFor(x);assert.ok(g.length>0,x);assert.ok(g.every(p=>p.length>=2),x);}});
