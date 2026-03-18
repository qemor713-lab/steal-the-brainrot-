const board = document.getElementById('game-board');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const bgm = document.getElementById('bgm'); // Untuk lagu kamu

let score = 0;
let gameActive = false;
let isPaused = false;
let gameInterval;
let savedHighScore = localStorage.getItem('brainrotHighScore') || 0;

// Papar rekor lama
highScoreEl.innerText = savedHighScore;

// Daftar item dengan emoji iblis 61239
const brainrotItems = [
    { emoji: '💀', poin: 1 },
    { emoji: '🔥', poin: 5 },
    { emoji: '🍷', poin: 10 },
    { emoji: '🗿', poin: 20 },
    { emoji: '🤌', poin: 50 },
    { emoji: '🧠', poin: 67 },
    { emoji: '😈', poin: 61239 }, // Raja Poin tetap ada!
    { emoji: '🤯', poin: -1231 },
];

function createTarget() {
    if (!gameActive || isPaused) return;

    const target = document.createElement('div');
    target.classList.add('target');

    const randomData = brainrotItems[Math.floor(Math.random() * brainrotItems.length)];
    target.innerText = randomData.emoji;

    // Posisi acak
    const x = Math.random() * (board.clientWidth - 60);
    const y = Math.random() * (board.clientHeight - 60);
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    // Klik dapat poin
    target.onclick = () => {
        if (!isPaused && gameActive) {
            score += randomData.poin;
            scoreEl.innerText = score;
            target.remove();
        }
    };

    board.appendChild(target);

    // Emoji hilang sendiri kalau tak diklik
    setTimeout(() => {
        if (target.parentNode && !isPaused) target.remove();
    }, 1200);
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

    // Lagu mula bunyi
    if(bgm) {
        bgm.currentTime = 0;
        bgm.play();
    }

    // TERUS MULA (Tak ada loading lagi)
    gameInterval = setInterval(createTarget, 800);
}

function togglePause() {
    if (!gameActive) return;
    if (!isPaused) {
        isPaused = true;
        clearInterval(gameInterval);
        pauseBtn.innerText = "Lanjut";
        if(bgm) bgm.pause();
    } else {
        isPaused = false;
        pauseBtn.innerText = "Pause";
        gameInterval = setInterval(createTarget, 800);
        if(bgm) bgm.play();
    }
}

function stopAndSave() {
    clearInterval(gameInterval);
    gameActive = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;

    // Lagu berhenti
    if(bgm) bgm.pause();

    if (score > savedHighScore) {
        savedHighScore = score;
        localStorage.setItem('brainrotHighScore', savedHighScore);
        highScoreEl.innerText = savedHighScore;
        alert("REKOR BARU: " + score);
    } else {
        alert("Selesai! Skor kamu: " + score);
    }
    board.innerHTML = "";
}

// Pasang butang
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
stopBtn.addEventListener('click', stopAndSave);