import {dayKey,weekKey,weekDays} from './calendar.js';
export const RULES=Object.freeze({seconds:900,games:3,perGame:5,enHr:10,hrEn:10,maths:10,independent:5,mathTopics:2,days:5,amount:10});
export const GAME_IDS=['quiz','recall','memory','flash','build','type','maths','letters','trace'];
export function freshState(){return {version:1,revision:0,created:Date.now(),updated:0,lastWall:0,setup:false,settings:{name:'Hunter',timezone:'Australia/Brisbane',script:'mixed',level:'steady',sound:true},parent:null,pinFailures:{count:0,until:0},days:{},weeks:{},mastery:{},letters:{},recent:[]};}
export function ensureDay(state,timestamp){
  const day=dayKey(timestamp,state.settings.timezone),week=weekKey(day);
  state.weeks[week]??={rules:{...RULES},timezone:state.settings.timezone,level:state.settings.level,paidAt:0};
  state.days[day]??={seconds:0,events:[],approvedAt:0,flags:[],reviewedAt:0};
  if(timestamp<state.lastWall-120000&&!state.days[day].flags.includes('Device clock moved backwards'))state.days[day].flags.push('Device clock moved backwards');
  state.lastWall=Math.max(state.lastWall,timestamp);return {day,entry:state.days[day],week};
}
export function recordEvidence(state,event){
  const {entry}=ensureDay(state,event.timestamp);
  if(entry.events.some(x=>x.id===event.id))return false;
  entry.events.push({...event});return true;
}
export function addActiveSeconds(state,timestamp,seconds){
  if(!Number.isFinite(seconds)||seconds<0||seconds>30)throw Error('Invalid active-time increment');
  const {entry}=ensureDay(state,timestamp);entry.seconds=Math.min(86400,entry.seconds+seconds);
}
export function dailyStatus(state,day){
  const d=state.days[day]||{seconds:0,events:[],approvedAt:0,flags:[],reviewedAt:0};
  const rules=state.weeks[weekKey(day)]?.rules||RULES;
  const accepted=new Map(),games={},mathTopics=new Set();let enHr=0,hrEn=0,maths=0,indEn=0,indHr=0;
  for(const e of d.events){
    if(!e.correct||e.revealed||e.game==='trace')continue;
    const key=`${e.subject}:${e.item}:${e.direction}`;
    if(accepted.has(key))continue;accepted.set(key,e);games[e.game]=(games[e.game]||0)+1;
    if(e.direction==='en-hr'){enHr++;if(e.first&&e.hints===0)indEn++;}
    if(e.direction==='hr-en'){hrEn++;if(e.first&&e.hints===0)indHr++;}
    if(e.subject==='maths'){maths++;mathTopics.add(e.topic);}
  }
  const gameCount=Object.values(games).filter(n=>n>=rules.perGame).length;
  const complete=d.seconds>=rules.seconds&&gameCount>=rules.games&&enHr>=rules.enHr&&hrEn>=rules.hrEn&&maths>=rules.maths&&indEn>=rules.independent&&indHr>=rules.independent&&mathTopics.size>=rules.mathTopics;
  return {day,seconds:d.seconds,enHr,hrEn,maths,indEn,indHr,games,gameCount,mathTopics:mathTopics.size,total:accepted.size,attempts:d.events.length,correct:d.events.filter(e=>e.correct).length,hints:d.events.reduce((n,e)=>n+e.hints,0),cyrillic:d.events.filter(e=>e.script==='cyrillic').length,complete,approved:complete&&d.approvedAt>0,approvedAt:d.approvedAt,flags:d.flags,reviewedAt:d.reviewedAt,rules};
}
export function weeklyStatus(state,week){
  const days=weekDays(week).map(d=>dailyStatus(state,d)),rules=state.weeks[week]?.rules||RULES,approved=days.filter(d=>d.approved).length;
  return {week,days,approved,complete:days.filter(d=>d.complete).length,earned:approved>=rules.days,amount:approved>=rules.days?rules.amount:0,paidAt:state.weeks[week]?.paidAt||0,seconds:days.reduce((n,d)=>n+d.seconds,0),total:days.reduce((n,d)=>n+d.total,0),rules};
}
export function approveDay(state,day,timestamp=Date.now(),acknowledge=false){
  const status=dailyStatus(state,day);if(!status.complete)throw Error('This day has not completed all quest requirements.');
  if(day>dayKey(timestamp,state.settings.timezone))throw Error('A future day cannot be approved.');
  if(status.flags.length&&!status.reviewedAt&&!acknowledge)throw Error('Review the clock warning before approving this day.');
  const d=state.days[day];if(acknowledge)d.reviewedAt=timestamp;d.approvedAt||=timestamp;return true;
}
export function markPaid(state,week,timestamp=Date.now()){
  const s=weeklyStatus(state,week);if(!s.earned)throw Error('Five qualifying days need parent approval first.');if(s.paidAt)throw Error('This reward is already marked paid.');state.weeks[week].paidAt=timestamp;
}
