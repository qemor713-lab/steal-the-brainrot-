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

// Daftar item dengan poin masing-masing
const brainrotItems = [
    { emoji: '💀', poin: 1 },
    { emoji: '🔥', poin: 5 },
    { emoji: '🍷', poin: 10 },
    { emoji: '🗿', poin: 20 },
    { emoji: '🤌', poin: 50 },
    { emoji: '🧠', poin: 67 },
];

// Load Rekor Tertinggi dari memori browser
let savedHighScore = localStorage.getItem('brainrotHighScore') || 0;
highScoreEl.innerText = savedHighScore;

function createTarget() {
    if (!gameActive || isPaused) return;

    const target = document.createElement('div');
    target.classList.add('target');

    // Pilih data acak (emoji + poin)
    const randomData = brainrotItems[Math.floor(Math.random() * brainrotItems.length)];
    target.innerText = randomData.emoji;

    // Hitung posisi acak
    const x = Math.random() * (board.clientWidth - 55);
    const y = Math.random() * (board.clientHeight - 55);
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    // Klik untuk dapat poin
    target.onclick = () => {
        if (!isPaused) {
            score += randomData.poin;
            scoreEl.innerText = score;
            target.remove();
        }
    };

    board.appendChild(target);

    // Hilang sendiri jika tidak diklik
    setTimeout(() => {
        if (target.parentNode && !isPaused) {
            target.remove();
        }
    }, 1100);
}

function startGame() {
    score = 0;
    gameActive = true;
    isPaused = false;
    scoreEl.innerText = score;
    board.innerHTML = "";
    board.style.opacity = "1";
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
    pauseBtn.innerText = "Pause";

    gameInterval = setInterval(createTarget, 800);
}

function togglePause() {
    if (!gameActive) return;

    if (!isPaused) {
        isPaused = true;
        clearInterval(gameInterval);
        pauseBtn.innerText = "Lanjut";
        board.style.opacity = "0.3";
    } else {
        isPaused = false;
        pauseBtn.innerText = "Pause";
        board.style.opacity = "1";
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
        alert("REKOR BARU! Berhasil disimpan: " + savedHighScore);
    } else {
        alert("Selesai! Skor kamu: " + score);
    }
    board.innerHTML = "";
}

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
stopBtn.addEventListener('click', stopAndSave);