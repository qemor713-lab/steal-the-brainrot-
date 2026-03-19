const board = document.getElementById('game-board');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const shareBtn = document.getElementById('share-btn');

let score = 0;
let gameActive = false;
let isPaused = false;
let gameInterval;

// Ambil rekod lama dari browser
let savedHighScore = localStorage.getItem('brainrotHighScore') || 0;
highScoreEl.innerText = savedHighScore;

// Senarai Emoji & Poin (Ikut gambar kau bagi)
const brainrotItems = [
    { emoji: '💀', poin: 1 },
    { emoji: '🔥', poin: 5 },
    { emoji: '🍷', poin: 10 },
    { emoji: '🗿', poin: 20 },
    { emoji: '🤌', poin: 50 },
    { emoji: '🧠', poin: 67 },
    { emoji: '😈', poin: 61239 },
    { emoji: '🤯', poin: -4332 },
    { emoji: '💱', poin: 9999999 }
];

function createTarget() {
    if (!gameActive || isPaused) return;

    const target = document.createElement('div');
    target.classList.add('target');
    const data = brainrotItems[Math.floor(Math.random() * brainrotItems.length)];
    target.innerText = data.emoji;

    // Kedudukan rawak dalam map
    const x = Math.random() * (board.clientWidth - 55);
    const y = Math.random() * (board.clientHeight - 55);
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
    
    // Emoji hilang lepas 3 saat (macam kau nak)
    setTimeout(() => {
        if (target.parentNode && !isPaused) target.remove();
    }, 3000);
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

// FUNGSI SHARE PALING PADU
shareBtn.onclick = async () => {
    const shareData = {
        title: 'Steal the Brainrot',
        text: 'Jom main game Brainrot paling padu ni! Kumpul poin sampai 9.9 Juta!',
        url: 'https://qemor713-lab.github.io/steal-the-brainrot-/'
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            // Kalau kat PC, dia akan copy link
            await navigator.clipboard.writeText(shareData.url);
            alert("Link Game sudah di-copy! Boleh paste dekat WhatsApp atau FB.");
        }
    } catch (err) {
        // Backup kalau user cancel
        alert("Link Game: " + shareData.url);
    }
};

// ATURAN BUTANG
startBtn.onclick = startGame;
pauseBtn.onclick = togglePause;
stopBtn.onclick = stopAndSave;