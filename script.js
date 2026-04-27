// ── State ──
let currentInput = '';
let operator = null;
let firstOperand = null;
let justCalculated = false;

const display    = document.getElementById('display');
const historyList = document.getElementById('history-list');
const emojiRain  = document.getElementById('emoji-rain');

// Emojis used for rain effect
const EMOJIS = ['😄','😎','🤩','😂','🥳','😜','🤪','😍','🥰','🤑',
                 '😆','🤣','😝','🥸','😏','🤓','😻','🫶','💥','✨',
                 '⭐','💎','🚀','🎉','🎊','🌟','💫','🔥','🎈'];

// ── Emoji Rain ──
function spawnEmojiBurst(count = 12) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.classList.add('emoji-particle');
      el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

      // Random horizontal position
      el.style.left = Math.random() * 100 + 'vw';

      // Random duration & delay
      const duration = 2 + Math.random() * 3;
      el.style.animationDuration = duration + 's';
      el.style.animationDelay    = Math.random() * 0.6 + 's';
      el.style.fontSize           = (16 + Math.random() * 20) + 'px';

      emojiRain.appendChild(el);

      // Remove after animation
      el.addEventListener('animationend', () => el.remove());
    }, i * 60);
  }
}

// Continuous ambient emojis (slow trickle)
function ambientEmoji() {
  const el = document.createElement('span');
  el.classList.add('emoji-particle');
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  el.style.left = Math.random() * 100 + 'vw';
  const duration = 5 + Math.random() * 5;
  el.style.animationDuration = duration + 's';
  el.style.fontSize = (14 + Math.random() * 16) + 'px';
  emojiRain.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}
setInterval(ambientEmoji, 600);

// ── Display update ──
function updateDisplay(val) {
  display.textContent = val === '' ? '0' : val;
}

// ── Add to history ──
function addHistory(expr, result) {
  const li = document.createElement('li');
  li.textContent = `${expr} = ${result}`;
  historyList.prepend(li);          // newest on top
}

// ── Calculation ──
function calculate(a, op, b) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 ? a / b : 'Error';
  }
}

// ── Button handlers ──
document.querySelectorAll('.btn.num').forEach(btn => {
  btn.addEventListener('click', () => {
    if (justCalculated) { currentInput = ''; justCalculated = false; }
    currentInput += btn.dataset.val;
    updateDisplay(currentInput);
  });
});

document.querySelectorAll('.btn.op').forEach(btn => {
  btn.addEventListener('click', () => {
    spawnEmojiBurst(15);

    if (currentInput === '' && firstOperand !== null) {
      operator = btn.dataset.val;
      return;
    }
    if (firstOperand !== null && currentInput !== '' && operator) {
      const result = calculate(firstOperand, operator, currentInput);
      addHistory(`${firstOperand} ${operator} ${currentInput}`, result);
      firstOperand = result;
      currentInput = '';
      updateDisplay(result);
    } else {
      firstOperand = parseFloat(currentInput) || 0;
      currentInput = '';
    }
    operator = btn.dataset.val;
    justCalculated = false;
  });
});

document.getElementById('equals').addEventListener('click', () => {
  if (operator === null || currentInput === '') return;
  spawnEmojiBurst(22);

  const result = calculate(firstOperand, operator, currentInput);
  addHistory(`${firstOperand} ${operator} ${currentInput}`, result);
  updateDisplay(result);
  currentInput = String(result);
  firstOperand = null;
  operator = null;
  justCalculated = true;
});

document.getElementById('clear').addEventListener('click', () => {
  currentInput = '';
  firstOperand = null;
  operator = null;
  justCalculated = false;
  updateDisplay('0');
  spawnEmojiBurst(8);
});

// ── Keyboard support ──
document.addEventListener('keydown', e => {
  const key = e.key;
  if ('0123456789'.includes(key)) {
    if (justCalculated) { currentInput = ''; justCalculated = false; }
    currentInput += key;
    updateDisplay(currentInput);
  } else if (['+','-','*','/'].includes(key)) {
    document.querySelector(`.btn.op[data-val="${key}"]`)?.click();
  } else if (key === 'Enter' || key === '=') {
    document.getElementById('equals').click();
  } else if (key === 'Escape' || key === 'c' || key === 'C') {
    document.getElementById('clear').click();
  }
});
