/* ==========================================================
   PIRATES OF SILICON VALLEY — MAIN GAME ENGINE
   State machine, input handling, game loop
   ========================================================== */

'use strict';

/* ---- Game States ---- */
const GS = {
  TITLE:         'TITLE',
  STORY:         'STORY',
  LEVEL_INTRO:   'LEVEL_INTRO',
  QUIZ:          'QUIZ',
  QUIZ_FEEDBACK: 'QUIZ_FEEDBACK',
  ACTION_INTRO:  'ACTION_INTRO',
  ACTION:        'ACTION',
  ACTION_RESULT: 'ACTION_RESULT',
  LEVEL_COMPLETE:'LEVEL_COMPLETE',
  GAME_OVER:     'GAME_OVER',
  VICTORY:       'VICTORY'
};

/* ---- Game Object ---- */
const Game = (() => {

  /* ===== State ===== */
  let canvas, state, frame;
  let levelIndex, questionIndex;
  let lives, score, levelScore;
  let mgScore, mgPassed;
  let storyPage;
  let feedbackTimer;
  let answerButtons;

  /* ===== Init ===== */
  function init() {
    canvas = document.getElementById('gameCanvas');
    answerButtons = document.getElementById('answerButtons');

    R.init(canvas);
    Audio.init();

    // Scale canvas responsively
    scaleCanvas();
    window.addEventListener('resize', scaleCanvas);

    // Input handlers
    window.addEventListener('keydown', onKey);
    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('touchend', onTouch, { passive: false });

    reset();
    setState(GS.TITLE);
    loop();
  }

  function scaleCanvas() {
    const maxW = Math.min(window.innerWidth - 8, 800);
    const scale = maxW / 800;
    canvas.style.width  = `${800 * scale}px`;
    canvas.style.height = `${600 * scale}px`;
  }

  /* ===== Full reset ===== */
  function reset() {
    levelIndex     = 0;
    questionIndex  = 0;
    lives          = 3;
    score          = 0;
    levelScore     = 0;
    mgScore        = 0;
    mgPassed       = false;
    storyPage      = 0;
    frame          = 0;
    clearTimeout(feedbackTimer);
    hideAnswerButtons();
  }

  /* ===== State transitions ===== */
  function setState(newState) {
    state = newState;
    frame = 0;
    hideAnswerButtons();
    MiniGameRunner.stop();

    switch (state) {
      case GS.TITLE:
        Audio.playPowerUp();
        break;

      case GS.QUIZ:
        showAnswerButtons();
        break;

      case GS.ACTION:
        MiniGameRunner.start(canvas, LEVELS[levelIndex], (s, passed) => {
          mgScore = s;
          mgPassed = passed;
          setState(GS.ACTION_RESULT);
          if (passed) Audio.playLevelComplete();
          else Audio.playWrong();
        });
        break;

      case GS.LEVEL_COMPLETE:
        levelScore += mgScore + lives * 100;
        score += levelScore;
        Audio.playLevelComplete();
        break;

      case GS.GAME_OVER:
        Audio.playGameOver();
        break;

      case GS.VICTORY:
        Audio.playVictory();
        break;
    }
  }

  /* ===== Main loop ===== */
  function loop() {
    frame++;
    render();
    requestAnimationFrame(loop);
  }

  /* ===== Render dispatch ===== */
  function render() {
    switch (state) {
      case GS.TITLE:
        R.drawTitle(frame);
        break;
      case GS.STORY:
        R.drawStory(frame, storyPage);
        break;
      case GS.LEVEL_INTRO:
        R.drawLevelIntro(LEVELS[levelIndex], frame);
        break;
      case GS.QUIZ:
      case GS.QUIZ_FEEDBACK:
        renderQuiz();
        break;
      case GS.ACTION_INTRO:
        R.drawActionIntro(LEVELS[levelIndex], frame);
        break;
      case GS.ACTION:
        // Mini-game renders itself to canvas
        break;
      case GS.ACTION_RESULT:
        R.drawActionResult(LEVELS[levelIndex], mgScore, mgPassed, frame);
        break;
      case GS.LEVEL_COMPLETE:
        R.drawLevelComplete(LEVELS[levelIndex], levelScore - mgScore - lives * 100, mgScore, levelScore, lives, frame);
        break;
      case GS.GAME_OVER:
        R.drawGameOver(score, frame);
        break;
      case GS.VICTORY:
        R.drawVictory(score, frame);
        break;
    }
  }

  function renderQuiz() {
    const level    = LEVELS[levelIndex];
    const questions = getQuestionsForLevel(levelIndex);
    const question  = questions[questionIndex];
    const feedback  = state === GS.QUIZ_FEEDBACK ? (lastAnswer === question.ans ? 'correct' : 'wrong') : null;
    R.drawQuiz(level, question, questionIndex, lives, score, frame, lastAnswer, feedback);
  }

  /* ===== Input ===== */
  let lastAnswer = -1;

  function advance() {
    Audio.resume();
    Audio.playMenuBlip();
    switch (state) {
      case GS.TITLE:
        storyPage = 0;
        setState(GS.STORY);
        break;
      case GS.STORY:
        storyPage++;
        if (storyPage >= 3) {
          levelIndex = 0; questionIndex = 0;
          lives = 3; score = 0; levelScore = 0;
          setState(GS.LEVEL_INTRO);
          Audio.playLevelStart();
        }
        break;
      case GS.LEVEL_INTRO:
        questionIndex = 0;
        levelScore = 0;
        setState(GS.QUIZ);
        break;
      case GS.QUIZ_FEEDBACK:
        nextQuestion();
        break;
      case GS.ACTION_INTRO:
        setState(GS.ACTION);
        break;
      case GS.ACTION_RESULT:
        setState(GS.LEVEL_COMPLETE);
        break;
      case GS.LEVEL_COMPLETE:
        nextLevel();
        break;
      case GS.GAME_OVER:
        reset();
        setState(GS.TITLE);
        break;
      case GS.VICTORY:
        reset();
        setState(GS.TITLE);
        break;
    }
  }

  function nextQuestion() {
    questionIndex++;
    const questions = getQuestionsForLevel(levelIndex);
    if (questionIndex >= questions.length) {
      // Quiz complete — go to action intro
      hideAnswerButtons();
      setState(GS.ACTION_INTRO);
    } else {
      setState(GS.QUIZ);
      showAnswerButtons();
    }
  }

  function nextLevel() {
    levelIndex++;
    if (levelIndex >= LEVELS.length) {
      setState(GS.VICTORY);
    } else {
      questionIndex = 0;
      levelScore    = 0;
      lives         = Math.min(3, lives + 1); // restore 1 life per level
      setState(GS.LEVEL_INTRO);
      Audio.playLevelStart();
    }
  }

  function selectAnswer(idx) {
    if (state !== GS.QUIZ) return;
    Audio.resume();
    const questions = getQuestionsForLevel(levelIndex);
    const question  = questions[questionIndex];
    lastAnswer = idx;

    if (idx === question.ans) {
      // Correct
      const points = 100 + Math.floor(Math.random() * 50);
      levelScore += points;
      score += points;
      Audio.playCorrect();
    } else {
      // Wrong
      lives--;
      Audio.playWrong();
      if (lives <= 0) {
        // Game over
        hideAnswerButtons();
        clearTimeout(feedbackTimer);
        setTimeout(() => setState(GS.GAME_OVER), 1200);
        state = GS.QUIZ_FEEDBACK;
        return;
      }
    }

    state = GS.QUIZ_FEEDBACK;
    hideAnswerButtons();
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
      nextQuestion();
    }, 2000);
  }

  /* ===== Keyboard ===== */
  function onKey(e) {
    if (state === GS.ACTION) return; // mini-game handles its own input
    const key = e.key;
    if (['1','2','3','4'].includes(key)) {
      selectAnswer(parseInt(key) - 1);
      return;
    }
    if (key === 'Enter' || key === ' ') {
      advance();
    }
  }

  /* ===== Mouse click on canvas ===== */
  function onCanvasClick(e) {
    if (state === GS.ACTION) return;
    if (state === GS.QUIZ) {
      // Check if click is on answer area
      const rect2 = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect2.width;
      const scaleY = canvas.height / rect2.height;
      const mx = (e.clientX - rect2.left) * scaleX;
      const my = (e.clientY - rect2.top) * scaleY;
      // Answer options start at y=230, each 70px tall
      for (let i = 0; i < 4; i++) {
        const by = 230 + i * 70;
        if (mx >= 30 && mx <= 770 && my >= by && my <= by + 62) {
          selectAnswer(i);
          return;
        }
      }
    } else {
      advance();
    }
  }

  function onTouch(e) {
    if (state === GS.ACTION) return;
    e.preventDefault();
    const t = e.changedTouches[0];
    const rect2 = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect2.width;
    const scaleY = canvas.height / rect2.height;
    const mx = (t.clientX - rect2.left) * scaleX;
    const my = (t.clientY - rect2.top) * scaleY;

    if (state === GS.QUIZ) {
      for (let i = 0; i < 4; i++) {
        const by = 230 + i * 70;
        if (mx >= 30 && mx <= 770 && my >= by && my <= by + 62) {
          selectAnswer(i);
          return;
        }
      }
    } else {
      advance();
    }
  }

  /* ===== HTML Answer Buttons ===== */
  function showAnswerButtons() {
    if (state !== GS.QUIZ) return;
    const questions = getQuestionsForLevel(levelIndex);
    if (!questions || questionIndex >= questions.length) return;
    const question = questions[questionIndex];

    // We draw answers on canvas, so we only need the HTML buttons
    // for reliable touch support — keep them hidden/transparent as an overlay
    answerButtons.innerHTML = '';
    question.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'ans-btn';
      btn.textContent = `${i + 1}.  ${opt}`;
      btn.addEventListener('click', () => selectAnswer(i));
      answerButtons.appendChild(btn);
    });
    answerButtons.style.display = 'none'; // answers drawn on canvas; HTML buttons as backup
  }

  function hideAnswerButtons() {
    if (answerButtons) {
      answerButtons.style.display = 'none';
      answerButtons.innerHTML = '';
    }
  }

  return { init };
})();

/* ===== Boot ===== */
window.addEventListener('load', () => {
  // Small delay to ensure fonts are loaded
  setTimeout(() => Game.init(), 100);
});
