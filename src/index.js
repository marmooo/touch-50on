var hira50on = Array.from('あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよわん');
var kana50on = Array.from('アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨワン');
var hiradakuon = Array.from('がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ');
var kanadakuon = Array.from('ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ');

function toKanji(kanjiId) {
  return String.fromCodePoint(parseInt('0x' + kanjiId));
}

function loadConfig() {
  if (localStorage.getItem('darkMode') == 1) {
    document.documentElement.dataset.theme = 'dark';
  }
}
loadConfig();

function toggleDarkMode() {
  if (localStorage.getItem('darkMode') == 1) {
    localStorage.setItem('darkMode', 0);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem('darkMode', 1);
    document.documentElement.dataset.theme = 'dark';
  }
}

function setCleared(obj) {
  var clearedKanjis = localStorage.getItem('touch-50on');
  if (clearedKanjis) {
    var problems = obj.children;
    for (var i=0; i<problems.length; i++) {
      if (clearedKanjis.includes(problems[i].innerText)) {
        problems[i].classList.remove('btn-outline-secondary');
        problems[i].classList.add('btn-secondary')
      }
    }
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i >= 0; i--) {
    let rand = Math.floor(Math.random() * (i + 1));
    [array[i], array[rand]] = [array[rand], array[i]]
  }
  return array;
}

function testRemained() {
  var problems = document.getElementById('problems').children;
  var kanjis = [...problems]
    .filter(e => e.classList.contains('btn-outline-secondary'))
    .map(e => e.innerText);
  var target = shuffle(kanjis).slice(0, 9).join('');
  location.href = `/touch-50on/drill/?q=${target}`;
}

function testCleared() {
  var problems = document.getElementById('problems').children;
  var kanjis = [...problems]
    .filter(e => e.classList.contains('btn-secondary'))
    .map(e => e.innerText);
  var target = shuffle(kanjis).slice(0, 9).join('');
  location.href = `/touch-50on/drill/?q=${target}`;
}

function deleteData() {
  localStorage.removeItem('touch-50on');
  location.reload();
}

function generateDrill() {
  var words = document.getElementById('search').value;
  if (words && words.match(/^[ぁ-んァ-ヶ]+$/)) {
    location.href = `/touch-50on/drill/?q=${words}`;
  }
}

function setLinkTemplate() {
  var a = document.createElement('a');
  a.className = 'me-1 mb-1 btn btn-outline-secondary btn-sm';
  return a;
}
const linkTemplate = setLinkTemplate();

function setProblems(obj, kanjis) {
  while (obj.lastElementChild) {
    obj.removeChild(obj.lastChild);
  }
  for (var i=0; i<kanjis.length; i++) {
    var problem = kanjis[i].repeat(6);
    var a = linkTemplate.cloneNode();
    a.href = `/touch-50on/drill/?q=${problem}`;
    a.innerText = kanjis[i];
    obj.appendChild(a);
  }
}


var problems1 = document.getElementById('cleared50on');
var kanjis1 = hira50on.concat(kana50on);
setProblems(problems1, kanjis1);
setCleared(problems1);
var problems2 = document.getElementById('clearedDakuon');
var kanjis2 = hiradakuon.concat(kanadakuon);
setProblems(problems2, kanjis2);
setCleared(problems2);

document.getElementById('search').addEventListener('keydown', function(event) {
  if (event.key == 'Enter') {
    var words = this.value;
    location.href = `/touch-50on/drill/?q=${words}`;
  }
}, false);

