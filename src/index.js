const hira50on = Array.from("あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよわん");
const kana50on = Array.from("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨワン");
const hiradakuon = Array.from("がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ");
const kanadakuon = Array.from("ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ");
loadConfig();

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.dataset.theme = "dark";
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.dataset.theme = "dark";
  }
}

function setCleared(obj) {
  const clearedKanjis = localStorage.getItem("touch-50on");
  if (clearedKanjis) {
    const problems = obj.children;
    for (let i = 0; i < problems.length; i++) {
      if (clearedKanjis.includes(problems[i].textContent)) {
        problems[i].classList.remove("btn-outline-secondary");
        problems[i].classList.add("btn-secondary");
      }
    }
  }
}

function deleteData() {
  localStorage.removeItem("touch-50on");
  location.reload();
}

function generateDrill() {
  const words = document.getElementById("search").value;
  if (words && /^[ぁ-んァ-ヶ]+$/.test(words)) {
    location.href = `/touch-50on/drill/?q=${words}`;
  }
}

function setLinkTemplate() {
  const a = document.createElement("a");
  a.className = "me-1 mb-1 btn btn-outline-secondary btn-sm";
  return a;
}
const linkTemplate = setLinkTemplate();

function setProblems(obj, kanjis) {
  while (obj.lastElementChild) {
    obj.removeChild(obj.lastChild);
  }
  for (let i = 0; i < kanjis.length; i++) {
    const problem = kanjis[i].repeat(6);
    const a = linkTemplate.cloneNode();
    a.href = `/touch-50on/drill/?q=${problem}`;
    a.textContent = kanjis[i];
    obj.appendChild(a);
  }
}

const problems1 = document.getElementById("cleared50on");
const kanjis1 = hira50on.concat(kana50on);
setProblems(problems1, kanjis1);
setCleared(problems1);

const problems2 = document.getElementById("clearedDakuon");
const kanjis2 = hiradakuon.concat(kanadakuon);
setProblems(problems2, kanjis2);
setCleared(problems2);

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("deleteData").onclick = deleteData;
document.getElementById("generateDrill").onclick = generateDrill;
document.getElementById("search").addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    const words = this.value;
    location.href = `/touch-50on/drill/?q=${words}`;
  }
}, false);

// disable troublesome iOS features
// - double tap zoom
document.ondblclick = (e) => {
  e.preventDefault();
};
// - selection context menu
// TODO: need better solution
document.body.style.webkitUserSelect = "none";
