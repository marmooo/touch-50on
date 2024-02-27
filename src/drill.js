const audioContext = new AudioContext();
const audioBufferCache = {};
loadAudio("stupid", "/touch-50on/mp3/stupid5.mp3");
loadAudio("correct", "/touch-50on/mp3/correct3.mp3");
loadAudio("correctAll", "/touch-50on/mp3/correct1.mp3");
loadAudio("incorrect", "/touch-50on/mp3/incorrect1.mp3");
const kanjivgDir = "/kanjivg";
let prevCanvasSize;
let canvasSize = 140;
let maxWidth = 2;
const repeatCount = 3;
if (globalThis.innerWidth >= 768) {
  canvasSize = 280;
  maxWidth = 4;
}
let level = 2;
let clearCount = 0;
let kanjis = "";
let mode = "hirahira";
let japaneseVoices = [];
loadVoices();
loadConfig();

// function toKanji(kanjiId) {
//   return String.fromCodePoint(parseInt("0x" + kanjiId));
// }

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
  if (localStorage.getItem("hint") == 1) {
    document.getElementById("hint").textContent = "EASY";
  }
  if (localStorage.getItem("touch-50on-level")) {
    level = parseInt(localStorage.getItem("touch-50on-level"));
  }
}

// TODO: :host-context() is not supportted by Safari/Firefox now
function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    document.documentElement.setAttribute("data-bs-theme", "light");
    boxes.forEach((box) => {
      const target = box.shadowRoot.querySelectorAll("object, canvas");
      [...target].forEach((canvas) => {
        canvas.removeAttribute("style");
      });
    });
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.setAttribute("data-bs-theme", "dark");
    boxes.forEach((box) => {
      const target = box.shadowRoot.querySelectorAll("object, canvas");
      [...target].forEach((canvas) => {
        canvas.setAttribute("style", "filter: invert(1) hue-rotate(180deg);");
      });
    });
  }
}

function toggleHint(event) {
  if (localStorage.getItem("hint") == 1) {
    localStorage.setItem("hint", 0);
    event.target.textContent = "HARD";
  } else {
    localStorage.setItem("hint", 1);
    event.target.textContent = "EASY";
  }
  toggleAllStroke();
}

function toggleScroll() {
  const scrollOn = document.getElementById("scrollOn");
  const scrollOff = document.getElementById("scrollOff");
  if (scrollOn.classList.contains("d-none")) {
    document.body.style.overflow = "visible";
    scrollOn.classList.remove("d-none");
    scrollOff.classList.add("d-none");
  } else {
    document.body.style.overflow = "hidden";
    scrollOn.classList.add("d-none");
    scrollOff.classList.remove("d-none");
  }
}

function toggleVoice() {
  const voiceOn = document.getElementById("voiceOn");
  const voiceOff = document.getElementById("voiceOff");
  if (voiceOn.classList.contains("d-none")) {
    voiceOn.classList.remove("d-none");
    voiceOff.classList.add("d-none");
  } else {
    voiceOn.classList.add("d-none");
    voiceOff.classList.remove("d-none");
  }
}

async function playAudio(name, volume) {
  const audioBuffer = await loadAudio(name, audioBufferCache[name]);
  const sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  if (volume) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
    sourceNode.connect(gainNode);
    sourceNode.start();
  } else {
    sourceNode.connect(audioContext.destination);
    sourceNode.start();
  }
}

async function loadAudio(name, url) {
  if (audioBufferCache[name]) return audioBufferCache[name];
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  audioBufferCache[name] = audioBuffer;
  return audioBuffer;
}

function unlockAudio() {
  audioContext.resume();
}

function loadVoices() {
  // https://stackoverflow.com/questions/21513706/
  const allVoicesObtained = new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve(voices);
    } else {
      let supported = false;
      speechSynthesis.addEventListener("voiceschanged", () => {
        supported = true;
        voices = speechSynthesis.getVoices();
        resolve(voices);
      });
      setTimeout(() => {
        if (!supported) {
          document.getElementById("noTTS").classList.remove("d-none");
        }
      }, 1000);
    }
  });
  allVoicesObtained.then((voices) => {
    japaneseVoices = voices.filter((voice) => voice.lang == "ja-JP");
  });
}

