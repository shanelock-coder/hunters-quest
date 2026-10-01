import {CARDS} from './content.js';import {alphabet,displayText} from './scripts.js';import {shuffle,selectItems,checkTranslation,makeOptions} from './learning.js';import {makeProblem,checkMathAnswer,TOPICS} from './maths.js';
export const MODES=[{id:'quiz',name:'Word quest',tag:'ENGLISH → CROATIAN',icon:'flag',color:'yellow',desc:'Find the Croatian words. Collect a little confidence.'},{id:'recall',name:'Reverse quest',tag:'CROATIAN → ENGLISH',icon:'swap',color:'aqua',desc:'Read it in Croatian. Tell us what it means.'},{id:'memory',name:'Memory match',tag:'FIND THE PAIRS',icon:'cards',color:'purple',desc:'Turn, remember, and match the two languages.'},{id:'flash',name:'Flashcard flip',tag:'STUDY + RECALL',icon:'bolt',color:'coral',desc:'Explore eight cards, then check your memory.'},{id:'build',name:'Sentence builder',tag:'PUT IT TOGETHER',icon:'blocks',color:'green',desc:'Arrange the words into a brilliant little sentence.'},{id:'type',name:'Type it out',tag:'ACTIVE RECALL',icon:'pencil',color:'aqua',desc:'A small clue. A big “I remembered!” moment.'},{id:'maths',name:'Maths missions',tag:'NUMBER POWER',icon:'calculator',color:'yellow',desc:'Solve it with blocks, potions, music, and more.'},{id:'letters',name:'Script switch',tag:'LATIN ↔ CYRILLIC',icon:'letters',color:'purple',desc:'Meet a new alphabet, one friendly letter at a time.'}];
function question(card,mode,script,direction,pool){const target=direction==='hr-en'?card.en:displayText(card,script);return {id:card.id,card,script,direction,subject:'croatian',mode,target,prompt:direction==='hr-en'?displayText(card,script):card.en,options:makeOptions(card,pool,direction,script),tokens:shuffle(target.split(/\s+/).map((text,id)=>({id,text}))),retried:false};}
export function createSession(options={},state){
 const {mode='quiz',world='all',topic='mixed',script=state.settings.script,level=state.settings.level}=options;const direction=options.direction||(mode==='recall'?'hr-en':'en-hr');
 const s={id:crypto.randomUUID(),mode,world,topic,index:0,phase:mode==='flash'?'study':'question',hints:0,revealed:false,response:null,answers:[],items:[],selected:[],typed:'',open:[],found:[],mistakes:[],tiles:[],started:Date.now()};
 let pool=world==='all'?CARDS:CARDS.filter(c=>c.world===world);if(mode==='build')pool=pool.filter(c=>c.hr.split(/\s+/).length>=3);
 if(mode==='maths'){
  const todayEvents=Object.values(state.days).flatMap(d=>d.events).filter(e=>e.subject==='maths');
  const weakness=id=>todayEvents.filter(e=>e.topic===id&&!e.correct).length;
  const topics=topic==='mixed'?[...TOPICS].sort((a,b)=>weakness(b.id)-weakness(a.id)).map(t=>t.id):[topic];const used=new Set(),base=Math.floor(Math.random()*1e9);
  for(let i=0;i<10;i++){let p,tries=0;do{p=makeProblem(topics[i%topics.length],level,base+i*100+tries++);}while(used.has(p.id)&&tries<100);used.add(p.id);s.items.push({id:p.id,card:p,subject:'maths',script:'none',direction:'math',mode,prompt:p.prompt,target:String(p.answer),options:[],retried:false});}
 }else if(mode==='letters'){
  s.items=shuffle(alphabet).slice(0,10).map((a,i)=>{const dir=i%2===0,target=dir?a.latin:a.cyrillic;return {id:a.latin,card:a,subject:'alphabet',script:'cyrillic',direction:'script',mode,prompt:dir?a.cyrillic:a.latin,target,options:shuffle([target,...shuffle(alphabet.filter(b=>b!==a)).slice(0,3).map(b=>dir?b.latin:b.cyrillic)]),retried:false};});
 }else{
  const chosen=selectItems(pool,state.mastery,{count:mode==='memory'?5:mode==='flash'?8:10,script:script==='mixed'?'latin':script,direction:mode==='memory'?'match':direction,recent:state.recent});
  s.items=chosen.map((c,i)=>question(c,mode,script==='mixed'?(i%3===2?'cyrillic':'latin'):script,direction,pool));
  if(mode==='memory'){s.tiles=shuffle(s.items.flatMap(q=>[{key:q.id+'-en',id:q.id,side:'en',text:q.card.en},{key:q.id+'-hr',id:q.id,side:'hr',text:displayText(q.card,q.script)}]));}
 }
 s.originalLength=s.items.length;return s;
}
export const currentQuestion=s=>s.items[s.index];
export function answerQuestion(s,input,now=Date.now(),reveal=false){
 if(s.response||s.phase!=='question'||s.mode==='memory')return null;const q=currentQuestion(s);if(!q)return null;
 let result;if(reveal)result={correct:false,model:q.target};else if(q.subject==='maths')result={correct:checkMathAnswer(q.card,input),empty:!String(input).trim(),model:q.target};else if(q.subject==='alphabet')result={correct:input===q.target,model:q.target};else result=checkTranslation(q.card,input,q.direction,q.script);
 if(result.empty)return {empty:true};
 const event={id:`${s.id}-${s.index}`,timestamp:now,item:q.id,subject:q.subject,direction:q.direction,game:s.mode,script:q.script,topic:q.card.topic||q.card.world||'alphabet',correct:result.correct,first:!q.retried,hints:s.hints,revealed:reveal};
 s.response={...result,event,input,revealed:reveal};s.answers.push(event);
 if(!result.correct&&!q.retried&&s.items.length< s.originalLength+5)s.items.splice(Math.min(s.index+4,s.items.length),0,{...q,retried:true});
 return s.response;
}
export function advance(s){s.index++;s.response=null;s.hints=0;s.revealed=false;s.selected=[];s.typed='';if(s.index>=s.items.length)s.phase='done';}
export function studyNext(s){if(s.phase!=='study')return;s.index++;s.revealed=false;if(s.index>=s.items.length){s.index=0;s.phase='question';}}
export function flipMemory(s,key,now=Date.now()){
 const tile=s.tiles.find(t=>t.key===key);if(!tile||s.found.includes(tile.id)||s.open.includes(key)||s.open.length>=2)return null;s.open.push(key);if(s.open.length<2)return {pending:true};
 const [a,b]=s.open.map(k=>s.tiles.find(t=>t.key===k));if(a.id!==b.id||a.side===b.side){s.mistakes.push(a.id,b.id);const q=s.items.find(x=>x.id===a.id);const event={id:s.id+'-miss-'+s.answers.length,timestamp:now,item:a.id,subject:'croatian',direction:'match',game:'memory',script:q.script,topic:q.card.world,correct:false,first:false,hints:0,revealed:false};s.answers.push(event);return {match:false,event};}
 const q=s.items.find(x=>x.id===a.id);s.found.push(a.id);s.open=[];const event={id:`${s.id}-${a.id}`,timestamp:now,item:a.id,subject:'croatian',direction:'match',game:'memory',script:q.script,topic:q.card.world,correct:true,first:!s.mistakes.includes(a.id),hints:0,revealed:false};s.answers.push(event);if(s.found.length===s.items.length)s.phase='done';return {match:true,event};
}
