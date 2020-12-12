const correctAllAudio=new Audio('/touch-50on/mp3/correct1.mp3');const correctAudio=new Audio('/touch-50on/mp3/correct3.mp3');const incorrectAudio=new Audio('/touch-50on/mp3/incorrect1.mp3');const stupidAudio=new Audio('/touch-50on/mp3/stupid5.mp3');const kanjivgDir='/kanjivg'
let prevCanvasSize;let canvasSize=140;let maxWidth=2;if(window.innerWidth>=768){canvasSize=280;maxWidth=4;}
function prev(obj){var object=obj.parentNode.parentNode.querySelector('#tehon')
var svg=object.contentDocument;var kanjiId=object.dataset.id;var currPos=0;if(object.dataset.animation){currPos=parseInt(object.dataset.animation)-1;if(currPos<=0){currPos=0;}}
if(currPos<=0){var i=1;while(true){var path=svg.getElementById('kvg:'+kanjiId+'-s'+i);if(path){path.setAttribute('stroke','black');}else{break;}
i+=1;}}else{var i=1;while(true){var path=svg.getElementById('kvg:'+kanjiId+'-s'+i);if(path){if(i<currPos){path.setAttribute('stroke','black');}else if(i==currPos){path.setAttribute('stroke','red');}else{path.setAttribute('stroke','none');}}else{break;}
i+=1;}}
object.dataset.animation=currPos;}
function next(obj){var object=obj.parentNode.parentNode.querySelector('#tehon')
var svg=object.contentDocument;var kanjiId=object.dataset.id;var currPos=0;if(object.dataset.animation){currPos=parseInt(object.dataset.animation);}
var kakusu=getKakusu(object,kanjiId);if(currPos<kakusu){currPos+=1;}
var i=1;while(true){var path=svg.getElementById('kvg:'+kanjiId+'-s'+i);if(path){if(i<currPos){path.setAttribute('stroke','black');}else if(i==currPos){path.setAttribute('stroke','red');}else{path.setAttribute('stroke','none');}}else{break;}
i+=1;}
object.dataset.animation=currPos;}
function toKanji(kanjiId){return String.fromCodePoint(parseInt('0x'+kanjiId));}
function loadConfig(){if(localStorage.getItem('darkMode')==1){document.documentElement.dataset.theme='dark';}
if(localStorage.getItem('hint')==1){document.getElementById('hint').innerText='EASY';}}
loadConfig();function toggleDarkMode(){if(localStorage.getItem('darkMode')==1){localStorage.setItem('darkMode',0);delete document.documentElement.dataset.theme;}else{localStorage.setItem('darkMode',1);document.documentElement.dataset.theme='dark';}}
function toggleHint(obj){if(localStorage.getItem('hint')==1){localStorage.setItem('hint',0);obj.innerText='HARD';}else{localStorage.setItem('hint',1);obj.innerText='EASY';}
toggleAllStroke();}
customElements.define('problem-box',class extends HTMLElement{constructor(){super();const template=document.getElementById('problem-box').content.cloneNode(true);this.attachShadow({mode:'open'}).appendChild(template);}});customElements.define('tehon-box',class extends HTMLElement{constructor(){super();const template=document.getElementById('tehon-box').content.cloneNode(true);if(window.innerWidth>=768){var canvases=template.querySelectorAll('canvas');[...canvases].forEach(canvas=>{canvas.setAttribute('width',canvasSize);canvas.setAttribute('height',canvasSize);});}
this.attachShadow({mode:'open'}).appendChild(template);}});customElements.define('tegaki-box',class extends HTMLElement{constructor(){super();const template=document.getElementById('tegaki-box').content.cloneNode(true);if(window.innerWidth>=768){var canvases=template.querySelectorAll('canvas');[...canvases].forEach(canvas=>{canvas.setAttribute('width',canvasSize);canvas.setAttribute('height',canvasSize);});}
this.attachShadow({mode:'open'}).appendChild(template);}});function getKakusu(object,kanjiId){var max=1;while(true){var path=object.contentDocument.getElementById('kvg:'+kanjiId+'-s'+max);if(path){max+=1;}else{break;}}
return max-1;}
function sleep(time){const d1=new Date();while(true){const d2=new Date();if(d2-d1>time){return;}}}
function getTehonCanvas(object,kanjiId,kakusu,kakuNo){return new Promise(function(resolve,reject){var clonedContent=object.contentDocument.cloneNode(true);var id='kvg:StrokePaths_'+kanjiId;var paths=clonedContent.querySelector('[id="'+id+'"]');paths.style.stroke='black';for(var j=1;j<=kakusu;j++){var path=clonedContent.getElementById('kvg:'+kanjiId+'-s'+j);if(kakuNo!=j){path.remove();}}
var text=clonedContent.documentElement.outerHTML;var blob=new Blob([text],{type:'image/svg+xml'});var url=URL.createObjectURL(blob);var img=new Image();img.src=url;img.onload=function(){var canvas=document.createElement('canvas');canvas.width=canvasSize;canvas.height=canvasSize;var ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvasSize,canvasSize);resolve(canvas);};});}
function toKanjiId(str){var hex=str.codePointAt(0).toString(16);return('00000'+hex).slice(-5);}
function loadSVG(kanjiId,parentNode,pos,loadCanvas){var box;if(loadCanvas){box=document.createElement('tegaki-box');}else{box=document.createElement('tehon-box');}
var object=box.shadowRoot.querySelector('object');object.setAttribute('data',kanjivgDir+'/'+kanjiId+'.svg');object.setAttribute('data-id',kanjiId);object.setAttribute('data-pos',pos);if(loadCanvas){object.setAttribute('onload','initSVG(this)');}
parentNode.appendChild(box);return object;}
function showKanjiScore(kanjiScore,kakuScores,scoreObj,tehonKanji,object,kanjiId,kakusu){var kanjiScore=Math.floor(kanjiScore);if(kanjiScore>=80){correctAudio.play();}else{incorrectAudio.play();}
scoreObj.classList.remove('d-none');scoreObj.innerText=kanjiScore;if(mode!='conv'&&mode!='hirakana'&&mode!='kanahira'){for(var i=0;i<kakusu;i++){changePathColor(i+1,tehonKanji,kanjiId,'black');}
for(var i=0;i<kakusu;i++){if(!kakuScores[i][0]||kakuScores[i][0]<80){changePathColor(i+1,tehonKanji,kanjiId,'red');}}}
if(localStorage.getItem('hint')!=1){changeAllColor(object,kanjiId,'lightgray');}}
function getKanjiScores(kakuScores,scoreObj,tehonKanji,object,kanjiId,kakusu){return Promise.all(kakuScores).then(kakuScores=>{var kanjiScore=0;var totalTehonCount=0;kakuScores.forEach(kakuData=>{var[kakuScore,tehonCount]=kakuData;kanjiScore+=kakuScore*tehonCount;totalTehonCount+=tehonCount;});kanjiScore/=totalTehonCount;showKanjiScore(kanjiScore,kakuScores,scoreObj,tehonKanji,object,kanjiId,kakusu);return kanjiScore;});}
function getProblemScores(tegakiPanel,tehonPanel,objects,tegakiPads){var promises=[];objects.forEach((object,i)=>{var kanjiId=object.dataset.id;var kakusu=getKakusu(object,kanjiId);var pos=parseInt(object.dataset.pos);var kanjiScores=0;var tegakiData=tegakiPads[i].toData();if(tegakiData.length!=0){var tehonKanji=tehonPanel.children[pos].shadowRoot.querySelector('object');var scoreObj=tegakiPanel.children[pos].shadowRoot.querySelector('#score');var kakuScores=getKakuScores(tegakiData,object,kanjiId,kakusu);kanjiScores=getKanjiScores(kakuScores,scoreObj,tehonKanji,object,kanjiId,kakusu);}
promises[i]=kanjiScores;});return Promise.all(promises);}
function unlockAudio(){correctAllAudio.volume=0;correctAudio.volume=0;incorrectAudio.volume=0;stupidAudio.volume=0;correctAllAudio.play();correctAudio.play();incorrectAudio.play();stupidAudio.play();correctAllAudio.pause();correctAudio.pause();incorrectAudio.pause();stupidAudio.pause();correctAllAudio.currentTime=0;correctAudio.currentTime=0;incorrectAudio.currentTime=0;stupidAudio.currentTime=0;correctAllAudio.volume=1;correctAudio.volume=1;incorrectAudio.volume=1;stupidAudio.volume=1;}
let audioUnlocked=false;function setScoringButton(problemBox,tegakiPanel,tehonPanel,objects,tegakiPads,word){var scoring=problemBox.shadowRoot.querySelector('#scoring');var once=true;scoring.addEventListener('click',function(){if(once){unlockAudio();once=false;}
getProblemScores(tegakiPanel,tehonPanel,objects,tegakiPads).then(scores=>{if(scores.every(score=>score>=80)){problemBox.shadowRoot.querySelector('#guard').style.height='100%';var next=problemBox.nextElementSibling;if(next){next.shadowRoot.querySelector('#guard').style.height='0';var scroll=new SmoothScroll();scroll.animateScroll(next);}else{window.removeEventListener('touchstart',scrollEvent,{passive:false});window.removeEventListener('touchmove',scrollEvent,{passive:false});}}
var clearedKanjis=localStorage.getItem('touch-50on');if(!clearedKanjis){clearedKanjis='';}
scores.forEach((score,i)=>{if(score<40){clearedKanjis=clearedKanjis.replace(word[i],'');}});localStorage.setItem('touch-50on',clearedKanjis);});});}
function setSignaturePad(object){var canvas=object.parentNode.querySelector('#tegaki');var pad=new SignaturePad(canvas,{minWidth:maxWidth,maxWidth:maxWidth,penColor:'black',throttle:0,minDistance:0,});return pad;}
function setEraser(tegakiPad,tegakiPanel,object,kanjiId){object.parentNode.querySelector('#eraser').onclick=function(){var data=tegakiPad.toData();if(data){tegakiPad.clear();}
var pos=parseInt(object.dataset.pos);var scoreObj=tegakiPanel.children[pos].shadowRoot.querySelector('#score');scoreObj.classList.add('d-none');if(localStorage.getItem('hint')!=1){changeAllColor(object,kanjiId,'none');}}}
function setSound(tehonPanel,object,kanji){var pos=parseInt(object.dataset.pos);var sound=tehonPanel.children[pos].shadowRoot.querySelector('#sound');var hira=kanaToHira(kanji);sound.onclick=function(){new Audio('/touch-50on/voice/波音リツ/'+hira+'.mp3').play();}}
function loadProblem(problem,answer){var problemBox=document.createElement('problem-box');var shadow=problemBox.shadowRoot;var objects=[];var tegakiPads=[];var tehon=shadow.querySelector('#tehon');var tegaki=shadow.querySelector('#tegaki');var tegakiPads=[];for(var i=0;i<problem.length;i++){var kanjiId=toKanjiId(problem[i]);loadSVG(kanjiId,tehon,i,false);var object=loadSVG(toKanjiId(answer[i]),tegaki,i,true);var tegakiPad=setSignaturePad(object);objects.push(object);tegakiPads.push(tegakiPad);setEraser(tegakiPad,tegaki,object,kanjiId);setSound(tehon,object,problem[i]);}
setScoringButton(problemBox,tegaki,tehon,objects,tegakiPads,problem);document.getElementById('problems').appendChild(problemBox);return tegakiPads;}
function resizeTegakiContents(tegakiPads){tegakiPads.forEach(tegakiPad=>{var canvas=tegakiPad._canvas;resizeCanvasSize(canvas,canvasSize);var data=tegakiPad.toData();if(data.length>0){tegakiPad.maxWidth=maxWidth;tegakiPad.minWidth=maxWidth;if(prevCanvasSize<canvasSize){data.forEach((tegakiData,i)=>{tegakiData.forEach((datum,j)=>{data[i][j].x*=2;data[i][j].y*=2;});});}else{data.forEach((tegakiData,i)=>{tegakiData.forEach((datum,j)=>{data[i][j].x/=2;data[i][j].y/=2;});});}
tegakiPad.fromData(data);}});}
function resizeCanvasSize(canvas,canvasSize){canvas.setAttribute('width',canvasSize);canvas.setAttribute('height',canvasSize);}
function resizeTehonContents(){var problems=document.getElementById('problems').children;for(const problem of problems){var tegakiBoxes=problem.shadowRoot.querySelector('#tegaki').children;var tehonBoxes=problem.shadowRoot.querySelector('#tehon').children;[...tegakiBoxes].forEach(tegakiBox=>{var canvas=tegakiBox.shadowRoot.querySelector('#tehon');resizeCanvasSize(canvas,canvasSize);});[...tehonBoxes].forEach(tehonBox=>{var canvas=tehonBox.shadowRoot.querySelector('#tehon');resizeCanvasSize(canvas,canvasSize);});}}
function loadDrill(problems1,problems2){var tegakiPads=[];for(var i=0;i<problems1.length;i++){var pads=loadProblem(problems1[i],problems2[i]);tegakiPads=tegakiPads.concat(pads);}
window.onresize=function(){prevCanvasSize=canvasSize;if(window.innerWidth>=768){canvasSize=280;maxWidth=4;}else{canvasSize=140;maxWidth=2;}
if(prevCanvasSize!=canvasSize){resizeTegakiContents(tegakiPads);resizeTehonContents();}};}
function setStrokeWidth(kakusu){return 15+6/kakusu;}
function toggleAllStroke(){var problems=document.getElementById('problems').children;for(const problem of problems){var tegakiBoxes=problem.shadowRoot.querySelector('#tegaki').children;for(const tegakiBox of tegakiBoxes){var object=tegakiBox.shadowRoot.querySelector('object');var kanjiId=object.dataset.id;var kakusu=getKakusu(object,kanjiId);toggleStroke(object,kanjiId,kakusu);}}}
function toggleStroke(object,kanjiId,kakusu){var id='kvg:StrokePaths_'+kanjiId;var paths=object.contentDocument.querySelector('[id="'+id+'"]');if(localStorage.getItem('hint')!=1){paths.style.stroke='none';}else{paths.style.stroke='lightgray';}
paths.style.strokeWidth=setStrokeWidth(kakusu);}
function changeAllColor(object,kanjiId,color){var id='kvg:StrokePaths_'+kanjiId;var paths=object.contentDocument.querySelector('[id="'+id+'"]');paths.style.stroke=color;}
function changePathColor(pos,object,kanjiId,color){var path=object.contentDocument.getElementById('kvg:'+kanjiId+'-s'+pos);path.setAttribute('stroke',color);}
function removeNumbers(object,kanjiId){var id='kvg:StrokeNumbers_'+kanjiId;var numbers=object.contentDocument.querySelector('[id="'+id+'"]');numbers.remove();}
function countNoTransparent(data){var count=0;for(var i=3;i<data.length;i+=4){if(data[i]!=0){count+=1;}}
return count;}
function getInclusionCount(tegakiImgData,tehonImgData){for(var i=3;i<tegakiImgData.length;i+=4){if(tehonImgData[i]!=0){tegakiImgData[i]=0;}}
var inclusionCount=countNoTransparent(tegakiImgData);return inclusionCount;}
function calcKakuScore(tegakiCount,tehonCount,inclusionCount){var lineScore=(1-Math.abs((tehonCount-tegakiCount)/tehonCount));if(lineScore>1){lineScore=1;}
var inclusionScore=(tegakiCount-inclusionCount)/tegakiCount;if(inclusionScore>1){inclusionScore=1;}
var kakuScore=lineScore*inclusionScore*100*1.20;if(kakuScore<0){kakuScore=0;}
if(kakuScore>100){kakuScore=100;}
if(isNaN(kakuScore)){kakuScore=0;}
return kakuScore;}
function getKakuScores(tegakiData,object,kanjiId,kakusu){var markerWidth=setStrokeWidth(kakusu)*109/canvasSize;if(canvasSize>140){markerWidth*=4;}
var promises=new Array(kakusu);for(var i=0;i<kakusu;i++){promises[i]=new Promise((resolve,reject)=>{if(tegakiData[i]){var markerCanvas=document.createElement('canvas');markerCanvas.setAttribute('width',canvasSize);markerCanvas.setAttribute('height',canvasSize);var markerContext=markerCanvas.getContext('2d');var markerPad=new SignaturePad(markerCanvas,{minWidth:markerWidth,maxWidth:markerWidth,penColor:'black',});markerPad.fromData([tegakiData[i]]);var kakuData=markerContext.getImageData(0,0,canvasSize,canvasSize).data;var tegakiCount=countNoTransparent(kakuData);var tegakiDatum=tegakiData[i];getTehonCanvas(object,kanjiId,kakusu,i+1).then(tehonCanvas=>{var tehonImgData=tehonCanvas.getContext('2d').getImageData(0,0,canvasSize,canvasSize).data;var tehonCount=countNoTransparent(tehonImgData);var tegakiImgData=markerContext.getImageData(0,0,canvasSize,canvasSize);var inclusionCount=getInclusionCount(tegakiImgData,tehonImgData);var kakuScore=calcKakuScore(tegakiCount,tehonCount,inclusionCount);resolve([kakuScore,tehonCount]);});}else{getTehonCanvas(object,kanjiId,kakusu,i+1).then(tehonCanvas=>{var tehonImgData=tehonCanvas.getContext('2d').getImageData(0,0,canvasSize,canvasSize).data;var tehonCount=countNoTransparent(tehonImgData);resolve([0,tehonCount]);});}});}
return promises;}
function initSVG(object){var kanjiId=object.dataset.id;var kakusu=getKakusu(object,kanjiId);toggleStroke(object,kanjiId,kakusu);removeNumbers(object,kanjiId)}
function report(obj){var scores=[];var problems=document.getElementById('problems').children;for(var i=0;i<problems.length;i++){var tegakis=problems[i].shadowRoot.querySelector('#tegaki').children;for(var j=0;j<tegakis.length;j++){var score=tegakis[j].shadowRoot.querySelector('#score').innerText;scores.push(parseInt(score));}}
var score=0;for(var i=0;i<scores.length;i++){score+=scores[i];}
score/=scores.length;if(score>=80){correctAllAudio.play();document.getElementById('report').classList.add('d-none');document.getElementById('correctReport').classList.remove('d-none');setTimeout(()=>{location.href='/touch-50on/';},3000);}else{stupidAudio.play();document.getElementById('report').classList.add('d-none');document.getElementById('incorrectReport').classList.remove('d-none');setTimeout(function(){document.getElementById('report').classList.remove('d-none');document.getElementById('incorrectReport').classList.add('d-none');},6000);}}
function shuffle(array){for(var i=array.length-1;i>0;i--){var r=Math.floor(Math.random()*(i+1));var tmp=array[i];array[i]=array[r];array[r]=tmp;}
return array;}
function parseQuery(queryString){var query={};var pairs=(queryString[0]==='?'?queryString.substr(1):queryString).split('&');for(var i=0;i<pairs.length;i++){var pair=pairs[i].split('=');query[decodeURIComponent(pair[0])]=decodeURIComponent(pair[1]||'');}
return query;}
function uniq(array){return array.filter((elem,index,self)=>self.indexOf(elem)===index);}
function kanaToHira(str){return str.replace(/[\u30a1-\u30f6]/g,function(match){var chr=match.charCodeAt(0)-0x60;return String.fromCharCode(chr);});}
function hiraToKana(str){return str.replace(/[\u3041-\u3096]/g,function(match){var chr=match.charCodeAt(0)+0x60;return String.fromCharCode(chr);});}
function convHirakana(str){for(var i=0;i<str.length;i++){if(str[i].test(/[\u3041-\u3096]/)){var chr=str[i].charCodeAt(0)+0x60;str[i]=String.fromCharCode(chr);}else if(str[i].test(/[\u30a1-\u30f6]/)){var chr=str[i].charCodeAt(0)-0x60;str[i]=String.fromCharCode(chr);}}
return str;}
let kanjis='';let mode='hirahira';function initQuery(){var problems1,problems2;var queries=parseQuery(location.search);mode=queries['mode'];var kanjiQuery=queries['q'];var problemQuery=queries['problem'];if(kanjiQuery){if(mode=='conv'){var conved=convHirakana(kanjiQuery);problems1=kanjiQuery.split('');problems2=conved.split('');}else{problems1=kanjiQuery.split('');problems2=kanjiQuery.split('');}}else{if(problemQuery=='50on'){var hira50on=Array.from('あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよわん');var kana50on=Array.from('アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨワン');if(mode=='hirahira'){problems1=hira50on;problems2=hira50on;}else if(mode=='hirakana'){problems1=hira50on;problems2=kana50on;}else if(mode=='kanakana'){problems1=kana50on;problems2=kana50on;}else{problems1=kana50on;problems2=hira50on;}}else{var hiradakuon=Array.from('がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ');var kanadakuon=Array.from('ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ');if(mode=='hirahira'){problems1=hiradakuon;problems2=hiradakuon;}else if(mode=='hirakana'){problems1=hiradakuon;problems2=kanadakuon;}else if(mode=='kanakana'){problems1=kanadakuon;problems2=kanadakuon;}else{problems1=kanadakuon;problems2=hiradakuon;}}}
loadDrill(problems1,problems2);document.getElementById('problems').children[0].shadowRoot.querySelector('#guard').style.height='0';}
function scrollEvent(e){if(e.target.tagName!='PROBLEM-BOX'&&e.target.tagName!='BUTTON'){e.preventDefault();}}
window.addEventListener("touchstart",scrollEvent,{passive:false});window.addEventListener("touchmove",scrollEvent,{passive:false});