function loopVoice(text, n) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.voice = japaneseVoices[Math.floor(Math.random() * japaneseVoices.length)];
  msg.lang = "ja-JP";
  for (let i = 0; i < n; i++) {
    speechSynthesis.speak(msg);
  }
}

function prevTehon(event) {
  const object = event.target.getRootNode().querySelector(".tehon");
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

function nextTehon(event) {
  const object = event.target.getRootNode().querySelector(".tehon");
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

class ProblemBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [globalCSS];

    const template = document.getElementById("problem-box")
      .content.cloneNode(true);
    this.shadowRoot.appendChild(template);
  }
}
customElements.define("problem-box", ProblemBox);

class TehonBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [globalCSS];

    const template = document.getElementById("tehon-box")
      .content.cloneNode(true);
    if (globalThis.innerWidth >= 768) {
      const canvases = template.querySelectorAll("canvas");
      [...canvases].forEach((canvas) => {
        canvas.setAttribute("width", canvasSize);
        canvas.setAttribute("height", canvasSize);
      });
    }
    template.querySelector(".prevTehon").onclick = prevTehon;
    template.querySelector(".nextTehon").onclick = nextTehon;
    this.shadowRoot.appendChild(template);

    if (document.documentElement.getAttribute("data-bs-theme") == "dark") {
      const target = this.shadowRoot.querySelectorAll("object, canvas");
      [...target].forEach((canvas) => {
        canvas.setAttribute("style", "filter: invert(1) hue-rotate(180deg);");
      });
    }
  }
}
customElements.define("tehon-box", TehonBox);

class TegakiBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [globalCSS];

    const template = document.getElementById("tegaki-box")
      .content.cloneNode(true);
    if (globalThis.innerWidth >= 768) {
      const canvases = template.querySelectorAll("canvas");
      [...canvases].forEach((canvas) => {
        canvas.setAttribute("width", canvasSize);
        canvas.setAttribute("height", canvasSize);
      });
    }
    this.shadowRoot.appendChild(template);

    if (document.documentElement.getAttribute("data-bs-theme") == "dark") {
      const target = this.shadowRoot.querySelectorAll("object, canvas");
      [...target].forEach((canvas) => {
        canvas.setAttribute("style", "filter: invert(1) hue-rotate(180deg);");
      });
    }
  }
}
customElements.define("tegaki-box", TegakiBox);

function getKakusu(object, kanjiId) {
  let max = 1;
  while (true) {
    const path = object.contentDocument
      .getElementById("kvg:" + kanjiId + "-s" + max);
    if (path) {
      max += 1;
    } else {
      break;
    }
  }
  return max - 1;
}

