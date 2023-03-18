let correctAudio, incorrectAudio, correctAllAudio, stupidAudio;
loadAudios();
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
const kanjivgDir = "/kanjivg";
let prevCanvasSize;
let canvasSize = 140;
let maxWidth = 2;
if (window.innerWidth >= 768) {
  canvasSize = 280;
  maxWidth = 4;
}
let level = 2;
loadConfig();

// function toKanji(kanjiId) {
//   return String.fromCodePoint(parseInt("0x" + kanjiId));
// }

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.dataset.theme = "dark";
  }
  if (localStorage.getItem("hint") == 1) {
    document.getElementById("hint").textContent = "EASY";
  }
  if (localStorage.getItem("touch-50on-level")) {
    level = parseInt(localStorage.getItem("touch-50on-level"));
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

function toggleHint(obj) {
  if (localStorage.getItem("hint") == 1) {
    localStorage.setItem("hint", 0);
    obj.textContent = "HARD";
  } else {
    localStorage.setItem("hint", 1);
    obj.textContent = "EASY";
  }
  toggleAllStroke();
}

function toggleScroll() {
  const scrollable = document.getElementById("scrollable");
  const pinned = document.getElementById("pinned");
  if (scrollable.classList.contains("d-none")) {
    window.removeEventListener("touchstart", scrollEvent, { passive: false });
    window.removeEventListener("touchmove", scrollEvent, { passive: false });
    scrollable.classList.remove("d-none");
    pinned.classList.add("d-none");
  } else {
    window.addEventListener("touchstart", scrollEvent, { passive: false });
    window.addEventListener("touchmove", scrollEvent, { passive: false });
    scrollable.classList.add("d-none");
    pinned.classList.remove("d-none");
  }
}

function playAudio(audioBuffer, volume) {
  const audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  if (volume) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
    audioSource.connect(gainNode);
    audioSource.start();
  } else {
    audioSource.connect(audioContext.destination);
    audioSource.start();
  }
}

function unlockAudio() {
  audioContext.resume();
}

function loadAudio(url) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          resolve(audioBuffer);
        }, (err) => {
          reject(err);
        });
      });
    });
}

function loadAudios() {
  promises = [
    loadAudio("/touch-50on/mp3/correct3.mp3"),
    loadAudio("/touch-50on/mp3/incorrect1.mp3"),
    loadAudio("/touch-50on/mp3/correct1.mp3"),
    loadAudio("/touch-50on/mp3/stupid5.mp3"),
  ];
  Promise.all(promises).then((audioBuffers) => {
    correctAudio = audioBuffers[0];
    incorrectAudio = audioBuffers[1];
    correctAllAudio = audioBuffers[2];
    stupidAudio = audioBuffers[3];
  });
}

function prevTehon() {
  const object = this.parentNode.parentNode.querySelector(".tehon");
  const svg = object.contentDocument;
  const kanjiId = object.dataset.id;
  let currPos = 1;
  if (object.dataset.animation) {
    currPos = parseInt(object.dataset.animation) - 1;
    if (currPos < 1) currPos = 1;
  }
  let i = 1;
  while (true) {
    const path = svg.getElementById("kvg:" + kanjiId + "-s" + i);
    if (path) {
      if (i < currPos) {
        path.setAttribute("stroke", "black");
      } else if (i == currPos) {
        path.setAttribute("stroke", "red");
      } else {
        path.setAttribute("stroke", "none");
      }
    } else {
      break;
    }
    i += 1;
  }
  object.dataset.animation = currPos;
}

function nextTehon() {
  const object = this.parentNode.parentNode.querySelector(".tehon");
  const svg = object.contentDocument;
  const kanjiId = object.dataset.id;
  let currPos = 0;
  if (object.dataset.animation) {
    currPos = parseInt(object.dataset.animation);
  }

  const kakusu = getKakusu(object, kanjiId);
  if (currPos < kakusu) {
    currPos += 1;
  }
  let i = 1;
  while (true) {
    const path = svg.getElementById("kvg:" + kanjiId + "-s" + i);
    if (path) {
      if (i < currPos) {
        path.setAttribute("stroke", "black");
      } else if (i == currPos) {
        path.setAttribute("stroke", "red");
      } else {
        path.setAttribute("stroke", "none");
      }
    } else {
      break;
    }
    i += 1;
  }
  object.dataset.animation = currPos;
}

