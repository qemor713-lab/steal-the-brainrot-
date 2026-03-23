// ==========================================
// 1. LOGIK LOADING SCREEN (0% - 500%)
// ==========================================
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
                    gameContainer.style.display = "block"; 
                }, 500);
            }, 500);
        }
    }, 40); 
};

// ==========================================
// 2. DATA & VARIABLE UTAMA
// ==========================================
const board = document.getElementById('game-board');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const shareBtn = document.getElementById('share-btn'); // Link Share

let score = 0;
let gameActive = false;
let isPaused = false;
let timeoutId; 
let secretTimeoutId; 
let secretActive = false;
let currentTargetData = null; 

let savedHighScore = localStorage.getItem('brainrotHighScore') || 0;
highScoreEl.innerText = Number(savedHighScore).toLocaleString();

const brainrotItems = [
    { emoji: '💀', poin: 1, nama: 'Skulled' },
    { emoji: '🔥', poin: 5, nama: 'Lit!' },
    { emoji: '🍷', poin: 10, nama: 'Sigma' },
    { emoji: '🗿', poin: 20, nama: 'Mewing' },
    { emoji: '👌', poin: 50, nama: 'Gotcha' },
    { emoji: '🧠', poin: 67, nama: 'Brainrot' },
    { emoji: '🤯', poin: -4332, nama: 'Mind Blown' },
    { emoji: '🐊', poin: 5000000000, nama: 'OG' },
    { emoji: '☻', poin: 9129833, nama: 'BG' }, // new brainrot
    { emoji: '🫲6 7🫱', poin: 12736762, name: 'Free Score' }, // New Emoji brainrot free score
];

const secretItem = { emoji: '🧿', poin: 888888, nama: 'SECRET ITEM!' };
const scamItemData = { emoji: '👁️', poin: -500000000, nama: 'SCAMMED!' };

// ==========================================
// 3. FUNGSI VISUAL
// ==========================================
function showFloatingName(x, y, text, color = "white") {
    const tag = document.createElement('div');
    tag.innerText = text;
    tag.style.cssText = `
        position: absolute; left: ${x}; top: ${y}; color: ${color}; 
        font-weight: bold; font-size: 20px; text-shadow: 2px 2px 5px black;
        pointer-events: none; animation: floatUp 0.8s forwards; z-index: 1000;
    `;
    board.appendChild(tag);
    setTimeout(() => tag.remove(), 800);
}

// ==========================================
// 4. LOGIK PERMAINAN
// ==========================================

function createTarget(existingData = null) {
    if (!gameActive || isPaused || secretActive) return;
    board.innerHTML = ""; 
    
    const target = document.createElement('div');
    target.classList.add('target');
    
    const data = existingData || brainrotItems[Math.floor(Math.random() * brainrotItems.length)];
    currentTargetData = data; 
    
    target.innerText = data.emoji;
    target.style.left = Math.random() * (board.clientWidth - 70) + 'px';
    target.style.top = Math.random() * (board.clientHeight - 70) + 'px';

    target.onclick = () => {
        if (!isPaused && gameActive) {
            const vvipEmojis = ['🐊', '☻'];
            if (vvipEmojis.includes(data.emoji)) {
                if (score < 400000000000) { 
                    alert("Sorry skor kamu tidak cukup untuk mendapatkannya");
                    target.remove();
                    clearTimeout(timeoutId);
                    setTimeout(() => createTarget(), 500);
                    return; 
                }
            }
            score += data.poin;
            scoreEl.innerText = score.toLocaleString();
            showFloatingName(target.style.left, target.style.top, data.nama);
            target.remove();
            clearTimeout(timeoutId);
            setTimeout(() => createTarget(), 500);
        }
    };
    board.appendChild(target);
    timeoutId = setTimeout(() => { if (target.parentNode && !isPaused) { target.remove(); createTarget(); } }, 2500);
}

