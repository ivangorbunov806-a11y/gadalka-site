const VK_URL = "https://vk.com/id1043709760";

const THEMES = ["Любовь", "Деньги", "Удача", "Ближайшее будущее"];
const CARDS = [
  "Луна перемен",
  "Золотой знак",
  "Тихий путь",
  "Огонь решения",
  "Зеркало судьбы",
  "Карта силы",
];

const RESULTS = {
  Любовь: {
    "Луна перемен": "Твоё сердце готово к обновлению: в отношениях наступает мягкий, но важный поворот.",
    "Золотой знак": "Скоро появится человек, который даст тёплый и честный отклик на твои чувства.",
    "Тихий путь": "Судьба советует не спешить: спокойствие сейчас приведёт к гармоничному союзу.",
    "Огонь решения": "Время для откровенного разговора — именно он очистит путь для любви.",
    "Зеркало судьбы": "Ты притягиваешь ту любовь, которую излучаешь сам(а). Покажи миру свою искренность.",
    "Карта силы": "Внутренняя уверенность усилит твою привлекательность и поможет сделать верный выбор.",
  },
  Деньги: {
    "Луна перемен": "Финансовая ситуация начнёт меняться, если решишься на новый подход в делах.",
    "Золотой знак": "Знак изобилия: возможен приятный денежный шанс в ближайшие недели.",
    "Тихий путь": "Постепенный рост окажется устойчивее, чем рискованные шаги. Действуй размеренно.",
    "Огонь решения": "Смелое, но продуманное решение в деньгах даст заметный результат.",
    "Зеркало судьбы": "Твои убеждения о деньгах формируют поток. Перестрой фокус на возможности.",
    "Карта силы": "В тебе достаточно ресурса, чтобы усилить доход через личные навыки.",
  },
  Удача: {
    "Луна перемен": "Полоса удачи начинается с маленького знака — обрати внимание на совпадения.",
    "Золотой знак": "Фортуна благоволит: смело принимай приглашения и новые знакомства.",
    "Тихий путь": "Твоя удача тихая: она приходит в правильных решениях, а не в шумных событиях.",
    "Огонь решения": "Удачный поворот ждёт там, где ты наконец-то выберешь действие.",
    "Зеркало судьбы": "Чем яснее твоё намерение, тем быстрее мир отвечает благоприятными шансами.",
    "Карта силы": "Ты в сильной позиции: используй энергию момента для старта важного дела.",
  },
  "Ближайшее будущее": {
    "Луна перемен": "Ближайшие дни принесут неожиданную, но полезную перемену в привычном ритме.",
    "Золотой знак": "Скоро получишь знак, подтверждающий, что движешься в верном направлении.",
    "Тихий путь": "События будут разворачиваться мягко, открывая путь без резких поворотов.",
    "Огонь решения": "Твоё ближайшее будущее связано с выбором, который нельзя откладывать.",
    "Зеркало судьбы": "Ты увидишь отражение своих мыслей в событиях: держи фокус на хорошем.",
    "Карта силы": "Впереди период, где твоя решительность станет главным ключом к успеху.",
  },
};

const PROCESS_LINES = [
  "Считываем вибрации твоего выбора.",
  "Сопоставляем знаки и символы.",
  "Открываем тайную подсказку судьбы...",
];

const state = {
  theme: "",
  card: "",
};

const screenEls = [...document.querySelectorAll(".screen")];
const themeGrid = document.getElementById("theme-grid");
const cardGrid = document.getElementById("card-grid");
const processText = document.getElementById("process-text");
const resultTopic = document.getElementById("result-topic");
const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const vkLink = document.getElementById("vk-link");

function trackEvent(eventName, payload = {}) {
  window.dataLayer = window.dataLayer || [];
  const event = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...payload,
  };
  window.dataLayer.push(event);
  console.log("[analytics]", event);
}

function showScreen(name) {
  screenEls.forEach((el) => el.classList.toggle("screen--active", el.dataset.screen === name));
}

function buildThemeButtons() {
  themeGrid.innerHTML = "";
  THEMES.forEach((theme) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = theme;
    btn.onclick = () => onThemeSelected(theme);
    themeGrid.appendChild(btn);
  });
}

function buildCardButtons() {
  cardGrid.innerHTML = "";
  cardGrid.classList.remove("card-grid--card-picked");
  const deck = [...CARDS].sort(() => Math.random() - 0.5).slice(0, 6);

  deck.forEach((card) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn tarot-card";
    btn.innerHTML = `
      <span class="tarot-card__frame" aria-hidden="true">✶</span>
      <span class="tarot-card__name">${card}</span>
      <span class="tarot-card__sigil" aria-hidden="true">☽ ✦ ☉</span>
    `;
    btn.onclick = () => onCardSelected(card);
    cardGrid.appendChild(btn);
  });
}

function onThemeSelected(theme) {
  state.theme = theme;
  state.card = "";
  trackEvent("theme_selected", { theme });
  buildCardButtons();
  showScreen("cards");
}

function onCardSelected(card) {
  if (state.card) {
    return;
  }

  state.card = card;
  trackEvent("card_selected", { theme: state.theme, card });

  const cardButtons = [...cardGrid.querySelectorAll(".tarot-card")];
  cardGrid.classList.add("card-grid--card-picked");
  cardButtons.forEach((btn) => {
    const isChosen = btn.querySelector(".tarot-card__name")?.textContent === card;
    btn.classList.toggle("tarot-card--selected", isChosen);
    btn.setAttribute("aria-pressed", String(isChosen));
    btn.disabled = true;
  });

  setTimeout(() => {
    showScreen("process");

    let lineIndex = 0;
    const interval = setInterval(() => {
      lineIndex = (lineIndex + 1) % PROCESS_LINES.length;
      processText.textContent = PROCESS_LINES[lineIndex];
    }, 680);

    setTimeout(() => {
      clearInterval(interval);
      showResult();
    }, 2200);
  }, 340);
}

function showResult() {
  const message = RESULTS[state.theme][state.card];
  resultTopic.textContent = `Тема: ${state.theme}`;
  resultTitle.textContent = state.card;
  resultMessage.textContent = message;

  showScreen("result");
  trackEvent("result_shown", {
    theme: state.theme,
    card: state.card,
    result: message,
  });
}

document.querySelector('[data-action="start"]').addEventListener("click", () => {
  trackEvent("start_click");
  showScreen("theme");
});

document.querySelector('[data-action="to-final"]').addEventListener("click", () => {
  showScreen("final");
});

vkLink.addEventListener("click", () => {
  trackEvent("vk_click", { url: vkLink.href });
});

vkLink.href = VK_URL;

buildThemeButtons();
trackEvent("site_opened");
