import signaturePad from"https://cdn.jsdelivr.net/npm/signature_pad@5.0.0/+esm";const audioContext=new globalThis.AudioContext,audioBufferCache={};loadAudio("stupid","/touch-50on/mp3/stupid5.mp3"),loadAudio("correct","/touch-50on/mp3/correct3.mp3"),loadAudio("correctAll","/touch-50on/mp3/correct1.mp3"),loadAudio("incorrect","/touch-50on/mp3/incorrect1.mp3");const kanjivgDir="/kanjivg";let prevCanvasSize,canvasSize=140,maxWidth=2;const repeatCount=3;globalThis.innerWidth>=768&&(canvasSize=280,maxWidth=4);let level=2,clearCount=0,kanjis="",mode="hirahira",japaneseVoices=[];loadVoices(),loadConfig();function loadConfig(){localStorage.getItem("darkMode")==1&&document.documentElement.setAttribute("data-bs-theme","dark"),localStorage.getItem("hint")==1&&(document.getElementById("hint").textContent="EASY"),localStorage.getItem("touch-50on-level")&&(level=parseInt(localStorage.getItem("touch-50on-level")))}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),document.documentElement.setAttribute("data-bs-theme","light"),boxes.forEach(e=>{const t=e.shadowRoot.querySelectorAll("object, canvas");[...t].forEach(e=>{e.removeAttribute("style")})})):(localStorage.setItem("darkMode",1),document.documentElement.setAttribute("data-bs-theme","dark"),boxes.forEach(e=>{const t=e.shadowRoot.querySelectorAll("object, canvas");[...t].forEach(e=>{e.setAttribute("style","filter: invert(1) hue-rotate(180deg);")})}))}function toggleHint(e){localStorage.getItem("hint")==1?(localStorage.setItem("hint",0),e.target.textContent="HARD"):(localStorage.setItem("hint",1),e.target.textContent="EASY"),toggleAllStroke()}function toggleScroll(){const e=document.getElementById("scrollOn"),t=document.getElementById("scrollOff");e.classList.contains("d-none")?(document.body.style.overflow="visible",e.classList.remove("d-none"),t.classList.add("d-none")):(document.body.style.overflow="hidden",e.classList.add("d-none"),t.classList.remove("d-none"))}function toggleVoice(){const e=document.getElementById("voiceOn"),t=document.getElementById("voiceOff");e.classList.contains("d-none")?(e.classList.remove("d-none"),t.classList.add("d-none")):(e.classList.add("d-none"),t.classList.remove("d-none"))}async function playAudio(e,t){const s=await loadAudio(e,audioBufferCache[e]),n=audioContext.createBufferSource();if(n.buffer=s,t){const e=audioContext.createGain();e.gain.value=t,e.connect(audioContext.destination),n.connect(e),n.start()}else n.connect(audioContext.destination),n.start()}async function loadAudio(e,t){if(audioBufferCache[e])return audioBufferCache[e];const s=await fetch(t),o=await s.arrayBuffer(),n=await audioContext.decodeAudioData(o);return audioBufferCache[e]=n,n}function unlockAudio(){audioContext.resume()}function loadVoices(){const e=new Promise(e=>{let t=speechSynthesis.getVoices();if(t.length!==0)e(t);else{let n=!1;speechSynthesis.addEventListener("voiceschanged",()=>{n=!0,t=speechSynthesis.getVoices(),e(t)}),setTimeout(()=>{n||document.getElementById("noTTS").classList.remove("d-none")},1e3)}});e.then(e=>{japaneseVoices=e.filter(e=>e.lang=="ja-JP")})}function loopVoice(e,t){speechSynthesis.cancel();const n=new globalThis.SpeechSynthesisUtterance(e);n.voice=japaneseVoices[Math.floor(Math.random()*japaneseVoices.length)],n.lang="ja-JP";for(let e=0;e<t;e++)speechSynthesis.speak(n)}function prevTehon(e){const n=e.target.getRootNode().querySelector(".tehon"),o=n.contentDocument,i=n.dataset.id;let t=1;n.dataset.animation&&(t=parseInt(n.dataset.animation)-1,t<1&&(t=1));let s=1;for(;!0;){const e=o.getElementById("kvg:"+i+"-s"+s);if(e)s<t?e.setAttribute("stroke","black"):s==t?e.setAttribute("stroke","red"):e.setAttribute("stroke","none");else break;s+=1}n.dataset.animation=t}function nextTehon(e){const t=e.target.getRootNode().querySelector(".tehon"),i=t.contentDocument,o=t.dataset.id;let n=0;t.dataset.animation&&(n=parseInt(t.dataset.animation));const a=getKakusu(t,o);n<a&&(n+=1);let s=1;for(;!0;){const e=i.getElementById("kvg:"+o+"-s"+s);if(e)s<n?e.setAttribute("stroke","black"):s==n?e.setAttribute("stroke","red"):e.setAttribute("stroke","none");else break;s+=1}t.dataset.animation=n}class ProblemBox extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[globalCSS];const e=document.getElementById("problem-box").content.cloneNode(!0);this.shadowRoot.appendChild(e)}}customElements.define("problem-box",ProblemBox);class TehonBox extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[globalCSS];const e=document.getElementById("tehon-box").content.cloneNode(!0);if(globalThis.innerWidth>=768){const t=e.querySelectorAll("canvas");[...t].forEach(e=>{e.setAttribute("width",canvasSize),e.setAttribute("height",canvasSize)})}if(e.querySelector(".prevTehon").onclick=prevTehon,e.querySelector(".nextTehon").onclick=nextTehon,this.shadowRoot.appendChild(e),document.documentElement.getAttribute("data-bs-theme")=="dark"){const e=this.shadowRoot.querySelectorAll("object, canvas");[...e].forEach(e=>{e.setAttribute("style","filter: invert(1) hue-rotate(180deg);")})}}}customElements.define("tehon-box",TehonBox);class TegakiBox extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[globalCSS];const e=document.getElementById("tegaki-box").content.cloneNode(!0);if(globalThis.innerWidth>=768){const t=e.querySelectorAll("canvas");[...t].forEach(e=>{e.setAttribute("width",canvasSize),e.setAttribute("height",canvasSize)})}if(this.shadowRoot.appendChild(e),document.documentElement.getAttribute("data-bs-theme")=="dark"){const e=this.shadowRoot.querySelectorAll("object, canvas");[...e].forEach(e=>{e.setAttribute("style","filter: invert(1) hue-rotate(180deg);")})}}}customElements.define("tegaki-box",TegakiBox);function getKakusu(e,t){let n=1;for(;!0;){const s=e.contentDocument.getElementById("kvg:"+t+"-s"+n);if(s)n+=1;else break}return n-1}function getTehonCanvas(e,t,n,s){return new Promise(o=>{const i=e.contentDocument.cloneNode(!0),r="kvg:StrokePaths_"+t,c=i.querySelector('[id="'+r+'"]');c.style.stroke="black";for(let e=1;e<=n;e++){const o=i.getElementById("kvg:"+t+"-s"+e);s!=e&&o.remove()}const l=i.documentElement.outerHTML,d=new Blob([l],{type:"image/svg+xml"}),u=URL.createObjectURL(d),a=new Image;a.src=u,a.onload=()=>{const e=document.createElement("canvas");e.width=canvasSize,e.height=canvasSize;const t=e.getContext("2d",{alpha:!1});t.drawImage(a,0,0,canvasSize,canvasSize),o(e)}})}function toKanjiId(e){const t=e.codePointAt(0).toString(16);return("00000"+t).slice(-5)}function loadSVG(e,t,n,s){let o;s?o=new TegakiBox:o=new TehonBox,boxes.push(o);const i=o.shadowRoot.querySelector("object");return i.setAttribute("data",kanjivgDir+"/"+e+".svg"),i.setAttribute("data-id",e),i.setAttribute("data-pos",n),s&&(i.onload=initSVG),t.appendChild(o),i}function showKanjiScore(e,t,n,s,o,i,a){if(e=Math.floor(e),e>=80?playAudio("correct",.3):playAudio("incorrect",.3),n.classList.remove("d-none"),n.textContent=e,mode!="conv"&&mode!="hirakana"&&mode!="kanahira"){for(let e=0;e<a;e++)changePathColor(e+1,s,i,"black");for(let e=0;e<a;e++)(!t[e][0]||t[e][0]<80)&&changePathColor(e+1,s,i,"red")}localStorage.getItem("hint")!=1&&changeAllColor(o,i,"lightgray")}function getKanjiScores(e,t,n,s,o,i){return Promise.all(e).then(e=>{let a=0,r=0;return e.forEach(e=>{const[n,t]=e;a+=n*t,r+=t}),a/=r,showKanjiScore(a,e,t,n,s,o,i),a})}function getProblemScores(e,t,n,s){const o=[];return n.forEach((n,i)=>{const a=n.dataset.id,r=getKakusu(n,a),c=parseInt(n.dataset.pos);let l=0;const d=s[i].toData();if(d.length!=0){const s=t.children[c].shadowRoot.querySelector("object"),o=e.children[c].shadowRoot.querySelector(".score"),i=getKakuScores(d,n,a,r);l=getKanjiScores(i,o,s,n,a,r)}o[i]=l}),Promise.all(o)}function setScoringButton(e,t,n,s,o,i){const a=e.shadowRoot.querySelector(".scoring");a.addEventListener("click",()=>{getProblemScores(t,n,s,o).then(t=>{if(t.every(e=>e>=80)){clearCount+=1,e.shadowRoot.querySelector(".guard").style.height="100%";const t=e.nextElementSibling;if(t){const e=document.getElementById("voiceOn").classList.contains("d-none");e||loopVoice(kanjis[clearCount].toLowerCase(),repeatCount),t.shadowRoot.querySelector(".guard").style.height="0";const n=document.getElementById("header").offsetHeight,s=t.getBoundingClientRect().top+document.documentElement.scrollTop-n;globalThis.scrollTo({top:s,behavior:"smooth"})}}let n=localStorage.getItem("touch-50on");n||(n=""),t.forEach((e,t)=>{e<40&&(n=n.replace(i[t],""))}),localStorage.setItem("touch-50on",n)})})}function setSignaturePad(e){const t=e.parentNode.querySelector(".tegaki"),n=new signaturePad(t,{minWidth:maxWidth,maxWidth,penColor:"black",throttle:0,minDistance:0});return n}function setEraser(e,t,n,s,o){const i=s.getRootNode().host,a=[...t.children].findIndex(e=>e==i),r=n.children[a].shadowRoot.querySelector(".eraser");r.onclick=()=>{const n=e.toData();n&&e.clear();const i=parseInt(s.dataset.pos),a=t.children[i].shadowRoot.querySelector(".score");a.classList.add("d-none"),localStorage.getItem("hint")!=1&&changeAllColor(s,o,"none")}}function setSound(e,t,n){const o=parseInt(t.dataset.pos),i=e.children[o].shadowRoot.querySelector(".sound");let s=kanaToHira(n);i.onclick=()=>{s=="ん"&&(s="んん"),loopVoice(s.toLowerCase(),repeatCount)}}function loadProblem(e,t){const s=new ProblemBox,a=s.shadowRoot,r=[],o=[],n=a.querySelector(".tehon"),i=a.querySelector(".tegaki");for(let s=0;s<e.length;s++){const c=toKanjiId(e[s]);loadSVG(c,n,s,!1);const a=loadSVG(toKanjiId(t[s]),i,s,!0),l=setSignaturePad(a);r.push(a),o.push(l),setEraser(l,i,n,a,c),setSound(n,a,e[s])}return setScoringButton(s,i,n,r,o,e),document.getElementById("problems").appendChild(s),o}function resizeTegakiContents(e){e.forEach(e=>{const n=e._canvas;resizeCanvasSize(n,canvasSize);const t=e.toData();if(t.length>0){if(e.maxWidth=maxWidth,e.minWidth=maxWidth,prevCanvasSize<canvasSize)for(let e=0;e<t.length;e++)for(let n=0;n<t[e].length;n++)t[e][n].x*=2,t[e][n].y*=2;else for(let e=0;e<t.length;e++)for(let n=0;n<t[e].length;n++)t[e][n].x/=2,t[e][n].y/=2;e.fromData(t)}})}function resizeCanvasSize(e,t){e.setAttribute("width",t),e.setAttribute("height",t)}function resizeTehonContents(){const e=document.getElementById("problems").children;for(const t of e){const n=t.shadowRoot.querySelector(".tegaki").children,s=t.shadowRoot.querySelector(".tehon").children;[...n].forEach(e=>{const t=e.shadowRoot.querySelector(".tehon");resizeCanvasSize(t,canvasSize)}),[...s].forEach(e=>{const t=e.shadowRoot.querySelector(".tehon");resizeCanvasSize(t,canvasSize)})}}function setStrokeWidth(e){return 15+6/e}function toggleAllStroke(){const e=document.getElementById("problems").children;for(const t of e){const n=t.shadowRoot.querySelector(".tegaki").children;for(const s of n){const e=s.shadowRoot.querySelector("object"),t=e.dataset.id,o=getKakusu(e,t);toggleStroke(e,t,o)}}}function toggleStroke(e,t,n){const o="kvg:StrokePaths_"+t,s=e.contentDocument.querySelector('[id="'+o+'"]');localStorage.getItem("hint")!=1?s.style.stroke="none":s.style.stroke="lightgray",s.style.strokeWidth=setStrokeWidth(n)}function changeAllColor(e,t,n){const s="kvg:StrokePaths_"+t,o=e.contentDocument.querySelector('[id="'+s+'"]');o.style.stroke=n}function changePathColor(e,t,n,s){const o=t.contentDocument.getElementById("kvg:"+n+"-s"+e);o.setAttribute("stroke",s)}function removeNumbers(e,t){const n="kvg:StrokeNumbers_"+t,s=e.contentDocument.querySelector('[id="'+n+'"]');s.remove()}function countNoTransparent(e){let t=0;for(let n=3;n<e.length;n+=4)e[n]!=0&&(t+=1);return t}function getInclusionCount(e,t){for(let n=3;n<e.length;n+=4)t[n]!=0&&(e[n]=0);const n=countNoTransparent(e);return n}function getScoringFactor(e){switch(e){case 0:return.5**2;case 1:return.6**2;case 2:return.7**2;case 3:return.8**2;case 4:return.9**2;default:return.7**2}}function calcKakuScore(e,t,n){let o=1-Math.abs((t-e)/t);o>1&&(o=1);let i=(e-n)/e;i>1&&(i=1);let s=o*i*100/getScoringFactor(level);return s<0&&(s=0),s>100&&(s=100),isNaN(s)&&(s=0),s}function getKakuScores(e,t,n,s){let o=setStrokeWidth(s)*109/canvasSize;canvasSize>140&&(o*=4);const i=new Array(s);for(let a=0;a<s;a++)i[a]=new Promise(i=>{if(e[a]){e[a].minWidth=o,e[a].maxWidth=o;const r=document.createElement("canvas");r.setAttribute("width",canvasSize),r.setAttribute("height",canvasSize);const l=r.getContext("2d",{alpha:!1}),d=new signaturePad(r,{minWidth:o,maxWidth:o,penColor:"black"});d.fromData([e[a]]);const c=l.getImageData(0,0,canvasSize,canvasSize).data,u=countNoTransparent(c);getTehonCanvas(t,n,s,a+1).then(e=>{const t=e.getContext("2d",{alpha:!1}).getImageData(0,0,canvasSize,canvasSize).data,n=countNoTransparent(t),s=getInclusionCount(c,t),o=calcKakuScore(u,n,s);i([o,n])})}else getTehonCanvas(t,n,s,a+1).then(e=>{const t=e.getContext("2d",{alpha:!1}).getImageData(0,0,canvasSize,canvasSize).data,n=countNoTransparent(t);i([0,n])})});return i}function initSVG(e){const t=e.target,n=t.dataset.id,s=getKakusu(t,n);toggleStroke(t,n,s),removeNumbers(t,n)}function report(){const e=[],n=document.getElementById("problems").children;for(let t=0;t<n.length;t++){const s=n[t].shadowRoot.querySelector(".tegaki").children;for(let t=0;t<s.length;t++){const n=s[t].shadowRoot.querySelector(".score").textContent;e.push(parseInt(n))}}let t=0;for(let n=0;n<e.length;n++)t+=e[n];if(t/=e.length,t>=80){playAudio("correctAll");let e=localStorage.getItem("touch-50on");e?(kanjis.split("").forEach(t=>{e.includes(t)||(e+=t)}),localStorage.setItem("touch-50on",e)):localStorage.setItem("touch-50on",kanjis),document.getElementById("report").classList.add("d-none"),document.getElementById("correctReport").classList.remove("d-none"),setTimeout(()=>{location.href="/touch-50on/"},3e3)}else playAudio("stupid"),document.getElementById("report").classList.add("d-none"),document.getElementById("incorrectReport").classList.remove("d-none"),setTimeout(()=>{document.getElementById("report").classList.remove("d-none"),document.getElementById("incorrectReport").classList.add("d-none")},6e3)}function kanaToHira(e){return e.replace(/[ァ-ヶ]/g,e=>{const t=e.charCodeAt(0)-96;return String.fromCharCode(t)})}function hiraToKana(e){return e.replace(/[ぁ-ゖ]/g,e=>{const t=e.charCodeAt(0)+96;return String.fromCharCode(t)})}function initDrill(){let e,t;const n="あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよわん",s="アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨワン",r="かきくけこさしすせそたちつてとはひふへほはひふへほ",o="がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ",c="カキクケコサシスセソタチツテトハヒフヘホハヒフヘホ",i="ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ";switch(mode){case"hh":console.log(kanjis||n),e=kanaToHira(kanjis||n),t=kanaToHira(kanjis||n);break;case"hk":e=kanaToHira(kanjis||n),t=hiraToKana(kanjis||s);break;case"kh":e=hiraToKana(kanjis||s),t=kanaToHira(kanjis||n);break;case"kk":e=hiraToKana(kanjis||s),t=hiraToKana(kanjis||s);break;case"dd":e=kanjis||o,t=kanjis||o;break;case"DD":e=kanjis||i,t=kanjis||i;break;case"nd":e=Array.from(kanjis||r).map(e=>e.normalize("NFD")[0]),t=kanjis||o;break;case"ND":e=Array.from(kanjis||c).map(e=>e.normalize("NFD")[0]),t=kanjis||i;break;default:e=kanjis||n,t=kanjis||n}const a=[];for(let n=0;n<e.length;n++){const s=loadProblem(e[n],t[n]);a.push(s)}document.getElementById("problems").children[0].shadowRoot.querySelector(".guard").style.height="0",globalThis.addEventListener("resize",()=>{prevCanvasSize=canvasSize,globalThis.innerWidth>=768?(canvasSize=280,maxWidth=4):(canvasSize=140,maxWidth=2),prevCanvasSize!=canvasSize&&(resizeTegakiContents(a),resizeTehonContents())})}function initQuery(){const e=new URLSearchParams(location.search);kanjis=e.get("q"),mode=e.get("mode")}function getGlobalCSS(){let e="";for(const t of document.styleSheets)for(const n of t.cssRules)e+=n.cssText;const t=new CSSStyleSheet;return t.replaceSync(e),t}const boxes=[];initQuery();const globalCSS=getGlobalCSS();initDrill(),document.getElementById("toggleDarkMode").onclick=toggleDarkMode,document.getElementById("hint").onclick=toggleHint,document.getElementById("toggleScroll").onclick=toggleScroll,document.getElementById("toggleVoice").onclick=toggleVoice,document.getElementById("reportButton").onclick=report,document.addEventListener("click",unlockAudio,{once:!0,useCapture:!0})