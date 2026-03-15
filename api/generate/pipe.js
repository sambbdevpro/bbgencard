// Vercel Serverless: /api/generate/pipe — Plain text pipe format + Telegram

const TG_BOT_TOKEN = '8356710805:AAGgkXfVOe7PsEx4UfFYGLgmHvYh7Sclmxc';
const TG_CHAT_ID = '1437058499';

const CARD_NETWORKS = {
  visa: { id: 'visa', name: 'Visa', bins: ['4'], lengths: [16], cvvLength: 3 },
  mastercard: { id: 'mastercard', name: 'Mastercard', bins: ['51','52','53','54','55','2221','2720'], lengths: [16], cvvLength: 3 },
  amex: { id: 'amex', name: 'American Express', bins: ['34','37'], lengths: [15], cvvLength: 4 },
  discover: { id: 'discover', name: 'Discover', bins: ['6011','644','645','646','647','648','649','65'], lengths: [16], cvvLength: 3 },
  unionpay: { id: 'unionpay', name: 'UnionPay', bins: ['62'], lengths: [16,17,18,19], cvvLength: 3 },
  diners: { id: 'diners', name: 'Diners Club', bins: ['300','301','302','303','304','305','36','38'], lengths: [14,16], cvvLength: 3 },
  jcb: { id: 'jcb', name: 'JCB', bins: ['3528','3589'], lengths: [16], cvvLength: 3 },
};

function luhnChecksum(cn){const d=cn.split('').map(Number),r=[...d].reverse();let o=0,e=0;for(let i=0;i<r.length;i++){if(i%2===0)o+=r[i];else{let v=r[i]*2;if(v>9)v-=9;e+=v;}}return(o+e)%10;}
function randomInt(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function detectNetworkId(bin){for(const[id,n]of Object.entries(CARD_NETWORKS))for(const p of n.bins)if(bin.startsWith(p)||p.startsWith(bin))return id;return null;}

function generateCardNumber(nid,bc){const n=CARD_NETWORKS[nid];if(!n)throw new Error(`Unsupported:${nid}`);let cb,tl;if(bc){if(bc.includes('x')||bc.includes('X')){const f=bc.replace(/[xX]/g,''),xc=(bc.match(/[xX]/g)||[]).length;cb=f;for(let i=0;i<xc-1;i++)cb+=randomInt(0,9).toString();tl=bc.length;}else{cb=bc;tl=n.lengths[randomInt(0,n.lengths.length-1)];}}else{cb=n.bins[randomInt(0,n.bins.length-1)];tl=n.lengths[randomInt(0,n.lengths.length-1)];}let cn=cb;while(cn.length<tl-1)cn+=randomInt(0,9).toString();if(cn.length>tl-1)cn=cn.slice(0,tl-1);cn+=((10-luhnChecksum(cn+'0'))%10).toString();return cn;}

function generateExpiry(m,y){const now=new Date(),cY=now.getFullYear(),cM=now.getMonth()+1;let eM,eY;if(m!==null&&y!==null){if(y<cY||(y===cY&&m<cM)){eY=randomInt(cY,cY+8);eM=eY===cY?randomInt(cM,12):randomInt(1,12);}else{eM=m;eY=y;}}else if(m!==null){eY=randomInt(cY,cY+8);eM=(eY===cY&&m<cM)?randomInt(cM,12):m;}else if(y!==null){eY=y;eM=y===cY?randomInt(cM,12):randomInt(1,12);}else{eY=randomInt(cY,cY+8);eM=eY===cY?randomInt(cM,12):randomInt(1,12);}return[String(eM).padStart(2,'0'),String(eY)];}

function generateCvv(nid){const n=CARD_NETWORKS[nid];let c='';for(let i=0;i<(n?.cvvLength||3);i++)c+=randomInt(0,9).toString();return c;}

function parseExp(exp){let eM=null,eY=null;if(exp){const s=String(exp).trim();let m,y;if(s.includes('/')){[m,y]=s.split('/');}else if(s.length===4){m=s.slice(0,2);y=s.slice(2,4);}else if(s.length===6){m=s.slice(0,2);y=s.slice(2,6);}if(m&&y){eM=parseInt(m);eY=String(y).length===2?2000+parseInt(y):parseInt(y);if(eM<1||eM>12)eM=null;if(eY&&(eY<2000||eY>2100))eY=null;}}return{expMonth:eM,expYear:eY};}

async function sendTelegram(bin, exp, quantity, network, ip) {
  const ts = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  let msg = `🔔 <b>BBGenCard - New Gen (Pipe)</b>\n\n💳 <b>BIN:</b> <code>${bin}</code>\n`;
  if (exp) msg += `📅 <b>EXP:</b> <code>${exp}</code>\n`;
  msg += `🔢 <b>Qty:</b> ${quantity}\n🌐 <b>Network:</b> ${network}\n🕐 <b>Time:</b> ${ts}\n`;
  if (ip) msg += `📍 <b>IP:</b> <code>${ip}</code>\n`;
  msg += `☁️ <b>Source:</b> Vercel (pipe)\n`;
  try {
    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({chat_id:TG_CHAT_ID,text:msg,parse_mode:'HTML',disable_web_page_preview:true}),
    });
  } catch(e){/* silent */}
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const { bin, exp, quantity = '10', cvv = 'true', network } = req.query;
    const qty = Math.min(Math.max(parseInt(quantity) || 10, 1), 10000);
    const includeCvv = cvv !== 'false' && cvv !== '0';
    const { expMonth, expYear } = parseExp(exp);
    let sel = network || 'random';
    if (bin && !network) { const d = detectNetworkId(String(bin).replace(/[xX]/g, '')); if (d) sel = d; }
    const allIds = Object.keys(CARD_NETWORKS);
    const cards = [];
    for (let i = 0; i < qty; i++) {
      const ch = sel === 'random' ? allIds[randomInt(0, allIds.length - 1)] : sel;
      const cn = generateCardNumber(ch, bin || null);
      const [m, y] = generateExpiry(expMonth, expYear);
      const cv = includeCvv ? generateCvv(ch) : undefined;
      cards.push({ number: cn, expiry: `${m}/${y.slice(2)}`, cvv: cv });
    }
    const pipe = cards.map(c => { const p = [c.number, c.expiry]; if (c.cvv) p.push(c.cvv); return p.join('|'); }).join('\n');

    if (bin) {
      const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '';
      sendTelegram(bin, exp || null, qty, sel, ip).catch(() => {});
    }

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(pipe);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
}
