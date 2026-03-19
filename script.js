// --- 1. LOGIK LOADING SCREEN (0% - 500%) ---
window.onload = () => {
    const loadingText = document.getElementById('loading-text');
    const progressFill = document.getElementById('progress-fill');
    const loadingScreen = document.getElementById('loading-screen');
    const gameContainer = document.querySelector('.game-container');
    
    let percentage = 0;

    const interval = setInterval(() => {
        percentage += 5; 
        
        loadingText.innerText = percentage + "%";
        progressFill.style.width = (percentage / 5) + "%"; 

        if (percentage >= 500) {
            clearInterval(interval);
            
            setTimeout(() => {
                loadingScreen.style.opacity = "0";
                setTimeout(() => {
                    loadingScreen.style.display = "none";
                    gameContainer.style.display = "block"; // Tunjuk game lepas loading
                }, 500);
            }, 500);
        }
    }, 40); 
};

// --- 2. LOGIK GAME BRAINROT (MUNCUL SATU-SATU) ---
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
let timeoutId; 

let savedHighScore = localStorage.getItem('brainrotHighScore') || 0;
highScoreEl.innerText = savedHighScore;

const brainrotItems = [
    { emoji: '💀', poin: 1, nama: 'Skulled' },
    { emoji: '🔥', poin: 5, nama: 'Lit!' },
    { emoji: '🍷', poin: 10, nama: 'Sigma' },
    { emoji: '🗿', poin: 20, nama: 'Mewing' },
    { emoji: '👌', poin: 50, nama: 'Gotcha' },
    { emoji: '🧠', poin: 67, nama: 'Brainrot' },
    { emoji: '😈', poin: 61239, nama: 'Demon Mode' },
    { emoji: '🤯', poin: -4332, nama: 'Mind Blown' },
    { emoji: '💱', poin: 9999, nama: 'Rich Guy' },
    { emoji: '🫀', poin: 452233, nama: 'Gold!' },
    { emoji: '🎗️', poin: 2231312, nama: 'secret item' },
];

function createTarget() {
    if (!gameActive || isPaused) return;

    board.innerHTML = ""; // Pastikan cuma ada satu emoji

    const target = document.createElement('div');
    target.classList.add('target');
    const data = brainrotItems[Math.floor(Math.random() * brainrotItems.length)];
    target.innerText = data.emoji;

    const x = Math.random() * (board.clientWidth - 55);
    const y = Math.random() * (board.clientHeight - 55);
    target.style.left = x + 'px';
    target.style.top = y + 'px';

    target.onclick = () => {
        if (!isPaused && gameActive) {
            score += data.poin;
            scoreEl.innerText = score;

            // Efek nama terapung
            const nameTag = document.createElement('div');
            nameTag.innerText = data.nama + " (+" + data.poin + ")";
            nameTag.style.position = 'absolute';
            nameTag.style.left = target.style.left;
            nameTag.style.top = target.style.top;
            nameTag.style.color = '#00ff00';
            nameTag.style.fontWeight = 'bold';
            nameTag.style.pointerEvents = 'none';
            board.appendChild(nameTag);
            setTimeout(() => { nameTag.remove(); }, 600);

            target.remove();
            
            clearTimeout(timeoutId);
            timeoutId = setTimeout(createTarget, 500); // Tunggu kejap baru muncul baru
        }
    };

    board.appendChild(target);
    
    // Kalau tak kena klik dalam 2.5 saat, tukar emoji lain
    timeoutId = setTimeout(() => {
        if (target.parentNode && !isPaused) {
            target.remove();
            createTarget();
        }
    }, 2500);
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
    createTarget();
}

function togglePause() {
    if (!gameActive) return;
    if (!isPaused) {
        isPaused = true;
        clearTimeout(timeoutId);
        pauseBtn.innerText = "Lanjut";
    } else {
        isPaused = false;
        pauseBtn.innerText = "Pause";
        createTarget();
    }
}

function stopAndSave() {
    clearTimeout(timeoutId);
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

// --- 3. LOGIK SHARE LINK ---
shareBtn.onclick = async () => {
    const shareData = {
        title: 'Steal the Brainrot',
        text: 'Jom main game Brainrot paling padu ni!',
        url: 'https://qemor713-lab.github.io/steal-the-brainrot-/'
    };
    try {
        if (navigator.share) { await navigator.share(shareData); } 
        else { await navigator.clipboard.writeText(shareData.url); alert("Link Copied!"); }
    } catch (err) { alert("Link: " + shareData.url); }
};

startBtn.onclick = startGame;
pauseBtn.onclick = togglePause;
stopBtn.onclick = stopAndSave;