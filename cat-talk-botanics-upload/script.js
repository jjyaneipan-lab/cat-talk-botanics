const cats = {
  white: {
    label: "white",
    flower: "daisy",
    detail: "Daisy likes quiet sentences and soft yellow centers.",
    statuses: {
      idle: [
        "the white cat is listening politely.",
        "the white cat blinked like it knows something.",
        "small daisies appeared. suspiciously wholesome."
      ],
      typing: [
        "the white cat follows every soft little word.",
        "the white cat has accepted this sentence.",
        "a quiet bloom is taking notes."
      ],
      sleepy: "the white cat folded itself into a peaceful pause.",
      concerned: "the white cat is concerned, but gracefully."
    }
  },
  black: {
    label: "black",
    flower: "calla",
    detail: "Calla Lily likes dramatic pauses and deep plum shadows.",
    statuses: {
      idle: [
        "the black cat is listening in silence.",
        "the black cat has formed an opinion.",
        "a calla lily opened. very theatrical."
      ],
      typing: [
        "the black cat permits the drama to continue.",
        "the black cat heard that and chose elegance.",
        "a calla lily curls around the paragraph."
      ],
      sleepy: "the black cat rests like a velvet secret.",
      concerned: "the black cat is concerned, with excellent posture."
    }
  },
  tabby: {
    label: "tabby",
    flower: "tiger",
    detail: "Tiger Lily is a gray tabby who likes curious, crooked paths.",
    statuses: {
      idle: [
        "the tabby is investigating your sentence.",
        "the tabby found a pattern in the mess.",
        "tiger lilies are growing in several questionable directions."
      ],
      typing: [
        "the tabby is tracking a clue through the commas.",
        "the tabby suspects the next word matters.",
        "a tiger lily has entered the evidence."
      ],
      sleepy: "the tabby paused mid-investigation.",
      concerned: "the tabby found three punctuation marks and filed a report."
    }
  },
  orange: {
    label: "orange",
    flower: "sunflower",
    detail: "Sunflower likes marigold noise and cheerful disorder.",
    statuses: {
      idle: [
        "the orange cat has no plan.",
        "the orange cat typed something by accident.",
        "sunflowers appeared with unjustified confidence."
      ],
      typing: [
        "the orange cat supports this with pure momentum.",
        "the orange cat has escalated the sentence.",
        "marigolds arrived before being asked."
      ],
      sleepy: "the orange cat abruptly remembered naps exist.",
      concerned: "the orange cat is concerned, somehow loudly."
    }
  },
  tuxedo: {
    label: "tuxedo",
    flower: "anemone",
    detail: "Anemone likes formal little blooms and careful punctuation.",
    statuses: {
      idle: [
        "the tuxedo cat is taking minutes.",
        "the tuxedo cat requests better punctuation.",
        "anemones appeared. overdressed, naturally."
      ],
      typing: [
        "the tuxedo cat records this for the archive.",
        "the tuxedo cat straightened a tiny cuff.",
        "ranunculus blooms are attending formally."
      ],
      sleepy: "the tuxedo cat adjourned for a tasteful pause.",
      concerned: "the tuxedo cat objects to the punctuation."
    }
  }
};

const catStage = document.querySelector(".cat-stage");
const catOptions = document.querySelectorAll(".cat-option");
const statusLine = document.querySelector("#status");
const textArea = document.querySelector("#writing");
const pulse = document.querySelector(".typing-pulse");
const garden = document.querySelector(".garden");
const notes = document.querySelector(".notes");
const clearButton = document.querySelector(".clear-button");
const companionDetail = document.querySelector("#companion-detail");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const noteCount = document.querySelector(".note-count");
const notesEmpty = document.querySelector(".notes-empty");
const notesStorageKey = `cat-talk-botanics-notes-${new Date().toISOString().slice(0, 10)}`;

let selectedCat = "white";
let pauseTimer = null;
let mouthTimer = null;
let nonSpaceCount = 0;
let nextFlowerAt = 20;
let hasStartedGarden = false;

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function setStatus(message) {
  statusLine.textContent = message;
}

function setCat(catName) {
  const previousCat = selectedCat;
  selectedCat = catName;
  catStage.className = `cat-stage cat-${catName}`;
  setStatus(randomItem(cats[catName].statuses.idle));
  companionDetail.textContent = cats[catName].detail;

  catOptions.forEach((option) => {
    const isSelected = option.dataset.cat === catName;
    option.classList.toggle("is-selected", isSelected);
    option.setAttribute("aria-checked", String(isSelected));
  });

  if (previousCat !== catName && (hasStartedGarden || nonSpaceCount > 0)) {
    addFlower();
  }
}

function wakeCat() {
  catStage.classList.remove("is-sleepy");
}

