export const LATIN_LETTERS=['A','B','C','Č','Ć','D','DŽ','Đ','E','F','G','H','I','J','K','L','LJ','M','N','NJ','O','P','R','S','Š','T','U','V','Z','Ž'];
export const CYRILLIC_LETTERS=['А','Б','В','Г','Д','Ђ','Е','Ж','З','И','Ј','К','Л','Љ','М','Н','Њ','О','П','Р','С','Т','Ћ','У','Ф','Х','Ц','Ч','Џ','Ш'];
const arc=(cx,cy,rx,ry,a,b,n=30)=>Array.from({length:n+1},(_,i)=>{const t=(a+(b-a)*i/n)*Math.PI/180;return [cx+rx*Math.cos(t),cy+ry*Math.sin(t)];});
const P={
 A:[[[20,85],[50,15],[80,85]],[[32,57],[68,57]]],
 B:[[[25,15],[25,85]],[[25,15],[52,15],...arc(52,32,23,17,-90,90)],[[25,49],[53,49],...arc(53,67,25,18,-90,90),[25,85]]],
 C:[arc(52,50,32,35,-45,-315)],
 D:[[[24,15],[24,85]],[[24,15],[42,15],...arc(42,50,36,35,-90,90),[24,85]]],
 E:[[[76,15],[24,15],[24,85],[76,85]],[[24,49],[66,49]]],
 F:[[[76,15],[24,15],[24,85]],[[24,49],[66,49]]],
 G:[[...arc(52,50,33,35,-45,-315),[78,51],[54,51]]],
 H:[[[23,15],[23,85]],[[77,15],[77,85]],[[23,50],[77,50]]],
 I:[[[32,15],[68,15]],[[50,15],[50,85]],[[32,85],[68,85]]],
 J:[[[74,15],[74,64],...arc(49,64,25,21,0,180)]],
 K:[[[25,15],[25,85]],[[76,15],[25,51],[78,85]]],
 L:[[[25,15],[25,85],[77,85]]],
 M:[[[18,85],[18,15],[50,57],[82,15],[82,85]]],
 N:[[[23,85],[23,15],[77,85],[77,15]]],
 O:[arc(50,50,32,35,-90,-450,40)],
 P:[[[25,85],[25,15],[51,15],...arc(51,33,26,18,-90,90),[25,51]]],
 R:[[[25,85],[25,15],[51,15],...arc(51,33,26,18,-90,90),[25,51]],[[51,51],[79,85]]],
 S:[[...arc(50,33,29,18,-30,-270,24),...arc(50,67,30,18,-90,145,24)]],
 T:[[[18,15],[82,15]],[[50,15],[50,85]]],
 U:[[[22,15],[22,60],...arc(50,60,28,25,180,0),[78,15]]],
 V:[[[18,15],[50,85],[82,15]]],
 Z:[[[22,15],[78,15],[22,85],[78,85]]]
};
const shrink=p=>p.map(s=>s.map(([x,y])=>[x,y*.84+12]));
const hat=[[[38,8],[50,18],[62,8]]];
P['Č']=[...shrink(P.C),...hat];P['Ć']=[...shrink(P.C),[[45,17],[60,6]]];P['Š']=[...shrink(P.S),...hat];P['Ž']=[...shrink(P.Z),...hat];P['Đ']=[...P.D,[[12,49],[53,49]]];
const combine=(a,b)=>[...a.map(s=>s.map(([x,y])=>[x*.49,y])),...b.map(s=>s.map(([x,y])=>[51+x*.49,y]))];
P.LJ=combine(P.L,P.J);P.NJ=combine(P.N,P.J);P['DŽ']=combine(P.D,P['Ž']);
Object.assign(P,{'А':P.A,'Б':[[[75,15],[25,15],[25,85],[50,85],...arc(50,65,28,20,90,-90),[25,45]]],'В':P.B,'Г':[[[25,85],[25,15],[79,15]]],'Д':[[[18,78],[30,15],[67,15],[79,78]],[[12,92],[12,78],[87,78],[87,92]]],'Е':P.E,'Ж':[[[18,15],[50,50],[18,85]],[[50,15],[50,85]],[[82,15],[50,50],[82,85]]],'З':[[...arc(46,32,27,18,-145,90),...arc(46,67,30,18,-90,145)]],'И':[[[23,15],[23,85],[77,15],[77,85]]],'Ј':P.J,'К':P.K,'Л':[[[17,85],[33,15],[76,15],[76,85]]],'М':P.M,'Н':P.H,'О':P.O,'П':[[[23,85],[23,15],[77,15],[77,85]]],'Р':P.P,'С':P.C,'Т':P.T,'У':[[[20,15],[49,55]],[[80,15],[45,75],[25,85]]],'Ф':[arc(50,49,33,26,-90,-450,40),[[50,10],[50,90]]],'Х':[[[22,15],[78,85]],[[78,15],[22,85]]],'Ц':[[[20,15],[20,80],[72,80],[72,15]],[[72,80],[85,80],[85,93]]],'Ч':[[[22,15],[22,48],[76,48]],[[76,15],[76,85]]],'Ш':[[[17,15],[17,85],[83,85],[83,15]],[[50,15],[50,85]]]});
P['Ћ']=[[[15,15],[70,15]],[[36,15],[36,85]],[[36,49],[62,42],[78,52],[78,85]]];
P['Ђ']=[[[15,15],[70,15]],[[36,15],[36,85]],[[36,49],[62,42],[78,52],[78,76],[63,90]]];
P['Љ']=combine(P['Л'],[[[25,15],[25,85],[50,85],...arc(50,65,27,20,90,-90),[25,45]]]);
P['Њ']=combine(P['Н'],[[[25,15],[25,85],[50,85],...arc(50,65,27,20,90,-90),[25,45]]]);
P['Џ']=[[[20,15],[20,80],[80,80],[80,15]],[[50,80],[50,94]]];
export const glyphFor=letter=>P[letter.toUpperCase()]||[];
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const length=p=>p.slice(1).reduce((n,b,i)=>n+distance(p[i],b),0);
function resample(p,step=2){const out=[];for(let i=1;i<p.length;i++){const a=p[i-1],b=p[i],n=Math.max(1,Math.ceil(distance(a,b)/step));for(let j=0;j<n;j++)out.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);}if(p.length)out.push(p.at(-1));return out;}
const near=(p,points,tolerance=6)=>points.some(q=>distance(p,q)<=tolerance);
export function scoreStroke(drawn,target){
 if(drawn.length<2||!target.length)return {pass:false,coverage:0,precision:0,score:0,message:'Start at the numbered dot and follow the whole stroke.'};
 const d=resample(drawn),t=resample(target),coverage=t.filter(p=>near(p,d)).length/t.length,precision=d.filter(p=>near(p,t)).length/d.length;
 const starts=distance(drawn[0],target[0])<13,ends=distance(drawn.at(-1),target.at(-1))<14,ratio=length(drawn)/length(target);
 const ordered=d.filter((p,i)=>{const at=i/(d.length-1)*(t.length-1),margin=Math.ceil(t.length*.18);return near(p,t.slice(Math.max(0,Math.floor(at)-margin),Math.min(t.length,Math.ceil(at)+margin+1)));}).length/d.length;
 const pass=coverage>=.82&&precision>=.78&&ordered>=.8&&starts&&ends&&ratio>.7&&ratio<1.85;
 return {pass,coverage,precision,score:Math.round((coverage*.55+precision*.45)*100),message:!starts?'Begin at the numbered dot.':!ends?'Keep going to the end of this stroke.':ordered<.8?'Follow the demonstrated direction. Use “Show the stroke” to see it.':ratio>=1.85||precision<.78?'Follow the guide more closely; avoid extra loops.':coverage<.82?'Trace the whole highlighted stroke.':pass?'Stroke complete.':'Try that stroke once more.'};
}
export class LetterTracer {
 constructor(canvas,letter,onUpdate){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.letter=letter;this.paths=glyphFor(letter);this.onUpdate=onUpdate;this.accepted=[];this.drawn=[];this.index=0;this.scores=[];this.active=false;this.demoFrame=0;
  this.down=e=>{if(this.active||this.index>=this.paths.length||this.demoFrame)return;e.preventDefault();canvas.setPointerCapture(e.pointerId);this.pointerId=e.pointerId;this.active=true;this.drawn=[this.point(e)];this.paint();};
  this.move=e=>{if(!this.active||e.pointerId!==this.pointerId)return;this.drawn.push(this.point(e));this.paint();};
  this.up=e=>{if(!this.active||e.pointerId!==this.pointerId)return;this.active=false;const r=scoreStroke(this.drawn,this.paths[this.index]);if(r.pass){this.accepted.push(this.drawn);this.scores.push(r.score);this.index++;}this.drawn=[];this.paint();this.onUpdate({...r,index:this.index,total:this.paths.length,complete:this.index===this.paths.length,score:Math.round(this.scores.reduce((a,b)=>a+b,0)/(this.scores.length||1))});};
  this.cancel=()=>{this.active=false;this.drawn=[];this.paint();};
  canvas.addEventListener('pointerdown',this.down);canvas.addEventListener('pointermove',this.move);canvas.addEventListener('pointerup',this.up);canvas.addEventListener('pointercancel',this.cancel);this.paint();
 }
 point(e){const r=this.canvas.getBoundingClientRect();return [(e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100];}
 line(path,color,width,dash=[]){if(!path.length)return;const c=this.ctx;c.beginPath();c.setLineDash(dash);c.strokeStyle=color;c.lineWidth=width;c.moveTo(...path[0]);for(const p of path.slice(1))c.lineTo(...p);c.stroke();c.setLineDash([]);}
 paint(preview){const c=this.ctx;c.setTransform(this.canvas.width/100,0,0,this.canvas.height/100,0,0);c.clearRect(0,0,100,100);c.lineCap='round';c.lineJoin='round';for(const y of [15,50,85])this.line([[5,y],[95,y]],'#303747',.35,[1,2]);
  this.paths.forEach((p,i)=>this.line(p,i<this.index?'#6eddbb':i===this.index?'#646d86':'#343c50',2.5));
  this.accepted.forEach(p=>this.line(p,'#6eddbb',1.7));this.line(this.drawn,'#f5cc79',1.8);if(preview)this.line(preview,'#f5cc79',2);
  if(this.index<this.paths.length){const p=this.paths[this.index][0];c.beginPath();c.fillStyle='#f5cc79';c.arc(p[0],p[1],4.2,0,Math.PI*2);c.fill();c.fillStyle='#10141f';c.font='bold 5px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(String(this.index+1),...p);}
 }
 demo(){if(this.demoFrame||this.index>=this.paths.length)return;const points=resample(this.paths[this.index],1),start=performance.now();const frame=t=>{const n=Math.floor((t-start)/1600*points.length);this.paint(points.slice(0,Math.max(1,n)));if(n<points.length)this.demoFrame=requestAnimationFrame(frame);else{this.demoFrame=0;this.paint();}};this.demoFrame=requestAnimationFrame(frame);}
 reset(){cancelAnimationFrame(this.demoFrame);this.demoFrame=0;this.index=0;this.accepted=[];this.drawn=[];this.scores=[];this.active=false;this.paint();}
 destroy(){cancelAnimationFrame(this.demoFrame);this.canvas.removeEventListener('pointerdown',this.down);this.canvas.removeEventListener('pointermove',this.move);this.canvas.removeEventListener('pointerup',this.up);this.canvas.removeEventListener('pointercancel',this.cancel);}
}
