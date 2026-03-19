const board = document.getElementById('game-board');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');

let score = 0;
let gameActive = false;
let isPaused = false;
let gameInterval;

let savedHighScore = localStorage.getItem('brainrotHighScore') || 0;
highScoreEl.innerText = savedHighScore;

const brainrotItems = [
    { emoji: '💀', poin: 1 },
    { emoji: '🔥', poin: 5 },
    { emoji: '🍷', poin: 10 },
    { emoji: '🗿', poin: 20 },
    { emoji: '🤌', poin: 50 },
    { emoji: '🧠', poin: 67 },
    { emoji: '😈', poin: 61239 },
    { emoji: '🤯', poin: -4332 },
    { emoji: '💱', poin: 9999 },
];

function createTarget() {
    if (!gameActive || isPaused) return;
    const target = document.createElement('div');
    target.classList.add('target');
    const data = brainrotItems[Math.floor(Math.random() * brainrotItems.length)];
    target.innerText = data.emoji;
    const x = Math.random() * (board.clientWidth - 50);
    const y = Math.random() * (board.clientHeight - 50);
    target.style.left = x + 'px';
    target.style.top = y + 'px';

    target.onclick = () => {
        if (!isPaused && gameActive) {
            score += data.poin;
            scoreEl.innerText = score;
            target.remove();
        }
    };
    board.appendChild(target);
    setTimeout(() => { if (target.parentNode && !isPaused) target.remove(); }, 1200);
}

function startGame() {
    score = 0;
    scoreEl.innerText = score;
    gameActive = true;
    isPaused = false;
    board.innerHTML = "";
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
    gameInterval = setInterval(createTarget, 800);
}

// NI FUNGSI PAUSE YANG BARU
function togglePause() {
    if (!gameActive) return;
    if (!isPaused) {
        isPaused = true;
        clearInterval(gameInterval);
        pauseBtn.innerText = "Lanjut";
    } else {
        isPaused = false;
        pauseBtn.innerText = "Pause";
        gameInterval = setInterval(createTarget, 800);
    }
}

function stopAndSave() {
    clearInterval(gameInterval);
    gameActive = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;
    if (score > savedHighScore) {
        savedHighScore = score;
        localStorage.setItem('brainrotHighScore', savedHighScore);
        highScoreEl.innerText = savedHighScore;
    }
    board.innerHTML = "";
}

startBtn.onclick = startGame;
pauseBtn.onclick = togglePause;
stopBtn.onclick = stopAndSave;

const shareBtn = document.getElementById('share-btn');

shareBtn.onclick = () => {
    // Peringatan yang kau minta sebiji-sebiji
    alert("saat ini tombol ini tidak bisa dibuka harus tunggu Update selanjutnya!!!");
};