function b(e){return new Promise(t=>{chrome.storage.local.get(e,n=>t(n))})}const x={keywords:[],regex:[],urls:[],vars:[],configKeys:[]};async function v(){const{customPatterns:e}=await b(["customPatterns"]);return e&&Object.keys(e).length>0?e:x}async function d(e){const t=e.toLowerCase(),n=await v(),o=[];for(const r in n)for(const a of n[r])try{r==="regex"?new RegExp(a,"gi").test(e)&&o.push({category:r,pattern:a}):t.includes(a.toLowerCase())&&o.push({category:r,pattern:a})}catch{console.warn("Invalid pattern skipped:",a)}return o.length>0?o:null}function E(e,t){let n=e;for(const{category:o,pattern:r}of t)try{const a=o==="regex"?new RegExp(r,"gi"):new RegExp(w(r),"gi");n=n.replace(a,"****")}catch{console.warn("Redact error:",r)}return n}function w(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function l(e,t,n){i();const o=document.createElement("div");o.id="safePasteModal",o.style.cssText=`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #0d1117;
    color: white;
    border: 1px solid #333;
    border-radius: 10px;
    padding: 20px;
    z-index: 2147483647;
    width: 400px;
    box-shadow: 0 0 20px rgba(255,255,255,0.2);
    font-family: 'Segoe UI', sans-serif;
  `,o.innerHTML=`
    <h2 style="margin-top:0;">🚨 Sensitive Content Detected</h2>
    <p style="font-size:14px; max-height:120px; overflow-y:auto;">
      "${e.slice(0,100)}${e.length>100?"...":""}"
    </p>
    <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end;">
      <button id="sp-cancel-btn" type="button" style="${u("#555","#eee")}">Cancel</button>
      <button id="sp-redact-btn" type="button" style="${u("#ff9800","#000")}">Redact & Paste</button>
      <button id="sp-proceed-btn" type="button" style="${u("#4caf50","#000")}">Paste Anyway</button>
    </div>
  `,document.body.appendChild(o);const r=document.getElementById("sp-cancel-btn"),a=document.getElementById("sp-redact-btn"),s=document.getElementById("sp-proceed-btn");r&&r.addEventListener("click",i),a&&a.addEventListener("click",()=>{p(n,E(e,t)),i()}),s&&s.addEventListener("click",()=>{p(n,e),i()})}function p(e,t){if(e)if(typeof e.value<"u"){const n=e.selectionStart||0,o=e.selectionEnd||0;e.value=e.value.slice(0,n)+t+e.value.slice(o),e.selectionStart=e.selectionEnd=n+t.length,e.dispatchEvent(new Event("input",{bubbles:!0}))}else e.isContentEditable&&(e.focus(),document.execCommand("insertText",!1,t))}function i(){const e=document.getElementById("safePasteModal");e&&e.remove()}function u(e,t){return`
    padding: 6px 12px;
    background: ${e};
    color: ${t};
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `}function f(){const e=document.activeElement;return e&&(e.tagName==="TEXTAREA"||e.tagName==="INPUT"||e.isContentEditable)?e:document.querySelector("textarea, input[type='text'], [contenteditable='true']")}let c=null;function h(e,t){if(e)if(typeof e.value<"u"){const n=e.selectionStart||0,o=e.selectionEnd||0;e.value=e.value.slice(0,n)+t+e.value.slice(o),e.selectionStart=e.selectionEnd=n+t.length,e.dispatchEvent(new Event("input",{bubbles:!0}))}else e.isContentEditable&&(e.focus(),document.execCommand("insertText",!1,t))}function m(e){const t=(e.clipboardData||window.clipboardData).getData("text");e.preventDefault(),e.stopImmediatePropagation(),c=f(),d(t).then(n=>{if(!n){h(c,t);return}l(t,n,c)})}function g(e){if(e.key!=="Enter"||e.shiftKey)return;const t=document.activeElement,n=t?.value||t?.innerText||"";d(n).then(o=>{o&&(e.preventDefault(),e.stopImmediatePropagation(),c=t,l(n,o,t))})}function y(e){const t=e.target;if(t?.tagName!=="BUTTON"&&t?.type!=="submit")return;const n=f();if(!n)return;const o=n.value||n.innerText||"";d(o).then(r=>{r&&(e.preventDefault(),e.stopImmediatePropagation(),c=n,l(o,r,n))})}function k(){document.addEventListener("paste",m,!0)}function I(){document.addEventListener("keydown",g,!0)}function P(){document.addEventListener("click",y,!0)}function T(){document.removeEventListener("paste",m,!0),document.removeEventListener("keydown",g,!0),document.removeEventListener("click",y,!0)}window.addEventListener("beforeunload",T);(async()=>(k(),I(),P()))();
