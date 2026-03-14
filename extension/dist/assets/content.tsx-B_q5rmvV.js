import{r as re,j as h,c as qe}from"./client-Cq2TKhAs.js";const Re="modulepreload",He=function(e){return"/"+e},se={},We=function(t,n,i){let o=Promise.resolve();if(n&&n.length>0){let c=function(d){return Promise.all(d.map(p=>Promise.resolve(p).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),l=r?.nonce||r?.getAttribute("nonce");o=c(n.map(d=>{if(d=He(d),d in se)return;se[d]=!0;const p=d.endsWith(".css"),v=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${v}`))return;const m=document.createElement("link");if(m.rel=p?"stylesheet":Re,p||(m.as="script"),m.crossOrigin="",m.href=d,l&&m.setAttribute("nonce",l),document.head.appendChild(m),p)return new Promise((g,T)=>{m.addEventListener("load",g),m.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${d}`)))})}))}function a(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return o.then(r=>{for(const l of r||[])l.status==="rejected"&&a(l.reason);return t().catch(a)})},Fe=({onFormat:e,onTransform:t,onRewrite:n})=>{const[i,o]=re.useState(null);if(re.useEffect(()=>{const r=()=>{const c=window.getSelection(),d=c?.toString().trim();if(d&&d.length>0){const p=document.activeElement;if(p&&(p.classList.contains("ql-editor")||p.closest(".ql-editor")||p.closest(".share-box")||p.closest(".comments-comment-texteditor"))){const g=c.getRangeAt(0).getBoundingClientRect();o({left:g.left+window.scrollX+g.width/2,top:g.top+window.scrollY-50});return}}o(null)},l=c=>{const d=document.getElementById("linkedin-ai-text-toolbar");d&&!d.contains(c.target)&&o(null)};return document.addEventListener("mouseup",r),document.addEventListener("keyup",r),document.addEventListener("mousedown",l),()=>{document.removeEventListener("mouseup",r),document.removeEventListener("keyup",r),document.removeEventListener("mousedown",l)}},[]),!i)return null;const a=[{id:"bold",icon:"B",title:"Make Bold",style:{fontWeight:700,fontSize:"14px"},action:()=>e("bold")},{id:"italic",icon:"I",title:"Make Italic",style:{fontStyle:"italic",fontSize:"14px"},action:()=>e("italic")},{id:"divider1",type:"divider"},{id:"ai-rewrite",icon:h.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"#0a66c2",strokeWidth:"2",children:h.jsx("path",{d:"M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"})}),title:"AI Rewrite Paragraph",action:n},{id:"shorten",icon:h.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"#0a66c2",strokeWidth:"2",children:[h.jsx("path",{d:"M8 18L12 6l4 12"}),h.jsx("path",{d:"M9.5 12h5"})]}),title:"Make Shorter",action:()=>t("shorten")},{id:"expand",icon:h.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"#0a66c2",strokeWidth:"2",children:h.jsx("path",{d:"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"})}),title:"Expand Text",action:()=>t("expand")},{id:"divider2",type:"divider"},{id:"professional",icon:h.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"#0a66c2",strokeWidth:"2",children:[h.jsx("path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"}),h.jsx("rect",{x:"8",y:"2",width:"8",height:"4",rx:"1",ry:"1"})]}),title:"Make Professional",action:()=>t("professional")},{id:"emoji",icon:"😊",title:"Add Emojis",style:{fontSize:"14px"},action:()=>t("emoji")},{id:"grammar",icon:h.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"#0a66c2",strokeWidth:"2",children:[h.jsx("path",{d:"M9 12l2 2 4-4"}),h.jsx("circle",{cx:"12",cy:"12",r:"10"})]}),title:"Fix Grammar",action:()=>t("grammar")}];return h.jsxs("div",{id:"linkedin-ai-text-toolbar",className:"linkedin-ai-text-toolbar",style:{position:"absolute",background:"white",border:"1px solid #e0e0e0",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0, 0, 0, 0.15)",padding:"8px",display:"flex",zIndex:1e4,fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',gap:"4px",alignItems:"center",backdropFilter:"blur(10px)",left:i.left,top:i.top,transform:"translateX(-50%)"},children:[h.jsx("div",{className:"toolbar-logo",style:{padding:"8px 12px",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg, #0a66c2, #004182)",borderRadius:"8px 0 0 8px",transition:"all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"},children:h.jsxs("svg",{className:"lia-logo",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"#ffffff",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[h.jsx("path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"}),h.jsx("rect",{x:"2",y:"9",width:"4",height:"12"}),h.jsx("circle",{cx:"4",cy:"4",r:"2"}),h.jsx("circle",{cx:"16",cy:"4",r:"2",fill:"#ffffff"}),h.jsx("path",{d:"M12 8a4 4 0 0 1 4-4",stroke:"#ffffff"})]})}),a.map((r,l)=>r.type==="divider"?h.jsx("div",{style:{width:"1px",height:"20px",background:"#e0e0e0",margin:"0 4px"}},l):h.jsx("button",{className:"linkedin-ai-toolbar-btn",title:r.title,style:{background:"none",border:"none",padding:"6px 8px",borderRadius:"4px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"background-color 0.2s",color:"#0a66c2",...r.style||{}},onMouseEnter:c=>c.currentTarget.style.backgroundColor="#e7f3ff",onMouseLeave:c=>c.currentTarget.style.backgroundColor="transparent",onClick:c=>{c.preventDefault(),c.stopPropagation(),r.action&&r.action()},children:r.icon},r.id))]})};function Oe(e,t=100,n=1e3){return new Promise((i,o)=>{let a=0;const r=()=>{const l=document.querySelector(e);if(l)return i(l);if(a++,a>=t)return o(`Element ${e} not found after ${t} attempts`);setTimeout(r,n)};r()})}async function x(){const{access_token:e}=await chrome.storage.local.get(["access_token"]);if(!e)throw new Error("Please Sign in to continue");return e}const De={rewrite:e=>`Rewrite this sentence to be more engaging and professional: "${e}"`,shorten:e=>`Make this text shorter while keeping the main message: "${e}"`,expand:e=>`Expand this text with more detail and context: "${e}"`,professional:e=>`Make this text more professional and business-appropriate: "${e}"`,emoji:e=>`Add relevant emojis to this text to make it more engaging: "${e}"`,grammar:e=>`Fix any grammar, spelling, or punctuation errors in this text: "${e}"`};async function fe(e,t){const n=De[t];let i=n?n(e):`Improve this text: "${e}"`;i+=" Return only the improved text without quotes or explanations.";const o=await x(),a=await window.lia_fetchWithAuth("https://api.getlia.live/api/prompt/improve",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},credentials:"include",body:JSON.stringify({prompt:i,type:t})});if(!a.ok){const l=await a.json();throw new Error(l.error?.message??"Failed to transform text")}return(await a.json()).response}async function Ue(e,t,n){const i=`Improve and rewrite the following LinkedIn post to make it more engaging, professional, and impactful. Keep the core message but enhance clarity, flow, and engagement. Maintain the same tone (${t}) and make it suitable for the ${n} industry:

    "${e}"

    Return only the improved text without any explanations or quotes. Include proper line breaks and formatting as needed - whitespaces.`,o=await x();return(await window.lia_fetchWithAuth("https://api.getlia.live/api/prompt/rewrite",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},credentials:"include",body:JSON.stringify({prompt:i,originalText:e})})).json()}function ve(e){const t=[];return e.querySelectorAll(".ql-mention").forEach((i,o)=>{t.push({id:o,text:i.textContent?.trim()??"",originalElement:i.outerHTML,entityUrn:i.getAttribute("data-entity-urn"),objectUrn:i.getAttribute("data-object-urn"),href:i.getAttribute("href"),guid:i.getAttribute("data-guid")})}),t}function xe(e){let t=e.innerHTML;e.querySelectorAll(".ql-mention").forEach(o=>{const a=o.textContent?.trim()??"";t=t.replace(o.outerHTML,`@${a}`)});const i=document.createElement("div");return i.innerHTML=t,i.textContent??i.innerText??""}function Ye(e,t){if(!t||t.length===0)return e;let n=e;return t.forEach(i=>{const o=`@${i.text}`;n.includes(o)&&(n=n.replace(o,`<MENTION_${i.id}>`))}),t.forEach(i=>{const o=`<MENTION_${i.id}>`;n.includes(o)&&(n=n.replace(o,ye(i)))}),n}function ye(e){return`<a class="ql-mention" href="${e.href??"#"}" data-entity-urn="${e.entityUrn??""}" data-guid="${e.guid??""}" data-object-urn="${e.objectUrn??""}" data-original-text="${e.text}" spellcheck="false" data-test-ql-mention="true">${e.text}</a>`}function ee(e){const t=e.getRangeAt(0);let n=t.commonAncestorContainer;for(;n&&n.tagName!=="P";)n=n.parentElement;if(n&&n.tagName==="P"){const c=ve(n),d=xe(n);return window.linkedinMentionsData=c,d}const i=t.commonAncestorContainer,o=i.textContent??i.innerText??"",a=t.startOffset;let r=o.lastIndexOf(".",a-1)+1,l=o.indexOf(".",a);return r<0&&(r=0),l<0&&(l=o.length),o.substring(r,l).trim()}const Ve=Object.freeze(Object.defineProperty({__proto__:null,convertMentionsToAtFormat:xe,createLinkedInMention:ye,extractMentionsFromParagraph:ve,getFullSentence:ee,restoreMentionsInText:Ye},Symbol.toStringTag,{value:"Module"})),be={a:"𝗮",b:"𝗯",c:"𝗰",d:"𝗱",e:"𝗲",f:"𝗳",g:"𝗴",h:"𝗵",i:"𝗶",j:"𝗷",k:"𝗸",l:"𝗹",m:"𝗺",n:"𝗻",o:"𝗼",p:"𝗽",q:"𝗾",r:"𝗿",s:"𝘀",t:"𝘁",u:"𝘂",v:"𝘃",w:"𝘄",x:"𝘅",y:"𝘆",z:"𝘇",A:"𝗔",B:"𝗕",C:"𝗖",D:"𝗗",E:"𝗘",F:"𝗙",G:"𝗚",H:"𝗛",I:"𝗜",J:"𝗝",K:"𝗞",L:"𝗟",M:"𝗠",N:"𝗡",O:"𝗢",P:"𝗣",Q:"𝗤",R:"𝗥",S:"𝗦",T:"𝗧",U:"𝗨",V:"𝗩",W:"𝗪",X:"𝗫",Y:"𝗬",Z:"𝗭",0:"𝟬",1:"𝟭",2:"𝟮",3:"𝟯",4:"𝟰",5:"𝟱",6:"𝟲",7:"𝟳",8:"𝟴",9:"𝟵"},we={a:"𝘢",b:"𝘣",c:"𝘤",d:"𝘥",e:"𝘦",f:"𝘧",g:"𝘨",h:"𝘩",i:"𝘪",j:"𝘫",k:"𝘬",l:"𝘭",m:"𝘮",n:"𝘯",o:"𝘰",p:"𝘱",q:"𝘲",r:"𝘳",s:"𝘴",t:"𝘵",u:"𝘶",v:"𝘷",w:"𝘸",x:"𝘹",y:"𝘺",z:"𝘻",A:"𝘈",B:"𝘉",C:"𝘊",D:"𝘋",E:"𝘌",F:"𝘍",G:"𝘎",H:"𝘏",I:"𝘐",J:"𝘑",K:"𝘒",L:"𝘓",M:"𝘔",N:"𝘕",O:"𝘖",P:"𝘗",Q:"𝘘",R:"𝘙",S:"𝘚",T:"𝘛",U:"𝘜",V:"𝘝",W:"𝘞",X:"𝘟",Y:"𝘠",Z:"𝘡"},Je=Object.fromEntries(Object.entries(be).map(([e,t])=>[t,e])),Xe=Object.fromEntries(Object.entries(we).map(([e,t])=>[t,e]));function le(e,t="bold"){const n=t==="italic"?we:be;return[...e].map(i=>n[i]??i).join("")}function j(e,t="bold"){const n=t==="italic"?Xe:Je;return[...e].map(i=>n[i]??i).join("")}function ce(e){return/[^\u0000-\u007F]/.test(e)}function Ze(e){return[...e].every(t=>{const n=t.codePointAt(0);return n>=119808&&n<=119833||n>=119834&&n<=119859||n>=120782&&n<=120791})}function Ge(e){return[...e].every(t=>{const n=t.codePointAt(0);return n>=119860&&n<=119885||n>=119886&&n<=119911||t==="ℎ"})}let de=null,B=null;function pe(){B||(B=document.createElement("div"),B.id="linkedin-ai-text-toolbar-root",document.body.appendChild(B),de=qe.createRoot(B),de.render(h.jsx(Fe,{onFormat:Ke,onTransform:Qe,onRewrite:et})))}function Ke(e){const t=window.getSelection();if(!t)return;const n=t.toString();if(!n)return;let i=n;switch(e){case"bold":Ge(n.trim())&&(i=j(n,"italic")),ce(n.trim())?i=j(n,"bold"):i=le(n);break;case"italic":Ze(n.trim())&&(i=j(n,"bold")),ce(n.trim())?i=j(n,"italic"):i=le(n,"italic");break}ke(i),D()}async function Qe(e){const t=window.getSelection();if(!t)return;const n=t.toString().trim();let i=ee(t);if(i.length!==0&&(i[i.length-1]!=="."&&(i+="."),!!n))try{Ee();const o=await fe(n,e);if(!o){F("Failed to fetch transformed text");return}await Ce(t,i,o),D()}catch(o){F(o.message)}}async function et(){const e=window.getSelection();if(!e)return;const t=e.toString().trim();if(!t)return;let n=t;if(!t.endsWith(".")&&!t.endsWith("?")&&!t.endsWith("!")&&(n=ee(e)),n.length===0)return;const i=n;n[n.length-1]!=="."&&(n+=".");try{Ee();const o=await fe(n,"rewrite");o?(await Ce(e,i,o),D()):F("failed to fetch")}catch(o){F(o.message)}}function ke(e){const t=window.getSelection();if(!t||t.rangeCount===0)return;const n=t.getRangeAt(0);if(!t.toString())return;n.deleteContents();const o=document.createTextNode(e);n.insertNode(o),n.setStartAfter(o),n.setEndAfter(o),t.removeAllRanges(),t.addRange(n);let a=o.parentElement;for(;a&&!a.isContentEditable;)a=a.parentElement;a&&a.dispatchEvent(new Event("input",{bubbles:!0}))}async function Ce(e,t,n){let o=e.getRangeAt(0).commonAncestorContainer;for(;o&&o.tagName!=="P";)o=o.parentElement;if(!o||o.tagName!=="P"){ke(n);return}const a=window.linkedinMentionsData||[];let r=n;if(a.length>0){const{restoreMentionsInText:p}=await We(async()=>{const{restoreMentionsInText:v}=await Promise.resolve().then(()=>Ve);return{restoreMentionsInText:v}},void 0);r=p(n,a)}const l=o.textContent||o.innerText||"",c=document.createElement("span");c.style.cssText=`
    background: linear-gradient(90deg, #e7f3ff, #f0f9ff);
    border-radius: 4px;
    padding: 2px 4px;
    transition: all 0.3s ease;
    position: relative;
    display: inline-block;
    width: 100%;
    min-height: 1.2em;
  `,c.textContent=l,o.innerHTML="",o.appendChild(c),await tt(c,l,r),o.innerHTML=r,delete window.linkedinMentionsData;const d=o.closest(".ql-editor");d&&d.dispatchEvent(new Event("input",{bubbles:!0}))}async function tt(e,t,n){return new Promise(i=>{e.style.background="linear-gradient(90deg, #fef3c7, #fde68a)",e.style.transform="scale(1.02)",setTimeout(()=>{let o=0;e.style.background="linear-gradient(90deg, #e7f3ff, #dbeafe)",e.style.transform="scale(1)";const a=setInterval(()=>{if(o<=n.length){const r=n.substring(0,o);o<n.length?e.innerHTML=r+'<span style="animation: blink 1s infinite; color: #0a66c2;">|</span>':e.textContent=n,o++}else clearInterval(a),e.style.background="linear-gradient(90deg, #d1fae5, #a7f3d0)",e.style.transform="scale(1.02)",setTimeout(()=>{e.style.background="transparent",e.style.transform="scale(1)",e.style.transition="all 0.5s ease",setTimeout(i,500)},800)},50)},300)})}function Ee(){const e=document.getElementById("linkedin-ai-text-toolbar");e&&(e.innerHTML=`
      <div style="display: flex; align-items: center; gap: 8px; padding: 4px 8px;">
        <div class="linkedin-ai-loading-spinner" style="width: 14px; height: 14px;"></div>
        <span style="font-size: 12px; color: #0a66c2;">Processing...</span>
      </div>
    `)}function F(e){const t=document.getElementById("linkedin-ai-text-toolbar");t&&(t.innerHTML=`
      <div style="padding: 4px 8px; color: #ef4444; font-size: 12px;">
        ${e}
      </div>
    `,setTimeout(()=>D(),3e3))}function D(){const e=window.getSelection();e&&e.removeAllRanges(),document.dispatchEvent(new MouseEvent("mousedown"))}const $={professional:{name:"Professional",description:"Formal, industry-focused responses",icon:"💼",prompt:"Respond in a professional, formal tone suitable for business networking"},conversational:{name:"Conversational",description:"Friendly, approachable tone",icon:"💬",prompt:"Respond in a friendly, conversational tone that builds rapport"},thoughtLeader:{name:"Thought Leader",description:"Insightful, question-provoking responses",icon:"🧠",prompt:"Respond as a thought leader with insightful, authoritative, strategic perspectives"},supportive:{name:"Supportive",description:"Encouraging, positive reinforcement",icon:"🤝",prompt:"Respond with encouragement and positive reinforcement"},analytical:{name:"Analytical",description:"Data-driven, logical responses",icon:"📊",prompt:"Respond with analytical, data-driven insights and logical reasoning"},networking:{name:"Networking",description:"Connection-building, relationship-focused",icon:"🌐",prompt:"Respond with a focus on building connections and relationships"},conciseExpert:{name:"Concise Expert",description:"Short, direct, minimal words but maximum insight",icon:"🎯",prompt:"Respond as a concise expert: use minimal words, be direct, and deliver maximum insight in each reply"}},nt={microContent:{name:"Micro-Content",description:"Very short sentences. Each on new line. Maximum impact.",icon:"⚡",example:{author:"Sarah Chen",content:`Just shipped our biggest feature yet.

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

Agree or disagree?`,engagement:{likes:"856",comments:"92"}},prompt:"Present a contrarian viewpoint that challenges conventional wisdom in your industry"}};function it(e){const t={isReplyingToComment:!1},n=e.closest(".feed-shared-update-v2");if(n){const o=n.querySelector(".update-components-actor__name"),a=n.querySelector(".update-components-text");t.postAuthor=o?(o.textContent||"").trim():"",t.postContent=a?(a.textContent||"").trim():""}const i=e.closest(".comments-comment-item");if(i){t.isReplyingToComment=!0;const o=i.querySelector(".comments-post-meta__name-text"),a=i.querySelector(".comments-comment-item-content-body");t.replyingToAuthor=o?(o.textContent||"").trim():"",t.replyingToContent=a?(a.textContent||"").trim():""}return t.postAuthor&&t.postContent?t:null}async function ot(e){const{selectedPersona:t}=await chrome.storage.sync.get(["selectedPersona"]),i=$[t||"professional"],o=`Based on this LinkedIn post by ${e.postAuthor}:

"${e.postContent}"

Provide 3 unique, engaging, and thoughtful comment suggestions from the perspective of a ${i.name} persona: ${i.prompt}.`;return Te(o)}async function at(e){const{selectedPersona:t}=await chrome.storage.sync.get(["selectedPersona"]),i=$[t||"professional"],o=`LinkedIn post by ${e.postAuthor}:
"${e.postContent}"

User ${e.replyingToAuthor} commented:
"${e.replyingToContent}"

Provide 3 unique, engaging replies to this specific comment from the perspective of a ${i.name} persona: ${i.prompt}.`;return Te(o)}async function Te(e){const t=await x();return(await window.lia_fetchWithAuth("https://api.getlia.live/api/prompt/comment",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},credentials:"include",body:JSON.stringify({prompt:e})})).json()}function rt(e,t,n){if(!t||!t.suggestions){e.innerHTML='<div style="color: red; padding: 10px;">Failed to parse suggestions</div>';return}const i=Array.isArray(t.suggestions)?t.suggestions:[t.suggestions];e.innerHTML="",i.forEach(a=>{const r=document.createElement("div");r.className="linkedin-ai-suggestion-item",r.textContent=a,r.addEventListener("click",()=>{const l=n.querySelector(".ql-editor");l&&window.insertTextIntoEditor?.(l,a),e.remove()}),e.appendChild(r)});const o=document.createElement("button");o.textContent="✕",o.style.cssText="position: absolute; top: 5px; right: 5px; background: none; border: none; cursor: pointer; color: #666; font-size: 12px;",o.onclick=()=>e.remove(),e.appendChild(o)}function st(e,t){chrome.storage.sync.set({selectedPersona:e});const n=$[e],i=t.querySelector(".lia-persona-btn");i&&(i.innerHTML=`
      <span class="lia-persona-icon">${n.icon}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6,9 12,15 18,9"/>
      </svg>
    `),t.querySelectorAll(".lia-persona-option").forEach(a=>{a.classList.remove("active")});const o=t.querySelector(`[data-persona="${e}"]`);o&&o.classList.add("active")}function lt(e){if(e.querySelector(".lia-reply-assistant"))return;const t=e.querySelector(".comments-comment-box-comment__text-editor");t&&chrome.storage.sync.get(["linkedinTheme","selectedPersona"],n=>{const i=n.linkedinTheme==="dark"?"dark":"",o=n.selectedPersona||"professional",a=document.createElement("div");a.className=`lia-reply-assistant ${i}`,a.innerHTML=`
      <button class="linkedin-ai-button ${i}" title="Generate AI Reply" style="font-size: 12px; padding: 4px 8px;" >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
        </svg>
        AI Reply
      </button>
      <div class="lia-persona-selector">
        <button class="lia-persona-btn" id="lia-persona-${Date.now()}" style="font-size: 12px; padding: 4px 8px;">
          <span class="lia-persona-icon">${$[o]?.icon||"💼"}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>
        <div class="lia-persona-dropdown" style="display: none;">
          ${Object.entries($).map(([d,p])=>`
            <div class="lia-persona-option ${d===o?"active":""}" data-persona="${d}">
              <span class="lia-persona-icon">${p.icon}</span>
              <div class="lia-persona-info">
                <div class="lia-persona-name">${p.name}</div>
                <div class="lia-persona-desc">${p.description}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `,t.prepend(a);const r=a.querySelector(".lia-persona-btn"),l=a.querySelector(".lia-persona-dropdown"),c=a.querySelector(".linkedin-ai-button");r&&l&&(r.addEventListener("click",d=>{d.stopPropagation(),d.preventDefault(),l.style.display=l.style.display==="none"?"block":"none"}),document.addEventListener("click",()=>{l.style.display="none"}),a.querySelectorAll(".lia-persona-option").forEach(d=>{d.addEventListener("click",p=>{p.stopPropagation();const v=d.dataset.persona||"professional";st(v,a),l.style.display="none"})})),c&&c.addEventListener("click",d=>{d.preventDefault(),ct(e)})})}async function ct(e){const t=e.querySelector(".ql-container"),n=e.querySelector(".ql-editor");if(!t||!n)return;let i=t.querySelector(".linkedin-ai-suggestions");i||(i=document.createElement("div"),i.className="linkedin-ai-suggestions",t.appendChild(i));const{linkedinTheme:o}=await chrome.storage.sync.get(["linkedinTheme"]);o==="dark"&&(i.style.backgroundColor="#293139",i.style.border="0"),i.innerHTML=`
    <div class="linkedin-ai-loading">
      <div class="linkedin-ai-loading-spinner"></div>
      <span>Generating reply suggestions...</span>
    </div>
  `;try{const a=it(e);if(!a)throw new Error("Unable to determine comment context");let r;if(a.isReplyingToComment?r=await at(a):r=await ot(a),r&&r.error){if(r.error.includes("missing plan")){i.innerHTML=`
          <div style="color: red; padding: 10px;">
          Please upgrade your plan to use this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Upgrade Now</a>
          </div>
        `;return}else if(r.error.includes("Plan expired")){i.innerHTML=`
          <div style="color: red; padding: 10px;">
          Your plan has expired. Please renew your subscription to continue using this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Renew Now</a>
          </div>
        `;return}}n.textContent="",rt(i,r,e)}catch(a){throw i.innerHTML=`
      <div style="color: red; padding: 10px;">
      ${a.message||"Failed to generate suggestions"}
      </div>
    `,a}}function V(){chrome.storage.sync.get(["reply_enabled"],e=>{if(!e.reply_enabled)return;document.querySelectorAll(".comments-comment-texteditor").forEach(n=>{lt(n)})})}function dt(){document.querySelectorAll(".lia-reply-assistant").forEach(e=>e.remove())}function w(e,t,n="info"){const i=e.parentElement?.querySelector(".lia-temp-message");i&&i.remove();const o=document.createElement("div");o.className=`lia-temp-message lia-msg-${n}`,o.style.cssText=`
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: ${n==="error"?"#fef2f2":"#f0f9ff"};
    color: ${n==="error"?"#dc2626":"#0a66c2"};
    border: 1px solid ${n==="error"?"#fecaca":"#bae6fd"};
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
  `,o.innerHTML=t,e.parentElement&&(e.parentElement.style.position="relative",e.parentElement.appendChild(o)),setTimeout(()=>{o.parentElement&&(o.style.animation="fadeOut 0.3s ease-in",setTimeout(()=>o.remove(),300))},4e3)}function pt(e){const t=document.createElement("div");t.className="linkedin-ai-rewrite-loading",t.style.cssText=`
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
  `;const n=e.closest(".share-box");return n&&(n.style.position="relative",n.appendChild(t)),t}async function ut(e){const t=await chrome.storage.sync.get(["tone","industry"]),n=t.tone||"professional",i=t.industry||"technology";let r=Array.from(e.querySelectorAll("p")).map(c=>{let d="";return c.childNodes.forEach(p=>{p.nodeType===Node.ELEMENT_NODE&&p.classList.contains("ql-mention")?d+="@"+(p.textContent??""):(p.nodeType===Node.TEXT_NODE||p.nodeType===Node.ELEMENT_NODE)&&(d+=p.textContent??"")}),d.trim()}).join(`
`)||e.textContent||e.innerText||"";if(!r.trim()){w(e,"Please write some text first to rewrite it");return}const l=pt(e);w(e,"LIA is rewriting..");try{const c=await Ue(r,n,i);if(c.error&&c.error.includes("missing plan")){l.remove(),w(e,"Please upgrade your plan to use this feature. <a href='https://www.getlia.live/pricing' target='_blank'>Upgrade Now</a>","error");return}else if(c.error&&c.error.includes("Plan expired")){l.remove(),w(e,"Your plan has expired. Please renew your subscription to continue using this feature. <a href='https://www.getlia.live/pricing' target='_blank'>Renew Now</a>","error");return}else if(c.error&&c.error.includes("Invalid or expired token")){l.remove(),w(e,"Your session has expired. Please sign in again to continue using this feature.","error");return}const d=window.cleanAIResponse?window.cleanAIResponse(c.response):c.response,p=c.improvements||[];l.remove(),d?(window.animateTextRewriteWithMentions?await window.animateTextRewriteWithMentions(e,r,d,p):e.textContent=d,window.showImprovementsMade&&window.showImprovementsMade(e,p,r)):w(e,"No improvements were made to the text because the extension encountered an error")}catch(c){l.remove(),console.error("Error during rewrite:",c),c.message==="Failed to generate improved text"?w(e,"Failed to generate improved text. Maybe your session has expired. Please try signing in again."):w(e,`Error: ${c.message}`)}}function gt(){document.querySelectorAll(".share-box_actions .linkedin-ai-button").forEach(e=>e.remove())}function J(){const e=document.querySelector(".share-box-feed-entry__top-bar button.artdeco-button--tertiary");e&&(e.hasAttribute("data-lia-rewrite-setup")||(e.setAttribute("data-lia-rewrite-setup","true"),e.addEventListener("click",()=>{chrome.storage.sync.get(["rewrite_enabled","linkedinTheme"],t=>{t.rewrite_enabled&&Oe(".share-box_actions").then(n=>{const i=n;i&&(i.style.display="flex",i.style.gap="8px");const o=document.createElement("button");o.className="linkedin-ai-button",t.linkedinTheme==="dark"&&(o.style.backgroundColor="#71b7fb"),o.style.padding="4px 8px",o.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
        </svg>
          AI Rewrite
        `;const a=document.querySelector(".share-box .ql-editor");let r=!1;o.addEventListener("click",async()=>{r?w(a,"LIA is rewriting text. Please wait for the process is complete."):(r=!0,await ut(a),r=!1)}),i&&!i.querySelector(".linkedin-ai-button")&&i.prepend(o)})})})))}const s={isOpen:!1,isMinimized:!1,sidebarCollapsed:!1,conversations:[],currentConversationId:null,position:{x:typeof window<"u"?window.innerWidth-80:0,y:typeof window<"u"?window.innerHeight-80:0},referenceMode:!1,referencedContent:null,notesMode:!1,notes:[],currentNoteId:null,noteContext:null,templateMode:!1,selectedTemplate:null};async function C(){await chrome.storage.local.set({chatbotState:s})}chrome.storage.local.get(["chatbotState"],e=>{e.chatbotState&&Object.assign(s,e.chatbotState)});const mt=async()=>{const e=await chrome.storage.local.get(["chatbotState"]);e.chatbotState&&Object.assign(s,e.chatbotState)};let y=10,k=10,L=nt,A={industry:"technology",tone:"professional"};chrome.storage.sync.get(["tone","industry"],e=>{A={...A,...e}});function Me(){const e=document.getElementById("lia-message-input"),t=document.getElementById("lia-send-btn"),n=document.getElementById("lia-minimize-btn"),i=document.getElementById("lia-close-btn"),o=document.getElementById("lia-sidebar-toggle"),a=document.getElementById("lia-chat-sidebar"),r=document.getElementById("lia-load-more-btn"),l=document.getElementById("lia-new-chat-btn"),c=document.querySelector(".lia-chatbot-title"),d=document.getElementById("lia-reference-toggle"),p=document.getElementById("lia-notes-toggle"),v=document.getElementById("lia-template-toggle"),m=document.getElementById("lia-structure-note"),g=document.getElementById("lia-summarize-note"),T=document.getElementById("lia-expand-note"),M=document.getElementById("lia-add-tags");document.getElementById("lia-quick-suggestions");const S=document.getElementById("lia-suggestions-close");document.getElementById("lia-suggestions-track");const _e=document.getElementById("lia-suggestions-prev"),je=document.getElementById("lia-suggestions-next");a.classList.add("collapsed"),e.focus(),e.addEventListener("input",function(){this.style.height="auto",this.style.height=Math.min(this.scrollHeight,120)+"px"}),e.addEventListener("keydown",u=>{u.key==="Enter"&&!u.shiftKey&&(u.preventDefault(),s.notesMode?me():G())}),e.addEventListener("input",function(){t.disabled=!this.value.trim()}),n.addEventListener("click",u=>{u.stopPropagation(),Lt()}),i.addEventListener("click",u=>{u.stopPropagation(),It()}),o.addEventListener("click",u=>{u.stopPropagation(),X()}),c.addEventListener("mouseover",u=>{u.stopPropagation(),X()}),c.addEventListener("mouseout",u=>{u.stopPropagation(),X()}),a.addEventListener("mouseover",u=>{u.stopPropagation(),St()}),r.addEventListener("click",u=>{u.stopPropagation(),Bt()}),l.addEventListener("click",async u=>{u.stopPropagation(),s.notesMode?ne():await Y()}),t.addEventListener("click",u=>{u.stopPropagation(),s.notesMode?me():G()}),d.addEventListener("click",u=>{u.stopPropagation(),_t()}),p.addEventListener("click",u=>{u.stopPropagation(),$e()}),v.addEventListener("click",u=>{u.stopPropagation(),Ie()}),m?.addEventListener("click",u=>{u.stopPropagation(),q("structure")}),g?.addEventListener("click",u=>{u.stopPropagation(),q("summarize")}),T?.addEventListener("click",u=>{u.stopPropagation(),q("expand")}),M?.addEventListener("click",u=>{u.stopPropagation(),q("tags")}),S?.addEventListener("click",u=>{u.stopPropagation(),E()}),_e?.addEventListener("click",u=>{u.stopPropagation(),ge("prev")}),je?.addEventListener("click",u=>{u.stopPropagation(),ge("next")}),Se(),new window.Lia_ProfileCard("lia-chat-sidebar"),new window.Lia_CustomizationModal}async function Ie(){s.templateMode=!s.templateMode;const e=document.getElementById("lia-template-toggle"),t=document.getElementById("lia-mode-title"),n=document.getElementById("lia-sidebar-header"),i=document.getElementById("lia-new-chat-btn"),o=document.getElementById("lia-message-input"),a=document.getElementById("lia-mode-indicator"),r=document.getElementById("lia-load-more-btn"),l=document.getElementById("lia-notes-toggle");try{a.style.display="flex"}catch{}if(s.templateMode){y=10,k=10,s.notesMode&&(s.notesMode=!s.notesMode,l.classList.remove("notes-active")),e.classList.add("template-active"),e.title="Template Mode: ON",window.typeWriter("LIA Templates",t),n.textContent="Writing Styles",i.innerHTML=`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Post
      `,o.placeholder="What would you like to write about?";const c=document.getElementById("lia-conversation-list");c.innerHTML="",await Le(),E(),r.style.display="none"}else{if(y=10,k=10,e.classList.remove("template-active"),e.title="Template Mode: OFF",!s.notesMode)try{a.style.display="none"}catch{}window.typeWriter("LIA",t),n.textContent="Conversations",i.innerHTML=`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Chat
      `,o.placeholder="What do you want to post?",oe(),r.style.display="block"}await C()}async function Le(){const e=document.getElementById("lia-conversation-list");e&&(await ht(),e.innerHTML=Object.entries(L).map(([t,n])=>`
      <div class="lia-template-item ${s.selectedTemplate===t?"active":""}" data-template="${t}">
        <div class="lia-template-icon">${n.icon}</div>
        <div class="lia-template-info">
          <div class="lia-template-name">${n.name}</div>
          <div class="lia-template-description">${n.description}</div>
        </div>
      </div>
    `).join(""),e.querySelectorAll(".lia-template-item").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.template;ue(n)})}),s.selectedTemplate&&(s.currentConversationId=null,ue(s.selectedTemplate)))}function ue(e){s.selectedTemplate=e,s.currentConversationId=null,s.conversations=[];const t=L[e];document.querySelectorAll(".lia-template-item").forEach(i=>{i.classList.remove("active")}),document.querySelector(`[data-template="${e}"]`).classList.add("active");const n=document.getElementById("lia-messages-container");n.innerHTML=`
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
    `,C()}const ht=async()=>{try{const e=await window.lia_fetchWithAuth("https://api.getlia.live/api/chat/templates",{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await x()}`},credentials:"include"}),t=await e.json();console.log("Fetched templates:",t),e.ok?L=t.templates.filter(n=>n.key!=="normal").reduce((n,i)=>(n[i.key]=i,n),{}):console.error("Failed to fetch templates:",t.error)}catch(e){console.error("Error fetching templates:",e)}};function Se(){const e=document.getElementById("lia-quick-suggestions"),t=document.getElementById("lia-suggestions-track");if(!(!e||!t))if(!s.notesMode&&(s.referenceMode||s.referencedContent)){const n=ft();vt(n),xt()}else E()}function ft(){const e=[];if(s.referenceMode&&e.push({icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
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
            </svg>`,text:"Rate and review",action:"What's your professional assessment of this article?"}),A.industry==="technology"&&e.push({icon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>`,text:"Tech implications",action:"What are the technology implications of this content?"})}return e.slice(0,6)}function vt(e){const t=document.getElementById("lia-suggestions-track");t&&(t.innerHTML=e.map(n=>`
      <div class="lia-suggestion-card" data-action="${n.action}" title='Click to use'>
        <div class="lia-suggestion-icon">
          ${n.icon}
        </div>
        <div class="lia-suggestion-text">${n.text}</div>
        <!--<div class="lia-suggestion-action">Click to use</div>-->
      </div>
    `).join(""),t.querySelectorAll(".lia-suggestion-card").forEach(n=>{n.addEventListener("click",i=>{i.stopPropagation();const o=n.dataset.action;G(o),E()})}),Be())}function xt(){const e=document.getElementById("lia-quick-suggestions");e&&e.classList.remove("hidden")}function E(){const e=document.getElementById("lia-quick-suggestions");e&&e.classList.add("hidden")}function ge(e){const t=document.getElementById("lia-suggestions-track");if(!t)return;const n=212,i=t.style.transform,o=i?Number.parseInt(i.match(/-?\d+/)?.[0]||0):0;let a=o;e==="next"?a=o-n:a=o+n;const r=0,l=-(t.children.length-2)*n;a=Math.max(l,Math.min(r,a)),t.style.transform=`translateX(${a}px)`,Be()}function Be(){const e=document.getElementById("lia-suggestions-track"),t=document.getElementById("lia-suggestions-prev"),n=document.getElementById("lia-suggestions-next");if(!e||!t||!n)return;const i=e.style.transform,o=i?Number.parseInt(i.match(/-?\d+/)?.[0]||0):0,a=212,r=0,l=-(e.children.length-2)*a;t.disabled=o>=r,n.disabled=o<=l}async function $e(){s.notesMode=!s.notesMode;const e=document.getElementById("lia-notes-toggle"),t=document.getElementById("lia-mode-title"),n=document.getElementById("lia-sidebar-header"),i=document.getElementById("lia-new-chat-btn"),o=document.getElementById("lia-message-input"),a=document.getElementById("lia-input-actions"),r=document.getElementById("lia-notes-mode-indicator"),l=document.getElementById("lia-send-btn"),c=document.getElementById("lia-load-more-btn");try{c.style.display="block"}catch{}try{r.style.display="flex"}catch{}const d=document.createElement("button");if(d.classList.add("sync-note-btn"),d.textContent="Sync Notes",d.addEventListener("click",async()=>{f("Syncing notes...","info");const p={notes:await ie()};await(async()=>{const m=await window.lia_fetchWithAuth("https://api.getlia.live/api/note/notes",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await x()}`},credentials:"include",body:JSON.stringify(p)});if(!m.ok)throw console.error("Error syncing notes:",m.statusText),new Error("Failed to sync notes");const g=await m.json();if(g.success&&(console.log("Notes synced successfully"),f("Notes synced successfully","success")),!g.success)throw new Error("Failed to sync notes");return g.success})()}),o.value="",s.templateMode&&(s.templateMode=!s.templateMode,document.getElementById("lia-template-toggle").classList.remove("template-active")),s.notesMode){const p=async g=>{const T=g<10?0:g-10,M=await window.lia_fetchWithAuth(`https://api.getlia.live/api/note/notes?limit=${g}&start=${T}`,{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await x()}`},credentials:"include"});if(!M.ok)throw console.error("Error fetching notes:",M.statusText),new Error("Failed to fetch notes");const S=await M.json();if(S)return console.log("Notes fetched successfully"),s.notes=S,C(),f("Notes fetched successfully","success"),S;if(!S)throw console.log("Failed to fetch notes"),new Error("Failed to fetch notes")},v=document.getElementById("lia-conversation-list");v.innerHTML="",k=10;let m=await p(k);k+=10,E(),y=10,e.classList.add("notes-active"),e.title="Notes Mode: ON",window.typeWriter("LIA Notes",t),n.textContent="Recent Notes",i.innerHTML=`
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
      `,yt(),te(),m=await wt();try{const g=r.querySelector(".lia-notes-info");g&&g.appendChild(d)}catch{}f("📝 Notes Mode ON - Capture and organize your thoughts","success"),console.log("this is the notes",m),v.innerHTML=m.map(g=>{const T=g.title.slice(0,15)+(g.title.length>15?"...":""),M=K(g.context?.type);return`
          <div class="lia-conversation-item-wrapper" style="position: relative;">
            <div class="lia-conversation-item ${g.id===s.currentNoteId?"active":""}"
                data-id="${g.id}" title="${g.title}" style="cursor: pointer; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
              <div style="flex: 1; overflow: hidden;">
                <div class="truncatedTitle" style="font-size: 12px; font-weight: 500;">${M} ${T}</div>
                <div style="font-size: 10px; color: #a9d2f3ff; margin-top: 2px;">${O(g.lastModified)}</div>
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
        `}).join(""),Ne()}else{k=10,y=10,e.classList.remove("notes-active"),e.title="Notes Mode: OFF",window.typeWriter("LIA",t),n.textContent="Recent Chats",i.innerHTML=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg> New Chat`,o.placeholder="What do you want to post?",o.setAttribute("rows","1"),a.style.display="none";try{r.style.display="none"}catch{}l.innerHTML=`
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22,2 15,22 11,13 2,9"></polygon>
        </svg>`,bt(),await oe();try{r.querySelector(".sync-note-btn").remove()}catch{}f("💬 Chat Mode ON","info")}await C()}function yt(){const e=document.getElementById("lia-context-info");let t="";if(window.location.href.includes("linkedin.com/in/")){const n=window.location.pathname.match(/\/in\/([^/]+)/),i=n?n[1]:null;i&&(t=`📋 Profile: ${i}`,s.noteContext={type:"profile",identifier:i,url:window.location.href})}else window.location.href.includes("linkedin.com/feed")?(t="📰 LinkedIn Feed",s.noteContext={type:"feed",identifier:"feed",url:window.location.href}):window.location.href.includes("linkedin.com/pulse")?(t="📖 LinkedIn Article",s.noteContext={type:"article",identifier:"article",url:window.location.href}):(t="🌐 General Note",s.noteContext={type:"general",identifier:"general",url:window.location.href});e.textContent=t}function te(){const e=document.getElementById("lia-messages-container");e.innerHTML=`
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
    `}function bt(){const e=document.getElementById("lia-messages-container");e.innerHTML=`
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
    `}async function ne(){document.getElementById("lia-messages-container"),document.querySelector(".lia-message-input").value="",te();const e={id:U(),title:"New Note",content:"",tags:[],context:s.noteContext,timestamp:Date.now(),lastModified:Date.now()};s.currentNoteId=e.id,await N(e),await b(),document.getElementById("lia-message-input").focus()}async function me(){const e=document.getElementById("lia-message-input"),t=e.value.trim();if(!t)return;const n=s.currentNoteId||U();let i=[];const o=await _(n);o&&Array.isArray(o.content)&&(i=[...o.content]),t&&(typeof t=="string"?i.push({contentId:z(),type:"text",text:t}):typeof t=="object"&&t.type==="reference"&&i.push({contentId:z(),type:"reference",content:t}));const a={id:n,title:await Tt(t),content:i,tags:Mt(typeof t=="string"?t:""),context:s.noteContext,timestamp:s.currentNoteId&&o?.timestamp||Date.now(),lastModified:Date.now()};s.currentNoteId=n,Ae(a),e.value="",e.style.height="auto",await N(a),await b(),f("📝 Note saved!","success")}function Ae(e){const t=document.getElementById("lia-messages-container");t.style.opacity="0.5";const n=t.querySelector(".lia-message.assistant");n&&n.textContent.includes("Welcome to Notes Mode")&&n.remove();let i=e.content;Array.isArray(i)&&(i=i.map(r=>{if(r.type==="text"&&typeof r.text=="string"){let l=r.text;return e.tags&&e.tags.length>0&&e.tags.forEach(c=>{l=l.replace(new RegExp(`#${c}\\b`,"g"),"")}),{...r,text:l.trim()}}return r}));const o=e.tags.length>0?`<div class="lia-note-tags">${e.tags.map(r=>`<span class="lia-tag">${r}</span>`).join("")}</div>`:"";let a="";Array.isArray(i)?a=i.map(r=>{if(r.type==="text")return`
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
                <span class="lia-note-timestamp">${O(e.lastModified)}</span>
              </div>
              <div class="lia-note-body">
                <div class="lia-note-text">${he(r.text)}</div>
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
          `:""}return""}).join(""):a=he(e.content),t.innerHTML=a,t.scrollTop=t.scrollHeight,e.content===""&&te(),setTimeout(()=>{t.style.opacity="1"},50)}async function q(e){const t=document.getElementById("lia-message-input"),n=t.value.trim();if(!n){f("Please write some content first","warning");return}const i=document.createElement("div");i.className="lia-message assistant",i.innerHTML=`
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
    `;const o=document.getElementById("lia-messages-container");o.appendChild(i),o.scrollTop=o.scrollHeight;try{let a="";switch(e){case"structure":a=await R(e,n,"Structure this note with clear headings, bullet points, and organized sections");break;case"summarize":a=await R(e,n,"Summarize this content into key points and main takeaways");break;case"expand":a=await R(e,n,"Expand this note with more details, examples, and comprehensive information");break;case"tags":a=await R(e,n,"Generate relevant tags for this content. Return only the content plus the space separated tags (as hashtags - e.g. #tag1 #tag2) one line after the conte");break}i.remove(),t.value=a,t.style.height="auto",t.style.height=Math.min(t.scrollHeight,120)+"px",f(`✨ Note ${e==="tags"?"tagged":e+"d"} successfully!`,"success")}catch(a){i.remove(),f(`Failed to ${e} note`,"error"),console.error("Note enhancement error:",a)}}async function R(e,t,n){const i=`${n}:

"${t}"

Return only the enhanced content without explanations or appending the type/anything infront of it.`,o=await fetch("https://api.getlia.live/api/note/enhance-note",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await x()}`},body:JSON.stringify({type:e,prompt:i,content:t,context:s.noteContext})}),a=await o.json();if(!o.ok)throw new Error(a.error?.message||"Failed to enhance note");return a.enhancedNote}async function wt(){try{const e=await ie();if(s.notes=e,e.length===0){ne();return}return e.length>0&&(s.currentNoteId=e[0].id,await P(s.currentNoteId)),e}catch(e){console.error("Error loading notes:",e)}}async function P(e){const t=await _(e);if(!t)return;s.currentNoteId=e;const n=document.getElementById("lia-messages-container");n.innerHTML="",Ae(t);const i=document.getElementById("lia-message-input");if(t.tags&&t.tags.length>0)if(Array.isArray(t.content)){const a=[...t.content].reverse().find(c=>c.type==="text");let r=a?a.text:"";const l=t.tags.map(c=>`#${c}`).join(" ");l&&!r.includes(l)?i.value=(r+`
`+l).trim():i.value=r}else{let a=typeof t.content=="string"?t.content:"";const r=t.tags.map(l=>`#${l}`).join(" ");r&&!a.includes(r)?i.value=(a+`
`+r).trim():i.value=a}else if(Array.isArray(t.content)){const a=[...t.content].reverse().find(r=>r.type==="text");i.value=a?a.text:""}else i.value=typeof t.content=="string"?t.content:"";i.style.height="auto",i.style.height=Math.min(i.scrollHeight,120)+"px",document.querySelectorAll(".lia-conversation-item").forEach(a=>{a.getAttribute("data-id")===conversationId?a.classList.add("active"):a.classList.remove("active")})}async function N(e){return new Promise(t=>{chrome.storage.local.get(["lia_notes"],n=>{const i=n.lia_notes||[],o=i.findIndex(a=>a.id===e.id);o>=0?i[o]=e:i.unshift(e),chrome.storage.local.set({lia_notes:i},t)})})}async function kt(e,t){return new Promise(n=>{chrome.storage.local.get(["lia_notes"],i=>{const o=i.lia_notes||[],a=o.findIndex(r=>r.id===e.id);a>=0?o[a].content.push(t):o.unshift(e),chrome.storage.local.set({lia_notes:o},n)})})}async function _(e){return new Promise(t=>{chrome.storage.local.get(["lia_notes"],n=>{const i=n.lia_notes||[];t(i.find(o=>o.id===e))})})}async function ie(){return new Promise(e=>{chrome.storage.local.get(["lia_notes"],t=>{e(t.lia_notes||[])})})}async function Ct(e){return new Promise(t=>{chrome.storage.local.get(["lia_notes"],n=>{const o=(n.lia_notes||[]).filter(a=>a.id!==e);chrome.storage.local.set({lia_notes:o},t)})})}async function Et(e,t){return new Promise(n=>{chrome.storage.local.get(["lia_notes"],i=>{const o=i.lia_notes||[],a=o.findIndex(r=>r.id===e);if(a>=0){const r=o[a];r.content=r.content.filter(l=>l.contentId!==t),r.content.length===0?o.splice(a,1):o[a]=r,chrome.storage.local.set({lia_notes:o},n)}else n()})})}function U(){return"note_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}function z(){return"content_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}async function Tt(e){if(!e||e.trim().length===0)return"Untitled Note";const t=await fetch("https://api.getlia.live/api/note/generate-title",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await x()}`},body:JSON.stringify({content:e})});function n(){const o=e.split(`
`)[0].trim();return o.length>50?o.substring(0,47)+"...":o||"Untitled Note"}if(!t.ok)return n();const i=await t.json();return i.title?i.title||"Untitled Note":n()}function Mt(e){const t=e.match(/#[\w]+/g);return t?t.map(n=>n.substring(1)):[]}function he(e){let t=e;return t=t.replace(/^# (.*$)/gm,'<h3 class="lia-note-h3">$1</h3>'),t=t.replace(/^## (.*$)/gm,'<h4 class="lia-note-h4">$1</h4>'),t=t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),t=t.replace(/\*(.*?)\*/g,"<em>$1</em>"),t=t.replace(/^- (.*$)/gm,'<li class="lia-note-li">$1</li>'),t=t.replace(/(<li class="lia-note-li">.*<\/li>)/s,'<ul class="lia-note-ul">$1</ul>'),t=t.replace(/\n/g,"<br>"),t}function O(e){const t=new Date(e),i=new Date-t;return i<6e4?"Just now":i<36e5?Math.floor(i/6e4)+"m ago":i<864e5?Math.floor(i/36e5)+"h ago":i<6048e5?Math.floor(i/864e5)+"d ago":t.toLocaleDateString()}window.editNote=async e=>{await P(e),document.getElementById("lia-message-input").focus(),document.getElementById("lia-send-btn").disabled=!1,f("📝 Note loaded for editing","info")};window.duplicateNote=async e=>{const t=await _(e);if(!t)return;const n={...t,id:U(),title:t.title+" (Copy)",timestamp:Date.now(),lastModified:Date.now()};await N(n),await b(),document.getElementById("lia-send-btn").disabled=!0,document.getElementById("lia-message-input").value="",f("📝 Note duplicated!","success")};window.duplicateNoteContent=async(e,t)=>{const n=await _(e);if(!n)return;const i=n.content.find(a=>a.contentId===t);if(!i)return;const o={...i,contentId:z(),timestamp:Date.now(),lastModified:Date.now()};n.content.push(o),await kt(n,o),await P(e),f("📝 Note content duplicated!","success")};window.deleteNote=async e=>{await Ct(e),s.currentNoteId===e&&await ne(),await b(),document.getElementById("lia-send-btn").disabled=!0,document.getElementById("lia-message-input").value="",f("🗑️ Note deleted","info")};window.deleteNoteContent=async(e,t)=>{await Et(e,t),await P(e),f("🗑️ Note content deleted","info")};function It(){const e=document.getElementById("lia-chatbot-interface");e.classList.remove("open"),e.classList.remove("minimized"),s.isOpen=!1,s.isMinimized=!1,y=10,k=10,e.classList.remove("right-radius-bottom-and-width")}function Lt(){const e=document.getElementById("lia-chatbot-interface");e.classList.toggle("right-radius-bottom-and-width"),e.style.left&&!e.classList.contains("minimized")&&(e.style.left="84.5%"),e.style.top&&!e.classList.contains("minimized")&&(e.style.top="89.5%"),e.classList.toggle("minimized"),s.isMinimized=!0}function St(){document.getElementById("lia-chat-sidebar").classList.remove("collapsed")}async function Bt(){const e=document.getElementById("lia-load-more-btn");if(e.disabled)return;e.disabled=!0;const t=e.innerHTML;if(e.innerHTML=`
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
      `,document.head.appendChild(n)}try{s.notesMode||(y+=10,await b())}finally{e.disabled=!1,e.innerHTML=t}}function X(){document.getElementById("lia-chat-sidebar").classList.toggle("collapsed"),s.sidebarCollapsed=!s.sidebarCollapsed}async function G(e){const t=document.getElementById("lia-message-input");let n=t.value.trim();if(n||(n=e||""),!!n){t.value="",t.style.height="auto",document.getElementById("lia-send-btn").disabled=!0,I("user",n),$t();try{let i;try{if(i=await At(n),i&&i.error&&i.error.includes("missing plan")){H(),I("assistant",'Please upgrade your plan to use this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Upgrade Now</a>');return}else if(i&&i.error&&i.error.includes("Plan expired")){H(),f("Your plan has expired. Please renew your subscription.","error"),I("assistant",'Your plan has expired. Please renew your subscription to continue using this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Renew Now</a>');return}throw new Error(i.error||"Failed to generate response from AI")}catch(o){console.error("Error generating chat response:",o)}E(),H(),I("assistant",i)}catch(i){H(),I("assistant",`Sorry, I encountered an error. Please try again. 😔
 Try Signin in again if the error continues - <a href='https://getlia.live/login' target='_blank' style='color: blue'>here</a>`),console.error("Chat error:",i)}}}function I(e,t){const n=document.getElementById("lia-messages-container"),i=document.createElement("div");if(i.className=`lia-message ${e}`,e==="assistant"){let o=W(t);o=Q(o),i.innerHTML=`
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
      `;const a=i.querySelector(".lia-message-content");if(t.includes("Unable to load conversations")||t.includes("Unable to create new chat"))a.innerHTML=o;else{let r=0;const l=t;async function c(){if(r<=l.length){const d=l.slice(0,r),p=Q(W(d));a.innerHTML=p+(r<l.length?'<span class="lia-cursor">|</span>':""),r++,setTimeout(c,8)}else if(a.innerHTML=o,t.length>50){const d=Xt(t),p=Zt();a.appendChild(d),i.addEventListener("mouseenter",()=>{d.style.opacity="1",p.style.opacity="1"}),i.addEventListener("mouseleave",()=>{d.style.opacity="0",p.style.opacity="0"})}}c()}}else i.innerHTML=`
        <div class="lia-message-avatar">${getUserAvatar()}</div>
        <div class="lia-message-content">${W(t)}</div>
      `;n.appendChild(i),n.scrollTop=n.scrollHeight,setTimeout(()=>{i.style.opacity="1"},50)}function $t(){const e=document.getElementById("lia-messages-container"),t=document.createElement("div");t.className="lia-message assistant",t.id="lia-typing-indicator",t.innerHTML=`
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
  `,e.appendChild(t),e.scrollTop=e.scrollHeight}function H(){const e=document.getElementById("lia-typing-indicator");e&&e.remove()}async function At(e){let t=null;s.templateMode&&s.selectedTemplate&&L[s.selectedTemplate]&&(t=L[s.selectedTemplate].id),console.log("Using template_id:",t),console.log("templates...",L),s.currentConversationId||await Y(template=!0);const n={message:e,tone:A.tone,industry:A.industry,reference:s.referencedContent||null};t&&(n.template_id=t);const i=await window.lia_fetchWithAuth(`https://api.getlia.live/api/chat/${s.currentConversationId}/message`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await x()}`},credentials:"include",body:JSON.stringify(n)}),o=await i.json();return i.ok?(s.templatesMode&&(s.templateMode=!1,s.selectedTemplate=null,await C(),document.getElementById("lia-template-badge").style.display="none",document.getElementById("lia-template-toggle").classList.remove("active"),document.getElementById("lia-sidebar-header").textContent="CONVERSATIONS",document.getElementById("lia-new-chat-btn").innerHTML=`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Chat
      `),o.reply):o}async function Y(e=!1){const t=document.getElementById("lia-messages-container");e||(t.innerHTML=`
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
    `);async function n(){const i=await window.lia_fetchWithAuth("https://api.getlia.live/api/chat/start",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await x()}`},body:JSON.stringify({title:"New Chat",chat_type:e?"template":"normal",...e&&{template_id:L[s.selectedTemplate].id||null}}),credentials:"include"}),o=await i.json();if(!i.ok)throw new Error(o.error||o.message||"Failed to create new chat");return s.currentConversationId=o.id,o}await n(),await b(),document.getElementById("lia-message-input").focus(),s.referencedContent=null}async function oe(){const e=await b();if(y+=10,s.conversations=e,s.conversations.length===0){await Y();return}e.length>0&&(s.currentConversationId=e[0].id,ae(s.currentConversationId))}async function b(){const e=document.getElementById("lia-conversation-list");if(s.notesMode){const t=await ie();return k>t.length||k>10?e.innerHTML+=t.map(n=>{const i=n.title.slice(0,15)+(n.title.length>15?"...":""),o=K(n.context?.type);return`
              <div class="lia-conversation-item-wrapper" style="position: relative;">
                <div class="lia-conversation-item ${n.id===s.currentNoteId?"active":""}"
                    data-id="${n.id}" title="${n.title}" style="cursor: pointer; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
                  <div style="flex: 1; overflow: hidden;">
                    <div class="truncatedTitle" style="font-size: 12px; font-weight: 500;">${o} ${i}</div>
                    <div style="font-size: 10px; color: #a9d2f3ff; margin-top: 2px;">${O(n.lastModified)}</div>
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
            `}).join(""):e.innerHTML=t.map(n=>{const i=n.title.slice(0,15)+(n.title.length>15?"...":""),o=K(n.context?.type);return`
              <div class="lia-conversation-item-wrapper" style="position: relative;">
                <div class="lia-conversation-item ${n.id===s.currentNoteId?"active":""}"
                    data-id="${n.id}" title="${n.title}" style="cursor: pointer; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
                  <div style="flex: 1; overflow: hidden;">
                    <div class="truncatedTitle" style="font-size: 12px; font-weight: 500;">${o} ${i}</div>
                    <div style="font-size: 10px; color: #a9d2f3ff; margin-top: 2px;">${O(n.lastModified)}</div>
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
            `}).join(""),Ne(),t}else{let t=[];t=await Vt(y),y>e.length||y>10?e.innerHTML+=t.map(i=>{const o=i.title.slice(0,10)+(i.title.length>15?"...":"");return`
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
          `,document.head.appendChild(n),document.querySelectorAll(".lia-conversation-item").forEach(i=>{i.addEventListener("click",o=>{o.target.classList.contains("lia-menu-trigger")||ae(i.dataset.id)})}),Nt(),t}}function Ne(){document.querySelectorAll(".lia-conversation-item").forEach(e=>{e.addEventListener("click",t=>{t.target.classList.contains("lia-menu-trigger")||P(e.dataset.id)})}),document.querySelectorAll(".lia-menu-trigger").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.closest(".lia-conversation-item-wrapper").querySelector(".lia-menu");document.querySelectorAll(".lia-menu").forEach(i=>{i!==n&&(i.style.display="none")}),n.style.display=n.style.display==="block"?"none":"block"})}),document.querySelectorAll(".lia-edit-note-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation(),window.editNote(e.dataset.id),document.querySelectorAll(".lia-menu").forEach(n=>n.style.display="none")})}),document.querySelectorAll(".lia-duplicate-note-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.dataset.id,i=e.closest(".lia-message"),o=i?i.dataset.noteId:null;o===n||!o?(window.duplicateNote(n),document.querySelectorAll(".lia-menu").forEach(a=>a.style.display="none")):window.duplicateNoteContent(o,n)})}),document.querySelectorAll(".lia-delete-note-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.dataset.id,i=e.closest(".lia-message"),o=i?i.dataset.noteId:null;o===n||!o?(window.deleteNote(n),document.querySelectorAll(".lia-menu").forEach(a=>a.style.display="none")):window.deleteNoteContent(o,n)})})}function Nt(){document.querySelectorAll(".lia-conversation-item").forEach(e=>{e.addEventListener("click",t=>{t.target.classList.contains("lia-menu-trigger")||ae(e.dataset.id)})}),document.querySelectorAll(".lia-menu-trigger").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.closest(".lia-conversation-item-wrapper").querySelector(".lia-menu");document.querySelectorAll(".lia-menu").forEach(i=>{i!==n&&(i.style.display="none")}),n.style.display=n.style.display==="block"?"none":"block"})}),document.querySelectorAll(".lia-rename-chat-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.dataset.id,i=conversations.find(o=>o.id===n);if(i){const o=e.closest(".lia-conversation-item-wrapper").querySelector(".truncatedTitle");if(o){let a=function(r){if(r.type==="keydown"&&r.key!=="Enter")return;r.preventDefault(),o.contentEditable="false";const l=o.textContent.trim();l&&l!==i.title&&Pt(n,l),o.removeEventListener("keydown",a),o.removeEventListener("blur",a)};o.contentEditable="true",o.focus(),document.execCommand("selectAll",!1,null),document.getSelection().collapseToEnd(),o.addEventListener("keydown",a),o.addEventListener("blur",a)}}document.querySelectorAll(".lia-menu").forEach(o=>o.style.display="none")})}),document.querySelectorAll(".lia-duplicate-chat-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.dataset.id;duplicateConversation(n),document.querySelectorAll(".lia-menu").forEach(i=>i.style.display="none")})}),document.querySelectorAll(".lia-export-chat-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.dataset.id;exportConversation(n),document.querySelectorAll(".lia-menu").forEach(i=>i.style.display="none")})}),document.querySelectorAll(".lia-delete-chat-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const n=e.dataset.id;zt(n),document.querySelectorAll(".lia-menu").forEach(i=>i.style.display="none")})}),document.addEventListener("click",e=>{!e.target.closest(".lia-menu")&&!e.target.classList.contains("lia-menu-trigger")&&document.querySelectorAll(".lia-menu").forEach(t=>t.style.display="none")})}function K(e){switch(e){case"profile":return"👤";case"feed":return"📰";case"article":return"📖";case"general":return"📝";default:return"📝"}}function zt(e){async function t(){const n=await fetch(`https://api.getlia.live/api/chat/${e}`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await x()}`},credentials:"include"}),i=await n.json();if(!n.ok)throw new Error(i.error?.message||"Failed to delete conversation");return i}t().then(()=>{s.currentConversationId==e?(s.currentConversationId=null,Y()):b()}).catch(n=>{console.error("Error deleting conversation:",n),I("assistant","Unable to delete conversation. Please check your connection or try signing in again <a href='https://www.getlia.live/login' target='_blank'> here </a>")})}function Pt(e,t){async function n(){const i=await fetch(`https://api.getlia.live/api/chat/${e}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await x()}`},body:JSON.stringify({title:t}),credentials:"include"}),o=await i.json();if(!i.ok)throw new Error(o.error?.message||"Failed to rename conversation");return o}n().then(()=>{b()}).catch(i=>{console.error("Error renaming conversation:",i),I("assistant","Unable to rename conversation. Please check your connection or try signing in again <a href='https://www.getlia.live/login' target='_blank'> here </a>")})}async function ae(e){let t=null;async function n(){const c=await window.lia_fetchWithAuth(`https://api.getlia.live/api/chat/${e}/messages`,{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${await x()}`},credentials:"include"}),d=await c.json();if(!c.ok)throw new Error(d.error?.message||"Failed to load conversation");return d}const i=await n();let o,a;try{o=i.messages,a=i.template}catch{}if(t=o,!t)return;s.currentConversationId=e;const r=document.getElementById("lia-messages-container");r.innerHTML=t.map(c=>{if(a&&c.role==="assistant"&&t.indexOf(c)===0)return`
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
                  <div class="lia-message-avatar">${c.role==="user"?getUserAvatar():`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                      <circle cx="16" cy="4" r="2" fill="#0a66c2"/>
                      <path d="M12 8a4 4 0 0 1 4-4" stroke="#0a66c2"/>
                    </svg>
                  `}</div>
                  <div class="lia-message-content" ${c.role==="user"?"style='color: #fff;'":""}>
                    ${Jt(c.content)}
                  </div>
                </div>
              `}).join(""),r.scrollTop=r.scrollHeight,document.querySelectorAll(".lia-conversation-item").forEach(c=>{c.getAttribute("data-id")===e?c.classList.add("active"):c.classList.remove("active")})}async function _t(){if(s.referenceMode===!1){const t=await jt();if(!t&&t!=="Request failed: Unauthorized"){qt();return}if(t==="Request failed: Unauthorized"){f("Please sign in to access Reference Mode","error");return}}s.referenceMode=!s.referenceMode;const e=document.getElementById("lia-reference-toggle");s.referenceMode?(e.classList.add("reference-active"),e.title="Reference Mode: ON (Click posts to reference)",s.notesMode&&(e.title="Reference Mode (pro): ON (Click any post to save to current note)"),Rt(),f("📎 Reference Mode ON - Click any post to reference it","success"),s.notesMode&&f("📎 Reference Mode ON - Click any post to save to current note","success")):(e.classList.remove("reference-active"),e.title="Reference Mode (Pro): OFF",Ht(),f("Reference Mode OFF","info")),await C()}async function jt(){return(await(await window.lia_fetchWithAuth("https://api.getlia.live/api/user/subscription",{headers:{Authorization:`Bearer ${await x()}`},credentials:"include"})).json()).isPro}function qt(){const e=document.createElement("div");e.style.cssText=`
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
  `,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&e.remove()}),document.querySelector(".reference-modal-upgrade-button").addEventListener("click",()=>{window.open("https://getlia.live/pricing","_blank"),e.remove()}),document.querySelector(".reference-modal-cancel-button").addEventListener("click",()=>{e.remove()})}function Rt(){Wt(),Ut()}function Ht(){document.querySelectorAll(".lia-reference-overlay").forEach(e=>e.remove()),document.querySelectorAll(".linkedin-post-hoverable").forEach(e=>{e.classList.remove("linkedin-post-hoverable")}),Yt()}function Wt(){[".feed-shared-update-v2",".feed-shared-update-detail-viewer__content",".reader-article-content",".comments-comment-item"].forEach(n=>{document.querySelectorAll(n).forEach(i=>{if(i.classList.contains("linkedin-post-hoverable"))return;i.classList.add("linkedin-post-hoverable");const o=document.createElement("div");o.className="lia-reference-overlay",i.style.position="relative",i.appendChild(o),i.addEventListener("click",async a=>{if(s.referenceMode&&(a.preventDefault(),a.stopPropagation(),await Ft(i),s.notesMode)){const r=await _(s.currentNoteId);if(r)r.content.push({contentId:z(),type:"reference",content:s.referencedContent}),r.lastModified=Date.now(),N(r);else{const l={id:U(),title:"Referenced Content",content:[{contentId:z(),type:"reference",content:s.referencedContent}],tags:[],context:s.noteContext,timestamp:Date.now(),lastModified:Date.now()};await N(l),s.currentNoteId=l.id,await b()}C()}})})});const t=document.querySelectorAll(".lia-clear-reference");t&&t.forEach(n=>{n.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),ze(n)})})}async function Ft(e){const t=Ot(e);if(t){s.referencedContent=t,Se(),Dt(),await C(),s.notesMode?f("✔ Content Referenced! And saved to your current notes.","success"):f("✔ Content Referenced! Ask me about it.","success");const n=document.getElementById("lia-message-input");n&&(n.focus(),s.notesMode?n.placeholder="Write short note on the referenced content...":n.placeholder="Ask me about the referenced content...")}}function Ot(e){try{const t={type:"unknown",author:"",text:"",engagement:{},timestamp:"",url:window.location.href};if(e.classList.contains("feed-shared-update-v2")||e.classList.contains("feed-shared-update-detail-viewer__content")){t.type="post";const n=e.querySelector(".update-components-actor__title span span span:not(.visually-hidden)");n&&(t.author=n.textContent.trim());const i=e.querySelector(".feed-shared-update-v2__description");i&&(t.text=i.textContent.trim());const o=e.querySelector(".social-details-social-counts__reactions");o&&(t.engagement.likes=o.textContent.trim());const a=e.querySelector(".social-details-social-counts__comments");if(a&&(t.engagement.comments=a.textContent.trim()),window.location.href.includes("feed")){const r=e?.getAttribute("data-urn"),l=r?`https://www.linkedin.com/feed/update/${r}/`:window.location.href;t.url=l}}else if(e.classList.contains("reader-article-content")){t.type="article";const n=document.querySelector(".reader-article-header__title");n&&(t.title=n.textContent.trim());const i=document.querySelector(".reader-author-info__content");i&&(t.author=i.textContent.trim()),t.text=e.textContent.trim().substring(0,1e3)+"..."}else if(e.classList.contains("comments-comment-item")){t.type="comment";const n=e.querySelector(".comments-comment-meta__description-title");n&&(t.author=n.textContent.trim());const i=e.querySelector(".comments-comment-item__main-content");i&&(t.text=i.textContent.trim())}return t}catch(t){return console.error("Error extracting post content:",t),null}}function Dt(){const e=document.getElementById("lia-messages-container");if(!e||!s.referencedContent)return;const t=e.querySelectorAll(".lia-referenced-content");t.length>0&&t[t.length-1].remove();const n=document.createElement("div");n.title="Click to open",n.className="lia-referenced-content",n.innerHTML=`
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
    </a>`,e.appendChild(n),e.scrollTop=e.scrollHeight}async function ze(e){s.referencedContent=null,await C();const t=e.closest(".lia-referenced-content");t&&t.remove();const n=document.getElementById("lia-message-input");n&&(s.notesMode?n.placeholder="Write your note here...":n.placeholder="What do you want to post?"),setTimeout(()=>{E()},1e3)}function Ut(){const e=document.createElement("div");e.id="lia-reference-indicator",e.style.cssText=`
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
  `,e.textContent="📎 Reference Mode Active - Click any post to analyze it",s.notesMode&&(e.textContent="📎 Reference Mode Active - Click any post to add it to your current note."),document.body.appendChild(e)}function Yt(){const e=document.getElementById("lia-reference-indicator");e&&e.remove()}function f(e,t="info"){const n=document.createElement("div"),i=document.querySelector(".lia-chatbot-interface");n.style.cssText=`
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
    `;const p=document.createElement("div");p.style.cssText=`
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
    `;const v=document.createElement("span");d.appendChild(p),d.appendChild(v),n.appendChild(r),n.appendChild(d),i.appendChild(n),setTimeout(()=>{r.style.opacity="1",r.style.transform="scale(1)"},100),setTimeout(()=>{d.style.opacity="1",d.style.transform="scale(1) translateY(0)"},400),setTimeout(()=>{let m=0;const g=()=>{m<=e.length&&(v.textContent=e.substring(0,m)+(m<e.length?"▋":""),m++,setTimeout(g,40))};g()},600),setTimeout(()=>{n.style.transform="translateX(-50%) scale(0.8)",n.style.opacity="0",setTimeout(()=>{n.remove(),c.remove()},2e3)},5e3)}window.clearReferencedContent=ze;async function Vt(e){const t=await x(),n=e<10?0:e-10,i=await window.lia_fetchWithAuth(`https://api.getlia.live/api/chat/history?limit=${e}&start=${n}`,{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},credentials:"include"}),o=await i.json();if(!i.ok)throw new Error(o.error?.message||"Failed to load conversations");return o}function Jt(e){let t=W(e);return t=Q(t),t}function W(e){return e=e.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,(t,n,i)=>`<a href="${i}" target="_blank" rel="noopener noreferrer" class="lia-link">${n} <span class="lia-link-icon">🔗</span></a>`),e.replace(/(<a [^>]+>.*?<\/a>)|(\bhttps?:\/\/[^\s<]+)/g,(t,n,i)=>n||(i?`<a href="${i}" target="_blank" rel="noopener noreferrer" class="lia-link">${i} <span class="lia-link-icon">🔗</span></a>`:t))}function Q(e){return e=e.replace(/^### (.*$)/gm,'<h3 class="lia-h3">$1</h3>'),e=e.replace(/^## (.*$)/gm,'<h2 class="lia-h2">$1</h2>'),e=e.replace(/^# (.*$)/gm,'<h1 class="lia-h1">$1</h1>'),e=e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),e=e.replace(/\*(.*?)\*/g,"<em>$1</em>"),e=e.replace(/```([\s\S]*?)```/g,function(t,n){return`<pre class="lia-code-block" style='position: relative'><code>${n}</code></pre>`}),e=e.replace(/`([^`]+)`/g,'<code class="lia-inline-code">$1</code>'),e=e.replace(/^\* (.*$)/gm,'<li class="lia-list-item">$1</li>'),e=e.replace(/(<li class="lia-list-item">.*<\/li>)/s,'<ul class="lia-list">$1</ul>'),e=e.replace(/^\d+\. (.*$)/gm,'<li class="lia-ordered-item">$1</li>'),e=e.replace(/(<li class="lia-ordered-item">.*<\/li>)/s,'<ol class="lia-ordered-list">$1</ol>'),e=e.replace(/\n\n/g,'</p><p class="lia-paragraph">'),e='<p class="lia-paragraph">'+e+"</p>",e=e.replace(/\n/g,"<br>"),e}function Xt(e){const t=document.createElement("button");return t.className="lia-copy-btn",t.innerHTML=`
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
          `,t.style.background="rgba(255, 255, 255, 0.9)",t.style.borderColor="#e9ecef"},2e3)}catch(n){console.error("Failed to copy text: ",n)}}),t}function Zt(){const e=document.createElement("button");return e.className="lia-regenerate-btn",e.innerHTML=`
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
    `,e.addEventListener("click",()=>{console.log("Regenerate response")}),e}function Pe(){if(document.getElementById("lia-chatbot-styles"))return;const e=document.createElement("style");e.id="lia-chatbot-styles",e.textContent=`
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

    /* Floating Action Button (FAB) Styles */
    .lia-fab-container {
      position: fixed;
      bottom: 72px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
    }

    .lia-fab-small {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: #495057;
      border: 1px solid rgba(222, 226, 230, 0.5);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transform: translateY(20px) scale(0.8);
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      padding: 0;
      margin: 0;
    }

    @media (prefers-color-scheme: dark) {
      .lia-fab-small {
        background: rgba(33, 37, 41, 0.85);
        color: #e9ecef;
        border-color: rgba(73, 80, 87, 0.5);
      }
    }
    
    .lia-fab-container:hover .lia-fab-small {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    
    .lia-fab-small:hover {
      background: #f8f9fa;
      color: #0a66c2;
      border-color: #0a66c2;
      transform: translateY(0) scale(1.1) !important;
    }

    @media (prefers-color-scheme: dark) {
      .lia-fab-small:hover {
        background: #343a40;
        color: #70b5f9;
        border-color: #70b5f9;
      }
    }

    .lia-fab-settings:hover svg {
      animation: lia-spin 2s linear infinite;
    }

    .lia-fab-close:hover svg {
      animation: lia-close-hover 0.3s ease-in-out;
    }

    @keyframes lia-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes lia-close-hover {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2) rotate(90deg); }
    }

    .lia-fab-close {
      transition-delay: 0.1s;
    }
    .lia-fab-settings {
      transition-delay: 0.05s;
    }
    
    .lia-fab-container:hover .lia-fab-close {
      transition-delay: 0s;
    }
    .lia-fab-container:hover .lia-fab-settings {
      transition-delay: 0.05s;
    }

    .lia-fab-main {
      height: 60px;
      background: linear-gradient(135deg, #0a66c2, #004182);
      border-radius: 30px; 
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(10, 102, 194, 0.3);
      display: flex;
      align-items: center;
      padding: 0 16px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      overflow: hidden;
      width: 60px;
      box-sizing: border-box;
      justify-content: center;
      position: relative;
    }

    .lia-fab-main .lia-logo-container {
      position: absolute;
      left: 16px;
      min-width: 28px;
      display: flex;
      justify-content: center;
    }

    .lia-fab-text {
      color: white;
      font-weight: 600;
      font-size: 14px;
      white-space: nowrap;
      opacity: 0;
      margin-left: 28px;
      transform: translateX(10px);
      transition: all 0.4s ease;
      display: inline-block;
    }

    .lia-fab-container:hover .lia-fab-main {
      width: 220px;
      box-shadow: 0 6px 25px rgba(10, 102, 194, 0.4);
    }

    .lia-fab-container:hover .lia-fab-text {
      opacity: 1;
      transform: translateX(0);
    }
  `,document.head.appendChild(e)}function Gt(){const e=document.getElementById("lia-fab-container");e&&e.remove();const t=document.getElementById("lia-chatbot-button");t&&t.parentElement?.id!=="lia-fab-container"&&t.remove();const n=document.createElement("div");n.id="lia-fab-container",n.className="lia-fab-container",n.innerHTML=`
    <button id="lia-fab-close" class="lia-fab-small lia-fab-close" title="Close floating icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
      </svg>
    </button>
    <button id="lia-fab-settings" class="lia-fab-small lia-fab-settings" title="LIA Settings">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.21232 14.0601C1.91928 12.6755 1.93115 11.2743 2.21316 9.94038C3.32308 10.0711 4.29187 9.7035 4.60865 8.93871C4.92544 8.17392 4.50032 7.22896 3.62307 6.53655C4.3669 5.3939 5.34931 4.39471 6.53554 3.62289C7.228 4.50059 8.17324 4.92601 8.93822 4.60914C9.7032 4.29227 10.0708 3.32308 9.93979 2.21281C11.3243 1.91977 12.7255 1.93164 14.0595 2.21364C13.9288 3.32356 14.2964 4.29235 15.0612 4.60914C15.8259 4.92593 16.7709 4.5008 17.4633 3.62356C18.606 4.36739 19.6052 5.3498 20.377 6.53602C19.4993 7.22849 19.0739 8.17373 19.3907 8.93871C19.7076 9.70369 20.6768 10.0713 21.7871 9.94028C22.0801 11.3248 22.0682 12.726 21.7862 14.06C20.6763 13.9293 19.7075 14.2969 19.3907 15.0616C19.0739 15.8264 19.4991 16.7714 20.3763 17.4638C19.6325 18.6064 18.6501 19.6056 17.4638 20.3775C16.7714 19.4998 15.8261 19.0743 15.0612 19.3912C14.2962 19.7081 13.9286 20.6773 14.0596 21.7875C12.675 22.0806 11.2738 22.0687 9.93989 21.7867C10.0706 20.6768 9.70301 19.708 8.93822 19.3912C8.17343 19.0744 7.22848 19.4995 6.53606 20.3768C5.39341 19.633 4.39422 18.6506 3.62241 17.4643C4.5001 16.7719 4.92552 15.8266 4.60865 15.0616C4.29179 14.2967 3.32259 13.9291 2.21232 14.0601ZM3.99975 12.2104C5.09956 12.5148 6.00718 13.2117 6.45641 14.2963C6.90564 15.3808 6.75667 16.5154 6.19421 17.5083C6.29077 17.61 6.38998 17.7092 6.49173 17.8056C7.4846 17.2432 8.61912 17.0943 9.70359 17.5435C10.7881 17.9927 11.485 18.9002 11.7894 19.9999C11.9295 20.0037 12.0697 20.0038 12.2099 20.0001C12.5143 18.9003 13.2112 17.9927 14.2958 17.5435C15.3803 17.0942 16.5149 17.2432 17.5078 17.8057C17.6096 17.7091 17.7087 17.6099 17.8051 17.5081C17.2427 16.5153 17.0938 15.3807 17.543 14.2963C17.9922 13.2118 18.8997 12.5149 19.9994 12.2105C20.0032 12.0704 20.0033 11.9301 19.9996 11.7899C18.8998 11.4856 17.9922 10.7886 17.543 9.70407C17.0937 8.61953 17.2427 7.48494 17.8052 6.49204C17.7086 6.39031 17.6094 6.2912 17.5076 6.19479C16.5148 6.75717 15.3803 6.9061 14.2958 6.4569C13.2113 6.0077 12.5144 5.10016 12.21 4.00044C12.0699 3.99666 11.9297 3.99659 11.7894 4.00024C11.4851 5.10005 10.7881 6.00767 9.70359 6.4569C8.61904 6.90613 7.48446 6.75715 6.49155 6.1947C6.38982 6.29126 6.29071 6.39047 6.19431 6.49222C6.75668 7.48509 6.90561 8.61961 6.45641 9.70407C6.00721 10.7885 5.09967 11.4855 3.99995 11.7899C3.99617 11.93 3.9961 12.0702 3.99975 12.2104ZM11.9997 15.0002C10.3428 15.0002 8.99969 13.657 8.99969 12.0002C8.99969 10.3433 10.3428 9.00018 11.9997 9.00018C13.6565 9.00018 14.9997 10.3433 14.9997 12.0002C14.9997 13.657 13.6565 15.0002 11.9997 15.0002ZM11.9997 13.0002C12.552 13.0002 12.9997 12.5525 12.9997 12.0002C12.9997 11.4479 12.552 11.0002 11.9997 11.0002C11.4474 11.0002 10.9997 11.4479 10.9997 12.0002C10.9997 12.5525 11.4474 13.0002 11.9997 13.0002Z"></path>
      </svg>
    </button>
    <div id="lia-chatbot-button" class="lia-fab-main">
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
      <span class="lia-fab-text" id="lia-fab-text">Click to begin chat</span>
    </div>
  `,document.body.appendChild(n);const i=document.getElementById("lia-chatbot-button"),o=document.getElementById("lia-fab-settings"),a=document.getElementById("lia-fab-close");i?.addEventListener("click",r=>{r.stopPropagation(),chrome.runtime.sendMessage({action:"toggleSidePanel"})}),chrome.storage.local.get(["isSidePanelOpen"],r=>{const l=document.getElementById("lia-fab-text");l&&(l.textContent=r.isSidePanelOpen?"Click to close chat":"Click to begin chat")}),chrome.storage.onChanged.addListener((r,l)=>{if(l==="local"&&r.isSidePanelOpen){const c=document.getElementById("lia-fab-text");c&&(c.textContent=r.isSidePanelOpen.newValue?"Click to close chat":"Click to begin chat")}}),a?.addEventListener("click",r=>{r.stopPropagation(),n.style.display="none",chrome.storage.sync.set({chatbot_enabled:!1})}),o?.addEventListener("click",r=>{r.stopPropagation();const l=document.getElementById("customization-modal");l&&l.classList.remove("hidden")}),Pe()}function Kt(){const e=document.getElementById("lia-chatbot-interface");e&&e.remove();const t=document.createElement("div");t.id="lia-chatbot-interface",t.className=`lia-chatbot-interface ${s.isOpen?"open":""}`,t.innerHTML=`
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
            <img src="${window.liaUser?.profile_picture_url}" alt="Profile" class="profile-avatar" id="profile-avatar">
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

  `,document.body.appendChild(t),Me()}async function Z(){const{chatbot_enabled:e}=await chrome.storage.sync.get(["chatbot_enabled"]);if(!e){const t=document.getElementById("lia-fab-container");t&&t.remove();const n=document.getElementById("lia-chatbot-interface");n&&n.remove();return}window.location.href.includes("linkedin.com")&&(await mt(),Gt(),Kt(),Me(),s.notesMode?(s.notesMode=!1,await $e()):s.templateMode?(s.templateMode=!1,await Ie()):await oe(),E(),await Le(),typeof window.getUserAvatar=="function"&&window.getUserAvatar(!0))}(function(){let e={tone:"professional",industry:"technology",chatbot_enabled:!0,reply_enabled:!0,rewrite_enabled:!0,linkedinTheme:"light",selectedPersona:"professional"};const t={current:!1};async function n(){if(t.current)return;t.current=!0;const l=await window.detectLinkedInTheme?.();e.linkedinTheme=l||"light",Pe(),V(),J(),pe()}chrome.storage.sync.get(["tone","industry","chatbot_enabled","reply_enabled","rewrite_enabled","linkedinTheme","selectedPersona"],l=>{e={...e,...l},n()}),window.addEventListener("message",async l=>{l.origin==="https://www.getlia.live"&&l.source===window&&(l.data.type==="SEND_JWTs"&&(chrome.runtime.sendMessage({type:"STORE_JWTs",access_token:l.data.access_token,refresh_token:l.data.refresh_token}),Z()),l.data.type==="CLEAR_JWTs"&&await window.lia_clearTokens?.())}),Z(),chrome.runtime?.onMessage.addListener((l,c,d)=>{l.action==="settingsUpdated"&&(Z(),chrome.storage.sync.get(["reply_enabled","rewrite_enabled"],p=>{p.reply_enabled?V():dt(),p.rewrite_enabled?J():gt()}))});let i;const o=new MutationObserver(l=>{if(!chrome.runtime?.id){o.disconnect();return}l.forEach(c=>{clearTimeout(i),i=setTimeout(async()=>{if(c.addedNodes.length)try{V(),J(),pe()}catch(d){console.error("MutationObserver Error:",d)}},500)})});o.observe(document.body,{childList:!0,subtree:!0});const a=document.body.querySelector(".feed-shared-update-v2__comments-container");a&&o.observe(a,{childList:!0,subtree:!0});const r=document.body.querySelector(".comments-comment-box__form");r&&o.observe(r,{childList:!0,subtree:!0})})();
