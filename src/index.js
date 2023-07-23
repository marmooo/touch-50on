const hira50on = Array.from(
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよわん",
);
const kana50on = Array.from(
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨワン",
);
const hiradakuon = Array.from(
  "がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ",
);
const kanadakuon = Array.from(
  "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ",
);
loadConfig();

function changeLevel(event) {
  const level = event.target.selectedIndex;
  localStorage.setItem("touch-kanji-level", level);
}

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
  if (localStorage.getItem("touch-50on-level")) {
    const level = parseInt(localStorage.getItem("touch-50on-level"));
    document.getElementById("levelOption").options[level].selected = true;
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    document.documentElement.setAttribute("data-bs-theme", "light");
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.setAttribute("data-bs-theme", "dark");
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

function setProblems(obj, words) {
  let html = "";
  words.forEach((word) => {
    const q = word.repeat(6);
    const url = `/touch-50on/drill/?q=${q}`;
    const klass = "me-1 mb-1 btn btn-sm btn-outline-secondary";
    html += `<a href="${url}" class="${klass}">${word}</a>`;
  });
  obj.innerHTML = html;
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
document.getElementById("levelOption").onchange = changeLevel;
document.getElementById("search").addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    const words = event.target.value;
    location.href = `/touch-50on/drill/?q=${words}`;
  }
});