customElements.define(
  "problem-box",
  class extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById("problem-box").content.cloneNode(
        true,
      );
      this.attachShadow({ mode: "open" }).appendChild(template);
    }
  },
);
customElements.define(
  "tehon-box",
  class extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById("tehon-box").content.cloneNode(
        true,
      );
      if (window.innerWidth >= 768) {
        const canvases = template.querySelectorAll("canvas");
        [...canvases].forEach((canvas) => {
          canvas.setAttribute("width", canvasSize);
          canvas.setAttribute("height", canvasSize);
        });
      }
      template.querySelector(".prevTehon").onclick = prevTehon;
      template.querySelector(".nextTehon").onclick = nextTehon;
      this.attachShadow({ mode: "open" }).appendChild(template);
    }
  },
);
customElements.define(
  "tegaki-box",
  class extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById("tegaki-box").content.cloneNode(
        true,
      );
      if (window.innerWidth >= 768) {
        const canvases = template.querySelectorAll("canvas");
        [...canvases].forEach((canvas) => {
          canvas.setAttribute("width", canvasSize);
          canvas.setAttribute("height", canvasSize);
        });
      }
      this.attachShadow({ mode: "open" }).appendChild(template);
    }
  },
);

function getKakusu(object, kanjiId) {
  let max = 1;
  while (true) {
    const path = object.contentDocument.getElementById(
      "kvg:" + kanjiId + "-s" + max,
    );
    if (path) {
      max += 1;
    } else {
      break;
    }
  }
  return max - 1;
}

function getTehonCanvas(object, kanjiId, kakusu, kakuNo) {
  return new Promise(function (resolve) {
    const clonedContent = object.contentDocument.cloneNode(true);
    const id = "kvg:StrokePaths_" + kanjiId;
    const paths = clonedContent.querySelector('[id="' + id + '"]');
    paths.style.stroke = "black";
    for (let j = 1; j <= kakusu; j++) {
      const path = clonedContent.getElementById("kvg:" + kanjiId + "-s" + j);
      if (kakuNo != j) {
        path.remove();
      }
    }
    const text = clonedContent.documentElement.outerHTML;
    const blob = new Blob([text], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = url;
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
      resolve(canvas);
    };
  });
}

function toKanjiId(str) {
  const hex = str.codePointAt(0).toString(16);
  return ("00000" + hex).slice(-5);
}

function loadSVG(kanjiId, parentNode, pos, loadCanvas) {
  let box;
  if (loadCanvas) {
    box = document.createElement("tegaki-box");
  } else {
    box = document.createElement("tehon-box");
  }
  const object = box.shadowRoot.querySelector("object");
  object.setAttribute("data", kanjivgDir + "/" + kanjiId + ".svg");
  object.setAttribute("data-id", kanjiId);
  object.setAttribute("data-pos", pos);
  if (loadCanvas) {
    object.setAttribute("onload", "_initSVG(this)");
  }
  parentNode.appendChild(box);
  return object;
}

function showKanjiScore(
  kanjiScore,
  kakuScores,
  scoreObj,
  tehonKanji,
  object,
  kanjiId,
  kakusu,
) {
  kanjiScore = Math.floor(kanjiScore);
  if (kanjiScore >= 80) {
    playAudio(correctAudio);
  } else {
    playAudio(incorrectAudio);
  }
  scoreObj.classList.remove("d-none");
  scoreObj.textContent = kanjiScore;
  if (mode != "conv" && mode != "hirakana" && mode != "kanahira") {
    for (let i = 0; i < kakusu; i++) {
      changePathColor(i + 1, tehonKanji, kanjiId, "black");
    }
    for (let i = 0; i < kakusu; i++) {
      if (!kakuScores[i][0] || kakuScores[i][0] < 80) {
        changePathColor(i + 1, tehonKanji, kanjiId, "red");
      }
    }
  }
  if (localStorage.getItem("hint") != 1) {
    changeAllColor(object, kanjiId, "lightgray");
  }
}

function getKanjiScores(
  kakuScores,
  scoreObj,
  tehonKanji,
  object,
  kanjiId,
  kakusu,
) {
  return Promise.all(kakuScores).then((kakuScores) => {
    let kanjiScore = 0;
    let totalTehonCount = 0;
    kakuScores.forEach((kakuData) => {
      const [kakuScore, tehonCount] = kakuData;
      kanjiScore += kakuScore * tehonCount;
      totalTehonCount += tehonCount;
    });
    kanjiScore /= totalTehonCount;
    showKanjiScore(
      kanjiScore,
      kakuScores,
      scoreObj,
      tehonKanji,
      object,
      kanjiId,
      kakusu,
    );
    return kanjiScore;
  });
}

