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

const items = ['💀', '🔥', '🍷', '🗿', '🤌', '😡'];

// Ambil rekor tertinggi dari memori browser
let savedHighScore = localStorage.getItem('brainrotHighScore') || 0;
highScoreEl.innerText = savedHighScore;

function createTarget() {
    if (!gameActive || isPaused) return;

    const target = document.createElement('div');
    target.classList.add('target');
    target.innerText = items[Math.floor(Math.random() * items.length)];

    const x = Math.random() * (board.clientWidth - 50);
    const y = Math.random() * (board.clientHeight - 50);

    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    target.onclick = () => {
        if (!isPaused) {
            score++;
            scoreEl.innerText = score;
            target.remove();
        }
    };

    board.appendChild(target);

    // Target hilang otomatis setelah 1.2 detik (lebih santai)
    setTimeout(() => {
        if (target.parentNode && !isPaused) target.remove();
    }, 1200);
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

    // Jalankan kemunculan item tanpa batas waktu
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
    // Hentikan game secara manual
    clearInterval(gameInterval);
    gameActive = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;

    // Cek rekor baru
    if (score > savedHighScore) {
        savedHighScore = score;
        localStorage.setItem('brainrotHighScore', savedHighScore);
        highScoreEl.innerText = savedHighScore;
        alert("REKOR BARU! Kamu mencuri " + score + " item.");
    } else {
        alert("Game Berhenti. Skor kamu: " + score);
    }
    board.innerHTML = "";
}

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
stopBtn.addEventListener('click', stopAndSave);