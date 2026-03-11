(function(){class f{constructor(){this.mentionCache=new Map}extractMentions(n){const s=new Map;return n.querySelectorAll('a.ql-mention[data-test-ql-mention="true"]').forEach((a,i)=>{const t={text:a.textContent.trim(),originalText:a.getAttribute("data-original-text"),entityUrn:a.getAttribute("data-entity-urn"),objectUrn:a.getAttribute("data-object-urn"),guid:a.getAttribute("data-guid")||i.toString(),href:a.getAttribute("href")||"#"};s.set(t.text.toLowerCase(),t),t.originalText&&t.originalText!==t.text&&s.set(t.originalText.toLowerCase(),t)}),this.mentionCache=s,s}restoreMentions(n,s){if(this.mentionCache.size===0)return n;let e=n;const a=n.trim(),i=this.findMentionData(a);if(i&&i.length>0)i.forEach(t=>{const r="@"+(t.originalText||t.text),c=this.createMentionElement(t);e=e.replaceAll(r,c),console.log(e,"processedText after replacement")});else{const t=/@([^@\n.,!?;:]+?)(?=\n|$|[.,!?;:]|@|\s+@)/g;return e=e.replaceAll(t,r=>r),e}return e}escapeRegex(n){return n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}findMentionData(n){const s=n.toLowerCase();if(this.mentionCache.has(s)){const t=[];for(const[r,c]of this.mentionCache)r===s&&t.push(c);return t.length>1?t:t[0]}let e=[];for(const[t,r]of this.mentionCache)(t.includes(s)||s.includes(t))&&e.push(r);if(e.length>0)return e.length>1?e:e[0];const a=[],i=s.split(/\s+/);for(const[t,r]of this.mentionCache){const c=t.split(/\s+/);i.some(l=>c.some(p=>p.includes(l)||l.includes(p)))&&a.push(r)}return a.length>0?a:null}createMentionElement(n){return`<a class="ql-mention" href="${n.href}" data-entity-urn="${n.entityUrn}" data-guid="${n.guid}" data-object-urn="${n.objectUrn}" data-original-text="${n.originalText||n.text}" spellcheck="false" data-test-ql-mention="true">${n.text}</a>`}clearCache(){this.mentionCache.clear()}}const b=new f;function m(o,n,s="info"){const e=document.createElement("div");e.style.cssText=`
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: flex-start;
    gap: 12px;
    z-index: 10001;
    pointer-events: none;
  `;const a={success:{avatar:"#10b981",bubble:"#f0fdf4",text:"#166534",border:"#bbf7d0"},error:{avatar:"#ef4444",bubble:"#fef2f2",text:"#991b1b",border:"#fecaca"},info:{avatar:"#0a66c2",bubble:"#eff6ff",text:"#1e40af",border:"#bfdbfe"},warning:{avatar:"#f59e0b",bubble:"#fffbeb",text:"#92400e",border:"#fed7aa"}},i=a[s]||a.info,t=document.createElement("div");t.style.cssText=`
    width: 44px;
    height: 44px;
    background: ${i.avatar};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px ${i.avatar}40;
    opacity: 0;
    transform: scale(0);
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    flex-shrink: 0;
    position: relative;
  `;const r=document.createElement("div");r.style.cssText=`
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 2px solid ${i.avatar};
    border-radius: 50%;
    opacity: 0;
    animation: pulse 2s infinite;
  `;const c=document.createElement("style");c.textContent=`
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.7; }
      100% { transform: scale(1.2); opacity: 0; }
    }
  `,document.head.appendChild(c),t.appendChild(r),t.innerHTML+=`
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
      <circle cx="16" cy="4" r="2" fill="white"/>
      <path d="M12 8a4 4 0 0 1 4-4" stroke="white"/>
    </svg>
  `;const l=document.createElement("div");l.style.cssText=`
    position: relative;
    background: ${i.bubble};
    color: ${i.text};
    padding: 14px 18px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    border: 1px solid ${i.border};
    max-width: 280px;
    opacity: 0;
    transform: scale(0.7) translateY(15px);
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    backdrop-filter: blur(10px);
  `;const p=document.createElement("div");p.style.cssText=`
    position: absolute;
    left: -8px;
    top: 15px;
    width: 20px;
    height: 20px;
    background: ${i.bubble};
    border: 1px solid ${i.border};
    border-right: none;
    border-bottom: none;
    transform: rotate(-45deg);
    border-radius: 4px 0 0 0;
  `;const h=document.createElement("span");l.appendChild(p),l.appendChild(h),e.appendChild(t),e.appendChild(l);const d=o.closest(".share-box");d.style.position="relative",d.appendChild(e),setTimeout(()=>{t.style.opacity="1",t.style.transform="scale(1)"},100),setTimeout(()=>{l.style.opacity="1",l.style.transform="scale(1) translateY(0)"},400),setTimeout(()=>{let u=0;const x=()=>{u<=n.length&&(h.textContent=n.substring(0,u)+(u<n.length?"▋":""),u++,setTimeout(x,40))};x()},700),setTimeout(()=>{e.style.transform="translateX(-50%) scale(0.8)",e.style.opacity="0",setTimeout(()=>{e.remove(),c.remove()},1500)},4500)}async function g(o,n,s,e){return new Promise(a=>{b.extractMentions(o);const i=document.createElement("div");i.style.cssText=`
      position: relative;
      min-height: ${o.offsetHeight}px;
    `;const t={opacity:o.style.opacity,transition:o.style.transition};o.style.transition="opacity 0.3s ease",o.style.opacity="0.3",setTimeout(()=>{let r=0;Math.max(n.length,s.length);const c=setInterval(()=>{if(r<=s.length){const l=s.substring(0,r);o.textContent=l+(r<s.length?"|":""),r++,o.closest(".share-box").scrollTo({top:o.scrollHeight,behavior:"smooth"})}else{clearInterval(c);const p=b.restoreMentions(s,o).split(/\n/).map(h=>`<p>${h}</p>`).join("");o.innerHTML=p,o.style.opacity="1",setTimeout(()=>{o.style.opacity=t.opacity,o.style.transition=t.transition;const h=new Event("input",{bubbles:!0});o.dispatchEvent(h);const d=new KeyboardEvent("keyup",{bubbles:!0});o.dispatchEvent(d),m(o,"✨ Text improved!","success"),b.clearCache(),a()},300)}},15);if(e&&e.length>0){const l=Math.max(s.length*15,800),p=Math.floor(l/e.length);setTimeout(()=>{window.lia_showTemporaryImprovements(o,e,p)},p)}},300)})}window.linkedInMentionHandler=b;window.animateTextRewriteWithMentions=g;window.LinkedInMentionHandler=f;
})()