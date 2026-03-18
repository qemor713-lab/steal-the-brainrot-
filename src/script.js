const board = document.getElementById('game-board');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const highScoreEl = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const saveBtn = document.getElementById('save-btn');

let score = 0;
let timeLeft = 20;
let gameActive = false;
let isPaused = false;
let gameInterval, timerInterval;

const items = ['💀', '🔥', '🍷', '🗿', '🤌'];

// Ambil High Score yang tersimpan saat pertama kali dibuka
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

    setTimeout(() => {
        if (target.parentNode && !isPaused) target.remove();
    }, 1000);
}

function startGame() {
    score = 0;
    timeLeft = 20;
    gameActive = true;
    isPaused = false;
    scoreEl.innerText = score;
    timerEl.innerText = timeLeft;
    board.innerHTML = "";
    board.style.opacity = "1";
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    pauseBtn.innerText = "Pause";

    runLogic();
}

function runLogic() {
    gameInterval = setInterval(createTarget, 700);
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            timerEl.innerText = timeLeft;
            if (timeLeft <= 0) endGame();
        }
    }, 1000);
}

function togglePause() {
    if (!gameActive) return;
    if (!isPaused) {
        isPaused = true;
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        pauseBtn.innerText = "Lanjut";
        board.style.opacity = "0.3";
    } else {
        isPaused = false;
        pauseBtn.innerText = "Pause";
        board.style.opacity = "1";
        runLogic();
    }
}

function saveScore() {
    // Logika simpan skor tertinggi
    if (score > savedHighScore) {
        savedHighScore = score;
        localStorage.setItem('brainrotHighScore', savedHighScore);
        highScoreEl.innerText = savedHighScore;
        alert("Gila! Rekor baru tersimpan: " + savedHighScore);
    } else {
        alert("Skor kamu masih cupu, belum bisa kalahkan rekor: " + savedHighScore);
    }
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    gameActive = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    alert("Waktu Habis! Skor kamu: " + score + ". Jangan lupa tekan Simpan Skor!");
}

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
saveBtn.addEventListener('click', saveScore);