function showTypingReaction() {
  clearTimeout(mouthTimer);
  catStage.classList.add("is-talking");
  pulse.classList.remove("is-visible");
  void pulse.offsetWidth;
  pulse.classList.add("is-visible");

  mouthTimer = setTimeout(() => {
    catStage.classList.remove("is-talking");
  }, 220);
}

function startPauseTimer() {
  clearTimeout(pauseTimer);
  pauseTimer = setTimeout(() => {
    catStage.classList.remove("is-concerned", "is-talking");
    catStage.classList.add("is-sleepy");
    setStatus(cats[selectedCat].statuses.sleepy);
  }, 3000);
}

function checkConcern(text) {
  if (/[!?]{3,}$/.test(text.trim())) {
    catStage.classList.add("is-concerned");
    setStatus(cats[selectedCat].statuses.concerned);
    return true;
  }

  catStage.classList.remove("is-concerned");
  return false;
}

function updateFlowerProgress() {
  const currentCount = textArea.value.replace(/\s/g, "").length;
  nonSpaceCount = currentCount;

  while (nonSpaceCount >= nextFlowerAt) {
    addFlower();
    nextFlowerAt += 20;
  }
}

function addFlower() {
  const cat = cats[selectedCat];
  const flower = document.createElement("span");
  flower.className = `flower ${cat.flower}`;

  const x = 12 + Math.random() * 76;
  const bottom = 34 + Math.random() * 190;
  const scale = 0.75 + Math.random() * 0.75;
  const depth = bottom > 150 ? 1 : 2;

  flower.style.setProperty("--x", `${x}%`);
  flower.style.setProperty("--bottom", `${bottom}px`);
  flower.style.setProperty("--scale", scale.toFixed(2));
  flower.style.setProperty("--depth", depth);

  garden.appendChild(flower);
  hasStartedGarden = true;

  while (garden.querySelectorAll(".flower").length > 40) {
    garden.querySelector(".flower").remove();
  }
}

function dropPetal() {
  const petal = document.createElement("span");
  petal.className = "falling-petal";
  petal.style.setProperty("--x", `${8 + Math.random() * 84}%`);
  garden.appendChild(petal);
  setTimeout(() => petal.remove(), 1300);
}

function latestLine() {
  const lines = textArea.value.split(/\n/).map((line) => line.trim()).filter(Boolean);
  return lines.at(-1) || "";
}

function saveNote() {
  const line = latestLine();
  if (!line) return;

  const now = new Date();
  addNote({
    text: line,
    iso: now.toISOString()
  });
  persistNotes();
}

function addNote(noteData) {
  const noteTime = new Date(noteData.iso);
  const dateTime = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(noteTime);
  const note = document.createElement("article");
  note.className = "note";
  note.innerHTML = `<time class="note-time" datetime="${noteData.iso}"></time><div class="note-text"></div>`;
  note.querySelector(".note-time").textContent = dateTime;
  note.querySelector(".note-text").textContent = noteData.text;
  notes.prepend(note);

  while (notes.children.length > 20) {
    notes.lastElementChild.remove();
  }

  updateNoteState();
}

function persistNotes() {
  const savedNotes = Array.from(notes.children).map((note) => ({
    iso: note.querySelector(".note-time").dateTime,
    text: note.querySelector(".note-text").textContent
  })).reverse();

  localStorage.setItem(notesStorageKey, JSON.stringify(savedNotes));
}

function loadNotesForToday() {
  const savedNotes = JSON.parse(localStorage.getItem(notesStorageKey) || "[]");
  savedNotes.forEach(addNote);
}

function updateNoteState() {
  const count = notes.children.length;
  noteCount.textContent = String(count);
  notesEmpty.hidden = count > 0;
}

function showPanel(panelName) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.panel === panelName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  tabPanels.forEach((panel) => {
    panel.hidden = panel.id !== `${panelName}-panel`;
    panel.classList.toggle("is-active", !panel.hidden);
  });
}

catOptions.forEach((option) => {
  option.addEventListener("click", () => setCat(option.dataset.cat));
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.panel));
});

textArea.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    saveNote();
    textArea.value = `${textArea.value}\n`;
    startPauseTimer();
    return;
  }

  if (event.key === "Backspace") {
    dropPetal();
  }
});

textArea.addEventListener("input", () => {
  wakeCat();
  showTypingReaction();
  updateFlowerProgress();

  if (!checkConcern(textArea.value)) {
    setStatus(randomItem(cats[selectedCat].statuses.typing));
  }

  startPauseTimer();
});

clearButton.addEventListener("click", () => {
  textArea.value = "";
  garden.innerHTML = "";
  nonSpaceCount = 0;
  nextFlowerAt = 20;
  hasStartedGarden = false;
  catStage.classList.remove("is-sleepy", "is-concerned", "is-talking");
  setStatus(randomItem(cats[selectedCat].statuses.idle));
  textArea.focus();
});

setCat(selectedCat);
loadNotesForToday();
updateNoteState();
