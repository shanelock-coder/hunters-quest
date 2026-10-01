const latin=['a','b','c','č','ć','d','dž','đ','e','f','g','h','i','j','k','l','lj','m','n','nj','o','p','r','s','š','t','u','v','z','ž'];
const cyr=['а','б','ц','ч','ћ','д','џ','ђ','е','ф','г','х','и','ј','к','л','љ','м','н','њ','о','п','р','с','ш','т','у','в','з','ж'];
const hints=['a as in father','b as in book','ts as in cats','ch, firmer sound','a softer ch','d as in day','j as in jam','a softer j','e as in bed','f as in fun','g as in go','h as in hello','ee as in see','y as in yes','k as in kite','l as in lamp','lj, a blended l + y','m as in moon','n as in new','ny as in canyon','o, a short pure vowel','p as in play','a tapped or rolled r','s as in sun','sh as in ship','t as in top','oo as in blue','v as in voice','z as in zoo','s as in treasure'];
export const alphabet=latin.map((l,i)=>({latin:l.toUpperCase(),cyrillic:cyr[i].toUpperCase(),sound:hints[i]}));
const forward=Object.fromEntries(latin.map((l,i)=>[l,cyr[i]])),back=Object.fromEntries(cyr.map((l,i)=>[l,latin[i]]));
const names={Hunter:'Хантер',Harry:'Хари',Harryja:'Харија',Potter:'Потер',Pottera:'Потера'};
export function toCyrillic(text){return String(text).replace(/[A-Za-zČĆĐŠŽčćđšž]+/g,word=>{
 if(names[word])return names[word];if(/^(Minecraft|Roblox|PS|Marshmello|Marshmella)$/i.test(word))return word;
 const low=word.toLocaleLowerCase('hr');let out='';for(let i=0;i<word.length;i++){const pair=low.slice(i,i+2),exception=(i===1&&low.startsWith('injek'))||(i===2&&low.startsWith('konjug'))||(i===2&&low.startsWith('nadživ'));const digraph=!exception&&['lj','nj','dž'].includes(pair);let ch=forward[digraph?pair:low[i]]||word[i];if(word[i]!==low[i])ch=ch.toUpperCase();out+=ch;if(digraph)i++;}return out;
});}
export function toLatin(text){return String(text).replace(/[А-Яа-яЂђЈјЉљЊњЋћЏџ]/g,(ch,i,s)=>{let value=back[ch.toLowerCase()]||ch;if(ch!==ch.toLowerCase())value=/[А-ЯЂЈЉЊЋЏ]/.test(s[i+1]||'')?value.toUpperCase():value[0].toUpperCase()+value.slice(1);return value;});}
export const displayText=(card,script)=>script==='cyrillic'?toCyrillic(card.hr):card.hr;
