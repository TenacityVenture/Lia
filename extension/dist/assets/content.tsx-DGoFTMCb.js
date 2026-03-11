(function(){(()=>{let u={tone:"professional",industry:"technology",chatbot_enabled:!0,reply_enabled:!0,rewrite_enabled:!0,isRewriting:!1,linkedinTheme:"light",selectedPersona:"professional",selectedTemplate:null},x=null,w=10,M=10;const Q=()=>x&&x.profile_picture_url?`<img class="lia-chat-user-avatar" src="${x.profile_picture_url}" alt="User Avatar" />`:"U";chrome.storage.sync.get(["tone","industry","chatbot_enabled","reply_enabled","rewrite_enabled","linkedinTheme","selectedPersona"],e=>{u={...u,...e},ce()}),chrome.runtime.onMessage.addListener(async(e,t,n)=>{e.action==="settingsUpdated"&&(await chrome.storage.sync.get(["tone","industry","chatbot_enabled","reply_enabled","rewrite_enabled","linkedinTheme","selectedPersona"],i=>{u={...u,...i}}),ce())}),window.addEventListener("message",async e=>{e.origin==="https://www.getlia.live"&&e.source===window&&(e.data.type==="SEND_JWTs"&&(chrome.runtime.sendMessage({type:"STORE_JWTs",access_token:e.data.access_token,refresh_token:e.data.refresh_token}),x=await window.getLiaUserInfo(),Ee()),e.data.type==="CLEAR_JWTs"&&(await window.lia_clearTokens(),x=null))});function je(e,t=100,n=1e3){return new Promise((i,o)=>{let a=0;const r=()=>{const l=document.querySelector(e);if(l)return i(l);if(a++,a>=t)return o(`Element ${e} not found after ${t} attempts`);setTimeout(r,n)};r()})}async function ce(){const e=await window.detectLinkedInTheme();u.linkedinTheme=e||"light",be(),we(),Z(),x=await window.getLiaUserInfo(),x||console.warn("LIA user not found, user might not be authenticated");let t;const n=new MutationObserver(o=>{o.forEach(a=>{clearTimeout(t),t=setTimeout(async()=>{if(a.addedNodes.length)try{const r=await window.detectLinkedInTheme();u.linkedinTheme=r||"light",be(),we(),Z(),x===null&&(x=await window.getLiaUserInfo()),s.referenceMode&&Pe()}catch(r){console.error("MutationObserver Error:",r)}},500)})});n.observe(document.body,{childList:!0,subtree:!0});const i=document.body.querySelector(".feed-shared-update-v2__comments-container");i&&n.observe(i,{childList:!0,subtree:!0,characterData:!0})}function de(e,t="bold"){const o=t==="italic"?{a:"𝘢",b:"𝘣",c:"𝘤",d:"𝘥",e:"𝘦",f:"𝘧",g:"𝘨",h:"𝘩",i:"𝘪",j:"𝘫",k:"𝘬",l:"𝘭",m:"𝘮",n:"𝘯",o:"𝘰",p:"𝘱",q:"𝘲",r:"𝘳",s:"𝘴",t:"𝘵",u:"𝘶",v:"𝘷",w:"𝘸",x:"𝘹",y:"𝘺",z:"𝘻",A:"𝘈",B:"𝘉",C:"𝘊",D:"𝘋",E:"𝘌",F:"𝘍",G:"𝘎",H:"𝘏",I:"𝘐",J:"𝘑",K:"𝘒",L:"𝘓",M:"𝘔",N:"𝘕",O:"𝘖",P:"𝘗",Q:"𝘘",R:"𝘙",S:"𝘚",T:"𝘛",U:"𝘜",V:"𝘝",W:"𝘞",X:"𝘟",Y:"𝘠",Z:"𝘡"}:{a:"𝗮",b:"𝗯",c:"𝗰",d:"𝗱",e:"𝗲",f:"𝗳",g:"𝗴",h:"𝗵",i:"𝗶",j:"𝗷",k:"𝗸",l:"𝗹",m:"𝗺",n:"𝗻",o:"𝗼",p:"𝗽",q:"𝗾",r:"𝗿",s:"𝘀",t:"𝘁",u:"𝘂",v:"𝘃",w:"𝘄",x:"𝘅",y:"𝘆",z:"𝘇",A:"𝗔",B:"𝗕",C:"𝗖",D:"𝗗",E:"𝗘",F:"𝗙",G:"𝗚",H:"𝗛",I:"𝗜",J:"𝗝",K:"𝗞",L:"𝗟",M:"𝗠",N:"𝗡",O:"𝗢",P:"𝗣",Q:"𝗤",R:"𝗥",S:"𝗦",T:"𝗧",U:"𝗨",V:"𝗩",W:"𝗪",X:"𝗫",Y:"𝗬",Z:"𝗭",0:"𝟬",1:"𝟭",2:"𝟮",3:"𝟯",4:"𝟰",5:"𝟱",6:"𝟲",7:"𝟳",8:"𝟴",9:"𝟵"};return[...e].map(a=>o[a]||a).join("")}function j(e,t="bold"){const o=t==="italic"?{"𝘢":"a","𝘣":"b","𝘤":"c","𝘥":"d","𝘦":"e","𝘧":"f","𝘨":"g","𝘩":"h","𝘪":"i","𝘫":"j","𝘬":"k","𝘭":"l","𝘮":"m","𝗻":"n","𝘰":"o","𝘱":"p","𝘲":"q","𝘳":"r","𝘴":"s","𝘵":"t","𝘶":"u","𝘷":"v","𝘸":"w","𝘹":"x","𝘺":"y","𝘻":"z","𝘈":"A","𝘉":"B","𝘊":"C","𝘋":"D","𝘌":"E","𝘍":"F","𝘎":"G","𝘏":"H","𝘐":"I","𝘑":"J","𝘒":"K","𝘓":"L","𝘔":"M","𝘕":"N","𝘖":"O","𝘗":"P","𝘘":"Q","𝘙":"R","𝘚":"S","𝘛":"T","𝘜":"U","𝘝":"V","𝘞":"W","𝘟":"X","𝘠":"Y","𝘡":"Z"}:{"𝗮":"a","𝗯":"b","𝗰":"c","𝗱":"d","𝗲":"e","𝗳":"f","𝗴":"g","𝗵":"h","𝗶":"i","𝗷":"j","𝗸":"k","𝗹":"l","𝗺":"m","𝗻":"n","𝗼":"o","𝗽":"p","𝗾":"q","𝗿":"r","𝘀":"s","𝘁":"t","𝘂":"u","𝘃":"v","𝘄":"w","𝘅":"x","𝘆":"y","𝘇":"z","𝗔":"A","𝗕":"B","𝗖":"C","𝗗":"D","𝗘":"E","𝗙":"F","𝗚":"G","𝗛":"H","𝗜":"I","𝗝":"J","𝗞":"K","𝗟":"L","𝗠":"M","𝗡":"N","𝗢":"O","𝗣":"P","𝗤":"Q","𝗥":"R","𝗦":"S","𝗧":"T","𝗨":"U","𝗩":"V","𝗪":"W","𝗫":"X","𝗬":"Y","𝗭":"Z","𝟬":0,"𝟭":1,"𝟮":2,"𝟯":3,"𝟰":4,"𝟱":5,"𝟲":6,"𝟳":7,"𝟴":8,"𝟵":9};return[...e].map(a=>o[a]||a).join("")}function pe(e){return/[^\u0000-\u007F]/.test(e)}function We(e){return[...e].every(t=>{const n=t.codePointAt(0);return n>=119808&&n<=119833||n>=119834&&n<=119859||n>=120782&&n<=120791})}function Oe(e){return[...e].every(t=>{const n=t.codePointAt(0);return n>=119860&&n<=119885||n>=119886&&n<=119911||t==="ℎ"})}function Z(){const e=document.createElement("div");e.id="linkedin-ai-text-toolbar",e.className="linkedin-ai-text-toolbar",e.style.cssText=`
      position: absolute;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 8px;
      display: none;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      gap: 4px;
      align-items: center;
      backdrop-filter: blur(10px);
    `;const t=document.createElement("div");t.className="toolbar-logo",t.style.cssText=`
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0a66c2, #004182);
      border-radius: 8px 0 0 8px;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    `,t.innerHTML=`
    <svg class="lia-logo" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
        <circle cx="16" cy="4" r="2" fill="#ffffff"/>
        <path d="M12 8a4 4 0 0 1 4-4" stroke="#ffffff"/>
      </svg>
    `,e.appendChild(t),[{id:"bold",icon:"B",title:"Make Bold",style:"font-weight: 700; font-size: 14px;",action:()=>ge("bold")},{id:"italic",icon:"I",title:"Make Italic",style:"font-style: italic; font-size: 14px;",action:()=>ge("italic")},{id:"divider1",type:"divider"},{id:"ai-rewrite",icon:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2">
          <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
        </svg>`,title:"AI Rewrite Paragraph",action:()=>Fe()},{id:"shorten",icon:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2">
          <path d="M8 18L12 6l4 12"/>
          <path d="M9.5 12h5"/>
        </svg>`,title:"Make Shorter",action:()=>A("shorten")},{id:"expand",icon:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>`,title:"Expand Text",action:()=>A("expand")},{id:"divider2",type:"divider"},{id:"professional",icon:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
        </svg>`,title:"Make Professional",action:()=>A("professional")},{id:"emoji",icon:"😊",title:"Add Emojis",style:"font-size: 14px;",action:()=>A("emoji")},{id:"grammar",icon:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2">
          <path d="M9 12l2 2 4-4"/>
          <circle cx="12" cy="12" r="10"/>
        </svg>`,title:"Fix Grammar",action:()=>A("grammar")}].forEach(i=>{if(i.type==="divider"){const o=document.createElement("div");o.style.cssText=`
          width: 1px;
          height: 20px;
          background: #e0e0e0;
          margin: 0 4px;
        `,e.appendChild(o)}else{const o=document.createElement("button");o.className="linkedin-ai-toolbar-btn",o.title=i.title,o.style.cssText=`
          background: none;
          border: none;
          padding: 6px 8px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
          color: #0a66c2;
          ${i.style||""}
        `,i.icon.startsWith("<svg")?o.innerHTML=i.icon:o.textContent=i.icon,o.addEventListener("mouseenter",()=>{o.style.backgroundColor="#e7f3ff"}),o.addEventListener("mouseleave",()=>{o.style.backgroundColor="transparent"}),o.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),i.action()}),e.appendChild(o)}}),document.body.appendChild(e),document.addEventListener("mouseup",ue),document.addEventListener("keyup",ue),document.addEventListener("mousedown",i=>{e.contains(i.target)||(e.style.display="none")})}function ue(){const e=document.getElementById("linkedin-ai-text-toolbar");if(!e)return;const t=window.getSelection(),n=t.toString().trim();if(n&&n.length>0){const i=document.activeElement;if(i&&(i.classList.contains("ql-editor")||i.closest(".ql-editor")||i.closest(".share-box")||i.closest(".comments-comment-texteditor"))){const a=t.getRangeAt(0),r=a.getBoundingClientRect();e.style.left=`${r.left+window.scrollX+r.width/2-e.offsetWidth/2}px`,e.style.top=`${r.top+window.scrollY-50}px`,e.style.display="flex",e.dataset.selectedText=n,e.dataset.selectionStart=a.startOffset,e.dataset.selectionEnd=a.endOffset}}else e.style.display="none"}function ge(e){const n=window.getSelection().toString();if(!n)return;let i=n;switch(e){case"bold":Oe(n.trim())&&(i=j(n,"italic")),pe(n.trim())?i=j(n,"bold"):i=de(n);break;case"italic":We(n.trim())&&(i=j(n,"bold")),pe(n.trim())?i=j(n,"italic"):i=de(n,"italic");break}ye(i),O()}async function A(e){const t=window.getSelection(),n=t.toString().trim();let i=me(t);if(i.length!==0&&(i[i.length-1]!=="."&&(i+="."),!!n))try{xe();let o="";if(o=await fe(n,e),!o){W("Failed to fetch transformed text");return}await ve(t,i,o),O()}catch(o){W(o.message)}}async function Fe(){const e=window.getSelection(),t=e.toString().trim();if(!t)return;let n=t;if(t.endsWith(".")||t.endsWith("?")||t.endsWith("!")?n=t:n=me(e),n.length===0)return;const i=n;n[n.length-1]!=="."&&(n+=".");try{xe();let o=await fe(n,"rewrite");o?(await ve(e,i,o),O()):W("failed to fetch")}catch(o){W(o.message)}}function me(e){const t=e.getRangeAt(0);let n=t.commonAncestorContainer;for(;n&&n.tagName!=="P";)n=n.parentElement;if(n&&n.tagName==="P"){const c=De(n),d=Ue(n);return window.linkedinMentionsData=c,d}const i=t.commonAncestorContainer,o=i.textContent||i.innerText||"",a=t.startOffset;let r=o.lastIndexOf(".",a-1)+1,l=o.indexOf(".",a);return r<0&&(r=0),l<0&&(l=o.length),o.substring(r,l).trim()}function De(e){const t=[];return e.querySelectorAll(".ql-mention").forEach((i,o)=>{t.push({id:o,text:i.textContent.trim(),originalElement:i.outerHTML,entityUrn:i.getAttribute("data-entity-urn"),objectUrn:i.getAttribute("data-object-urn"),href:i.getAttribute("href"),guid:i.getAttribute("data-guid")})}),t}function Ue(e){let t=e.innerHTML;e.querySelectorAll(".ql-mention").forEach((o,a)=>{const l=`@${o.textContent.trim()}`;t=t.replace(o.outerHTML,l)});const i=document.createElement("div");return i.innerHTML=t,i.textContent||i.innerText||""}function Ye(e,t){if(!t||t.length===0)return e;let n=e;return t.forEach(i=>{const o=`@${i.text}`;n.includes(o)&&(he(i),n=n.replace(o,`<MENTION_${i.id}>`))}),t.forEach(i=>{const o=`<MENTION_${i.id}>`;if(n.includes(o)){const a=he(i);n=n.replace(o,a)}}),n}function he(e){return`<a class="ql-mention" href="${e.href||"#"}" data-entity-urn="${e.entityUrn||""}" data-guid="${e.guid||""}" data-object-urn="${e.objectUrn||""}" data-original-text="${e.text}" spellcheck="false" data-test-ql-mention="true">${e.text}</a>`}async function fe(e,t){let n="";switch(t){case"rewrite":n=`Rewrite this sentence to be more engaging and professional: "${e}"`;break;case"shorten":n=`Make this text shorter while keeping the main message: "${e}"`;break;case"expand":n=`Expand this text with more detail and context: "${e}"`;break;case"professional":n=`Make this text more professional and business-appropriate: "${e}"`;break;case"emoji":n=`Add relevant emojis to this text to make it more engaging: "${e}"`;break;case"grammar":n=`Fix any grammar, spelling, or punctuation errors in this text: "${e}"`;break;default:n=`Improve this text: "${e}"`}n+=" Return only the improved text without quotes or explanations.";const i=await window.lia_fetchWithAuth("https://api.getlia.live/api/prompt/improve",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await v()}`},credentials:"include",body:JSON.stringify({prompt:n,type:t})});if(!i.ok)throw new Error(o.error?.message||"Failed to transform text");const o=await i.json();return o.response}function ye(e){const t=window.getSelection();if(!t||t.rangeCount===0)return;const n=t.getRangeAt(0);if(!t.toString())return;n.deleteContents();const o=document.createTextNode(e);n.insertNode(o),n.setStartAfter(o),n.setEndAfter(o),t.removeAllRanges(),t.addRange(n);let a=o.parentElement;for(;a&&!a.isContentEditable;)a=a.parentElement;if(a){const r=new Event("input",{bubbles:!0});a.dispatchEvent(r)}}async function ve(e,t,n){let o=e.getRangeAt(0).commonAncestorContainer;for(;o&&o.tagName!=="P";)o=o.parentElement;if(!o||o.tagName!=="P"){ye(n);return}const a=window.linkedinMentionsData||[],r=Ye(n,a);o.innerHTML;const l=o.textContent||o.innerText||"",c=document.createElement("span");c.style.cssText=`
    background: linear-gradient(90deg, #e7f3ff, #f0f9ff);
    border-radius: 4px;
    padding: 2px 4px;
    transition: all 0.3s ease;
    position: relative;
    display: inline-block;
    width: 100%;
    min-height: 1.2em;`,c.textContent=l,o.innerHTML="",o.appendChild(c),await Ve(c,l,n),o.innerHTML=r,delete window.linkedinMentionsData;const d=o.closest(".ql-editor");if(d){const m=new Event("input",{bubbles:!0});d.dispatchEvent(m)}}async function Ve(e,t,n){return new Promise(i=>{e.style.background="linear-gradient(90deg, #fef3c7, #fde68a)",e.style.transform="scale(1.02)",setTimeout(()=>{let o=0;e.style.background="linear-gradient(90deg, #e7f3ff, #dbeafe)",e.style.transform="scale(1)";const a=setInterval(()=>{if(o<=n.length){const r=n.substring(0,o);o<n.length?e.innerHTML=r+'<span style="animation: blink 1s infinite; color: #0a66c2;">|</span>':e.textContent=n,o++}else clearInterval(a),e.style.background="linear-gradient(90deg, #d1fae5, #a7f3d0)",e.style.transform="scale(1.02)",setTimeout(()=>{e.style.background="transparent",e.style.transform="scale(1)",e.style.transition="all 0.5s ease",setTimeout(()=>{i()},500)},800)},50)},300)})}function xe(){const e=document.getElementById("linkedin-ai-text-toolbar");e&&(e.innerHTML=`
        <div style="display: flex; align-items: center; gap: 8px; padding: 4px 8px;">
          <div class="linkedin-ai-loading-spinner" style="width: 14px; height: 14px;"></div>
          <span style="font-size: 12px; color: #0a66c2;">Processing...</span>
        </div>
      `)}function W(e){const t=document.getElementById("linkedin-ai-text-toolbar");t&&(t.innerHTML=`
        <div style="padding: 4px 8px; color: #ef4444; font-size: 12px;">
          ${e}
        </div>
      `,setTimeout(()=>O(),3e3))}function O(){const e=document.getElementById("linkedin-ai-text-toolbar");e&&(e.style.display="none",window.getSelection().removeAllRanges()),document.getElementById("linkedin-ai-text-toolbar").remove(),Z()}function be(){if(!u.reply_enabled)return;document.querySelectorAll(".comments-comment-texteditor").forEach(t=>{Je(t)})}function Je(e){if(e.querySelector(".lia-reply-assistant"))return;const t=e.querySelector(".comments-comment-box-comment__text-editor");if(!t)return;const n=document.createElement("div");n.className=`lia-reply-assistant ${u.linkedinTheme==="dark"?"dark":""}`,n.innerHTML=`
      <button class="linkedin-ai-button ${u.linkedinTheme==="dark"?"dark":""}" title="Generate AI Reply" style="font-size: 12px; padding: 4px 8px;" >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
        </svg>
        AI Reply
      </button>
      <div class="lia-persona-selector">
        <button class="lia-persona-btn" id="lia-persona-${Date.now()}" style="font-size: 12px; padding: 4px 8px;">
          <span class="lia-persona-icon">${L[u.selectedPersona].icon}</span>
          <!--<span class="lia-persona-name">${L[u.selectedPersona].name}</span>-->
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>
        <div class="lia-persona-dropdown" style="display: none;">
          ${Object.entries(L).map(([r,l])=>`
            <div class="lia-persona-option ${r===u.selectedPersona?"active":""}" data-persona="${r}">
              <span class="lia-persona-icon">${l.icon}</span>
              <div class="lia-persona-info">
                <div class="lia-persona-name">${l.name}</div>
                <div class="lia-persona-desc">${l.description}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `,t.prepend(n);const i=n.querySelector(".lia-persona-btn"),o=n.querySelector(".lia-persona-dropdown"),a=n.querySelector(".linkedin-ai-button");i.addEventListener("click",r=>{r.stopPropagation(),r.preventDefault(),o.style.display=o.style.display==="none"?"block":"none"}),document.addEventListener("click",()=>{o.style.display="none"}),n.querySelectorAll(".lia-persona-option").forEach(r=>{r.addEventListener("click",l=>{l.stopPropagation();const c=r.dataset.persona;Xe(c,n),o.style.display="none"})}),a.addEventListener("click",r=>{r.preventDefault(),ke(e)})}async function Xe(e,t){u.selectedPersona=e,await chrome.storage.sync.set({selectedPersona:e}),console.log("awesome");const n=L[e],i=t.querySelector(".lia-persona-btn");i.innerHTML=`
      <span class="lia-persona-icon">${n.icon}</span>
      <!--<span class="lia-persona-name">${n.name}</span>-->
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6,9 12,15 18,9"/>
      </svg>
    `,t.querySelectorAll(".lia-persona-option").forEach(o=>{o.classList.remove("active")}),t.querySelector(`[data-persona="${e}"]`).classList.add("active")}function we(){if(!u.rewrite_enabled)return;const e=document.querySelector(".share-box-feed-entry__top-bar button.artdeco-button--tertiary");e&&e.addEventListener("click",()=>{je(".share-box_actions").then(t=>{t&&(t.style.display="flex",t.style.gap="8px");const n=document.createElement("button");n.className="linkedin-ai-button",u.linkedinTheme==="dark"&&(n.style.backgroundColor="#71b7fb"),n.style.padding="4px 8px",n.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
        </svg>
          AI Rewrite
        `;const i=document.querySelector(".share-box .ql-editor");n.addEventListener("click",()=>{u.isRewriting?I(i,"LIA is rewriting text. Please wait for the process is complete."):Ge(i)}),t&&(t.querySelector(".linkedin-ai-button")||t.prepend(n))})})}async function ke(e){const t=e.querySelector(".ql-container"),n=e.querySelector(".ql-editor");let i=t.querySelector(".linkedin-ai-suggestions");i||(i=document.createElement("div"),i.className="linkedin-ai-suggestions",t.appendChild(i)),u.linkedinTheme==="dark"&&(i.style.backgroundColor="#293139",i.style.border="0"),i.innerHTML=`
      <div class="linkedin-ai-loading">
        <div class="linkedin-ai-loading-spinner"></div>
        <span>Generating reply suggestions...</span>
      </div>
    `;try{const o=Ke(e);if(!o)throw new Error("Unable to determine comment context");let a;if(o.isReplyingToComment==!0)try{if(a=await tt(o),a&&a.error&&a.error.includes("missing plan")){i.innerHTML=`
            <div style="color: red; padding: 10px;">
            Please upgrade your plan to use this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Upgrade Now</a>
            </div>
            `;return}else if(a&&a.error&&a.error.includes("Plan expired")){i.innerHTML=`
            <div style="color: red; padding: 10px;">
            Your plan has expired. Please renew your subscription to continue using this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Renew Now</a>
            </div>
            `;return}}catch(r){throw console.error("Error generating reply suggestions:",r),new Error("Failed to generate suggestions")}else try{if(a=await et(o),a&&a.error&&a.error.includes("missing plan")){i.innerHTML=`
            <div style="color: red; padding: 10px;">
            Please upgrade your plan to use this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Upgrade Now</a>
            </div>
            `;return}else if(a&&a.error&&a.error.includes("Plan expired")){i.innerHTML=`
            <div style="color: red; padding: 10px;">
            Your plan has expired. Please renew your subscription to continue using this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Renew Now</a>
            </div>
            `;return}}catch(r){throw console.error("Error generating comment suggestions:",r),new Error("Failed to generate suggestions")}n.textContent="",nt(i,a,e)}catch(o){throw i.innerHTML=`
        <div style="color: red; padding: 10px;">
        ${o||"Failed to generate suggestions"}
        </div>
        `,o}}async function Ge(e){u.isRewriting=!0;const n=Array.from(e.querySelectorAll("p")).map(a=>{let r="";return a.childNodes.forEach(l=>{l.nodeType===Node.ELEMENT_NODE&&l.classList.contains("ql-mention")?r+="@"+l.textContent:(l.nodeType===Node.TEXT_NODE||l.nodeType===Node.ELEMENT_NODE)&&(r+=l.textContent)}),r.trim()}).join(`
`);console.log("Text content to rewrite:",n);let i=n;if(n||(i=e.textContent||e.innerText||""),!i.trim()){u.isRewriting=!1,I(e,"Please write some text first to rewrite it");return}const o=Qe(e);I(e,"LIA is rewriting..");try{let a=null,r=[];const l=await Ze(i);if(l.error&&l.error.includes("missing plan")){o.remove(),I(e,"Please upgrade your plan to use this feature. <a href='https://www.getlia.live/pricing' target='_blank'>Upgrade Now</a>","error"),u.isRewriting=!1;return}else if(l.error&&l.error.includes("Plan expired")){o.remove(),I(e,"Your plan has expired. Please renew your subscription to continue using this feature. <a href='https://www.getlia.live/pricing' target='_blank'>Renew Now</a>","error"),u.isRewriting=!1;return}else if(l.error&&l.error.includes("Invalid or expired token")){o.remove(),I(e,"Your session has expired. Please sign in again to continue using this feature.","error"),u.isRewriting=!1;return}a=window.cleanAIResponse(l.response)||null,r=l.improvements||[],o.remove(),a?(await window.animateTextRewriteWithMentions(e,i,a,r),u.isRewriting=!1,window.showImprovementsMade(e,r,i)):(u.isRewriting=!1,I(e,"No improvements were made to the text because the extension encountered an error"))}catch(a){u.isRewriting=!1,o.remove(),console.error("Error during rewrite:",a),a.message==="Failed to generate improved text"?I(e,"Failed to generate improved text. Maybe your session has expired. Please try signing in again."):I(e,`Error: ${a.message}`)}}function Qe(e){const t=document.createElement("div");t.className="linkedin-ai-rewrite-loading",t.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      border-radius: 8px;
      backdrop-filter: blur(2px);
    `,t.innerHTML=`
      <div style="display: flex; align-items: center; gap: 8px; color: #0a66c2;">
        <div class="linkedin-ai-loading-spinner" style="width: 16px; height: 16px;"></div>
        <span style="font-size: 14px;">AI is rewriting...</span>
      </div>
    `,e.getBoundingClientRect();const n=e.closest(".share-box");return n.style.position="relative",n.appendChild(t),t}async function Ze(e){if(!u.rewrite_enabled)return;const t=`Improve and rewrite the following LinkedIn post to make it more engaging, professional, and impactful. Keep the core message but enhance clarity, flow, and engagement. Maintain the same tone (${u.tone}) and make it suitable for the ${u.industry} industry:

    "${e}"

    Return only the improved text without any explanations or quotes. Include proper line breaks and formatting as needed - whitespaces.`,n=await window.lia_fetchWithAuth("https://api.getlia.live/api/prompt/rewrite",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await v()}`},credentials:"include",body:JSON.stringify({prompt:t,originalText:e})}),i=await n.json();return n.ok,i}function I(e,t,n="info"){const i=document.createElement("div");i.style.cssText=`
      position: absolute;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: flex-start;
      gap: 12px;
      z-index: 10001;
      pointer-events: none;
    `;const o={success:{avatar:"#10b981",bubble:"#f0fdf4",text:"#166534",border:"#bbf7d0"},error:{avatar:"#ef4444",bubble:"#fef2f2",text:"#991b1b",border:"#fecaca"},info:{avatar:"#0a66c2",bubble:"#eff6ff",text:"#1e40af",border:"#bfdbfe"},warning:{avatar:"#f59e0b",bubble:"#fffbeb",text:"#92400e",border:"#fed7aa"}},a=o[n]||o.info,r=document.createElement("div");r.style.cssText=`
      width: 44px;
      height: 44px;
      background: ${a.avatar};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px ${a.avatar}40;
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
      border: 2px solid ${a.avatar};
      border-radius: 50%;
      opacity: 0;
      animation: pulse 2s infinite;
    `;const c=document.createElement("style");c.textContent=`
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.7; }
        100% { transform: scale(1.2); opacity: 0; }
      }
    `,document.head.appendChild(c),r.appendChild(l),r.innerHTML+=`
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
        <circle cx="16" cy="4" r="2" fill="white"/>
        <path d="M12 8a4 4 0 0 1 4-4" stroke="white"/>
      </svg>
    `;const d=document.createElement("div");d.style.cssText=`
      position: relative;
      background: ${a.bubble};
      color: ${a.text};
      padding: 14px 18px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      border: 1px solid ${a.border};
      max-width: 280px;
      opacity: 0;
      transform: scale(0.7) translateY(15px);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      backdrop-filter: blur(10px);
    `;const m=document.createElement("div");m.style.cssText=`
      position: absolute;
      left: -8px;
      top: 15px;
      width: 20px;
      height: 20px;
      background: ${a.bubble};
      border: 1px solid ${a.border};
      border-right: none;
      border-bottom: none;
      transform: rotate(-45deg);
      border-radius: 4px 0 0 0;
    `;const f=document.createElement("span");d.appendChild(m),d.appendChild(f),i.appendChild(r),i.appendChild(d);const y=e.closest(".share-box");y.style.position="relative",y.appendChild(i),setTimeout(()=>{r.style.opacity="1",r.style.transform="scale(1)"},100),setTimeout(()=>{d.style.opacity="1",d.style.transform="scale(1) translateY(0)"},400),setTimeout(()=>{let g=0;const E=()=>{g<=t.length&&(f.textContent=t.substring(0,g)+(g<t.length?"▋":""),g++,setTimeout(E,40))};E()},700),setTimeout(()=>{i.style.transform="translateX(-50%) scale(0.8)",i.style.opacity="0",setTimeout(()=>{i.remove(),c.remove()},1500)},4500)}function Ke(e){const t={postContent:"",previousComments:[],postWriter:""};if(window.location.href.includes("linkedin.com/pulse/")){const n=document.querySelector(".reader-article-content"),i=document.querySelector(".reader-article-header__title");if(n){const d=`
          ${i.innerText}
          ${n.innerText}
          `;t.postContent=d}const o=document.querySelector(".reader-social-details__comments-list, .comments-comments-list");o&&o.querySelectorAll(".comments-comment-entity").forEach(m=>{const f=m.querySelector(".comments-comment-item__main-content"),g=`
            ${m.querySelector(".comments-comment-meta__description-title").innerText} said: 
            ${f.innerText}
          `;t.previousComments.push(g)});const a=document.querySelector(".reader-author-info__content");if(a){const d=a.querySelector("div a").innerText;t.postWriter=d}const r={postContent:t.postContent,commenterName:"",commentReply:"",previousRepliesOnComment:[],previousComments:t.previousComments,isReplyingToComment:!0,isReplyingTo:"",isSubReplyingTo:!1},l=e.closest(".comments-comment-entity");let c=null;if(l?c=l.querySelector(".comment-social-activity"):c=e.closest(".comments-social-activity"),c){const d=l.querySelector(".comments-comment-meta__container .comments-comment-meta__description"),m=l.querySelector(".comments-thread-entity"),f=d.querySelector(".comments-comment-meta__description-title").innerText,g=e.querySelector(".ql-editor").textContent.split(" "),b=[...new Set(g)].join(" ");r.isReplyingTo=b.trim();const T=`
        ${m.innerText} -- by ${f}
        `;r.commenterName=f,r.commentReply=T;const N=c.querySelector(".comments-replies-list");return N?(N.querySelectorAll(".comments-thread-entity").forEach(p=>{const P=p.querySelector(".comments-comment-entity .comments-thread-entity"),H=p.querySelector(".comments-comment-entity .comments-comment-meta__container");if(P&&H){const le=`
              ${H.querySelector(".comments-comment-meta__description-container .comments-comment-meta__description").innerText} replied: 
              ${P.innerText}
            `;r.previousRepliesOnComment.push(le)}}),r.previousRepliesOnComment.forEach(p=>{if(p.includes(r.isReplyingTo+" replied")){r.commentReply=p,r.isSubReplyingTo=!0;return}}),r.replyContext=!0,r):(r.previousRepliesOnComment=[],r.replyContext=!0,r)}return t}else{let n=e.closest(".feed-shared-update-v2");if(n==null&&(n=e.closest(".feed-shared-update-detail-viewer__content")),n){const d=n.querySelector(".feed-shared-update-v2__description");d&&(t.postContent=d.textContent.trim())}const i=n.querySelector(".reader-social-details__comments-list, .comments-comments-list");i&&i.querySelectorAll(".comments-comment-entity").forEach(m=>{const f=m.querySelector(".comments-comment-item__main-content"),g=`
          ${m.querySelector(".comments-comment-meta__description-title").innerText} said: 
          ${f.innerText}
          `;t.previousComments.push(g)});const o=n.querySelector(".update-components-actor__container"),a=o.querySelector(".update-components-actor__title");if(o){const d=a.querySelector("span").innerText;t.postWriter=d}const r={postContent:t.postContent,commenterName:"",commentReply:"",previousRepliesOnComment:[],previousComments:t.previousComments,isReplyingToComment:!0,isReplyingTo:"",isSubReplyingTo:!1},l=e.closest(".comments-comment-entity"),c=e.closest(".comment-social-activity");if(c){const d=l.querySelector(".comments-comment-meta__container .comments-comment-meta__description"),m=l.querySelector(".comments-thread-entity"),f=d.querySelector(".comments-comment-meta__description-title").innerText,g=e.querySelector(".ql-editor").textContent.split(" "),b=[...new Set(g)].join(" ");r.isReplyingTo=b.trim();const T=`
        ${m.innerText}. The comment was posted by "${f}"
        `;r.commenterName=f,r.commentReply=T;const N=c.querySelector(".comments-replies-list");return N?(N.querySelectorAll(".comments-thread-entity").forEach(p=>{const P=p.querySelector(".comments-comment-entity .comments-thread-entity"),H=p.querySelector(".comments-comment-entity .comments-comment-meta__container");if(P&&H){const le=`
              ${H.querySelector(".comments-comment-meta__description-container .comments-comment-meta__description").innerText} replied: 
              ${P.innerText}
            `;r.previousRepliesOnComment.push(le)}}),r.previousRepliesOnComment.forEach(p=>{if(p.includes(r.isReplyingTo)){r.commentReply=p,r.isSubReplyingTo=!0;return}}),r.replyContext=!0,r):(r.previousRepliesOnComment=[],r.replyContext=!0,r)}return t}}async function et(e){if(!u.reply_enabled)return;const{access_token:t}=await chrome.storage.local.get(["access_token"]);if(t==null)throw new Error("Please Sign in to continue");let n="Generate 3 LinkedIn comment replies that are playful, smart, and thoughtful, they should feel natural - like something a sharp professional would say in public:",i={};u.selectedPersona&&L[u.selectedPersona]&&(i=L[u.selectedPersona]),e.postContent&&(n+=` The post says: "${e.postContent}"`),e.postWriter&&(n+=`. Written by ${e.postWriter}`),e.previousComments&&e.previousComments.length>0&&(n+=`. Look at these previous comments as inspiration for tone, vibe, or topic: ${e.previousComments.join(" | ")}`),n+=`. The tone should be ${u.tone}. And industry should be ${u.industry}`,n+=` Write each reply:
    - Under 20 words
    - Distinct in voice or viewpoint
    - Without hashtags
    - Without starting with "Your"
    - Use emojis cautiously so it doesn't sound too robotic
    - Without sounding like an AI or bot
    - Avoid generic responses
    - Feel free to be slightly opinionated, clever, or relatable
    
    IMPORTANT: In addition to the instruction above the user has also selected a persona for you to follow while generating the replies. Please make sure to follow the persona instructions closely.
    PERSONA:
      Name: ${i.name||"N/A"}
      Description: ${i.description||"N/A"}
      Prompt: ${i.prompt||"N/A"}`;async function o(){return await(await window.lia_fetchWithAuth("https://api.getlia.live/api/prompt/suggest-reply",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await v()}`},body:JSON.stringify({comment_text:n,...i&&{persona:i}})})).json()}let a=await o();return a.error?a:a.suggestions}async function tt(e){if(!u.reply_enabled)return;const{access_token:t}=await chrome.storage.local.get(["access_token"]);if(t==null)throw new Error("Please Sign in to continue");let n="You are replying to a **comment** on a LinkedIn post. Generate 3 thoughtful and human-sounding LinkedIn replies",i={};u.selectedPersona&&L[u.selectedPersona]&&(i=L[u.selectedPersona]),e.commentReply&&(n+=` to this comment${e.isSubReplyingTo?" (a nested reply - a reply to another reply)":""}: "${e.commentReply}"`),e.postContent&&(n+=`. The original post is: "${e.postContent}"`),e.postWriter&&(n+=`. The original post was written by ${e.postWriter}`),e.previousRepliesOnComment&&e.previousRepliesOnComment.length>0&&(n+=`. Consider these previous replies to that comment: ${e.previousRepliesOnComment.join(" | ")}`),n+=`. The tone should be ${u.tone} and industry should be ${u.industry}`,n+=" Respond from either the perspective of the **author replying to a comment**, or a **regular user replying to another user** — whichever fits the situation. Vary the tone and style across the 3 replies.",n+=` Each suggestion should:
    - Be under 15 words
    - Feel human and natural
    - Add value to the conversation
    - Include no hashtags
    - Use no emojis
    - Never start with "Your" or use "Your [something] is..."
    - Avoid generic or robotic responses`,n+=`
    
    Only return the 3 replies. No explanation, no intro-text or extra formatting.
    
    IMPORTANT: In addition to the instruction above the user has also selected a persona for you to follow while generating the replies. Please make sure to follow the persona instructions closely.
    PERSONA:
      Name: ${i.name||"N/A"}
      Description: ${i.description||"N/A"}
      Prompt: ${i.prompt||"N/A"}`;async function o(){return await(await window.lia_fetchWithAuth("https://api.getlia.live/api/prompt/suggest-reply",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await v()}`},body:JSON.stringify({comment_text:n,persona:i})})).json()}let a=await o();return a.error?a:a.suggestions}function nt(e,t,n){e.innerHTML=`
      <h3 style=${u.linkedinTheme==="dark"?"color: #71b7fb":""}>AI Reply Suggestions</h3>
      <div class="linkedin-ai-suggestion-list">
        ${t.map((r,l)=>`
          <div class="linkedin-ai-suggestion" data-index="${l}" style="${u.linkedinTheme==="dark"?"background-color: #1B1F23; color: #BEBEBE; border: 0;":""}">
            ${r}
          </div>
        `).join("")}
      </div>
      <div class="linkedin-ai-actions">
        <button class="linkedin-ai-dismiss" style=${u.linkedinTheme==="dark"?"color: #71b7fb":""}>Dismiss</button>
        <button class="linkedin-ai-regenerate" style=${u.linkedinTheme==="dark"?"color: #71b7fb":""}>Regenerate</button>
      </div>
    `,e.querySelectorAll(".linkedin-ai-suggestion").forEach(r=>{r.addEventListener("click",function(){const l=this.getAttribute("data-index"),c=t[l],d=n.querySelector(".ql-editor");it(d,c),e.remove()})}),e.querySelector(".linkedin-ai-dismiss").addEventListener("click",()=>{e.remove()}),e.querySelector(".linkedin-ai-regenerate").addEventListener("click",r=>{r.preventDefault(),ke(n)})}function it(e,t){if(e.isContentEditable){e.textContent=t.replaceAll('"',"");const n=new Event("input",{bubbles:!0});e.dispatchEvent(n)}else if(e.tagName==="TEXTAREA"){e.value=t;const n=new Event("input",{bubbles:!0});e.dispatchEvent(n)}else e.textContent=t}const v=async()=>{const{access_token:e}=await chrome.storage.local.get(["access_token"]);if(!e)throw new Error("Please Sign in to continue");return e},L={professional:{name:"Professional",description:"Formal, industry-focused responses",icon:"💼",prompt:"Respond in a professional, formal tone suitable for business networking"},conversational:{name:"Conversational",description:"Friendly, approachable tone",icon:"💬",prompt:"Respond in a friendly, conversational tone that builds rapport"},thoughtLeader:{name:"Thought Leader",description:"Insightful, question-provoking responses",icon:"🧠",prompt:"Respond as a thought leader with insightful, authoritative, strategic perspectives"},supportive:{name:"Supportive",description:"Encouraging, positive reinforcement",icon:"🤝",prompt:"Respond with encouragement and positive reinforcement"},analytical:{name:"Analytical",description:"Data-driven, logical responses",icon:"📊",prompt:"Respond with analytical, data-driven insights and logical reasoning"},networking:{name:"Networking",description:"Connection-building, relationship-focused",icon:"🌐",prompt:"Respond with a focus on building connections and relationships"},conciseExpert:{name:"Concise Expert",description:"Short, direct, minimal words but maximum insight",icon:"🎯",prompt:"Respond as a concise expert: use minimal words, be direct, and deliver maximum insight in each reply"}};let $={microContent:{name:"Micro-Content",description:"Very short sentences. Each on new line. Maximum impact.",icon:"⚡",example:{author:"Sarah Chen",content:`Just shipped our biggest feature yet.

6 months of work.

3 failed attempts.

1 breakthrough moment.

Sometimes persistence is everything.

What's your biggest win this quarter?`,engagement:{likes:"847",comments:"23"}},prompt:"Write in micro-content style with very short sentences, each on a new line for maximum impact"},storyArc:{name:"Story Arc",description:"Hook → Context → Challenge → Resolution → Lesson",icon:"📖",example:{author:"Marcus Rodriguez",content:`I almost quit my job last month.

After 3 years at the company, I felt stuck. No growth, same tasks, same meetings. The Sunday scaries were real.

Then my manager pulled me aside: "We're launching a new division. Want to lead it?"

Sometimes the breakthrough comes right when you're about to give up.

Lesson: Have the difficult conversations before making big decisions.`,engagement:{likes:"1.2K",comments:"67"}},prompt:"Structure your post as a story with a clear hook, context, challenge, resolution, and lesson learned"},listFormat:{name:"List Format",description:"Numbered insights, bullet points, structured takeaways",icon:"📝",example:{author:"Jennifer Park",content:`5 things I learned building a remote team:

1. Overcommunicate everything
2. Document decisions in writing
3. Create virtual water cooler moments
4. Respect time zones religiously
5. Invest in good tools

Remote work isn't just office work from home.

It's a completely different operating system.

What would you add to this list?`,engagement:{likes:"923",comments:"45"}},prompt:"Structure your content as a numbered list or bullet points with clear takeaways"},questionDriven:{name:"Question-Driven",description:"Starts with provocative question, builds to answer",icon:"❓",example:{author:"David Kim",content:`What if I told you the best networking happens when you're not trying to network?

Last week at a coffee shop, I helped someone with their laptop. No business cards exchanged. No LinkedIn requests.

Just one human helping another.

3 days later, they introduced me to their CEO.

Authentic relationships > transactional connections.

When did you last help someone without expecting anything back?`,engagement:{likes:"1.5K",comments:"89"}},prompt:"Start with a provocative question and build your narrative around answering it"},vulnerableLeader:{name:"Vulnerable Leader",description:"Shares failures/struggles, shows humanity",icon:"💝",example:{author:"Rachel Thompson",content:`I made a $50K mistake last quarter.

Approved a campaign without proper testing. It flopped spectacularly.

My first instinct? Hide it. Blame external factors. Make excuses.

Instead, I called an all-hands meeting and owned it completely.

The team's response surprised me. They shared their own mistakes. We problem-solved together.

Vulnerability isn't weakness in leadership.

It's the foundation of trust.`,engagement:{likes:"2.1K",comments:"134"}},prompt:"Share a personal failure or struggle that led to growth, showing vulnerability and humanity"},contrarian:{name:"Contrarian Take",description:"Challenges common beliefs, 'unpopular opinion' posts",icon:"🔥",example:{author:"Alex Morgan",content:`Unpopular opinion: Most networking events are a waste of time.

Here's why:

→ Surface-level conversations
→ Everyone's in 'pitch mode'
→ No real connection happens
→ Follow-ups feel forced

Better alternatives:

→ Industry workshops
→ Volunteer opportunities  
→ Online communities
→ One-on-one coffee chats

Stop collecting business cards.

Start building real relationships.

Agree or disagree?`,engagement:{likes:"856",comments:"92"}},prompt:"Present a contrarian viewpoint that challenges conventional wisdom in your industry"}};const s={isOpen:!1,isMinimized:!1,sidebarCollapsed:!1,conversations:[],currentConversationId:null,position:{x:window.innerWidth-80,y:window.innerHeight-80},referenceMode:!1,referencedContent:null,notesMode:!1,notes:[],currentNoteId:null,noteContext:null,templateMode:!1,selectedTemplate:null};async function k(){await chrome.storage.local.set({chatbotState:s})}chrome.storage.local.get(["chatbotState"],e=>{e.chatbotState&&Object.assign(s,e.chatbotState)});const Ce=async()=>{const e=await chrome.storage.local.get(["chatbotState"]);e.chatbotState&&Object.assign(s,e.chatbotState)};async function Ee(){const{chatbot_enabled:e}=await chrome.storage.sync.get(["chatbot_enabled"]);e&&window.location.href.includes("linkedin.com")&&(await Ce(),ot(),rt(),s.notesMode?(s.notesMode=!1,await Be()):s.templateMode?(s.templateMode=!1,await Te()):await X(),S(),await Ie(),Q())}function ot(){const e=document.getElementById("lia-chatbot-button");e&&e.remove();const t=document.createElement("div");t.id="lia-chatbot-button",t.innerHTML=`
    <div class="lia-logo-container">
      <svg class="lia-logo" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
        <circle cx="16" cy="4" r="2" fill="#ffffff"/>
        <path d="M12 8a4 4 0 0 1 4-4" stroke="#ffffff"/>
      </svg>
      <div class="lia-pulse-ring"></div>
      <div class="lia-pulse-ring-2"></div>
      <div class="lia-notification-dot"></div>
    </div>
  `,t.style.cssText=`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #0a66c2, #004182);
    border-radius: 50%;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 4px 20px rgba(10, 102, 194, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 255, 255, 0.2);
    overflow: hidden;
  `,t.addEventListener("mouseenter",()=>{t.style.transform="scale(1.1) rotate(5deg)",t.style.boxShadow="0 6px 25px rgba(10, 102, 194, 0.4)"}),t.addEventListener("mouseleave",()=>{t.style.transform="scale(1) rotate(0deg)",t.style.boxShadow="0 4px 20px rgba(10, 102, 194, 0.3)"}),t.addEventListener("click",xt),document.body.appendChild(t),at()}function at(){if(document.getElementById("lia-chatbot-styles"))return;const e=document.createElement("style");e.id="lia-chatbot-styles",e.textContent=`
    .lia-logo-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lia-logo {
      animation: liaFloat 4s ease-in-out infinite;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
      transform-origin: center;
    }

    .lia-pulse-ring {
      position: absolute;
      width: 80px;
      height: 80px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      animation: liaPulse 3s ease-out infinite;
    }

    .lia-pulse-ring-2 {
      position: absolute;
      width: 80px;
      height: 80px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      animation: liaPulse 3s ease-out infinite 1.5s;
    }

    .lia-notification-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 12px;
      height: 12px;
      background: #ff4757;
      border-radius: 50%;
      border: 2px solid white;
      animation: liaNotificationPulse 2s ease-in-out infinite;
      opacity: 0;
    }

    .lia-notification-dot.show {
      opacity: 1;
    }

    /* Note Display Styles */
    .lia-message.note {
      background: linear-gradient(135deg, #f8f9fa, #ffffff);
      border: 1px solid #e9ecef;
      border-radius: 12px;
      margin: 12px 0;
      padding: 4px;
    }
    
    .lia-message.note .lia-message-content {
      background: transparent;
      border: none;
      box-shadow: none;
    }
    
    .lia-note-content {
      position: relative;
    }
    
    .lia-note-header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      gap: 12px;
      align-items: center;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e9ecef;
      position: relative;
    }
    
    .lia-note-title {
      font-weight: 600;
      color: #0a66c2;
      font-size: 14px;
    }
    
    .lia-note-timestamp {
      font-size: 11px;
      color: #6c757d;
      white-space: nowrap;
      position: absolute;
      bottom: .5px;
      right: 2px;
    }
    
    .lia-note-body {
      line-height: 1.6;
      margin-bottom: 12px;
      color: #495057;
    }
    
    .lia-note-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
    }
    
    .lia-tag {
      background: #e7f3ff;
      color: #0a66c2;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
    }
    
    .lia-note-actions {
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    .lia-message.note:hover .lia-note-actions {
      opacity: 1;
    }
    
    .lia-note-action-btn {
      padding: 6px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid #dee2e6;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .lia-note-action-btn:hover {
      background: #0a66c2;
      color: white;
      transform: scale(1.1);
    }
    
    .lia-note-action-btn.lia-delete-btn:hover {
      background: #dc3545;
    }

    .lia-input-actions {
      display: flex;
      gap: 8px;
      justify-content: center;
      align-items: center;
      padding: 8px 0;
      flex-direction: column;
      padding-right: 15px;
      border-right: 2px solid #eee;
    }

    .lia-context-info {
      color: #495057;
      margintTop: 5px;
    }
    
    /* Note formatting styles */
    .lia-note-h3 {
      font-size: 16px;
      font-weight: 600;
      color: #0a66c2;
      margin: 12px 0 8px 0;
    }
    
    .lia-note-h4 {
      font-size: 14px;
      font-weight: 600;
      color: #495057;
      margin: 10px 0 6px 0;
    }
    
    .lia-note-ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    
    .lia-note-li {
      margin: 4px 0;
      color: #495057;
    }
    
    /* Loading spinner for notes */
    .lia-loading-spinner {
      border: 2px solid #f3f3f3;
      border-top: 2px solid #0a66c2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Added persona selector styles */
    .lia-reply-assistant {
      display: flex;
      gap: 8px;
      align-items: center;
      z-index: 1000;
    }

    .lia-persona-selector {
      position: relative;
    }

    .lia-persona-btn {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: var(--accent);
      border-radius: 16px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
      color: white;
    }

    .lia-persona-btn:hover, .linkedin-ai-button:hover {
      background: var(--accent-invert);
      color: var(--accent-foreground);
    }

    .lia-persona-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 280px;
      background: var(--popover);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      z-index: 1001;
      margin-top: 4px;
      overflow: hidden;
    }

    .lia-persona-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.2s;
      border-bottom: 1px solid var(--border);
    }

    .lia-persona-option:last-child {
      border-bottom: none;
    }

    .lia-persona-option:hover {
      background: var(--accent);
      color: var(--accent-foreground);
    }

    .lia-persona-option.active {
      background: var(--primary);
      color: var(--primary-foreground);
    }

    .lia-persona-info {
      flex: 1;
      color: var(--persona-option-color);
    }

    .lia-persona-name {
      font-weight: 600;
      font-size: 12px;
    }

    .lia-persona-desc {
      font-size: 11px;
      opacity: 0.8;
      margin-top: 2px;
    }

    .lia-persona-icon {
      font-size: 12px;
    }

    .lia-reply-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: var(--primary);
      color: var(--primary-foreground);
      border: none;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .lia-reply-btn:hover {
      background: var(--secondary);
      color: var(--secondary-foreground);
    }

    /* Added template styles */
    .lia-template-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      margin-bottom: 6px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
      color: #495057;
    }

    .lia-template-item:hover {
      background: var(--accent);
      color: var(--accent-foreground);
      transform: translateX(4px);
      border-color: var(--primary);
    }

    .lia-template-item.active {
      background: var(--primary);
      color: var(--primary-foreground);
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(22, 78, 99, 0.3);
    }

    .lia-template-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .lia-template-info {
      flex: 1;
      min-width: 0;
    }

    .lia-template-name {
      font-weight: 600;
      font-size: 12px;
      margin-bottom: 2px;
    }

    .lia-template-description {
      font-size: 10px;
      opacity: 0.8;
      line-height: 1.3;
    }

    .lia-template-example {
      margin: 16px 0;
    }

    .lia-linkedin-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      max-width: 500px;
    }

    .lia-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .lia-card-avatar {
      width: 48px;
      height: 48px;
      background: var(--primary);
      color: var(--primary-foreground);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 18px;
    }

    .lia-card-info {
      flex: 1;
    }

    .lia-card-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--card-foreground);
    }

    .lia-card-title {
      font-size: 12px;
      color: var(--muted-foreground);
      margin: 2px 0;
    }

    .lia-card-time {
      font-size: 11px;
      color: var(--muted-foreground);
    }

    .lia-card-content {
      font-size: 14px;
      line-height: 1.5;
      color: var(--card-foreground);
      margin-bottom: 12px;
      white-space: pre-line;
    }

    .lia-card-engagement {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: var(--muted-foreground);
      padding-top: 8px;
      border-top: 1px solid var(--border);
    }

    /*.lia-mode-badge {
      background: var(--accent);
      color: var(--accent-foreground);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
    }*/

    /* Quick suggestions slider styles */
    .lia-quick-suggestions {
      position: relative;
      background: linear-gradient(135deg, #f8f9fa, #ffffff);
      border: 1px solid #e9ecef;
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .lia-quick-suggestions.hidden {
      opacity: 0;
      transform: translateY(-10px);
      max-height: 0;
      padding: 0;
      margin: 0;
    }

    .lia-suggestions-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .lia-suggestions-title {
      font-size: 13px;
      font-weight: 600;
      color: #0a66c2;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .lia-suggestions-close {
      background: none;
      border: none;
      color: #6c757d;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .lia-suggestions-close:hover {
      background: #e9ecef;
      color: #495057;
    }

    .lia-suggestions-slider {
      position: relative;
    }

    .lia-suggestions-track {
      display: flex;
      gap: 12px;
      transition: transform 0.3s ease;
      padding: 4px 0;
    }

    .lia-suggestion-card {
      display: flex;
      gap: 15px;
      min-width: 200px;
      max-width: 250px;
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .lia-suggestion-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(10, 102, 194, 0.1), transparent);
      transition: left 0.5s;
    }

    .lia-suggestion-card:hover::before {
      left: 100%;
    }

    .lia-suggestion-card:hover {
      border-color: #0a66c2;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(10, 102, 194, 0.15);
    }

    .lia-suggestion-icon {
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #0a66c2, #004182);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }

    .lia-suggestion-text {
      font-size: 12px;
      color: #495057;
      line-height: 1.4;
      margin-bottom: 8px;
    }

    .lia-suggestion-action {
      font-size: 11px;
      color: #0a66c2;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .lia-suggestions-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #dee2e6;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      backdrop-filter: blur(10px);
      z-index: 10;
    }

    .lia-suggestions-nav:hover {
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-50%) scale(1.1);
    }

    .lia-suggestions-nav.prev {
      left: -7px;
    }

    .lia-suggestions-nav.next {
      right: -7px;
    }

    .lia-suggestions-nav:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: translateY(-50%) scale(1);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .lia-input-actions {
        flex-wrap: wrap;
      }
      
      .lia-action-btn {
        flex: 1;
        min-width: 0;
        justify-content: center;
      }
    }

    @keyframes liaFloat {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg) scale(1); 
      }
      25% { 
        transform: translateY(-4px) rotate(2deg) scale(1.05); 
      }
      50% { 
        transform: translateY(-8px) rotate(0deg) scale(1.1); 
      }
      75% { 
        transform: translateY(-4px) rotate(-2deg) scale(1.05); 
      }
    }

    @keyframes liaPulse {
      0% {
        transform: scale(0.8);
        opacity: 1;
      }
      100% {
        transform: scale(1.4);
        opacity: 0;
      }
    }

    @keyframes liaNotificationPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    @keyframes messageSlideIn {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes avatarPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .lia-chatbot-interface {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 420px;
      height: 500px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
      z-index: 100000;
      display: flex;
      flex-direction: column;
      transform: scale(0) translateY(20px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(20px);

      /*border-bottom-right-radius: 0;*/
    }

    .lia-chatbot-interface.right-radius-bottom-and-width {
      border-bottom-right-radius: 20px;
      bottom: 20px;
      width: calc(420px/2)
    }

    .lia-chatbot-interface.open {
      transform: scale(1) translateY(0);
      opacity: 1;
    }

    .lia-chatbot-interface.minimized {
      height: 60px;
      overflow: hidden;
      width: ${s.notesMode?"305":s.templateMode?"320":"290"}px;
    }

    .lia-chatbot-header {
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 20px 20px 0 0;
      position: relative;
      overflow: hidden;
    }

    .lia-chatbot-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
      transform: translateX(-100%);
      animation: headerShine 3s ease-in-out infinite;
    }

    .lia-chatbot-header:hover {
      cursor: grab;
    }

    @keyframes headerShine {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(100%); }
      100% { transform: translateX(100%); }
    }

    .lia-chatbot-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      font-size: 16px;
      z-index: 1;
      cursor: pointer;
    }

    .lia-chatbot-title svg {
      /* animation: titleLogoSpin 6s linear infinite; */
    }

    @keyframes titleLogoSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .lia-chatbot-controls {
      display: flex;
      gap: 8px;
      z-index: 1;
    }

    .lia-control-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      backdrop-filter: blur(10px);
    }

    .lia-control-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.1);
    }

    .lia-control-btn:active {
      transform: scale(0.95);
    }

    .lia-chatbot-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .lia-chat-sidebar {
      width: 140px;
      background: linear-gradient(180deg, #f8f9fa, #e9ecef);
      border-right: 1px solid #dee2e6;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      position: relative;
      border-bottom-left-radius: 20px;
    }

    .lia-chat-sidebar.collapsed {
      width: 0;
      border-right: none;
      overflow: hidden;
    }

    .lia-sidebar-toggle {
      position: absolute;
      right: -12px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 40px;
      background: #0a66c2;
      border: none;
      border-radius: 0 8px 8px 0;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.3s ease;
      box-shadow: 2px 0 8px rgba(0,0,0,0.1);
    }

    .lia-sidebar-toggle:hover {
      background: #004182;
      transform: translateY(-50%) scale(1.1);
    }

    .lia-sidebar-toggle svg {
      transition: transform 0.3s ease;
    }

    .lia-chat-sidebar.collapsed .lia-sidebar-toggle svg {
      transform: rotate(180deg);
    }

    .lia-sidebar-header {
      padding: 16px 12px 12px;
      border-bottom: 1px solid #dee2e6;
      font-size: 11px;
      font-weight: 700;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: linear-gradient(135deg, #ffffff, #f8f9fa);
    }

    .lia-conversation-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      scrollbar-width: thin;
      scrollbar-color: #dee2e6 transparent;
    }

    .lia-load-more-btn {
      padding: 8px 12px;
      border-radius: 8px;
      color: #0a66c2;
      font-weight: 600;
      cursor: pointer;
    }

    .lia-conversation-list::-webkit-scrollbar {
      width: 4px;
    }

    .lia-conversation-list::-webkit-scrollbar-track {
      background: transparent;
    }

    .lia-conversation-list::-webkit-scrollbar-thumb {
      background: #dee2e6;
      border-radius: 2px;
    }

    .lia-conversation-item {
      padding: 10px 12px;
      margin-bottom: 6px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 12px;
      color: #495057;
      transition: all 0.2s;
      border: 1px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .lia-conversation-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(10, 102, 194, 0.1), transparent);
      transition: left 0.5s;
    }

    .lia-conversation-item:hover::before {
      left: 100%;
    }

    .lia-conversation-item:hover {
      background: #e9ecef;
      transform: translateX(4px);
      border-color: #0a66c2;
    }

    .lia-conversation-item.active {
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(10, 102, 194, 0.3);
    }

    .lia-new-chat-btn {
      margin: 8px;
      padding: 12px;
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }

    .lia-new-chat-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .lia-new-chat-btn:hover::before {
      left: 100%;
    }

    .lia-new-chat-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(10, 102, 194, 0.4);
    }

    .lia-chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .lia-messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      scrollbar-width: thin;
      scrollbar-color: #dee2e6 transparent;
    }

    .lia-messages-container::-webkit-scrollbar {
      width: 6px;
    }

    .lia-messages-container::-webkit-scrollbar-track {
      background: transparent;
    }

    .lia-messages-container::-webkit-scrollbar-thumb {
      background: #dee2e6;
      border-radius: 3px;
    }

    .lia-message {
      display: flex;
      gap: 12px;
      animation: messageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0;
      animation-fill-mode: forwards;
    }

    .lia-message.user {
      flex-direction: row-reverse;
    }

    .lia-message-avatar {
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }

    .lia-message.user .lia-message-avatar {
      color: #0a66c2;
    }

    .lia-message.assistant .lia-message-avatar {
      color: #0a66c2;
      animation: avatarPulse 2s ease-in-out infinite;
    }

    .lia-message.user .lia-chat-user-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    @keyframes avatarPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .lia-message-content {
      max-width: 75%;
      padding: 14px 18px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.5;
      position: relative;
      word-wrap: break-word;
    }

    .lia-message.user .lia-message-content .lia-paragraph {
      color: #fff !important;
    }

    .lia-message.assistant .lia-message-content .lia-paragraph {
      color: #333 !important;
    }

    .lia-message.user .lia-message-content {
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white !important;
      border-bottom-right-radius: 6px;
      box-shadow: 0 4px 12px rgba(10, 102, 194, 0.2);
    }

    .lia-message.assistant .lia-message-content {
      background: linear-gradient(135deg, #f8f9fa, #ffffff);
      color: #333 !important;
      border-bottom-left-radius: 6px;
      border: 1px solid #e9ecef;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    }

    .lia-input-container {
      padding: 20px;
      border-top: 1px solid #e9ecef;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      background: linear-gradient(180deg, #ffffff, #f8f9fa);
    }

    .lia-input-wrapper {
      display: flex;
      gap: 12px;
      align-items: flex-end;
      background: white;
      border-radius: 25px;
      padding: 8px;
      border: 2px solid #e9ecef;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .lia-input-wrapper:focus-within {
      border-color: #0a66c2;
      box-shadow: 0 4px 20px rgba(10, 102, 194, 0.15);
    }

    .lia-message-input {
      flex: 1;
      border: none !important;
      border-radius: 20px;
      padding: 12px 16px;
      font-size: 14px;
      resize: none;
      max-height: 120px;
      min-height: 20px;
      outline: none !important;
      background: transparent;
      font-family: inherit;
      color: #333333;
      
      scrollbar-width: thin;
      scrollbar-color: #0a66c2 #e9ecef;

      &::placeholder {
        color: #888888;
      }
      
      &::-webkit-scrollbar {
        width: 2px;
        height: 2px;
      }
    }

    .lia-message-input:active {
      background: none !important;
      border: none !important;
      outline: none !important;
    }

    .lia-message-input:focus {
      border: none;
      background: none;
      outline: none;
    }

    .lia-send-btn {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }

    .lia-send-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s;
    }

    .lia-send-btn:hover::before {
      left: 100%;
    }

    .lia-send-btn:hover {
      transform: scale(1.1) rotate(15deg);
      box-shadow: 0 6px 20px rgba(10, 102, 194, 0.4);
    }

    .lia-send-btn:active {
      transform: scale(0.95) rotate(15deg);
    }

    .lia-send-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }

    .lia-send-btn:disabled::before {
      display: none;
    }

    .lia-typing-indicator {
      display: flex;
      gap: 6px;
      padding: 14px 18px;
    }

    .lia-typing-dot {
      width: 8px;
      height: 8px;
      background: #0a66c2;
      border-radius: 50%;
      animation: typingBounce 1.4s ease-in-out infinite both;
    }

    .lia-typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .lia-typing-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes messageSlideIn {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes typingBounce {
      0%, 80%, 100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .lia-chatbot-interface {
        width: calc(100vw - 40px);
        height: 70vh;
        right: 20px;
        left: 20px;
        bottom: 100px;
      }
      
      .lia-chat-sidebar {
        width: 0;
        border-right: none;
        overflow: hidden;
      }

      .lia-chat-sidebar.collapsed {
        width: 0;
      }

      .lia-sidebar-toggle {
        display: none;
      }
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    .lia-control-btn.reference-active,
    .lia-control-btn.notes-active,
    .lia-control-btn.template-active {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
    }

    .lia-reference-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(10, 102, 194, 0.1), rgba(16, 185, 129, 0.1));
      border: 2px solid #0a66c2;
      border-radius: 8px;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: all 0.3s ease;
      backdrop-filter: blur(1px);
      pointer-events: all;
    }

    .lia-reference-overlay.show {
      opacity: 1;
    }

    .lia-reference-overlay::before {
      content: '📎 Click to Reference';
      position: absolute;
      top: 8px;
      left: 8px;
      background: #0a66c2;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .linkedin-post-hoverable {
      position: relative;
      cursor: pointer;
    }

    .linkedin-post-hoverable:hover .lia-reference-overlay {
      opacity: 1;
    }

    .lia-referenced-content {
      background: linear-gradient(135deg, #e7f3ff, #f0f9ff);
      border: 1px solid #0a66c2;
      border-radius: 8px;
      padding: 12px;
      margin: 8px 0;
      font-size: 12px;
    }

    .lia-referenced-content-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-weight: 600;
      color: #0a66c2;
    }

    .lia-referenced-content-preview {
      color: #666;
      font-style: italic;
      max-height: 60px;
      overflow: hidden;
      position: relative;
    }

    .lia-referenced-content-preview::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 20px;
      background: linear-gradient(transparent, #f0f9ff);
    }

    .lia-clear-reference {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      font-size: 12px;
      margin-left: auto;
    }
  `,document.head.appendChild(e)}function rt(){const e=document.getElementById("lia-chatbot-interface");e&&e.remove();const t=document.createElement("div");t.id="lia-chatbot-interface",t.className=`lia-chatbot-interface ${s.isOpen?"open":""}`,t.innerHTML=`
    <div class="lia-chatbot-header">
      <div class="lia-chatbot-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
          <circle cx="16" cy="4" r="2" fill="currentColor"/>
          <path d="M12 8a4 4 0 0 1 4-4" stroke="currentColor"/>
        </svg>
        <span id="lia-mode-title">LIA</span>
        <div id="lia-mode-indicator" style="display: none; margin-left: 8px;">
          <div class="lia-mode-badge" id="lia-template-badge" style="display: none;">Template</div>
          <div class="lia-mode-badge" id="lia-notes-badge" style="display: none;">Notes</div>
        </div>
      </div>
      <div class="lia-chatbot-controls">
        <button class="lia-control-btn ${s.templateMode?"template-active":""}" id="lia-template-toggle" title="Template Mode: OFF">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="9" x2="15" y2="9"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        </button>
        <button class="lia-control-btn ${s.notesMode?"notes-active":""}" id="lia-notes-toggle" title="Notes Mode: OFF">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </button>
        <button class="lia-control-btn ${s.referenceMode?"reference-active":""}" id="lia-reference-toggle" title="Reference Mode (Pro): OFF">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>
        <button class="lia-control-btn" id="lia-minimize-btn" title="Minimize">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button class="lia-control-btn" id="lia-close-btn" title="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <div class="lia-chatbot-body">
      <div class="lia-chat-sidebar" id="lia-chat-sidebar">
        <button class="lia-sidebar-toggle" id="lia-sidebar-toggle" title="Toggle Sidebar">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>
        <div class="lia-sidebar-header" id="lia-sidebar-header">Recent Chats</div>
        <div class="lia-conversation-list" id="lia-conversation-list">
          <!-- Conversations/Notes will be populated here -->
        </div>
        <button class="lia-load-more-btn" id="lia-load-more-btn">Load more</button>
        <button class="lia-new-chat-btn" id="lia-new-chat-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Chat
        </button>
        <!-- Profile Card Component -->
        <div id="lia-profile-card" class="lia-profile-card">
          <!-- Dropdown Menu -->
          <div id="profile-menu" class="profile-menu hidden">
            <div class="menu-item" data-action="upgrade">
              <span class="menu-icon">⬆️</span>
              <span><a href="https://www.getlia.live/pricing" target="_blank" class='menu-link'>Upgrade plan</a></span>
            </div>
            <div class="menu-item" data-action="customize">
              <span class="menu-icon">🎨</span>
              <span>Customize LIA</span>
            </div>
            <!--<div class="menu-item" data-action="settings">
              <span class="menu-icon">⚙️</span>
              <span>Settings</span>
            </div>-->
            <div class="menu-item submenu-parent" data-action="help">
              <span class="menu-icon">❓</span>
              <span>Help</span>
              <span class="submenu-arrow">›</span>
              
              <!-- Help Submenu -->
              <div class="submenu">
                <div class="menu-item" data-action="help-center">
                  <span class="menu-icon">❓</span>
                  <span><a href="https://www.getlia.live/support?from=extension" target="_blank" class='menu-link'>Help center</a></span>
                </div>
                <div class="menu-item" data-action="release-notes">
                  <span class="menu-icon">📝</span>
                  <span><a href="https://www.getlia.live/release-notes" target="_blank" class='menu-link'>Release notes</a></span>
                </div>
                <div class="menu-item" data-action="terms">
                  <span class="menu-icon">📋</span>
                  <span><a href="https://www.getlia.live/terms" target="_blank"  class='menu-link'>Terms & policies</a></span>
                </div>
                <div class="menu-item" data-action="report-bug">
                  <span class="menu-icon">🐛</span>
                  <span><a href="https://www.getlia.live/feedback?from=extension" target="_blank" class='menu-link'>Report Bug</a></span>
                </div>
              </div>
            </div>
            <div class="menu-item" data-action="logout">
              <span class="menu-icon">🚪</span>
              <span><a href="https://www.getlia.live/logout" target="_blank" class='menu-link'>Log out</a></span>
            </div>
          </div>
          <div class="profile-info" title='click to open menu'>
            <img src="${x?.profile_picture_url}" alt="Profile" class="profile-avatar" id="profile-avatar">
            <div class="profile-details">
              <span class="profile-name" id="profile-name">User</span>
              <span class="profile-status">Free</span>
            </div>
          </div>
        </div>
      </div>

      <div class="lia-chat-main">
        <div class="lia-messages-container" id="lia-messages-container">
          <div class="lia-message assistant">
            <div class="lia-message-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
                <circle cx="16" cy="4" r="2" fill="#0a66c2"/>
                <path d="M12 8a4 4 0 0 1 4-4" stroke="#0a66c2"/>
              </svg>
            </div>
            <div class="lia-message-content">
              Hi! I'm Lia, your LinkedIn Intelligent Assistant. <br/><br/> I'm here to help you write posts, polish comments, and improve your content. <br/><br/>What can I assist you with today?
            </div>
          </div>
        </div>

        <div class="lia-input-container">
          <!-- Quick suggestion area for reference mode in chat mode -->

          <div class="lia-quick-suggestions hidden" id="lia-quick-suggestions">
            <div class="lia-suggestions-header">
              <div class="lia-suggestions-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                Quick Suggestions
              </div>
              <button class="lia-suggestions-close" id="lia-suggestions-close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="lia-suggestions-slider">
              <div class="lia-suggestions-track" id="lia-suggestions-track">
                 Suggestions will be populated here 
              </div>
              <button class="lia-suggestions-nav prev" id="lia-suggestions-prev" disabled>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </button>
              <button class="lia-suggestions-nav next" id="lia-suggestions-next">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Enhanced input area with mode-specific features -->
          <div class="lia-input-wrapper">
            <div class="lia-input-actions" id="lia-input-actions" style="display: none;">
              <!-- Note enhancement buttons -->
              <button class="lia-action-btn" id="lia-structure-note" title="Structure Note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
              <button class="lia-action-btn" id="lia-summarize-note" title="Summarize">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </button>
              <button class="lia-action-btn" id="lia-expand-note" title="Expand Details">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15,3 21,3 21,9"/>
                  <polyline points="9,21 3,21 3,15"/>
                  <line x1="21" y1="3" x2="14" y2="10"/>
                  <line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
              </button>
              <button class="lia-action-btn" id="lia-add-tags" title="Add Tags">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              </button>
            </div>
            <textarea
              style="border: none; outline: none;" 
              class="lia-message-input"
              id="lia-message-input"
              placeholder="What do you want to post?"
              rows="1"
            ></textarea>
            <button class="lia-send-btn" id="lia-send-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9"></polygon>
              </svg>
            </button>
          </div>
          <div class="lia-notes-mode-indicator" id="lia-notes-mode-indicator">
            <!-- <span class="lia-mode-text">Notes Mode Active</span> -->
            <div class="lia-context-info" id="lia-context-info"></div>
            <div class="lia-notes-info" id="lia-notes-info" title="Notes are stored locally, you must sync to save them.">
              
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Customization Modal -->
    <div id="customization-modal" class="modal-overlay hidden">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Customize LIA</h2>
          <button class="close-btn" id="close-modal">×</button>
        </div>
        
        <div class="modal-body">
          <p class="modal-subtitle">Introduce yourself to get better, more personalized responses</p>
          
          <div class="form-group">
            <label>What should LIA call you?</label>
            <input type="text" id="nickname" placeholder="Nickname" class="form-input">
          </div>
          
          <div class="form-group">
            <label>What do you do?</label>
            <input type="text" id="occupation" placeholder="Professional cat herder" class="form-input">
          </div>
          
          <div class="form-group">
            <label>What personality should LIA have?</label>
            <select id="personality" class="form-select">
              <option value="default">Default</option>
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>What traits should LIA have?</label>
            <div class="traits-container">
              <div class="trait-tag" data-trait="chatty" id="trait-chatty">+ Chatty</div>
              <div class="trait-tag" data-trait="witty" id="trait-witty">+ Witty</div>
              <div class="trait-tag" data-trait="straight-shooting" id="trait-straight-shooting">+ Straight shooting</div>
              <div class="trait-tag" data-trait="encouraging" id="trait-encouraging">+ Encouraging</div>
              <div class="trait-tag" data-trait="gen-z" id="trait-gen-z">+ Gen Z</div>
              <div class="trait-tag" data-trait="traditional" id="trait-traditional">+ Traditional</div>
              <div class="trait-tag" data-trait="forward-thinking" id="trait-forward-thinking">+ Forward thinking</div>
            </div>
            <textarea id="custom-traits" placeholder="Describe or select traits" class="form-textarea"></textarea>
          </div>
          
          <div class="form-group">
            <label>Anything else LIA should know about you?</label>
            <textarea id="additional-info" placeholder="Interests, values, or preferences to keep in mind" class="form-textarea"></textarea>
          </div>
          
          <!--<div class="form-group">
            <label class="toggle-label">
              <input type="checkbox" id="enable-new-chats" checked>
              <span class="toggle-slider"></span>
              Enable for new chats
            </label>
          </div>-->
        </div>
        
        <div class="modal-footer">
          <button class="btn-secondary" id="cancel-btn">Cancel</button>
          <button class="btn-primary" id="save-btn">Save</button>
        </div>
      </div>
    </div>

  `,document.body.appendChild(t),st()}function st(){const e=document.getElementById("lia-message-input"),t=document.getElementById("lia-send-btn"),n=document.getElementById("lia-minimize-btn"),i=document.getElementById("lia-close-btn"),o=document.getElementById("lia-sidebar-toggle"),a=document.getElementById("lia-chat-sidebar"),r=document.getElementById("lia-load-more-btn"),l=document.getElementById("lia-new-chat-btn"),c=document.querySelector(".lia-chatbot-title"),d=document.getElementById("lia-reference-toggle"),m=document.getElementById("lia-notes-toggle"),f=document.getElementById("lia-template-toggle"),y=document.getElementById("lia-structure-note"),g=document.getElementById("lia-summarize-note"),E=document.getElementById("lia-expand-note"),b=document.getElementById("lia-add-tags");document.getElementById("lia-quick-suggestions");const T=document.getElementById("lia-suggestions-close");document.getElementById("lia-suggestions-track");const N=document.getElementById("lia-suggestions-prev"),se=document.getElementById("lia-suggestions-next");a.classList.add("collapsed"),e.focus(),e.addEventListener("input",function(){this.style.height="auto",this.style.height=Math.min(this.scrollHeight,120)+"px"}),e.addEventListener("keydown",p=>{p.key==="Enter"&&!p.shiftKey&&(p.preventDefault(),s.notesMode?Ne():ie())}),e.addEventListener("input",function(){t.disabled=!this.value.trim()}),n.addEventListener("click",p=>{p.stopPropagation(),wt()}),i.addEventListener("click",p=>{p.stopPropagation(),Re()}),o.addEventListener("click",p=>{p.stopPropagation(),ne()}),c.addEventListener("mouseover",p=>{p.stopPropagation(),ne()}),c.addEventListener("mouseout",p=>{p.stopPropagation(),ne()}),a.addEventListener("mouseover",p=>{p.stopPropagation(),kt()}),r.addEventListener("click",p=>{p.stopPropagation(),Ct()}),l.addEventListener("click",async p=>{p.stopPropagation(),s.notesMode?ee():await J()}),t.addEventListener("click",p=>{p.stopPropagation(),s.notesMode?Ne():ie()}),d.addEventListener("click",p=>{p.stopPropagation(),$t()}),m.addEventListener("click",p=>{p.stopPropagation(),Be()}),f.addEventListener("click",p=>{p.stopPropagation(),Te()}),y?.addEventListener("click",p=>{p.stopPropagation(),F("structure")}),g?.addEventListener("click",p=>{p.stopPropagation(),F("summarize")}),E?.addEventListener("click",p=>{p.stopPropagation(),F("expand")}),b?.addEventListener("click",p=>{p.stopPropagation(),F("tags")}),T?.addEventListener("click",p=>{p.stopPropagation(),S()}),N?.addEventListener("click",p=>{p.stopPropagation(),Se("prev")}),se?.addEventListener("click",p=>{p.stopPropagation(),Se("next")}),Le(),new window.Lia_ProfileCard("lia-chat-sidebar"),new window.Lia_CustomizationModal}async function Te(){s.templateMode=!s.templateMode;const e=document.getElementById("lia-template-toggle"),t=document.getElementById("lia-mode-title"),n=document.getElementById("lia-sidebar-header"),i=document.getElementById("lia-new-chat-btn"),o=document.getElementById("lia-message-input"),a=document.getElementById("lia-mode-indicator"),r=document.getElementById("lia-load-more-btn"),l=document.getElementById("lia-notes-toggle");try{a.style.display="flex"}catch{}if(s.templateMode){w=10,M=10,s.notesMode&&(s.notesMode=!s.notesMode,l.classList.remove("notes-active")),e.classList.add("template-active"),e.title="Template Mode: ON",window.typeWriter("LIA Templates",t),n.textContent="Writing Styles",i.innerHTML=`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Post
      `,o.placeholder="What would you like to write about?";const c=document.getElementById("lia-conversation-list");c.innerHTML="",await lt(),S(),r.style.display="none"}else{if(w=10,M=10,e.classList.remove("template-active"),e.title="Template Mode: OFF",!s.notesMode)try{a.style.display="none"}catch{}window.typeWriter("LIA",t),n.textContent="Conversations",i.innerHTML=`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Chat
      `,o.placeholder="What do you want to post?",X(),r.style.display="block"}await k()}async function lt(){const e=document.getElementById("lia-conversation-list");e&&(await Ie(),e.innerHTML=Object.entries($).map(([t,n])=>`
      <div class="lia-template-item ${s.selectedTemplate===t?"active":""}" data-template="${t}">
        <div class="lia-template-icon">${n.icon}</div>
        <div class="lia-template-info">
          <div class="lia-template-name">${n.name}</div>
          <div class="lia-template-description">${n.description}</div>
        </div>
      </div>
    `).join(""),e.querySelectorAll(".lia-template-item").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.template;Me(n)})}),s.selectedTemplate&&(s.currentConversationId=null,Me(s.selectedTemplate)))}function Me(e){s.selectedTemplate=e,s.currentConversationId=null,s.conversations=[];const t=$[e];document.querySelectorAll(".lia-template-item").forEach(i=>{i.classList.remove("active")}),document.querySelector(`[data-template="${e}"]`).classList.add("active");const n=document.getElementById("lia-messages-container");n.innerHTML=`
      <div class="lia-welcome-message">
        <div class="lia-message assistant">
          <div class="lia-message-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
              <circle cx="16" cy="4" r="2" fill="#0a66c2"/>
              <path d="M12 8a4 4 0 0 1 4-4" stroke="#0a66c2"/>
            </svg>
          </div>
          <div class="lia-message-content">
            Hi! I'm Lia, your LinkedIn Intelligent Assistant.<br/><br/>
            You're using <strong>${t.name}</strong> - posts will be written like the example below:<br/><br/>
            <div class="lia-template-example">
              <div class="lia-linkedin-card">
                <div class="lia-card-header">
                  <div class="lia-card-avatar">${t.example.author.charAt(0)}</div>
                  <div class="lia-card-info">
                    <div class="lia-card-name">${t.example.author}</div>
                    <div class="lia-card-title">Product Manager • 2nd</div>
                    <div class="lia-card-time">2h • 🌍</div>
                  </div>
                </div>
                <div class="lia-card-content">${t.example.content.replace(/\n/g,"<br>")}</div>
                <div class="lia-card-engagement">
                  <span>👍 ${t.example.engagement.likes}</span>
                  <span>💬 ${t.example.engagement.comments}</span>
                  <span>🔄 12</span>
                </div>
              </div>
            </div>
            <br/>This style works great for:<br/>
            • ${t.description}<br/>
            • Building engagement through ${t.name.toLowerCase()} content<br/><br/>
            What would you like to write about today?
          </div>
        </div>
      </div>
    `,k()}const Ie=async()=>{try{const e=await window.lia_fetchWithAuth("https://api.getlia.live/api/chat/templates",{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await v()}`},credentials:"include"}),t=await e.json();console.log("Fetched templates:",t),e.ok?$=t.templates.filter(n=>n.key!=="normal").reduce((n,i)=>(n[i.key]=i,n),{}):console.error("Failed to fetch templates:",t.error)}catch(e){console.error("Error fetching templates:",e)}};function Le(){const e=document.getElementById("lia-quick-suggestions"),t=document.getElementById("lia-suggestions-track");if(!(!e||!t))if(!s.notesMode&&(s.referenceMode||s.referencedContent)){const n=ct();dt(n),pt()}else S()}function ct(){const e=[];if(s.referenceMode&&e.push({icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M9 11H1l8-8 8 8"/>
            <path d="M9 11v10"/>
          </svg>`,text:"Summarize this content",action:"Summarize the key points from the referenced content"},{icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
          </svg>`,text:"What's your take on this?",action:"What's your professional opinion on this content?"},{icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>`,text:"Write a thoughtful comment",action:"Help me write a thoughtful comment on this post"}),s.referencedContent){const t=s.referencedContent.type;t==="post"?e.push({icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>`,text:"Create a similar post",action:"Help me create a similar post with my own perspective"},{icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>`,text:"Extract key insights",action:"What are the key business insights from this post?"}):t==="article"&&e.push({icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>`,text:"Article summary",action:"Provide a concise summary of this article"},{icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>`,text:"Rate and review",action:"What's your professional assessment of this article?"}),u.industry==="technology"&&e.push({icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>`,text:"Tech implications",action:"What are the technology implications of this content?"})}return e.slice(0,6)}function dt(e){const t=document.getElementById("lia-suggestions-track");t&&(t.innerHTML=e.map(n=>`
      <div class="lia-suggestion-card" data-action="${n.action}" title='Click to use'>
        <div class="lia-suggestion-icon">
          ${n.icon}
        </div>
        <div class="lia-suggestion-text">${n.text}</div>
        <!--<div class="lia-suggestion-action">Click to use</div>-->
      </div>
    `).join(""),t.querySelectorAll(".lia-suggestion-card").forEach(n=>{n.addEventListener("click",i=>{i.stopPropagation();const o=n.dataset.action;ie(o),S()})}),$e())}function pt(){const e=document.getElementById("lia-quick-suggestions");e&&e.classList.remove("hidden")}function S(){const e=document.getElementById("lia-quick-suggestions");e&&e.classList.add("hidden")}function Se(e){const t=document.getElementById("lia-suggestions-track");if(!t)return;const n=212,i=t.style.transform,o=i?Number.parseInt(i.match(/-?\d+/)?.[0]||0):0;let a=o;e==="next"?a=o-n:a=o+n;const r=0,l=-(t.children.length-2)*n;a=Math.max(l,Math.min(r,a)),t.style.transform=`translateX(${a}px)`,$e()}function $e(){const e=document.getElementById("lia-suggestions-track"),t=document.getElementById("lia-suggestions-prev"),n=document.getElementById("lia-suggestions-next");if(!e||!t||!n)return;const i=e.style.transform,o=i?Number.parseInt(i.match(/-?\d+/)?.[0]||0):0,a=212,r=0,l=-(e.children.length-2)*a;t.disabled=o>=r,n.disabled=o<=l}async function Be(){s.notesMode=!s.notesMode;const e=document.getElementById("lia-notes-toggle"),t=document.getElementById("lia-mode-title"),n=document.getElementById("lia-sidebar-header"),i=document.getElementById("lia-new-chat-btn"),o=document.getElementById("lia-message-input"),a=document.getElementById("lia-input-actions"),r=document.getElementById("lia-notes-mode-indicator"),l=document.getElementById("lia-send-btn"),c=document.getElementById("lia-load-more-btn");try{c.style.display="block"}catch{}try{r.style.display="flex"}catch{}const d=document.createElement("button");if(d.classList.add("sync-note-btn"),d.textContent="Sync Notes",d.addEventListener("click",async()=>{h("Syncing notes...","info");const m={notes:await te()};await(async()=>{const y=await window.lia_fetchWithAuth("https://api.getlia.live/api/note/notes",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await v()}`},credentials:"include",body:JSON.stringify(m)});if(!y.ok)throw console.error("Error syncing notes:",y.statusText),new Error("Failed to sync notes");const g=await y.json();if(g.success&&(console.log("Notes synced successfully"),h("Notes synced successfully","success")),!g.success)throw new Error("Failed to sync notes");return g.success})()}),o.value="",s.templateMode&&(s.templateMode=!s.templateMode,document.getElementById("lia-template-toggle").classList.remove("template-active")),s.notesMode){const m=async g=>{const E=g<10?0:g-10,b=await window.lia_fetchWithAuth(`https://api.getlia.live/api/note/notes?limit=${g}&start=${E}`,{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await v()}`},credentials:"include"});if(!b.ok)throw console.error("Error fetching notes:",b.statusText),new Error("Failed to fetch notes");const T=await b.json();if(T)return console.log("Notes fetched successfully"),s.notes=T,k(),h("Notes fetched successfully","success"),T;if(!T)throw console.log("Failed to fetch notes"),new Error("Failed to fetch notes")},f=document.getElementById("lia-conversation-list");f.innerHTML="",M=10;let y=await m(M);M+=10,S(),w=10,e.classList.add("notes-active"),e.title="Notes Mode: ON",window.typeWriter("LIA Notes",t),n.textContent="Recent Notes",i.innerHTML=`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="12" y1="11" x2="12" y2="17"/>
          <line x1="9" y1="14" x2="15" y2="14"/>
        </svg>
        New Note
      `,o.placeholder="Write your note here...",o.setAttribute("rows","3"),a.style.display="flex",l.innerHTML=`
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="12" y1="11" x2="12" y2="17"/>
          <line x1="9" y1="14" x2="15" y2="14"/>
        </svg>
      `,ut(),K(),y=await ze();try{const g=r.querySelector(".lia-notes-info");g&&g.appendChild(d)}catch{}h("📝 Notes Mode ON - Capture and organize your thoughts","success"),console.log("this is the notes",y),f.innerHTML=y.map(g=>{const E=g.title.slice(0,15)+(g.title.length>15?"...":""),b=oe(g.context?.type);return`
          <div class="lia-conversation-item-wrapper" style="position: relative;">
            <div class="lia-conversation-item ${g.id===s.currentNoteId?"active":""}"
                data-id="${g.id}" title="${g.title}" style="cursor: pointer; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
              <div style="flex: 1; overflow: hidden;">
                <div class="truncatedTitle" style="font-size: 12px; font-weight: 500;">${b} ${E}</div>
                <div style="font-size: 10px; color: #a9d2f3ff; margin-top: 2px;">${Y(g.lastModified)}</div>
              </div>
              <span class="lia-menu-trigger" style="cursor: pointer; padding: 4px; border-radius: 4px; opacity: 0.7; transition: opacity 0.2s;">⋯</span>
            </div>
            <div class="lia-menu" style="display: none; position: absolute; right: 0; top: 100%; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; min-width: 120px; overflow: hidden;">
              <button class="lia-edit-note-btn" data-id="${g.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                <span style="margin-right: 8px;">✏️</span>Edit
              </button>
              <button class="lia-duplicate-note-btn" data-id="${g.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                <span style="margin-right: 8px;">📋</span>Duplicate
              </button>
              <div style="height: 1px; background: #e0e0e0; margin: 4px 0;"></div>
              <button class="lia-delete-note-btn" data-id="${g.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #dc3545; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                <span style="margin-right: 8px;">🗑️</span>Delete
              </button>
            </div>
          </div>
        `}).join(""),qe()}else{M=10,w=10,e.classList.remove("notes-active"),e.title="Notes Mode: OFF",window.typeWriter("LIA",t),n.textContent="Recent Chats",i.innerHTML=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg> New Chat`,o.placeholder="What do you want to post?",o.setAttribute("rows","1"),a.style.display="none";try{r.style.display="none"}catch{}l.innerHTML=`
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22,2 15,22 11,13 2,9"></polygon>
        </svg>`,gt(),await X();try{r.querySelector(".sync-note-btn").remove()}catch{}h("💬 Chat Mode ON","info")}await k()}function ut(){const e=document.getElementById("lia-context-info");let t="";if(window.location.href.includes("linkedin.com/in/")){const n=window.location.pathname.match(/\/in\/([^/]+)/),i=n?n[1]:null;i&&(t=`📋 Profile: ${i}`,s.noteContext={type:"profile",identifier:i,url:window.location.href})}else window.location.href.includes("linkedin.com/feed")?(t="📰 LinkedIn Feed",s.noteContext={type:"feed",identifier:"feed",url:window.location.href}):window.location.href.includes("linkedin.com/pulse")?(t="📖 LinkedIn Article",s.noteContext={type:"article",identifier:"article",url:window.location.href}):(t="🌐 General Note",s.noteContext={type:"general",identifier:"general",url:window.location.href});e.textContent=t}function K(){const e=document.getElementById("lia-messages-container");e.innerHTML=`
      <div class="lia-message assistant">
        <div class="lia-message-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div class="lia-message-content">
          📝 <strong>Welcome to Notes Mode!</strong><br/><br/>
          I can help you:<br/>
          • <strong>Structure</strong> your thoughts into organized notes<br/>
          • <strong>Summarize</strong> long content into key points<br/>
          • <strong>Expand</strong> brief ideas into detailed notes<br/>
          • <strong>Tag</strong> and categorize your notes<br/><br/>
          Start typing your note below, or use the action buttons to enhance existing content!
        </div>
      </div>
    `}function gt(){const e=document.getElementById("lia-messages-container");e.innerHTML=`
      <div class="lia-message assistant">
        <div class="lia-message-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
            <circle cx="16" cy="4" r="2" fill="#0a66c2"/>
            <path d="M12 8a4 4 0 0 1 4-4" stroke="#0a66c2"/>
          </svg>
        </div>
        <div class="lia-message-content">
          Hi! I'm Lia, your LinkedIn Intelligent Assistant. <br/><br/> I'm here to help you write posts, polish comments, and improve your content. <br/><br/>What can I assist you with today?
        </div>
      </div>
    `}async function ee(){document.getElementById("lia-messages-container"),document.querySelector(".lia-message-input").value="",K();const e={id:U(),title:"New Note",content:"",tags:[],context:s.noteContext,timestamp:Date.now(),lastModified:Date.now()};s.currentNoteId=e.id,await _(e),await C(),document.getElementById("lia-message-input").focus()}async function Ne(){const e=document.getElementById("lia-message-input"),t=e.value.trim();if(!t)return;const n=s.currentNoteId||U();let i=[];const o=await R(n);o&&Array.isArray(o.content)&&(i=[...o.content]),t&&(typeof t=="string"?i.push({contentId:q(),type:"text",text:t}):typeof t=="object"&&t.type==="reference"&&i.push({contentId:q(),type:"reference",content:t}));const a={id:n,title:await yt(t),content:i,tags:vt(typeof t=="string"?t:""),context:s.noteContext,timestamp:s.currentNoteId&&o?.timestamp||Date.now(),lastModified:Date.now()};s.currentNoteId=n,Ae(a),e.value="",e.style.height="auto",await _(a),await C(),h("📝 Note saved!","success")}function Ae(e){const t=document.getElementById("lia-messages-container");t.style.opacity="0.5";const n=t.querySelector(".lia-message.assistant");n&&n.textContent.includes("Welcome to Notes Mode")&&n.remove();let i=e.content;Array.isArray(i)&&(i=i.map(r=>{if(r.type==="text"&&typeof r.text=="string"){let l=r.text;return e.tags&&e.tags.length>0&&e.tags.forEach(c=>{l=l.replace(new RegExp(`#${c}\\b`,"g"),"")}),{...r,text:l.trim()}}return r}));const o=e.tags.length>0?`<div class="lia-note-tags">${e.tags.map(r=>`<span class="lia-tag">${r}</span>`).join("")}</div>`:"";let a="";Array.isArray(i)?a=i.map(r=>{if(r.type==="text")return`
          <div class="lia-message note" data-note-id="${e.id}" data-content-note-id="${r.contentId}">
            <div class="lia-message-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
              </div>
              <div class="lia-message-content lia-note-content">
              <div class="lia-note-header">
                <span class="lia-note-title">${e.title}</span>
                <span class="lia-note-timestamp">${Y(e.lastModified)}</span>
              </div>
              <div class="lia-note-body">
                <div class="lia-note-text">${_e(r.text)}</div>
              </div>
              ${o}
              <div class="lia-note-actions">
                <!--<button class="lia-note-action-btn lia-edit-note-btn" data-id="${r.contentId}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>-->
                <button class="lia-note-action-btn lia-duplicate-note-btn" data-id="${r.contentId}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                </button>
                <button class="lia-note-action-btn lia-delete-note-btn" data-id="${r.contentId}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>`;if(r.type==="reference"){const l=r.content;return l&&typeof l=="object"?`
          <div class="lia-referenced-content" title="Click to open">
            <div class="lia-referenced-content-header">
              <a href="${s.referencedContent?s.referencedContent.url:""}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                Referenced ${l.type||"content"}${l.author?` by ${l.author}`:""}
              </a>
            </div>
            <a href="${s.referencedContent?s.referencedContent.url:""}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; font-weight: normal" class="lia-referenced-content-preview" title="Click to open">
              ${l.text?l.text.substring(0,150):""}
              ${l.text&&l.text.length>150?"...":""}
            </a>
          </div>
          `:""}return""}).join(""):a=_e(e.content),t.innerHTML=a,t.scrollTop=t.scrollHeight,e.content===""&&K(),setTimeout(()=>{t.style.opacity="1"},50)}async function F(e){const t=document.getElementById("lia-message-input"),n=t.value.trim();if(!n){h("Please write some content first","warning");return}const i=document.createElement("div");i.className="lia-message assistant",i.innerHTML=`
      <div class="lia-message-avatar">
        <div class="lia-loading-spinner" style="width: 16px; height: 16px;"></div>
      </div>
      <div class="lia-message-content">
        <div class="lia-typing-indicator">
          <div class="lia-typing-dot"></div>
          <div class="lia-typing-dot"></div>
          <div class="lia-typing-dot"></div>
        </div>
      </div>
    `;const o=document.getElementById("lia-messages-container");o.appendChild(i),o.scrollTop=o.scrollHeight;try{let a="";switch(e){case"structure":a=await D(e,n,"Structure this note with clear headings, bullet points, and organized sections");break;case"summarize":a=await D(e,n,"Summarize this content into key points and main takeaways");break;case"expand":a=await D(e,n,"Expand this note with more details, examples, and comprehensive information");break;case"tags":a=await D(e,n,"Generate relevant tags for this content. Return only the content plus the space separated tags (as hashtags - e.g. #tag1 #tag2) one line after the conte");break}i.remove(),t.value=a,t.style.height="auto",t.style.height=Math.min(t.scrollHeight,120)+"px",h(`✨ Note ${e==="tags"?"tagged":e+"d"} successfully!`,"success")}catch(a){i.remove(),h(`Failed to ${e} note`,"error"),console.error("Note enhancement error:",a)}}async function D(e,t,n){const i=`${n}:

"${t}"

Return only the enhanced content without explanations or appending the type/anything infront of it.`,o=await fetch("https://api.getlia.live/api/note/enhance-note",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await v()}`},body:JSON.stringify({type:e,prompt:i,content:t,context:s.noteContext})}),a=await o.json();if(!o.ok)throw new Error(a.error?.message||"Failed to enhance note");return a.enhancedNote}async function ze(){try{const e=await te();if(s.notes=e,e.length===0){ee();return}return e.length>0&&(s.currentNoteId=e[0].id,await z(s.currentNoteId)),e}catch(e){console.error("Error loading notes:",e)}}async function z(e){const t=await R(e);if(!t)return;s.currentNoteId=e;const n=document.getElementById("lia-messages-container");n.innerHTML="",Ae(t);const i=document.getElementById("lia-message-input");if(t.tags&&t.tags.length>0)if(Array.isArray(t.content)){const a=[...t.content].reverse().find(c=>c.type==="text");let r=a?a.text:"";const l=t.tags.map(c=>`#${c}`).join(" ");l&&!r.includes(l)?i.value=(r+`
`+l).trim():i.value=r}else{let a=typeof t.content=="string"?t.content:"";const r=t.tags.map(l=>`#${l}`).join(" ");r&&!a.includes(r)?i.value=(a+`
`+r).trim():i.value=a}else if(Array.isArray(t.content)){const a=[...t.content].reverse().find(r=>r.type==="text");i.value=a?a.text:""}else i.value=typeof t.content=="string"?t.content:"";i.style.height="auto",i.style.height=Math.min(i.scrollHeight,120)+"px",document.querySelectorAll(".lia-conversation-item").forEach(a=>{a.getAttribute("data-id")===conversationId?a.classList.add("active"):a.classList.remove("active")})}async function _(e){return new Promise(t=>{chrome.storage.local.get(["lia_notes"],n=>{const i=n.lia_notes||[],o=i.findIndex(a=>a.id===e.id);o>=0?i[o]=e:i.unshift(e),chrome.storage.local.set({lia_notes:i},t)})})}async function mt(e,t){return new Promise(n=>{chrome.storage.local.get(["lia_notes"],i=>{const o=i.lia_notes||[],a=o.findIndex(r=>r.id===e.id);a>=0?o[a].content.push(t):o.unshift(e),chrome.storage.local.set({lia_notes:o},n)})})}async function R(e){return new Promise(t=>{chrome.storage.local.get(["lia_notes"],n=>{const i=n.lia_notes||[];t(i.find(o=>o.id===e))})})}async function te(){return new Promise(e=>{chrome.storage.local.get(["lia_notes"],t=>{e(t.lia_notes||[])})})}async function ht(e){return new Promise(t=>{chrome.storage.local.get(["lia_notes"],n=>{const o=(n.lia_notes||[]).filter(a=>a.id!==e);chrome.storage.local.set({lia_notes:o},t)})})}async function ft(e,t){return new Promise(n=>{chrome.storage.local.get(["lia_notes"],i=>{const o=i.lia_notes||[],a=o.findIndex(r=>r.id===e);if(a>=0){const r=o[a];r.content=r.content.filter(l=>l.contentId!==t),r.content.length===0?o.splice(a,1):o[a]=r,chrome.storage.local.set({lia_notes:o},n)}else n()})})}function U(){return"note_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}function q(){return"content_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}async function yt(e){if(!e||e.trim().length===0)return"Untitled Note";const t=await fetch("https://api.getlia.live/api/note/generate-title",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await v()}`},body:JSON.stringify({content:e})});function n(){const o=e.split(`
`)[0].trim();return o.length>50?o.substring(0,47)+"...":o||"Untitled Note"}if(!t.ok)return n();const i=await t.json();return i.title?i.title||"Untitled Note":n()}function vt(e){const t=e.match(/#[\w]+/g);return t?t.map(n=>n.substring(1)):[]}function _e(e){let t=e;return t=t.replace(/^# (.*$)/gm,'<h3 class="lia-note-h3">$1</h3>'),t=t.replace(/^## (.*$)/gm,'<h4 class="lia-note-h4">$1</h4>'),t=t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),t=t.replace(/\*(.*?)\*/g,"<em>$1</em>"),t=t.replace(/^- (.*$)/gm,'<li class="lia-note-li">$1</li>'),t=t.replace(/(<li class="lia-note-li">.*<\/li>)/s,'<ul class="lia-note-ul">$1</ul>'),t=t.replace(/\n/g,"<br>"),t}function Y(e){const t=new Date(e),i=new Date-t;return i<6e4?"Just now":i<36e5?Math.floor(i/6e4)+"m ago":i<864e5?Math.floor(i/36e5)+"h ago":i<6048e5?Math.floor(i/864e5)+"d ago":t.toLocaleDateString()}window.editNote=async e=>{await z(e),document.getElementById("lia-message-input").focus(),document.getElementById("lia-send-btn").disabled=!1,h("📝 Note loaded for editing","info")},window.duplicateNote=async e=>{const t=await R(e);if(!t)return;const n={...t,id:U(),title:t.title+" (Copy)",timestamp:Date.now(),lastModified:Date.now()};await _(n),await C(),document.getElementById("lia-send-btn").disabled=!0,document.getElementById("lia-message-input").value="",h("📝 Note duplicated!","success")},window.duplicateNoteContent=async(e,t)=>{const n=await R(e);if(!n)return;const i=n.content.find(a=>a.contentId===t);if(!i)return;const o={...i,contentId:q(),timestamp:Date.now(),lastModified:Date.now()};n.content.push(o),await mt(n,o),await z(e),h("📝 Note content duplicated!","success")},window.deleteNote=async e=>{await ht(e),s.currentNoteId===e&&await ee(),await C(),document.getElementById("lia-send-btn").disabled=!0,document.getElementById("lia-message-input").value="",h("🗑️ Note deleted","info")},window.deleteNoteContent=async(e,t)=>{await ft(e,t),await z(e),h("🗑️ Note content deleted","info")};async function xt(){s.isOpen?Re():bt(),await k()}async function bt(){const e=document.getElementById("lia-chatbot-interface");e.classList.add("open"),e.classList.remove("minimized"),s.isOpen=!0,s.isMinimized=!1,x=await window.getLiaUserInfo(),await Ce(),s.notesMode?await ze():await X(),setTimeout(()=>{document.getElementById("lia-message-input").focus()},400),Et()}function Re(){const e=document.getElementById("lia-chatbot-interface");e.classList.remove("open"),e.classList.remove("minimized"),s.isOpen=!1,s.isMinimized=!1,w=10,M=10,e.classList.remove("right-radius-bottom-and-width")}function wt(){const e=document.getElementById("lia-chatbot-interface");e.classList.toggle("right-radius-bottom-and-width"),e.style.left&&!e.classList.contains("minimized")&&(e.style.left="84.5%"),e.style.top&&!e.classList.contains("minimized")&&(e.style.top="89.5%"),e.classList.toggle("minimized"),s.isMinimized=!0}function kt(){document.getElementById("lia-chat-sidebar").classList.remove("collapsed")}async function Ct(){const e=document.getElementById("lia-load-more-btn");if(e.disabled)return;e.disabled=!0;const t=e.innerHTML;if(e.innerHTML=`
      <svg class="spinner" width="20" height="20" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
    `,!document.getElementById("spinner-style")){const n=document.createElement("style");n.id="spinner-style",n.innerHTML=`
        .spinner {
          animation: rotate 1s linear infinite;
        }
        .path {
          stroke: #4f46e5;
          stroke-linecap: round;
          animation: dash 1.5s ease-in-out infinite;
        }
        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }
        @keyframes dash {
          0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
          100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
        }
      `,document.head.appendChild(n)}try{s.notesMode||(w+=10,await C())}finally{e.disabled=!1,e.innerHTML=t}}function ne(){document.getElementById("lia-chat-sidebar").classList.toggle("collapsed"),s.sidebarCollapsed=!s.sidebarCollapsed}function Et(){const e=document.querySelector(".lia-notification-dot");e&&(e.classList.add("show"),setTimeout(()=>{e.classList.remove("show")},2e3))}async function ie(e){const t=document.getElementById("lia-message-input");let n=t.value.trim();if(n||(n=e||""),!!n){t.value="",t.style.height="auto",document.getElementById("lia-send-btn").disabled=!0,B("user",n),Tt();try{let i;try{if(i=await Mt(n),i&&i.error&&i.error.includes("missing plan")){V(),B("assistant",'Please upgrade your plan to use this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Upgrade Now</a>');return}else if(i&&i.error&&i.error.includes("Plan expired")){V(),h("Your plan has expired. Please renew your subscription.","error"),B("assistant",'Your plan has expired. Please renew your subscription to continue using this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Renew Now</a>');return}throw new Error(i.error||"Failed to generate response from AI")}catch(o){console.error("Error generating chat response:",o)}S(),V(),B("assistant",i)}catch(i){V(),B("assistant",`Sorry, I encountered an error. Please try again. 😔
 Try Signin in again if the error continues - <a href='https://getlia.live/login' target='_blank' style='color: blue'>here</a>`),console.error("Chat error:",i)}}}function B(e,t){const n=document.getElementById("lia-messages-container"),i=document.createElement("div");if(i.className=`lia-message ${e}`,e==="assistant"){let o=G(t);o=re(o),i.innerHTML=`
        <div class="lia-message-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
            <circle cx="16" cy="4" r="2" fill="#0a66c2"/>
            <path d="M12 8a4 4 0 0 1 4-4" stroke="#0a66c2"/>
          </svg>
        </div>
        <div class="lia-message-content" style="position: relative;"></div>
      `;const a=i.querySelector(".lia-message-content");if(t.includes("Unable to load conversations")||t.includes("Unable to create new chat"))a.innerHTML=o;else{let r=0;const l=t;async function c(){if(r<=l.length){const d=l.slice(0,r),m=re(G(d));a.innerHTML=m+(r<l.length?'<span class="lia-cursor">|</span>':""),r++,setTimeout(c,8)}else if(a.innerHTML=o,t.length>50){const d=Ot(t),m=Ft();a.appendChild(d),i.addEventListener("mouseenter",()=>{d.style.opacity="1",m.style.opacity="1"}),i.addEventListener("mouseleave",()=>{d.style.opacity="0",m.style.opacity="0"})}}c()}}else i.innerHTML=`
        <div class="lia-message-avatar">${Q()}</div>
        <div class="lia-message-content">${G(t)}</div>
      `;n.appendChild(i),n.scrollTop=n.scrollHeight,setTimeout(()=>{i.style.opacity="1"},50)}function Tt(){const e=document.getElementById("lia-messages-container"),t=document.createElement("div");t.className="lia-message assistant",t.id="lia-typing-indicator",t.innerHTML=`
    <div class="lia-message-avatar">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
        <circle cx="16" cy="4" r="2" fill="#0a66c2"/>
        <path d="M12 8a4 4 0 0 1 4-4" stroke="#0a66c2"/>
      </svg>
    </div>
    <div class="lia-message-content">
      <div class="lia-typing-indicator">
        <div class="lia-typing-dot"></div>
        <div class="lia-typing-dot"></div>
        <div class="lia-typing-dot"></div>
      </div>
    </div>
  `,e.appendChild(t),e.scrollTop=e.scrollHeight}function V(){const e=document.getElementById("lia-typing-indicator");e&&e.remove()}async function Mt(e){let t=null;s.templateMode&&s.selectedTemplate&&$[s.selectedTemplate]&&(t=$[s.selectedTemplate].id),console.log("Using template_id:",t),console.log("templates...",$),s.currentConversationId||await J(template=!0);const n={message:e,tone:u.tone,industry:u.industry,reference:s.referencedContent||null};t&&(n.template_id=t);const i=await window.lia_fetchWithAuth(`https://api.getlia.live/api/chat/${s.currentConversationId}/message`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await v()}`},credentials:"include",body:JSON.stringify(n)}),o=await i.json();return i.ok?(s.templatesMode&&(s.templateMode=!1,s.selectedTemplate=null,await k(),document.getElementById("lia-template-badge").style.display="none",document.getElementById("lia-template-toggle").classList.remove("active"),document.getElementById("lia-sidebar-header").textContent="CONVERSATIONS",document.getElementById("lia-new-chat-btn").innerHTML=`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Chat
      `),o.reply):o}async function J(e=!1){const t=document.getElementById("lia-messages-container");e||(t.innerHTML=`
      <div class="lia-message assistant">
        <div class="lia-message-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
            <circle cx="16" cy="4" r="2" fill="#0a66c2"/>
            <path d="M12 8a4 4 0 0 1 4-4" stroke="#0a66c2"/>
          </svg>
        </div>
        <div class="lia-message-content">
        Hi! I'm Lia, your LinkedIn Intelligent Assistant. <br/><br/> I'm here to help you write posts, polish comments, and improve your content. <br/><br/>What can I assist you with today?
        </div>
      </div>
    `);async function n(){const i=await window.lia_fetchWithAuth("https://api.getlia.live/api/chat/start",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await v()}`},body:JSON.stringify({title:"New Chat",chat_type:e?"template":"normal",...e&&{template_id:$[s.selectedTemplate].id||null}}),credentials:"include"}),o=await i.json();if(!i.ok)throw new Error(o.error||o.message||"Failed to create new chat");return s.currentConversationId=o.id,o}await n(),await C(),document.getElementById("lia-message-input").focus(),s.referencedContent=null}async function X(){const e=await C();if(w+=10,s.conversations=e,s.conversations.length===0){await J();return}e.length>0&&(s.currentConversationId=e[0].id,ae(s.currentConversationId))}async function C(){const e=document.getElementById("lia-conversation-list");if(s.notesMode){const t=await te();return M>t.length||M>10?e.innerHTML+=t.map(n=>{const i=n.title.slice(0,15)+(n.title.length>15?"...":""),o=oe(n.context?.type);return`
              <div class="lia-conversation-item-wrapper" style="position: relative;">
                <div class="lia-conversation-item ${n.id===s.currentNoteId?"active":""}"
                    data-id="${n.id}" title="${n.title}" style="cursor: pointer; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
                  <div style="flex: 1; overflow: hidden;">
                    <div class="truncatedTitle" style="font-size: 12px; font-weight: 500;">${o} ${i}</div>
                    <div style="font-size: 10px; color: #a9d2f3ff; margin-top: 2px;">${Y(n.lastModified)}</div>
                  </div>
                  <span class="lia-menu-trigger" style="cursor: pointer; padding: 4px; border-radius: 4px; opacity: 0.7; transition: opacity 0.2s;">⋯</span>
                </div>
                <div class="lia-menu" style="display: none; position: absolute; right: 0; top: 100%; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; min-width: 120px; overflow: hidden;">
                  <button class="lia-edit-note-btn" data-id="${n.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                    <span style="margin-right: 8px;">✏️</span>Edit
                  </button>
                  <button class="lia-duplicate-note-btn" data-id="${n.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                    <span style="margin-right: 8px;">📋</span>Duplicate
                  </button>
                  <div style="height: 1px; background: #e0e0e0; margin: 4px 0;"></div>
                  <button class="lia-delete-note-btn" data-id="${n.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #dc3545; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                    <span style="margin-right: 8px;">🗑️</span>Delete
                  </button>
                </div>
              </div>
            `}).join(""):e.innerHTML=t.map(n=>{const i=n.title.slice(0,15)+(n.title.length>15?"...":""),o=oe(n.context?.type);return`
              <div class="lia-conversation-item-wrapper" style="position: relative;">
                <div class="lia-conversation-item ${n.id===s.currentNoteId?"active":""}"
                    data-id="${n.id}" title="${n.title}" style="cursor: pointer; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
                  <div style="flex: 1; overflow: hidden;">
                    <div class="truncatedTitle" style="font-size: 12px; font-weight: 500;">${o} ${i}</div>
                    <div style="font-size: 10px; color: #a9d2f3ff; margin-top: 2px;">${Y(n.lastModified)}</div>
                  </div>
                  <span class="lia-menu-trigger" style="cursor: pointer; padding: 4px; border-radius: 4px; opacity: 0.7; transition: opacity 0.2s;">⋯</span>
                </div>
                <div class="lia-menu" style="display: none; position: absolute; right: 0; top: 100%; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; min-width: 120px; overflow: hidden;">
                  <button class="lia-edit-note-btn" data-id="${n.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                    <span style="margin-right: 8px;">✏️</span>Edit
                  </button>
                  <button class="lia-duplicate-note-btn" data-id="${n.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                    <span style="margin-right: 8px;">📋</span>Duplicate
                  </button>
                  <div style="height: 1px; background: #e0e0e0; margin: 4px 0;"></div>
                  <button class="lia-delete-note-btn" data-id="${n.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #dc3545; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                    <span style="margin-right: 8px;">🗑️</span>Delete
                  </button>
                </div>
              </div>
            `}).join(""),qe(),t}else{let t=[];t=await jt(w),w>e.length||w>10?e.innerHTML+=t.map(i=>{const o=i.title.slice(0,10)+(i.title.length>15?"...":"");return`
                  <div class="lia-conversation-item-wrapper" style="position: relative;">
                    <div class="lia-conversation-item ${i.id===s.currentConversationId?"active":""}" 
                        data-id="${i.id}" title="${i.title}" style="cursor: pointer; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
                      <span style="flex: 1; overflow: hidden;" class='truncatedTitle'>${o}</span>
                      <span class="lia-menu-trigger" style="cursor: pointer; padding: 4px; border-radius: 4px; opacity: 0.7; transition: opacity 0.2s;">⋯</span>
                    </div>
                    <div class="lia-menu" style="display: none; position: absolute; right: 0; top: 100%; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; min-width: 120px; overflow: hidden;">
                      <button class="lia-rename-chat-btn" data-id="${i.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                        <span style="margin-right: 8px;">✏️</span>Rename
                      </button>
                      
                      <div style="height: 1px; background: #e0e0e0; margin: 4px 0;"></div>
                      <button class="lia-delete-chat-btn" data-id="${i.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #dc3545; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                        <span style="margin-right: 8px;">🗑️</span>Delete Chat
                      </button>
                    </div>
                  </div>
                `}).join(""):e.innerHTML=t.map(i=>{const o=i.title.slice(0,10)+(i.title.length>15?"...":"");return`
                    <div class="lia-conversation-item-wrapper" style="position: relative;">
                      <div class="lia-conversation-item ${i.id===s.currentConversationId?"active":""}" 
                          data-id="${i.id}" title="${i.title}" style="cursor: pointer; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
                        <span style="flex: 1; overflow: hidden;" class='truncatedTitle'>${o}</span>
                        <span class="lia-menu-trigger" style="cursor: pointer; padding: 4px; border-radius: 4px; opacity: 0.7; transition: opacity 0.2s;">⋯</span>
                      </div>
                      <div class="lia-menu" style="display: none; position: absolute; right: 0; top: 100%; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; min-width: 120px; overflow: hidden;">
                        <button class="lia-rename-chat-btn" data-id="${i.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                          <span style="margin-right: 8px;">✏️</span>Rename
                        </button>
                        
                        <div style="height: 1px; background: #e0e0e0; margin: 4px 0;"></div>
                        <button class="lia-delete-chat-btn" data-id="${i.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #dc3545; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                          <span style="margin-right: 8px;">🗑️</span>Delete Chat
                        </button>
                      </div>
                    </div>
                  `}).join("");const n=document.createElement("style");return n.textContent=`
            .lia-conversation-item:hover .lia-menu-trigger {
              opacity: 1 !important;
              background-color: rgba(0,0,0,0.1);
            }
            .lia-menu button:hover {
              background-color: #f5f5f5 !important;
            }
            .lia-delete-chat-btn:hover {
              background-color: #fff5f5 !important;
            }
          `,document.head.appendChild(n),document.querySelectorAll(".lia-conversation-item").forEach(i=>{i.addEventListener("click",o=>{o.target.classList.contains("lia-menu-trigger")||ae(i.dataset.id)})}),It(),t}}function qe(){document.querySelectorAll(".lia-conversation-item").forEach(e=>{e.addEventListener("click",t=>{t.target.classList.contains("lia-menu-trigger")||z(e.dataset.id)})}),document.querySelectorAll(".lia-menu-trigger").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.closest(".lia-conversation-item-wrapper").querySelector(".lia-menu");document.querySelectorAll(".lia-menu").forEach(i=>{i!==n&&(i.style.display="none")}),n.style.display=n.style.display==="block"?"none":"block"})}),document.querySelectorAll(".lia-edit-note-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation(),window.editNote(e.dataset.id),document.querySelectorAll(".lia-menu").forEach(n=>n.style.display="none")})}),document.querySelectorAll(".lia-duplicate-note-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.dataset.id,i=e.closest(".lia-message"),o=i?i.dataset.noteId:null;o===n||!o?(window.duplicateNote(n),document.querySelectorAll(".lia-menu").forEach(a=>a.style.display="none")):window.duplicateNoteContent(o,n)})}),document.querySelectorAll(".lia-delete-note-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.dataset.id,i=e.closest(".lia-message"),o=i?i.dataset.noteId:null;o===n||!o?(window.deleteNote(n),document.querySelectorAll(".lia-menu").forEach(a=>a.style.display="none")):window.deleteNoteContent(o,n)})})}function It(){document.querySelectorAll(".lia-conversation-item").forEach(e=>{e.addEventListener("click",t=>{t.target.classList.contains("lia-menu-trigger")||ae(e.dataset.id)})}),document.querySelectorAll(".lia-menu-trigger").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.closest(".lia-conversation-item-wrapper").querySelector(".lia-menu");document.querySelectorAll(".lia-menu").forEach(i=>{i!==n&&(i.style.display="none")}),n.style.display=n.style.display==="block"?"none":"block"})}),document.querySelectorAll(".lia-rename-chat-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.dataset.id,i=conversations.find(o=>o.id===n);if(i){const o=e.closest(".lia-conversation-item-wrapper").querySelector(".truncatedTitle");if(o){let a=function(r){if(r.type==="keydown"&&r.key!=="Enter")return;r.preventDefault(),o.contentEditable="false";const l=o.textContent.trim();l&&l!==i.title&&St(n,l),o.removeEventListener("keydown",a),o.removeEventListener("blur",a)};o.contentEditable="true",o.focus(),document.execCommand("selectAll",!1,null),document.getSelection().collapseToEnd(),o.addEventListener("keydown",a),o.addEventListener("blur",a)}}document.querySelectorAll(".lia-menu").forEach(o=>o.style.display="none")})}),document.querySelectorAll(".lia-duplicate-chat-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.dataset.id;duplicateConversation(n),document.querySelectorAll(".lia-menu").forEach(i=>i.style.display="none")})}),document.querySelectorAll(".lia-export-chat-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.dataset.id;exportConversation(n),document.querySelectorAll(".lia-menu").forEach(i=>i.style.display="none")})}),document.querySelectorAll(".lia-delete-chat-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.dataset.id;Lt(n),document.querySelectorAll(".lia-menu").forEach(i=>i.style.display="none")})}),document.addEventListener("click",e=>{!e.target.closest(".lia-menu")&&!e.target.classList.contains("lia-menu-trigger")&&document.querySelectorAll(".lia-menu").forEach(t=>t.style.display="none")})}function oe(e){switch(e){case"profile":return"👤";case"feed":return"📰";case"article":return"📖";case"general":return"📝";default:return"📝"}}function Lt(e){async function t(){const n=await fetch(`https://api.getlia.live/api/chat/${e}`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await v()}`},credentials:"include"}),i=await n.json();if(!n.ok)throw new Error(i.error?.message||"Failed to delete conversation");return i}t().then(()=>{s.currentConversationId==e?(s.currentConversationId=null,J()):C()}).catch(n=>{console.error("Error deleting conversation:",n),B("assistant","Unable to delete conversation. Please check your connection or try signing in again <a href='https://www.getlia.live/login' target='_blank'> here </a>")})}function St(e,t){async function n(){const i=await fetch(`https://api.getlia.live/api/chat/${e}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await v()}`},body:JSON.stringify({title:t}),credentials:"include"}),o=await i.json();if(!i.ok)throw new Error(o.error?.message||"Failed to rename conversation");return o}n().then(()=>{C()}).catch(i=>{console.error("Error renaming conversation:",i),B("assistant","Unable to rename conversation. Please check your connection or try signing in again <a href='https://www.getlia.live/login' target='_blank'> here </a>")})}async function ae(e){let t=null;async function n(){const c=await window.lia_fetchWithAuth(`https://api.getlia.live/api/chat/${e}/messages`,{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await v()}`},credentials:"include"}),d=await c.json();if(!c.ok)throw new Error(d.error?.message||"Failed to load conversation");return d}const i=await n();let o,a;try{o=i.messages,a=i.template}catch{}if(t=o,!t)return;s.currentConversationId=e;const r=document.getElementById("lia-messages-container");r.innerHTML=t.map(c=>{if(a&&c.role==="assistant"&&t.indexOf(c)===0)return`
              <div class="lia-welcome-message">
                <div class="lia-message assistant">
                  <div class="lia-message-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                      <circle cx="16" cy="4" r="2" fill="#0a66c2"/>
                      <path d="M12 8a4 4 0 0 1 4-4" stroke="#0a66c2"/>
                    </svg>
                  </div>
                  <div class="lia-message-content">
                    Hi! I'm Lia, your LinkedIn Intelligent Assistant.<br/><br/>
                    You're using <strong>${a.name}</strong> - posts will be written like the example below:<br/><br/>
                    <div class="lia-template-example">
                      <div class="lia-linkedin-card">
                        <div class="lia-card-header">
                          <div class="lia-card-avatar">${a.example.author.charAt(0)}</div>
                          <div class="lia-card-info">
                            <div class="lia-card-name">${a.example.author}</div>
                            <div class="lia-card-title">Product Manager • 2nd</div>
                            <div class="lia-card-time">2h • 🌍</div>
                          </div>
                        </div>
                        <div class="lia-card-content">${a.example.content.replace(/\n/g,"<br>")}</div>
                        <div class="lia-card-engagement">
                          <span>👍 ${a.example.engagement.likes}</span>
                          <span>💬 ${a.example.engagement.comments}</span>
                          <span>🔄 12</span>
                        </div>
                      </div>
                    </div>
                    <br/>This style works great for:<br/>
                    • ${a.description}<br/>
                    • Building engagement through ${a.name.toLowerCase()} content<br/><br/>
                    What would you like to write about today?
                  </div>
                </div>
              </div>
              `;if(c.role==="reference"){const d=JSON.parse(c.content);return`
                  <div class="lia-referenced-content" title="Click to open">
                    <div class="lia-referenced-content-header">
                      <a href="${s.referencedContent?s.referencedContent.url:""}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                        </svg>
                        Referenced ${d.type}
                        ${d.author?`by ${d.author}`:""}
                      </a>
                    </div>
                    <a href="${s.referencedContent?s.referencedContent.url:""}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; font-weight: normal" class="lia-referenced-content-preview" title="Click to open">
                      ${d.text.substring(0,150)}${d.text.length>150?"...":""}
                    </a>
                  </div>
                `}else return`
                <div class="lia-message ${c.role}">
                  <div class="lia-message-avatar">${c.role==="user"?Q():`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                      <circle cx="16" cy="4" r="2" fill="#0a66c2"/>
                      <path d="M12 8a4 4 0 0 1 4-4" stroke="#0a66c2"/>
                    </svg>
                  `}</div>
                  <div class="lia-message-content" ${c.role==="user"?"style='color: #fff;'":""}>
                    ${Wt(c.content)}
                  </div>
                </div>
              `}).join(""),r.scrollTop=r.scrollHeight,document.querySelectorAll(".lia-conversation-item").forEach(c=>{c.getAttribute("data-id")===e?c.classList.add("active"):c.classList.remove("active")})}async function $t(){if(s.referenceMode===!1){const t=await Bt();if(!t&&t!=="Request failed: Unauthorized"){Nt();return}if(t==="Request failed: Unauthorized"){h("Please sign in to access Reference Mode","error");return}}s.referenceMode=!s.referenceMode;const e=document.getElementById("lia-reference-toggle");s.referenceMode?(e.classList.add("reference-active"),e.title="Reference Mode: ON (Click posts to reference)",s.notesMode&&(e.title="Reference Mode (pro): ON (Click any post to save to current note)"),At(),h("📎 Reference Mode ON - Click any post to reference it","success"),s.notesMode&&h("📎 Reference Mode ON - Click any post to save to current note","success")):(e.classList.remove("reference-active"),e.title="Reference Mode (Pro): OFF",zt(),h("Reference Mode OFF","info")),await k()}async function Bt(){return(await(await window.lia_fetchWithAuth("https://api.getlia.live/api/user/subscription",{headers:{Authorization:`Bearer ${await v()}`},credentials:"include"})).json()).isPro}function Nt(){const e=document.createElement("div");e.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100001;
  `,e.innerHTML=`
    <div style="
      background: white;
      padding: 32px;
      border-radius: 16px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
    ">
      <div style="font-size: 48px; margin-bottom: 16px;">🚀</div>
      <h2 style="margin: 0 0 16px 0; color: #0A66C2;">Upgrade to Pro</h2>
      <p style="margin: 0 0 24px 0; color: #666;">
        Reference Mode lets you click any LinkedIn post to analyze it with AI.
        Get insights, summaries, and contextual responses!
      </p>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class='reference-modal-cancel-button' style="
          padding: 12px 24px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 8px;
          cursor: pointer;
        ">Maybe Later</button>
        <button class='reference-modal-upgrade-button' style="
          padding: 12px 24px;
          background: linear-gradient(135deg, #0A66C2, #004182);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        ">Upgrade Now</button>
      </div>
    </div>
  `,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.remove()}),document.querySelector(".reference-modal-upgrade-button").addEventListener("click",()=>{window.open("https://getlia.live/pricing","_blank"),e.remove()}),document.querySelector(".reference-modal-cancel-button").addEventListener("click",()=>{e.remove()})}function At(){Pe(),Pt()}function zt(){document.querySelectorAll(".lia-reference-overlay").forEach(e=>e.remove()),document.querySelectorAll(".linkedin-post-hoverable").forEach(e=>{e.classList.remove("linkedin-post-hoverable")}),Ht()}function Pe(){[".feed-shared-update-v2",".feed-shared-update-detail-viewer__content",".reader-article-content",".comments-comment-item"].forEach(n=>{document.querySelectorAll(n).forEach(i=>{if(i.classList.contains("linkedin-post-hoverable"))return;i.classList.add("linkedin-post-hoverable");const o=document.createElement("div");o.className="lia-reference-overlay",i.style.position="relative",i.appendChild(o),i.addEventListener("click",async a=>{if(s.referenceMode&&(a.preventDefault(),a.stopPropagation(),await _t(i),s.notesMode)){const r=await R(s.currentNoteId);if(r)r.content.push({contentId:q(),type:"reference",content:s.referencedContent}),r.lastModified=Date.now(),_(r);else{const l={id:U(),title:"Referenced Content",content:[{contentId:q(),type:"reference",content:s.referencedContent}],tags:[],context:s.noteContext,timestamp:Date.now(),lastModified:Date.now()};await _(l),s.currentNoteId=l.id,await C()}k()}})})});const t=document.querySelectorAll(".lia-clear-reference");t&&t.forEach(n=>{n.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),He(n)})})}async function _t(e){const t=Rt(e);if(t){s.referencedContent=t,Le(),qt(),await k(),s.notesMode?h("✔ Content Referenced! And saved to your current notes.","success"):h("✔ Content Referenced! Ask me about it.","success");const n=document.getElementById("lia-message-input");n&&(n.focus(),s.notesMode?n.placeholder="Write short note on the referenced content...":n.placeholder="Ask me about the referenced content...")}}function Rt(e){try{const t={type:"unknown",author:"",text:"",engagement:{},timestamp:"",url:window.location.href};if(e.classList.contains("feed-shared-update-v2")||e.classList.contains("feed-shared-update-detail-viewer__content")){t.type="post";const n=e.querySelector(".update-components-actor__title span span span:not(.visually-hidden)");n&&(t.author=n.textContent.trim());const i=e.querySelector(".feed-shared-update-v2__description");i&&(t.text=i.textContent.trim());const o=e.querySelector(".social-details-social-counts__reactions");o&&(t.engagement.likes=o.textContent.trim());const a=e.querySelector(".social-details-social-counts__comments");if(a&&(t.engagement.comments=a.textContent.trim()),window.location.href.includes("feed")){const r=e?.getAttribute("data-urn"),l=r?`https://www.linkedin.com/feed/update/${r}/`:window.location.href;t.url=l}}else if(e.classList.contains("reader-article-content")){t.type="article";const n=document.querySelector(".reader-article-header__title");n&&(t.title=n.textContent.trim());const i=document.querySelector(".reader-author-info__content");i&&(t.author=i.textContent.trim()),t.text=e.textContent.trim().substring(0,1e3)+"..."}else if(e.classList.contains("comments-comment-item")){t.type="comment";const n=e.querySelector(".comments-comment-meta__description-title");n&&(t.author=n.textContent.trim());const i=e.querySelector(".comments-comment-item__main-content");i&&(t.text=i.textContent.trim())}return t}catch(t){return console.error("Error extracting post content:",t),null}}function qt(){const e=document.getElementById("lia-messages-container");if(!e||!s.referencedContent)return;const t=e.querySelectorAll(".lia-referenced-content");t.length>0&&t[t.length-1].remove();const n=document.createElement("div");n.title="Click to open",n.className="lia-referenced-content",n.innerHTML=`
    <div class="lia-referenced-content-header">
      <a href="${s.referencedContent?s.referencedContent.url:""}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
        </svg>
        Referenced ${s.referencedContent.type}
        ${s.referencedContent.author?`by ${s.referencedContent.author}`:""}
      </a>
      <button class="lia-clear-reference">×</button>
    </div>
    <a href="${s.referencedContent?s.referencedContent.url:""}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; font-weight: normal" class="lia-referenced-content-preview" title="Click to open">
      ${s.referencedContent.text.substring(0,150)}${s.referencedContent.text.length>150?"...":""}
    </a>`,e.appendChild(n),e.scrollTop=e.scrollHeight}async function He(e){s.referencedContent=null,await k();const t=e.closest(".lia-referenced-content");t&&t.remove();const n=document.getElementById("lia-message-input");n&&(s.notesMode?n.placeholder="Write your note here...":n.placeholder="What do you want to post?"),setTimeout(()=>{S()},1e3)}function Pt(){const e=document.createElement("div");e.id="lia-reference-indicator",e.style.cssText=`
    position: fixed;
    top: 45px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #0A66C2, #004182);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    z-index: 10001;
    box-shadow: 0 4px 12px rgba(10, 102, 194, 0.3);
    animation: slideInDown 0.3s ease;
  `,e.textContent="📎 Reference Mode Active - Click any post to analyze it",s.notesMode&&(e.textContent="📎 Reference Mode Active - Click any post to add it to your current note."),document.body.appendChild(e)}function Ht(){const e=document.getElementById("lia-reference-indicator");e&&e.remove()}function h(e,t="info"){const n=document.createElement("div"),i=document.querySelector(".lia-chatbot-interface");n.style.cssText=`
    position: fixed;
    top: -15%;
    right: 20px;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10002;
    animation: slideInRight 0.3s ease;
    max-width: 300px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    pointer-events: none;
  `;const o={success:{avatar:"#10b981",bubble:"#f0fdf4",text:"#166534",border:"#bbf7d0"},error:{avatar:"#ef4444",bubble:"#fef2f2",text:"#991b1b",border:"#fecaca"},info:{avatar:"#0a66c2",bubble:"#eff6ff",text:"#1e40af",border:"#bfdbfe"},warning:{avatar:"#f59e0b",bubble:"#fffbeb",text:"#92400e",border:"#fed7aa"}},a=o[t]||o.info,r=document.createElement("div");r.style.cssText=`
      width: 44px;
      height: 44px;
      background: ${a.avatar};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px ${a.avatar}40;
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
      border: 2px solid ${a.avatar};
      border-radius: 50%;
      opacity: 0;
      animation: pulse 2s infinite;
    `;const c=document.createElement("style");c.textContent=`
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.7; }
        100% { transform: scale(1.2); opacity: 0; }
      }
    `,document.head.appendChild(c),r.appendChild(l),r.innerHTML+=`
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
        <circle cx="16" cy="4" r="2" fill="white"/>
        <path d="M12 8a4 4 0 0 1 4-4" stroke="white"/>
      </svg>
    `;const d=document.createElement("div");d.style.cssText=`
      position: relative;
      background: ${a.bubble};
      color: ${a.text};
      padding: 14px 18px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      border: 1px solid ${a.border};
      max-width: 280px;
      opacity: 0;
      transform: scale(0.7) translateY(15px);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      backdrop-filter: blur(10px);
    `;const m=document.createElement("div");m.style.cssText=`
      position: absolute;
      left: -8px;
      top: 15px;
      width: 20px;
      height: 20px;
      background: ${a.bubble};
      border: 1px solid ${a.border};
      border-right: none;
      border-bottom: none;
      transform: rotate(-45deg);
      border-radius: 4px 0 0 0;
    `;const f=document.createElement("span");d.appendChild(m),d.appendChild(f),n.appendChild(r),n.appendChild(d),i.appendChild(n),setTimeout(()=>{r.style.opacity="1",r.style.transform="scale(1)"},100),setTimeout(()=>{d.style.opacity="1",d.style.transform="scale(1) translateY(0)"},400),setTimeout(()=>{let y=0;const g=()=>{y<=e.length&&(f.textContent=e.substring(0,y)+(y<e.length?"▋":""),y++,setTimeout(g,40))};g()},600),setTimeout(()=>{n.style.transform="translateX(-50%) scale(0.8)",n.style.opacity="0",setTimeout(()=>{n.remove(),c.remove()},2e3)},5e3)}window.clearReferencedContent=He;async function jt(e){const t=await v(),n=e<10?0:e-10,i=await window.lia_fetchWithAuth(`https://api.getlia.live/api/chat/history?limit=${e}&start=${n}`,{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},credentials:"include"}),o=await i.json();if(!i.ok)throw new Error(o.error?.message||"Failed to load conversations");return o}function Wt(e){let t=G(e);return t=re(t),t}function G(e){return e=e.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,(t,n,i)=>`<a href="${i}" target="_blank" rel="noopener noreferrer" class="lia-link">${n} <span class="lia-link-icon">🔗</span></a>`),e.replace(/(<a [^>]+>.*?<\/a>)|(\bhttps?:\/\/[^\s<]+)/g,(t,n,i)=>n||(i?`<a href="${i}" target="_blank" rel="noopener noreferrer" class="lia-link">${i} <span class="lia-link-icon">🔗</span></a>`:t))}function re(e){return e=e.replace(/^### (.*$)/gm,'<h3 class="lia-h3">$1</h3>'),e=e.replace(/^## (.*$)/gm,'<h2 class="lia-h2">$1</h2>'),e=e.replace(/^# (.*$)/gm,'<h1 class="lia-h1">$1</h1>'),e=e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),e=e.replace(/\*(.*?)\*/g,"<em>$1</em>"),e=e.replace(/```([\s\S]*?)```/g,function(t,n){return`<pre class="lia-code-block" style='position: relative'><code>${n}</code></pre>`}),e=e.replace(/`([^`]+)`/g,'<code class="lia-inline-code">$1</code>'),e=e.replace(/^\* (.*$)/gm,'<li class="lia-list-item">$1</li>'),e=e.replace(/(<li class="lia-list-item">.*<\/li>)/s,'<ul class="lia-list">$1</ul>'),e=e.replace(/^\d+\. (.*$)/gm,'<li class="lia-ordered-item">$1</li>'),e=e.replace(/(<li class="lia-ordered-item">.*<\/li>)/s,'<ol class="lia-ordered-list">$1</ol>'),e=e.replace(/\n\n/g,'</p><p class="lia-paragraph">'),e='<p class="lia-paragraph">'+e+"</p>",e=e.replace(/\n/g,"<br>"),e}function Ot(e){const t=document.createElement("button");return t.className="lia-copy-btn",t.innerHTML=`
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
    `,t.title="Copy message",t.style.cssText=`
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 6px;
      cursor: pointer;
      opacity: 0;
      transition: all 0.2s ease;
      z-index: 10;
      backdrop-filter: blur(4px);
    `,t.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e.trim()),t.innerHTML=`
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
        `,t.style.background="#f0fdf4",t.style.borderColor="#10b981",setTimeout(()=>{t.innerHTML=`
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          `,t.style.background="rgba(255, 255, 255, 0.9)",t.style.borderColor="#e9ecef"},2e3)}catch(n){console.error("Failed to copy text: ",n)}}),t}function Ft(){const e=document.createElement("button");return e.className="lia-regenerate-btn",e.innerHTML=`
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="23,4 23,10 17,10"/>
        <polyline points="1,20 1,14 7,14"/>
        <path d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10m22,4L18.36,18.36A9,9,0,0,1,3.51,15"/>
      </svg>
    `,e.title="Regenerate response",e.style.cssText=`
      position: absolute;
      top: 8px;
      right: 50px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 6px;
      cursor: pointer;
      opacity: 0;
      transition: all 0.2s ease;
      z-index: 10;
      backdrop-filter: blur(4px);
    `,e.addEventListener("click",()=>{console.log("Regenerate response")}),e}Ee()})();
})()