(function(){function B(t,r,c=5e3,f="success"){if(!r||r.length===0)return;const e=document.createElement("div");e.style.cssText=`
        position: absolute;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: flex-start;
        gap: 12px;
        z-index: 10001;
        pointer-events: none;
    `;const n={success:{avatar:"#10b981",bubble:"#f0fdf4",text:"#166534",border:"#bbf7d0"},error:{avatar:"#ef4444",bubble:"#fef2f2",text:"#991b1b",border:"#fecaca"},info:{avatar:"#0a66c2",bubble:"#eff6ff",text:"#1e40af",border:"#bfdbfe"},warning:{avatar:"#f59e0b",bubble:"#fffbeb",text:"#92400e",border:"#fed7aa"}},s=n[f]||n.success,a=document.createElement("div");a.style.cssText=`
        width: 44px;
        height: 44px;
        background: ${s.avatar};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px ${s.avatar}40;
        opacity: 0;
        transform: scale(0);
        transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        flex-shrink: 0;
        position: relative;
    `;const l=document.createElement("div");l.style.cssText=`
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        border: 2px solid ${s.avatar};
        border-radius: 50%;
        opacity: 0;
        animation: pulse 2s infinite;
    `;const d=document.createElement("style");d.textContent=`
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.7; }
            100% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes slideInBubble {
            0% { 
                opacity: 0;
                transform: scale(0.7) translateY(15px) translateX(-20px);
            }
            100% { 
                opacity: 1;
                transform: scale(1) translateY(0) translateX(0);
            }
        }
        @keyframes slideOutBubble {
            0% { 
                opacity: 1;
                transform: scale(1) translateY(0) translateX(0);
            }
            100% { 
                opacity: 0;
                transform: scale(0.8) translateY(-10px) translateX(20px);
            }
        }
    `,document.head.appendChild(d),a.appendChild(l),a.innerHTML+=`
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
            <circle cx="16" cy="4" r="2" fill="white"/>
            <path d="M12 8a4 4 0 0 1 4-4" stroke="white"/>
        </svg>
    `;const p=document.createElement("div");p.style.cssText=`
        position: relative;
        min-width: 280px;
        max-width: 320px;
    `,e.appendChild(a),e.appendChild(p);const o=t.closest(".share-box");o.style.position="relative",o.appendChild(e),setTimeout(()=>{a.style.opacity="1",a.style.transform="scale(1)"},100);const h=Math.max(1200,(c-800)/r.length),i=8;let y=0,b=null;function g(){if(y>=r.length){setTimeout(()=>{e.style.transform="translateX(-50%) scale(0.8)",e.style.opacity="0",setTimeout(()=>{e.remove(),d.remove()},800)},500);return}const v=r[y];function C(){b&&(b.style.animation="slideOutBubble 0.3s ease-out forwards",setTimeout(()=>{b.parentNode&&b.remove()},300))}const m=document.createElement("div");m.style.cssText=`
            position: relative;
            background: ${s.bubble};
            color: ${s.text};
            padding: 14px 18px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid ${s.border};
            opacity: 0;
            transform: scale(0.7) translateY(15px) translateX(-20px);
            backdrop-filter: blur(10px);
            animation: slideInBubble 0.4s ease-out forwards;
        `;const w=document.createElement("div");w.style.cssText=`
            position: absolute;
            left: -8px;
            top: 15px;
            width: 20px;
            height: 20px;
            background: ${s.bubble};
            border: 1px solid ${s.border};
            border-right: none;
            border-bottom: none;
            transform: rotate(-45deg);
            border-radius: 4px 0 0 0;
        `;const T=document.createElement("span");m.appendChild(w),m.appendChild(T),p.appendChild(m),b=m;function E(x,I){return new Promise(z=>{let u=0;function k(){u<=x.length&&(I.textContent=x.substring(0,u)+(u<x.length?"▋":""),u++,u<=x.length?setTimeout(k,i):z())}k()})}setTimeout(()=>{E(v,T).then(()=>{setTimeout(()=>{C(),y++,setTimeout(g,320)},Math.max(800,h-v.length*i-400))})},400)}setTimeout(()=>{g()},400)}function M(t){for(t=t.trim();t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'");)t=t.slice(1,-1).trim();return t}function Y(t,r,c){if(!r||r.length===0)return;const f=t.querySelector(".lia-improvements-card");f&&f.remove();const e=document.createElement("div");e.className="lia-improvements-card",e.style.cssText=`
        position: absolute;
        right: 25px;
        bottom: 65px;
        min-width: 320px;
        max-width: 380px;
        background: #f0fdf4;
        color: #166534;
        border-radius: 18px 18px 24px 24px;
        box-shadow: 0 8px 32px rgba(16,185,129,0.13), 0 1.5px 8px #bbf7d0;
        padding: 20px 24px 18px 24px;
        opacity: 0;
        transform: translateY(40px) scale(0.97);
        transition: opacity 0.35s cubic-bezier(.4,1.4,.6,1), transform 0.35s cubic-bezier(.4,1.4,.6,1);
        z-index: 10002;
        pointer-events: auto;
        font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    `;const n=document.createElement("button");n.innerHTML="&times;",n.setAttribute("aria-label","Close"),n.style.cssText=`
        position: absolute;
        top: 10px;
        right: 14px;
        background: none;
        border: none;
        color: #10b981;
        font-size: 22px;
        font-weight: bold;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
        z-index: 1;
    `,n.onmouseenter=()=>n.style.opacity="1",n.onmouseleave=()=>n.style.opacity="0.7",n.onclick=()=>e.remove(),e.appendChild(n);const s=document.createElement("div");s.textContent="Improvements made:",s.style.cssText=`
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 10px;
        letter-spacing: 0.01em;
    `,e.appendChild(s);const a=document.createElement("ul");if(a.style.cssText=`
        list-style: none;
        margin: 0;
        padding: 0;
    `,r.forEach((o,h)=>{const i=document.createElement("li");i.textContent=o,i.style.cssText=`
            background: #fff;
            color: #166534;
            border-radius: 10px;
            margin-bottom: 8px;
            padding: 9px 14px 9px 12px;
            font-size: 14px;
            box-shadow: 0 1.5px 6px #bbf7d0;
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 0.35s cubic-bezier(.4,1.4,.6,1), transform 0.35s cubic-bezier(.4,1.4,.6,1);
            will-change: opacity, transform;
        `,setTimeout(()=>{i.style.opacity="1",i.style.transform="translateY(0)"},200+h*120),a.appendChild(i)}),e.appendChild(a),typeof c=="string"){const o=document.createElement("button");o.textContent="Undo",o.setAttribute("aria-label","Undo improvements"),o.style.cssText=`
            margin-top: 12px;
            background: #fff;
            color: #10b981;
            border: 1.5px solid #bbf7d0;
            border-radius: 8px;
            padding: 7px 18px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 1.5px 6px #bbf7d0;
            transition: background 0.2s, color 0.2s, border 0.2s;
            display: block;
        `,o.onmouseenter=()=>{o.style.background="#f0fdf4",o.style.color="#166534",o.style.borderColor="#10b981"},o.onmouseleave=()=>{o.style.background="#fff",o.style.color="#10b981",o.style.borderColor="#bbf7d0"},o.onclick=()=>{t.tagName==="TEXTAREA"||t.tagName==="INPUT"?(t.value=c,t.dispatchEvent(new Event("input",{bubbles:!0}))):t.isContentEditable&&(t.innerText=c,t.dispatchEvent(new Event("input",{bubbles:!0}))),e.remove(),window.showTemporaryMessage(t,"Improvements undone","info")},e.appendChild(o)}const l=document.createElement("div");l.style.cssText=`
        position: absolute;
        left: 50%;
        bottom: -18px;
        transform: translateX(-50%);
        width: 36px;
        height: 18px;
        pointer-events: none;
        z-index: 0;
    `,l.innerHTML=`
        <svg width="36" height="18" viewBox="0 0 36 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0 Q18 24 36 0" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1"/>
        </svg>
    `,e.appendChild(l),setTimeout(()=>{e.style.opacity="1",e.style.transform="translateY(0) scale(1)"},30);const d=setTimeout(()=>{e.style.opacity="0",e.style.transform="translateY(40px) scale(0.97)",setTimeout(()=>e.remove(),400)},2e4);n.onclick=()=>{clearTimeout(d),e.style.opacity="0",e.style.transform="translateY(40px) scale(0.97)",setTimeout(()=>e.remove(),350)};const p=t.closest(".share-box")||t;p.style.position="relative",p.appendChild(e)}window.cleanAIResponse=M;window.lia_showTemporaryImprovements=B;window.showImprovementsMade=Y;
})()