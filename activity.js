import {dayKey} from './calendar.js';import {addActiveSeconds,ensureDay} from './progress.js';
export class ActiveClock{
 constructor(now=performance.now()){this.last=now;this.action=-Infinity;}
 touch(now=performance.now()){this.last=Math.max(this.last,now);this.action=now;}
 pause(now=performance.now()){this.last=Math.max(this.last,now);this.action=-Infinity;}
 sampleInterval(now=performance.now(),eligible=true){if(now<this.last)return null;const start=this.last,end=Math.min(now,this.action+30000,start+30000);this.last=now;return eligible&&end>start?{start,end}:null;}
 sample(now=performance.now(),eligible=true){const interval=this.sampleInterval(now,eligible);return interval?(interval.end-interval.start)/1000:0;}
}
export function creditInterval(state,interval,monoNow,wallNow){
 if(!interval)return 0;if(wallNow<state.lastWall-120000){ensureDay(state,wallNow);return 0;}
 const start=wallNow-(monoNow-interval.start),end=wallNow-(monoNow-interval.end),seconds=(end-start)/1000;
 if(seconds<=0||seconds>30)return 0;const timezone=state.settings.timezone,startDay=dayKey(start,timezone);
 if(startDay===dayKey(end,timezone))return addActiveSeconds(state,end,seconds);
 let lo=start,hi=end;while(hi-lo>1){const mid=Math.floor((lo+hi)/2);if(dayKey(mid,timezone)===startDay)lo=mid;else hi=mid;}
 return addActiveSeconds(state,lo,(hi-start)/1000)+addActiveSeconds(state,end,(end-hi)/1000);
}