function getProblemScores(tegakiPanel, tehonPanel, objects, tegakiPads) {
  const promises = [];
  objects.forEach((object, i) => {
    const kanjiId = object.dataset.id;
    const kakusu = getKakusu(object, kanjiId);
    const pos = parseInt(object.dataset.pos);
    let kanjiScores = 0;
    const tegakiData = tegakiPads[i].toData();
    if (tegakiData.length != 0) {
      const tehonKanji = tehonPanel.children[pos].shadowRoot.querySelector(
        "object",
      );
      const scoreObj = tegakiPanel.children[pos].shadowRoot.querySelector(
        ".score",
      );
      const kakuScores = getKakuScores(tegakiData, object, kanjiId, kakusu);
      kanjiScores = getKanjiScores(
        kakuScores,
        scoreObj,
        tehonKanji,
        object,
        kanjiId,
        kakusu,
      );
    }
    promises[i] = kanjiScores;
  });
  return Promise.all(promises);
}

function setScoringButton(
  problemBox,
  tegakiPanel,
  tehonPanel,
  objects,
  tegakiPads,
  word,
) {
  const scoring = problemBox.shadowRoot.querySelector(".scoring");
  scoring.addEventListener("click", function () {
    getProblemScores(tegakiPanel, tehonPanel, objects, tegakiPads).then(
      (scores) => {
        if (scores.every((score) => score >= 80)) {
          problemBox.shadowRoot.querySelector(".guard").style.height = "100%";
          const next = problemBox.nextElementSibling;
          if (next) {
            next.shadowRoot.querySelector(".guard").style.height = "0";
            const headerHeight = document.getElementById("header").offsetHeight;
            const top = next.getBoundingClientRect().top +
              document.documentElement.scrollTop - headerHeight;
            window.scrollTo({ top: top, behavior: "smooth" });
          } else {
            window.removeEventListener("touchstart", scrollEvent, {
              passive: false,
            });
            window.removeEventListener("touchmove", scrollEvent, {
              passive: false,
            });
          }
        }
        let clearedKanjis = localStorage.getItem("touch-50on");
        if (!clearedKanjis) clearedKanjis = "";
        scores.forEach((score, i) => {
          if (score < 40) {
            // 点数があまりにも低いものは合格リストから除外
            clearedKanjis = clearedKanjis.replace(word[i], "");
          }
        });
        localStorage.setItem("touch-50on", clearedKanjis);
      },
    );
  });
}

function setSignaturePad(object) {
  const canvas = object.parentNode.querySelector(".tegaki");
  const pad = new SignaturePad(canvas, {
    minWidth: maxWidth,
    maxWidth: maxWidth,
    penColor: "black",
    throttle: 0,
    minDistance: 0,
  });
  return pad;
}

function setEraser(tegakiPad, tegakiPanel, tehonPanel, object, kanjiId) {
  const currKanji = object.getRootNode().host;
  const kanjiPos = [...tegakiPanel.children].findIndex((x) => x == currKanji);
  tehonPanel.children[kanjiPos].shadowRoot.querySelector(".eraser").onclick =
    function () {
      const data = tegakiPad.toData();
      if (data) {
        tegakiPad.clear();
      }
      const pos = parseInt(object.dataset.pos);
      const scoreObj = tegakiPanel.children[pos].shadowRoot.querySelector(
        ".score",
      );
      scoreObj.classList.add("d-none");
      if (localStorage.getItem("hint") != 1) {
        changeAllColor(object, kanjiId, "none");
      }
    };
}

function setSound(tehonPanel, object, kanji) {
  const pos = parseInt(object.dataset.pos);
  const sound = tehonPanel.children[pos].shadowRoot.querySelector(".sound");
  const hira = kanaToHira(kanji);
  sound.onclick = function () {
    new Audio("/touch-50on/voice/波音リツ/" + hira + ".mp3").play();
  };
}

function loadProblem(problem, answer) {
  const problemBox = document.createElement("problem-box");
  const shadow = problemBox.shadowRoot;
  const objects = [];
  const tegakiPads = [];
  const tehon = shadow.querySelector(".tehon");
  const tegaki = shadow.querySelector(".tegaki");
  for (let i = 0; i < problem.length; i++) {
    const kanjiId = toKanjiId(problem[i]);
    loadSVG(kanjiId, tehon, i, false);
    const object = loadSVG(toKanjiId(answer[i]), tegaki, i, true);
    const tegakiPad = setSignaturePad(object);
    objects.push(object);
    tegakiPads.push(tegakiPad);
    setEraser(tegakiPad, tegaki, tehon, object, kanjiId);
    setSound(tehon, object, problem[i]);
  }
  setScoringButton(problemBox, tegaki, tehon, objects, tegakiPads, problem);
  document.getElementById("problems").appendChild(problemBox);
  return tegakiPads;
}

