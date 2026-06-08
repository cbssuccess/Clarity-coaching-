const PROMPTS = [
  "What is one small thing you can do today to move toward the life you want?",
  "You made it through the hard part. What do you want to build now?",
  "What would you do if you trusted yourself completely?",
  "Name one belief that no longer serves you. What would replace it?",
  "What does clarity feel like in your body? Can you create a little of that right now?",
  "Who were you before the hard season — and who are you becoming?",
  "What is one thing you've been avoiding that actually has the power to free you?",
  "If fear weren't a factor, what would your next step be?",
  "What do you need to hear today that nobody else has said to you?",
  "You are not lost. You are between chapters. What is the title of your next one?",
  "What boundary, if set today, would change everything?",
  "What are you grieving that you haven't given yourself permission to grieve?",
  "What would 'enough' look like — in your work, your relationships, yourself?",
  "What does your gut know that your mind is still arguing with?",
  "Where in your life are you performing instead of living?",
  "What is the version of you that already made it through this doing right now?",
  "What would you tell a dear friend who was exactly where you are?",
  "What are you ready to release to make room for what's coming?",
  "If this season has a lesson, what is it trying to teach you?",
  "What one word do you want to carry with you today?",
];

function getDailyPrompt() {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return PROMPTS[dayIndex % PROMPTS.length];
}

function getRandomPrompt(exclude) {
  const pool = PROMPTS.filter(p => p !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

const affirmationEl = document.getElementById('affirmation-text');
const nextBtn = document.getElementById('next-prompt');
const journalEl = document.getElementById('journal');
const saveBtn = document.getElementById('save-note');
const saveStatus = document.getElementById('save-status');

affirmationEl.textContent = getDailyPrompt();

nextBtn.addEventListener('click', () => {
  const current = affirmationEl.textContent;
  affirmationEl.style.opacity = '0';
  setTimeout(() => {
    affirmationEl.textContent = getRandomPrompt(current);
    affirmationEl.style.transition = 'opacity 0.4s';
    affirmationEl.style.opacity = '1';
  }, 200);
});

chrome.storage.local.get(['journal'], (result) => {
  if (result.journal) journalEl.value = result.journal;
});

saveBtn.addEventListener('click', () => {
  chrome.storage.local.set({ journal: journalEl.value }, () => {
    saveStatus.textContent = 'Saved ✦';
    saveStatus.classList.add('visible');
    setTimeout(() => saveStatus.classList.remove('visible'), 2000);
  });
});

journalEl.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveBtn.click();
  }
});

document.getElementById('book-call').href = 'https://claritywithcaitandscott.com';
