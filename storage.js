import {freshState,GAME_IDS,RULES,weeklyStatus} from './progress.js';
import {validDay,weekKey,dayKey} from './calendar.js';
export const KEY='hunters.quest.v1';
export function validateState(input){
  const fail=()=>{throw Error('This backup is incomplete or invalid. Existing progress has not been changed.');};
  const obj=x=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;
  const num=(n,max=8.64e15)=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=max;
  const str=(s,n=200)=>typeof s==='string'&&s.length<=n;
  function scan(x,depth=0){if(depth>12)fail();if(x&&typeof x==='object'){for(const k of Object.keys(x)){if(['__proto__','constructor','prototype'].includes(k))fail();scan(x[k],depth+1);}}}scan(input);
  if(!obj(input)||input.version!==1||!Number.isInteger(input.revision)||input.revision<0||typeof input.setup!=='boolean')fail();
  for(const k of ['created','updated','lastWall'])if(!num(input[k]))fail();
  for(const k of ['settings','pinFailures','days','weeks','mastery','letters'])if(!obj(input[k]))fail();
  const q=input.settings;if(!str(q.name,40)||!['latin','cyrillic','mixed'].includes(q.script)||!['intro','steady','stretch'].includes(q.level)||typeof q.sound!=='boolean'||!str(q.timezone,80))fail();try{dayKey(0,q.timezone);}catch{fail();}
  if(input.parent!==null&&(!obj(input.parent)||!str(input.parent.salt,64)||!/^[0-9a-f]{32}$/.test(input.parent.salt)||!/^[0-9a-f]{64}$/.test(input.parent.hash)||input.parent.iterations!==120000))fail();
  if(input.setup&&!input.parent)fail();if(!num(input.pinFailures.count,5)||!Number.isInteger(input.pinFailures.count)||!num(input.pinFailures.until))fail();
  if(!Array.isArray(input.recent)||input.recent.length>1000||input.recent.some(x=>!str(x)))fail();
  if(Object.keys(input.days).length>10000)fail();
  for(const [day,d] of Object.entries(input.days)){
    if(!validDay(day)||!obj(d)||!num(d.seconds,86400)||!num(d.approvedAt)||!num(d.reviewedAt)||!Array.isArray(d.events)||d.events.length>10000||!Array.isArray(d.flags)||d.flags.some(x=>!str(x)))fail();
    if(d.assistance!==undefined&&(!obj(d.assistance)||Object.entries(d.assistance).some(([k,v])=>!str(k)||!num(v))))fail();if(!input.weeks[weekKey(day)])fail();const ids=new Set();
    for(const e of d.events){if(!obj(e)||!str(e.id)||!e.id||ids.has(e.id)||!num(e.timestamp)||dayKey(e.timestamp,input.weeks[weekKey(day)].timezone)!==day||!str(e.item)||!e.item||!GAME_IDS.includes(e.game)||!['croatian','maths','alphabet'].includes(e.subject)||!['en-hr','hr-en','math','match','script'].includes(e.direction)||!['latin','cyrillic','none'].includes(e.script)||typeof e.correct!=='boolean'||typeof e.first!=='boolean'||typeof e.revealed!=='boolean'||!Number.isInteger(e.hints)||!num(e.hints,3))fail();if(e.subject==='maths'&&(e.direction!=='math'||!str(e.topic)||!e.topic))fail();if(e.subject==='croatian'&&!['en-hr','hr-en','match'].includes(e.direction))fail();if(e.subject==='alphabet'&&e.direction!=='script')fail();ids.add(e.id);}
  }
  for(const [w,d] of Object.entries(input.weeks)){
    if(!validDay(w)||weekKey(w)!==w||!obj(d)||!obj(d.rules)||!num(d.paidAt)||!str(d.timezone,80)||!['intro','steady','stretch'].includes(d.level))fail();
    try{dayKey(0,d.timezone);}catch{fail();}for(const [k,v] of Object.entries(RULES))if(d.rules[k]!==v)fail();
    if(d.paidAt&&!weeklyStatus(input,w).earned)fail();
  }
  for(const [k,m] of Object.entries(input.mastery)){if(!str(k)||!obj(m))fail();for(const f of ['seen','correct','lapses','streak','last','due','level'])if(!num(m[f]))fail();if(m.correct>m.seen||m.lapses>m.seen)fail();}
  for(const [k,m] of Object.entries(input.letters)){if(!str(k)||!obj(m)||!num(m.attempts)||!num(m.passed)||m.passed>m.attempts)fail();}
  return structuredClone(input);
}
export function loadState(store){try{store??=localStorage;const raw=store.getItem(KEY);return {state:raw?validateState(JSON.parse(raw)):freshState(),error:null};}catch(e){return {state:freshState(),error:'Browser storage is unavailable or saved progress could not be read. Existing data has not been changed. Allow site storage or use the parent recovery screen.'};}}
export function saveState(state,expectedRevision,store=localStorage){
  const raw=store.getItem(KEY),old=raw?JSON.parse(raw):null;if((old?.revision||0)!==expectedRevision)throw Error('Progress changed in another tab. Reload this tab before continuing.');
  const next={...state,revision:expectedRevision+1,updated:Date.now()};store.setItem(KEY,JSON.stringify(next));state.revision=next.revision;state.updated=next.updated;return state.revision;
}

export function mutateSaved(state,mutate,store){const next=structuredClone(state);mutate(next);saveState(next,state.revision,store);return next;}