function resizeTegakiContents(tegakiPads) {
  tegakiPads.forEach((tegakiPad) => {
    const canvas = tegakiPad._canvas;
    resizeCanvasSize(canvas, canvasSize);
    const data = tegakiPad.toData();
    if (data.length > 0) {
      tegakiPad.maxWidth = maxWidth;
      tegakiPad.minWidth = maxWidth;
      if (prevCanvasSize < canvasSize) {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].length; j++) {
            data[i][j].x *= 2;
            data[i][j].y *= 2;
          }
        }
      } else {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].length; j++) {
            data[i][j].x /= 2;
            data[i][j].y /= 2;
          }
        }
      }
      tegakiPad.fromData(data);
    }
  });
}

function resizeCanvasSize(canvas, canvasSize) {
  // canvas.style.width = canvasSize + 'px';
  // canvas.style.height = canvasSize + 'px';
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);
}

function resizeTehonContents() {
  const problems = document.getElementById("problems").children;
  for (const problem of problems) {
    const tegakiBoxes = problem.shadowRoot.querySelector(".tegaki").children;
    const tehonBoxes = problem.shadowRoot.querySelector(".tehon").children;
    [...tegakiBoxes].forEach((tegakiBox) => {
      const canvas = tegakiBox.shadowRoot.querySelector(".tehon");
      resizeCanvasSize(canvas, canvasSize);
    });
    [...tehonBoxes].forEach((tehonBox) => {
      const canvas = tehonBox.shadowRoot.querySelector(".tehon");
      resizeCanvasSize(canvas, canvasSize);
    });
  }
}

function loadDrill(problems1, problems2) {
  let tegakiPads = [];
  for (let i = 0; i < problems1.length; i++) {
    const pads = loadProblem(problems1[i], problems2[i]);
    tegakiPads = tegakiPads.concat(pads);
  }
  window.onresize = function () {
    prevCanvasSize = canvasSize;
    if (window.innerWidth >= 768) {
      canvasSize = 280;
      maxWidth = 4;
    } else {
      canvasSize = 140;
      maxWidth = 2;
    }
    if (prevCanvasSize != canvasSize) {
      resizeTegakiContents(tegakiPads);
      resizeTehonContents();
    }
  };
}

// 器用差の大きい低学年の採点が緩くなるよう太さを変える
function setStrokeWidth(kakusu) {
  return 15 + 6 / kakusu;
}

function toggleAllStroke() {
  const problems = document.getElementById("problems").children;
  for (const problem of problems) {
    const tegakiBoxes = problem.shadowRoot.querySelector(".tegaki").children;
    for (const tegakiBox of tegakiBoxes) {
      const object = tegakiBox.shadowRoot.querySelector("object");
      const kanjiId = object.dataset.id;
      const kakusu = getKakusu(object, kanjiId);
      toggleStroke(object, kanjiId, kakusu);
    }
  }
}

function toggleStroke(object, kanjiId, kakusu) {
  const id = "kvg:StrokePaths_" + kanjiId;
  const paths = object.contentDocument.querySelector('[id="' + id + '"]');
  if (localStorage.getItem("hint") != 1) {
    paths.style.stroke = "none";
  } else {
    paths.style.stroke = "lightgray";
  }
  paths.style.strokeWidth = setStrokeWidth(kakusu);
}

function changeAllColor(object, kanjiId, color) {
  const id = "kvg:StrokePaths_" + kanjiId;
  const paths = object.contentDocument.querySelector('[id="' + id + '"]');
  paths.style.stroke = color;
}

function changePathColor(pos, object, kanjiId, color) {
  const path = object.contentDocument.getElementById(
    "kvg:" + kanjiId + "-s" + pos,
  );
  path.setAttribute("stroke", color);
}

function removeNumbers(object, kanjiId) {
  const id = "kvg:StrokeNumbers_" + kanjiId;
  const numbers = object.contentDocument.querySelector('[id="' + id + '"]');
  numbers.remove();
}

function countNoTransparent(data) {
  let count = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] != 0) {
      count += 1;
    }
  }
  return count;
}

