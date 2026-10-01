const hex=b=>[...b].map(x=>x.toString(16).padStart(2,'0')).join('');
const bytes=s=>new Uint8Array(s.match(/../g).map(x=>parseInt(x,16)));
async function digest(pin,salt,iterations){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(pin),'PBKDF2',false,['deriveBits']);return hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:bytes(salt),iterations,hash:'SHA-256'},key,256)));}
export async function createPin(pin){if(!/^\d{6,12}$/.test(pin))throw Error('Choose a PIN with 6–12 digits.');const salt=hex(crypto.getRandomValues(new Uint8Array(16))),iterations=120000;return {salt,iterations,hash:await digest(pin,salt,iterations)};}
export async function verifyPin(pin,verifier){if(!verifier||!/^\d{6,12}$/.test(pin))return false;const result=await digest(pin,verifier.salt,verifier.iterations);let different=0;for(let i=0;i<result.length;i++)different|=result.charCodeAt(i)^verifier.hash.charCodeAt(i);return different===0;}
export async function attemptPin(pin,verifier,failures,now=Date.now()){
 if(failures.until>now)return {ok:false,locked:true,seconds:Math.ceil((failures.until-now)/1000)};
 if(failures.until){failures.until=0;failures.count=0;}
 const ok=await verifyPin(pin,verifier);if(ok){failures.count=0;failures.until=0;return {ok:true};}
 failures.count++;if(failures.count>=5)failures.until=now+60000;return {ok:false,locked:failures.until>now,seconds:60};
}
export const parentSessionValid=(last,now=performance.now())=>last>0&&now>=last&&now-last<300000;