function getTehonCanvas(object, kanjiId, kakusu, kakuNo) {
  return new Promise((resolve) => {
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
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext("2d", { alpha: false });
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
    box = new TegakiBox();
  } else {
    box = new TehonBox();
  }
  boxes.push(box);
  const object = box.shadowRoot.querySelector("object");
  object.setAttribute("data", kanjivgDir + "/" + kanjiId + ".svg");
  object.setAttribute("data-id", kanjiId);
  object.setAttribute("data-pos", pos);
  if (loadCanvas) {
    object.onload = initSVG;
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
    playAudio("correct", 0.3);
  } else {
    playAudio("incorrect", 0.3);
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
      const tehonKanji = tehonPanel.children[pos]
        .shadowRoot.querySelector("object");
      const scoreObj = tegakiPanel.children[pos]
        .shadowRoot.querySelector(".score");
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
  scoring.addEventListener("click", () => {
    getProblemScores(tegakiPanel, tehonPanel, objects, tegakiPads).then(
      (scores) => {
        if (scores.every((score) => score >= 80)) {
          clearCount += 1;
          problemBox.shadowRoot.querySelector(".guard").style.height = "100%";
          const next = problemBox.nextElementSibling;
          if (next) {
            const voiceOff = document.getElementById("voiceOn")
              .classList.contains("d-none");
            if (!voiceOff) {
              loopVoice(kanjis[clearCount].toLowerCase(), repeatCount);
            }
            next.shadowRoot.querySelector(".guard").style.height = "0";
            const headerHeight = document.getElementById("header").offsetHeight;
            const top = next.getBoundingClientRect().top +
              document.documentElement.scrollTop - headerHeight;
            globalThis.scrollTo({ top: top, behavior: "smooth" });
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
  const eraser = tehonPanel.children[kanjiPos]
    .shadowRoot.querySelector(".eraser");
  eraser.onclick = () => {
    const data = tegakiPad.toData();
    if (data) {
      tegakiPad.clear();
    }
    const pos = parseInt(object.dataset.pos);
    const scoreObj = tegakiPanel.children[pos]
      .shadowRoot.querySelector(".score");
    scoreObj.classList.add("d-none");
    if (localStorage.getItem("hint") != 1) {
      changeAllColor(object, kanjiId, "none");
    }
  };
}

function setSound(tehonPanel, object, text) {
  const pos = parseInt(object.dataset.pos);
  const sound = tehonPanel.children[pos].shadowRoot.querySelector(".sound");
  let hira = kanaToHira(text);
  sound.onclick = () => {
    if (hira == "ん") hira = "んん";
    loopVoice(hira.toLowerCase(), repeatCount);
  };
}

function loadProblem(problem, answer) {
  const problemBox = new ProblemBox();
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
  globalThis.addEventListener("resize", () => {
    prevCanvasSize = canvasSize;
    if (globalThis.innerWidth >= 768) {
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
  });
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
  let lineScore = 1 - Math.abs((tehonCount - tegakiCount) / tehonCount);
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
        const markerContext = markerCanvas.getContext("2d", { alpha: false });
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
          const tehonImgData = tehonCanvas
            .getContext("2d", { alpha: false })
            .getImageData(0, 0, canvasSize, canvasSize).data;
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
          const tehonImgData = tehonCanvas
            .getContext("2d", { alpha: false })
            .getImageData(0, 0, canvasSize, canvasSize).data;
          const tehonCount = countNoTransparent(tehonImgData);
          resolve([0, tehonCount]);
        });
      }
    });
  }
  return promises;
}

function initSVG(event) {
  const object = event.target;
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
    playAudio("correctAll");
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
    playAudio("stupid");
    document.getElementById("report").classList.add("d-none");
    document.getElementById("incorrectReport").classList.remove("d-none");
    setTimeout(() => {
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
  return str.replace(/[ァ-ヶ]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

// function hiraToKana(str) {
//   return str.replace(/[ぁ-ゖ]/g, (match) => {
//     const chr = match.charCodeAt(0) + 0x60;
//     return String.fromCharCode(chr);
//   });
// }

function convHirakana(str) {
  for (let i = 0; i < str.length; i++) {
    if (str[i].test(/[ぁ-ゖ]/)) {
      const chr = str[i].charCodeAt(0) + 0x60;
      str[i] = String.fromCharCode(chr);
    } else if (str[i].test(/[ァ-ヶ]/)) {
      const chr = str[i].charCodeAt(0) - 0x60;
      str[i] = String.fromCharCode(chr);
    }
  }
  return str;
}

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
      const hira50on = Array.from(
        "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよわん",
      );
      const kana50on = Array.from(
        "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨワン",
      );
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
      kanjis = hira50on;
    } else {
      const hiradakuon = Array.from(
        "がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ",
      );
      const kanadakuon = Array.from(
        "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ",
      );
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
      kanjis = hiradakuon;
    }
  }
  loadDrill(problems1, problems2);
  document.getElementById("problems").children[0]
    .shadowRoot.querySelector(".guard").style.height = "0";
}

function getGlobalCSS() {
  let cssText = "";
  for (const stylesheet of document.styleSheets) {
    for (const rule of stylesheet.cssRules) {
      cssText += rule.cssText;
    }
  }
  const css = new CSSStyleSheet();
  css.replaceSync(cssText);
  return css;
}

const boxes = [];
const globalCSS = getGlobalCSS();
initQuery();

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("hint").onclick = toggleHint;
document.getElementById("toggleScroll").onclick = toggleScroll;
document.getElementById("toggleVoice").onclick = toggleVoice;
document.getElementById("reportButton").onclick = report;
document.addEventListener("click", unlockAudio, {
  once: true,
  useCapture: true,
});