function getInclusionCount(tegakiImgData, tehonImgData) {
  for (let i = 3; i < tegakiImgData.length; i += 4) {
    if (tehonImgData[i] != 0) {
      tegakiImgData[i] = 0;
    }
  }
  const inclusionCount = countNoTransparent(tegakiImgData);
  return inclusionCount;
}

function getScoringFactor(level) {
  switch (level) {
    case 0:
      return 0.5 ** 2;
    case 1:
      return 0.6 ** 2;
    case 2:
      return 0.7 ** 2;
    case 3:
      return 0.8 ** 2;
    case 4:
      return 0.9 ** 2;
    default:
      return 0.7 ** 2;
  }
}

function calcKakuScore(tegakiCount, tehonCount, inclusionCount) {
  // 線長を優遇し過ぎると ["未","末"], ["土","士"] の見分けができなくなる
  let lineScore = (1 - Math.abs((tehonCount - tegakiCount) / tehonCount));
  if (lineScore > 1) lineScore = 1;
  // 包含率を優遇し過ぎると ["一","つ"], ["二","＝"] の見分けができなくなる
  let inclusionScore = (tegakiCount - inclusionCount) / tegakiCount;
  if (inclusionScore > 1) inclusionScore = 1;
  // 100点が取れないので少しだけ採点を甘くする
  let kakuScore = lineScore * inclusionScore * 100 / getScoringFactor(level);
  if (kakuScore < 0) kakuScore = 0;
  if (kakuScore > 100) kakuScore = 100;
  if (isNaN(kakuScore)) kakuScore = 0;
  return kakuScore;
}

function getKakuScores(tegakiData, object, kanjiId, kakusu) {
  let markerWidth = setStrokeWidth(kakusu) * 109 / canvasSize; // 109 = original svg width/height
  if (canvasSize > 140) markerWidth *= 4; // TODO: 厳格な算出方法
  const promises = new Array(kakusu);
  for (let i = 0; i < kakusu; i++) {
    promises[i] = new Promise((resolve) => {
      if (tegakiData[i]) {
        tegakiData[i].minWidth = markerWidth;
        tegakiData[i].maxWidth = markerWidth;
        const markerCanvas = document.createElement("canvas");
        markerCanvas.setAttribute("width", canvasSize);
        markerCanvas.setAttribute("height", canvasSize);
        const markerContext = markerCanvas.getContext("2d");
        const markerPad = new SignaturePad(markerCanvas, {
          minWidth: markerWidth,
          maxWidth: markerWidth,
          penColor: "black",
        });
        markerPad.fromData([tegakiData[i]]);
        const kakuData =
          markerContext.getImageData(0, 0, canvasSize, canvasSize).data;
        const tegakiCount = countNoTransparent(kakuData);
        getTehonCanvas(object, kanjiId, kakusu, i + 1).then((tehonCanvas) => {
          const tehonImgData = tehonCanvas.getContext("2d").getImageData(
            0,
            0,
            canvasSize,
            canvasSize,
          ).data;
          const tehonCount = countNoTransparent(tehonImgData);

          const inclusionCount = getInclusionCount(kakuData, tehonImgData);
          const kakuScore = calcKakuScore(
            tegakiCount,
            tehonCount,
            inclusionCount,
          );
          resolve([kakuScore, tehonCount]);
        });
      } else {
        getTehonCanvas(object, kanjiId, kakusu, i + 1).then((tehonCanvas) => {
          const tehonImgData = tehonCanvas.getContext("2d").getImageData(
            0,
            0,
            canvasSize,
            canvasSize,
          ).data;
          const tehonCount = countNoTransparent(tehonImgData);
          resolve([0, tehonCount]);
        });
      }
    });
  }
  return promises;
}

function _initSVG(object) {
  const kanjiId = object.dataset.id;
  const kakusu = getKakusu(object, kanjiId);
  toggleStroke(object, kanjiId, kakusu);
  removeNumbers(object, kanjiId);
}