function createSecretTarget() {
    if (!gameActive || isPaused) return;
    secretActive = true; 
    board.innerHTML = ""; 
    clearTimeout(timeoutId);
    const warningText = document.createElement('div');
    warningText.innerText = "CHOOSE WISELY!!!";
    warningText.style.cssText = "position:absolute; width:100%; top:10px; text-align:center; color:#ffeb3b; font-weight:bold; font-size:24px; text-shadow:0 0 15px #ffeb3b; z-index:100;";
    board.appendChild(warningText);

    const realT = document.createElement('div');
    realT.classList.add('target');
    realT.id = 'secret-item'; 
    realT.innerText = secretItem.emoji;
    realT.style.left = Math.random() * (board.clientWidth - 100) + 'px';
    realT.style.top = Math.random() * (board.clientHeight - 100) + 'px';
    realT.onclick = () => {
        score += secretItem.poin;
        scoreEl.innerText = score.toLocaleString();
        showFloatingName(realT.style.left, realT.style.top, secretItem.nama, "#ffeb3b");
        cleanUpSecret();
    };

    const scamT = document.createElement('div');
    scamT.classList.add('target');
    scamT.id = 'scam-item'; 
    scamT.innerText = scamItemData.emoji;
    scamT.style.left = Math.random() * (board.clientWidth - 100) + 'px';
    scamT.style.top = Math.random() * (board.clientHeight - 100) + 'px';
    scamT.onclick = () => {
        score += scamItemData.poin;
        scoreEl.innerText = score.toLocaleString();
        const msg = document.createElement('div');
        msg.innerText = "YOU GOT SCAMMED! LOL";
        msg.style.cssText = "position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:40px; font-weight:900; z-index:1000; width:100%; text-align:center; animation: blink-scam 0.1s infinite;";
        board.appendChild(msg);
        board.classList.add('shake-effect');
        setTimeout(() => { msg.remove(); board.classList.remove('shake-effect'); cleanUpSecret(); }, 2000);
    };

    board.appendChild(realT);
    board.appendChild(scamT);

    function cleanUpSecret() {
        if(realT) realT.remove();
        if(scamT) scamT.remove();
        warningText.remove();
        secretActive = false; 
        setTimeout(() => createTarget(), 500); 
    }
    setTimeout(() => { if (secretActive) cleanUpSecret(); }, 3000); 
}

// ==========================================
// 5. KAWALAN GAME & SHARE
// ==========================================

function togglePause() {
    if (!gameActive) return;
    if (!isPaused) {
        isPaused = true;
        clearTimeout(timeoutId);
        clearTimeout(secretTimeoutId);
        board.innerHTML = '<div style="color:white; text-align:center; margin-top:50px; font-size:24px;">GAME PAUSED</div>';
        pauseBtn.innerText = "Lanjut";
    } else {
        isPaused = false;
        pauseBtn.innerText = "Pause";
        board.innerHTML = ""; 
        if (secretActive) { createSecretTarget(); } else { createTarget(currentTargetData); }
        secretTimeoutId = setTimeout(createSecretTarget, 30000);
    }
}

// --- FUNGSI SHARE (DAH ADA BALIK!) ---
shareBtn.onclick = async () => {
    const shareUrl = 'https://qemor713-lab.github.io/steal-the-brainrot-/';
    
    try {
        if (navigator.share) {
            await navigator.share({
                title: 'Steal the Brainrot',
                text: shareText,
                url: shareUrl
            });
        } else {
            await navigator.clipboard.writeText(shareUrl);
            alert("Link dah dicopy! Paste kat kawan kau.");
        }
    } catch (err) {
        alert("Link: " + shareUrl);
    }
};

const styleS = document.createElement('style');
styleS.innerHTML = `
    @keyframes floatUp { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-70px); opacity: 0; } }
    @keyframes blink-scam { 0% { color: red; } 50% { color: white; } 100% { color: red; } }
`;
document.head.appendChild(styleS);

function startGame() {
    score = 0; scoreEl.innerText = score;
    gameActive = true; isPaused = false; secretActive = false;
    board.innerHTML = ""; 
    startBtn.disabled = true; pauseBtn.disabled = false; stopBtn.disabled = false;
    createTarget(); 
    clearTimeout(secretTimeoutId);
    secretTimeoutId = setTimeout(createSecretTarget, 30000); 
}

function stopAndSave() {
    clearTimeout(timeoutId); clearTimeout(secretTimeoutId);
    gameActive = false; startBtn.disabled = false; pauseBtn.disabled = true; stopBtn.disabled = true;
    if (score > savedHighScore) {
        savedHighScore = score; localStorage.setItem('brainrotHighScore', savedHighScore);
        highScoreEl.innerText = savedHighScore.toLocaleString();
    }
    board.innerHTML = "";
}

startBtn.onclick = startGame;
pauseBtn.onclick = togglePause;
stopBtn.onclick = stopAndSave;