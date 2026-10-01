export class ActiveClock{
 constructor(now=performance.now()){this.last=now;this.action=-Infinity;}
 touch(now=performance.now()){this.last=Math.max(this.last,now);this.action=now;}
 pause(now=performance.now()){this.last=Math.max(this.last,now);this.action=-Infinity;}
 sample(now=performance.now(),eligible=true){if(now<this.last)return 0;const end=Math.min(now,this.action+30000),delta=eligible?Math.max(0,Math.min(30,(end-this.last)/1000)):0;this.last=now;return delta;}
}
