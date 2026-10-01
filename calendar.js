const formatters=new Map();
export function dayKey(timestamp=Date.now(),timezone='Australia/Brisbane'){
  if(!formatters.has(timezone))formatters.set(timezone,new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}));
  const p=Object.fromEntries(formatters.get(timezone).formatToParts(new Date(timestamp)).map(x=>[x.type,x.value]));return `${p.year}-${p.month}-${p.day}`;
}
export function validDay(s){return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;}
export function addDays(day,n){if(!validDay(day))throw Error('Invalid calendar date');const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
export function weekKey(day){if(!validDay(day))throw Error('Invalid date');return addDays(day,-((new Date(day+'T12:00:00Z').getUTCDay()+6)%7));}
export const weekDays=week=>Array.from({length:7},(_,i)=>addDays(week,i));
export const dateLabel=(day,short=false)=>new Date(day+'T12:00:00Z').toLocaleDateString('en-AU',{timeZone:'UTC',day:'numeric',month:short?'short':'long'});
