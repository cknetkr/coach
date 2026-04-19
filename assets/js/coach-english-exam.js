function getInitialDictationExamTopicIndex() {
  const raw = Number(new URLSearchParams(window.location.search).get('topic'));
  if (Number.isFinite(raw) && raw >= 0 && raw < DICT_TOPICS.length) return raw;
  return 0;
}

const DICT_EXAM_THEME_STORAGE_KEY = 'dict-exam-theme';

function applyDictationExamTheme(theme) {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  document.body.dataset.theme = nextTheme;
  const toggle = document.getElementById('dict-exam-theme-toggle');
  if (toggle) {
    toggle.textContent = nextTheme === 'light' ? '다크 모드' : '화이트 모드';
  }
  try {
    window.localStorage.setItem(DICT_EXAM_THEME_STORAGE_KEY, nextTheme);
  } catch (error) {
    // Ignore storage failures and keep the in-memory theme.
  }
}

function getInitialDictationExamTheme() {
  try {
    const savedTheme = window.localStorage.getItem(DICT_EXAM_THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
  } catch (error) {
    // Ignore storage failures and fall back to the default theme.
  }
  return 'dark';
}

function bindDictationExamThemeToggle() {
  const toggle = document.getElementById('dict-exam-theme-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    applyDictationExamTheme(document.body.dataset.theme === 'light' ? 'dark' : 'light');
  });
}

function renderDictationExamTopicSelect() {
  const select = document.getElementById('dict-exam-topic-select');
  if (!select) return;
  select.innerHTML = DICT_TOPICS.map((topic, index) => (
    `<option value="${index}">Part ${index + 1} · ${escapeHtml(topic.title)}</option>`
  )).join('');
  select.addEventListener('change', (event) => {
    selectDictTopic(event.target.value);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  dictSentenceModalState.open = true;
  selectedDictLevel = 'low';
  selectedDictBlankMode = 'word';
  bindDictationExamThemeToggle();
  applyDictationExamTheme(getInitialDictationExamTheme());
  renderDictationExamTopicSelect();
  const initialTopicIndex = getInitialDictationExamTopicIndex();
  if (DICT_TOPICS.length) {
    selectDictTopic(initialTopicIndex);
  } else {
    syncDictationSentenceModalHeader();
    syncDictationSentenceModalFontUI();
  }
});