function report() {
  const scores = [];
  const problems = document.getElementById("problems").children;
  for (let i = 0; i < problems.length; i++) {
    const tegakis = problems[i].shadowRoot.querySelector(".tegaki").children;
    for (let j = 0; j < tegakis.length; j++) {
      const score = tegakis[j].shadowRoot.querySelector(".score").textContent;
      scores.push(parseInt(score));
    }
  }
  let score = 0;
  for (let i = 0; i < scores.length; i++) {
    score += scores[i];
  }
  score /= scores.length;
  if (score >= 80) {
    playAudio(correctAllAudio);
    let clearedKanjis = localStorage.getItem("touch-50on");
    if (clearedKanjis) {
      kanjis.split("").forEach((kanji) => {
        if (!clearedKanjis.includes(kanji)) {
          clearedKanjis += kanji;
        }
      });
      localStorage.setItem("touch-50on", clearedKanjis);
    } else {
      localStorage.setItem("touch-50on", kanjis);
    }
    document.getElementById("report").classList.add("d-none");
    document.getElementById("correctReport").classList.remove("d-none");
    setTimeout(() => {
      location.href = "/touch-50on/";
    }, 3000);
  } else {
    playAudio(stupidAudio);
    document.getElementById("report").classList.add("d-none");
    document.getElementById("incorrectReport").classList.remove("d-none");
    setTimeout(function () {
      document.getElementById("report").classList.remove("d-none");
      document.getElementById("incorrectReport").classList.add("d-none");
    }, 6000);
  }
}

// function shuffle(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const r = Math.floor(Math.random() * (i + 1));
//     const tmp = array[i];
//     array[i] = array[r];
//     array[r] = tmp;
//   }
//   return array;
// }

function kanaToHira(str) {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

// function hiraToKana(str) {
//   return str.replace(/[\u3041-\u3096]/g, function (match) {
//     const chr = match.charCodeAt(0) + 0x60;
//     return String.fromCharCode(chr);
//   });
// }

function convHirakana(str) {
  for (let i = 0; i < str.length; i++) {
    if (str[i].test(/[\u3041-\u3096]/)) {
      const chr = str[i].charCodeAt(0) + 0x60;
      str[i] = String.fromCharCode(chr);
    } else if (str[i].test(/[\u30a1-\u30f6]/)) {
      const chr = str[i].charCodeAt(0) - 0x60;
      str[i] = String.fromCharCode(chr);
    }
  }
  return str;
}

let kanjis = "";
let mode = "hirahira";
function initQuery() {
  let problems1, problems2;
  const query = new URLSearchParams(location.search);
  mode = query.get("mode");
  kanjis = query.get("q");
  const problemQuery = query.get("problem");
  if (kanjis) {
    if (mode == "conv") {
      const conved = convHirakana(kanjis);
      problems1 = kanjis.split("");
      problems2 = conved.split("");
    } else {
      problems1 = kanjis.split("");
      problems2 = kanjis.split("");
    }
  } else {
    if (problemQuery == "50on") {
      const hira50on = Array.from("あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよわん");
      const kana50on = Array.from("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨワン");
      if (mode == "hirahira") {
        problems1 = hira50on;
        problems2 = hira50on;
      } else if (mode == "hirakana") {
        problems1 = hira50on;
        problems2 = kana50on;
      } else if (mode == "kanakana") {
        problems1 = kana50on;
        problems2 = kana50on;
      } else {
        problems1 = kana50on;
        problems2 = hira50on;
      }
    } else {
      const hiradakuon = Array.from("がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ");
      const kanadakuon = Array.from("ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ");
      if (mode == "hirahira") {
        problems1 = hiradakuon;
        problems2 = hiradakuon;
      } else if (mode == "hirakana") {
        problems1 = hiradakuon;
        problems2 = kanadakuon;
      } else if (mode == "kanakana") {
        problems1 = kanadakuon;
        problems2 = kanadakuon;
      } else {
        problems1 = kanadakuon;
        problems2 = hiradakuon;
      }
    }
  }
  loadDrill(problems1, problems2);
  document.getElementById("problems").children[0].shadowRoot.querySelector(
    ".guard",
  ).style.height = "0";
}
// https://qiita.com/noraworld/items/2834f2e6f064e6f6d41a
// https://webinlet.com/2020/ios11以降でピンチインアウト拡大縮小禁止
// 手を置いた時の誤爆を防ぎつつスクロールは許可
function scrollEvent(e) {
  if (
    !["MAIN", "PROBLEM-BOX", "A", "BUTTON", "path"].includes(e.target.tagName)
  ) {
    e.preventDefault();
  }
}

initQuery();

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("hint").onclick = toggleHint;
document.getElementById("toggleScroll").onclick = toggleScroll;
document.getElementById("reportButton").onclick = report;
document.addEventListener("click", unlockAudio, {
  once: true,
  useCapture: true,
});

// disable troublesome iOS features
// - double tap zoom
document.ondblclick = (e) => {
  e.preventDefault();
};
